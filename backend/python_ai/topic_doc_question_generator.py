import sys
import json
import traceback
import os
from datetime import datetime
from bson.objectid import ObjectId
from pymongo import MongoClient
from openai import OpenAI

# ===== CONFIGURATION =====
OPENROUTER_BASE_URL = os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
MODEL = os.environ.get("OPENROUTER_MODEL", "deepseek/deepseek-chat")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "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")
MONGO_URI = os.environ.get("MONGO_URI_SCMS", "mongodb+srv://HARIHARAN:Hari0519@scms.wnt7tx1.mongodb.net/?retryWrites=true&w=majority&appName=SCMS")

# ===== INITIALIZATION =====
def initialize_client():
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not set")
    return OpenAI(base_url=OPENROUTER_BASE_URL, api_key=OPENROUTER_API_KEY)

def fetch_text_from_mongo(doc_id):
    client = MongoClient(MONGO_URI)
    db = client['document_db']
    collection = db['documents']
    doc = collection.find_one({'_id': ObjectId(doc_id)})
    client.close()
    if doc and 'extractedText' in doc:
        return doc['extractedText'], doc.get('filename', 'Untitled Document')
    if doc and 'textContent' in doc:
        return doc['textContent'], doc.get('name', doc.get('filename', 'Untitled Document'))
    raise ValueError("Document not found or missing textContent/extractedText field")

def create_mixed_prompt(text_chunk, num_questions=6):
    prompt = f"""You are an exam question generator.

Generate {num_questions} questions using a mix of:
- MCQs (Single correct)
- MSQs (Multiple correct answers)
- Fill in the Blank

Format the output exactly as:

Q1 (MCQ): <question>
A) option A
B) option B
C) option C
D) option D
ANSWER: <one correct option letter>

Q2 (MSQ): <question>
A) option A
B) option B
C) option C
D) option D
ANSWER: <comma-separated correct letters like A,C>

Q3 (FILL): <Fill-in-the-blank sentence with a missing word>
ANSWER: <Correct word>

Text:
\"\"\" 
{text_chunk[:3000]}
\"\"\"
"""
    return prompt

def generate_questions(client, text_chunk, num_questions=6):
    prompt = create_mixed_prompt(text_chunk, num_questions)
    completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "https://scms-unified.local",
            "X-Title": "SCMS Mixed Question Generator"
        },
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2048
    )
    return completion.choices[0].message.content

def parse_questions(raw_output, doc_name):
    questions = []
    current_question = {}
    lines = raw_output.strip().splitlines()
    
    for line in lines:
        line = line.strip()
        if line.startswith("Q"):
            if current_question:
                questions.append(current_question)
                current_question = {}
            parts = line.split(":", 1)
            if len(parts) == 2:
                qtype = "MCQ" if "(MCQ)" in parts[0] else "MSQ" if "(MSQ)" in parts[0] else "FILL"
                current_question = {
                    "type": qtype,
                    "text": parts[1].strip(),
                    "options": [],
                    "answer": "",
                    "docName": doc_name
                }
        elif line.startswith("A)") or line.startswith("B)") or line.startswith("C)") or line.startswith("D)"):
            if "options" in current_question:
                current_question["options"].append(line[2:].strip())
        elif line.startswith("ANSWER:"):
            current_question["answer"] = line.replace("ANSWER:", "").strip()

    if current_question:
        questions.append(current_question)
    
    return questions

def save_to_mongo(parsed_questions, doc_id):
    client = MongoClient(MONGO_URI)
    db = client['document_db']
    collection = db['generated_questions']
    
    result = collection.insert_one({
        "docId": ObjectId(doc_id),
        "questions": parsed_questions,
        "createdAt": datetime.utcnow()
    })
    client.close()
    return str(result.inserted_id)

def main():
    try:
        client = initialize_client()

        input_data = json.load(sys.stdin)
        document_id = input_data.get('documentId')
        num_questions = int(input_data.get('numQuestions', 6))

        if not document_id:
            raise ValueError("Missing documentId")

        sys.stderr.write("Fetching text from MongoDB...\n")
        text, doc_name = fetch_text_from_mongo(document_id)

        if len(text) < 20:
            raise ValueError("Insufficient text in document")

        sys.stderr.write(f"Generating {num_questions} mixed questions...\n")
        raw_questions = generate_questions(client, text, num_questions)

        sys.stderr.write("Parsing questions...\n")
        parsed_questions = parse_questions(raw_questions, doc_name)

        sys.stderr.write("Saving to MongoDB...\n")
        record_id = save_to_mongo(parsed_questions, document_id)

        output = {
            "recordId": record_id,
            "questions": parsed_questions
        }
        print(json.dumps(output))

    except Exception as e:
        traceback.print_exc()
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
