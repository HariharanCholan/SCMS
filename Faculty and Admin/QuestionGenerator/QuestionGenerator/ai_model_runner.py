import sys
import json
import traceback
from pymongo import MongoClient
from bson.objectid import ObjectId

MONGO_URI = "mongodb+srv://HARIHARAN:Hari0519@scms.wnt7tx1.mongodb.net/?retryWrites=true&w=majority&appName=SCMS"

def fetch_document_by_id(doc_id):
    client = MongoClient(MONGO_URI)
    db = client['document_db']
    collection = db['documents']
    doc = collection.find_one({'_id': ObjectId(doc_id)})
    client.close()
    return doc

def generate_questions_from_text(text, num_questions):
    # Placeholder function - replace with your actual AI or question generation logic.
    # For demo, just create dummy questions.
    questions = []
    for i in range(num_questions):
        questions.append({
            "type": "mcq",
            "text": f"Sample question {i+1} based on document text.",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Option A",
            "docName": "Sample Document"
        })
    return questions

def main():
    try:
        input_str = sys.stdin.read()
        print(f"DEBUG: Received input: {input_str}", file=sys.stderr)  # debug input
        
        input_data = json.loads(input_str)
        document_id = input_data.get('documentId')
        num_questions = input_data.get('numQuestions', 5)

        if not document_id:
            error_output = {"error": "Missing documentId"}
            print(json.dumps(error_output))
            print(f"DEBUG: {error_output}", file=sys.stderr)
            return

        document = fetch_document_by_id(document_id)
        if not document:
            error_output = {"error": "Document not found"}
            print(json.dumps(error_output))
            print(f"DEBUG: {error_output}", file=sys.stderr)
            return

        text = document.get('extractedText', '')
        if not text.strip():
            error_output = {"error": "Document has no extracted text"}
            print(json.dumps(error_output))
            print(f"DEBUG: {error_output}", file=sys.stderr)
            return

        questions = generate_questions_from_text(text, num_questions)

        output = {"questions": questions}
        output_str = json.dumps(output)
        print(f"DEBUG: Outputting: {output_str}", file=sys.stderr)  # debug output

        print(output_str)

    except Exception:
        traceback_str = traceback.format_exc()
        print(f"ERROR: Exception in ai_model_runner.py:\n{traceback_str}", file=sys.stderr)
        print(json.dumps({"error": "Internal error occurred"}))

if __name__ == "__main__":
    main()
