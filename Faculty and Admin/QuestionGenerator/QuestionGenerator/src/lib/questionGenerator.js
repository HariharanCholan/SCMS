import React from 'react';

class TopicDrivenQuestionGenerator {
  constructor() {
    this.usedSentences = new Set();
    this.questionTypesMap = {
      mcq: this._generateMcq.bind(this),
      trueFalse: this._generateTrueFalse.bind(this),
      shortAnswer: this._generateShortAnswer.bind(this),
      fillInBlank: this._generateFillBlank.bind(this),
    };
  }

  _sentTokenize(text) {
    if (!text) return [];
    // Improved sentence tokenization to handle various punctuation and newlines better.
    return text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!|\n)\s+/).map(s => s.trim()).filter(s => s);
  }

  _wordTokenize(sentence) {
    if (!sentence) return [];
    // Keep hyphenated words, allow numbers, basic punctuation for context
    return sentence.toLowerCase().match(/\b[\w'-]+\b/g) || [];
  }
  
  _getNounsAndVerbs(sentence) {
    // This is a very basic heuristic, actual POS tagging is complex in JS without heavy libraries
    // For simulation: assume words ending in 'ing', 'ed', 's' (plural) or common verbs/nouns are candidates
    const words = this._wordTokenize(sentence);
    const commonVerbs = ['is', 'are', 'was', 'were', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'make', 'get', 'go', 'see', 'know', 'take', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'try', 'call', 'provide', 'include', 'allow', 'manage'];
    const commonNounSuffixes = ['tion', 'sion', 'ment', 'ness', 'ity', 'age', 'ence', 'ance', 'er', 'or', 'ist'];
    
    return words.filter(w => {
        if (w.length < 3) return false;
        if (commonVerbs.includes(w)) return true;
        if (commonNounSuffixes.some(suffix => w.endsWith(suffix))) return true;
        if (w.endsWith('s') && !commonVerbs.includes(w.slice(0,-1))) return true; // Plural nouns (heuristic)
        if (w.endsWith('ing') || w.endsWith('ed')) return true; // Verbs (heuristic)
        return false; 
    });
  }


  generateQuestions(text, topic, questionTypes, numQuestions, docName = "document", processEntireDoc = false) {
    this.usedSentences.clear();
    let sentences = [];

    if (processEntireDoc || topic === "_ENTIRE_DOCUMENT_") {
        // Select diverse sentences from the entire document
        sentences = this._sentTokenize(text)
            .map(s => s.trim())
            .filter(s => s.split(/\s+/).length > 7 && s.split(/\s+/).length < 50); // Filter by sentence length for better quality
        
        // Try to pick sentences with a mix of content (very heuristic)
        sentences.sort((a, b) => this._getNounsAndVerbs(b).length - this._getNounsAndVerbs(a).length);
        sentences = sentences.slice(0, numQuestions * 5); // Take a larger pool for variety
    } else {
        sentences = this._sentTokenize(text)
            .map(s => s.trim())
            .filter(s => {
                const lowerS = s.toLowerCase();
                const lowerTopic = topic.toLowerCase();
                return lowerS.includes(lowerTopic) && s.split(/\s+/).length > 6 && s.split(/\s+/).length < 50;
            });
    }


    if (!sentences.length) {
      const messageType = processEntireDoc ? 'info' : 'info';
      const messageText = processEntireDoc 
        ? `Could not find enough suitable sentences in the document to generate ${numQuestions} questions. The document might be too short or sentences too complex/simple.`
        : `No relevant sentences found in the document about '${topic}' to generate questions. Try broader topics, a different document, or 'Process Entire Document'.`;
      return [{
        id: Date.now().toString(),
        docName,
        text: messageText,
        type: messageType,
        answer: '',
        options: [],
        topics: [processEntireDoc ? "Entire Document" : topic],
        generatedDate: new Date().toISOString(),
        mode: 'System Info'
      }];
    }

    const questions = [];
    const shuffledSentences = [...sentences].sort(() => 0.5 - Math.random());

    for (const sentence of shuffledSentences) {
      if (questions.length >= numQuestions) break;

      if (this.usedSentences.has(sentence)) continue;
      this.usedSentences.add(sentence);
      
      const activeQuestionTypes = Object.keys(questionTypes).filter(qt => questionTypes[qt]);
      if (!activeQuestionTypes.length) continue;

      const qType = activeQuestionTypes[Math.floor(Math.random() * activeQuestionTypes.length)];
      
      try {
        // Pass the current topic (or a generic one if entire doc) to generation methods
        const currentTopicForQuestion = processEntireDoc ? (this._getNounsAndVerbs(sentence)[0] || "this concept") : topic;

        const questionData = this.questionTypesMap[qType](sentence, currentTopicForQuestion);
        questions.push({
          id: `${Date.now()}-${questions.length}`,
          docName,
          text: questionData.text,
          type: qType,
          answer: questionData.answer,
          options: questionData.options || [],
          topics: [processEntireDoc ? "Entire Document" : topic],
          generatedDate: new Date().toISOString(),
          mode: 'Rule-Based'
        });
      } catch (e) {
        questions.push({
          id: `${Date.now()}-${questions.length}`,
          docName,
          text: `Failed to generate ${qType} question for: "${sentence.substring(0,70)}...". Error: ${e.message || 'Unknown error'}`,
          type: 'error',
          answer: '',
          options: [],
          topics: [processEntireDoc ? "Entire Document" : topic],
          generatedDate: new Date().toISOString(),
          mode: 'Generation Error'
        });
      }
    }
    
    if (questions.length < numQuestions && sentences.length > 0 && questions.length > 0) {
        questions.push({
            id: `${Date.now()}-debug`,
            docName,
            text: `Note: Generated ${questions.length} out of ${numQuestions} requested questions. Document may have limited suitable sentences for the selected criteria.`,
            type: 'debug',
            answer: '',
            options: [],
            topics: [processEntireDoc ? "Entire Document" : topic],
            generatedDate: new Date().toISOString(),
            mode: 'System Debug'
        });
    }


    return questions;
  }

  _generateMcq(sentence, topic) {
    const words = this._wordTokenize(sentence).filter(w => w.length > 3 && w.toLowerCase() !== topic.toLowerCase());
    if (words.length < 5) throw new Error("Sentence too short or lacks distinct words for MCQ.");

    // Try to pick a more significant word as correct answer
    const contentWords = this._getNounsAndVerbs(sentence).filter(w => w.length > 3 && w.toLowerCase() !== topic.toLowerCase());
    let correctWord = contentWords[Math.floor(Math.random() * contentWords.length)];
    if (!correctWord && words.length > 0) correctWord = words[Math.floor(Math.random() * words.length)];
    if (!correctWord) throw new Error("Could not select a correct word.");


    const uniqueWords = Array.from(new Set(words.filter(w => w !== correctWord)));
    if (uniqueWords.length < 3) throw new Error("Not enough unique distractor words available.");

    let options = [correctWord];
    // Shuffle unique words and pick first 3 as distractors
    uniqueWords.sort(() => 0.5 - Math.random());
    for(let i = 0; i < Math.min(3, uniqueWords.length); i++) {
        options.push(uniqueWords[i]);
    }
     // If still not enough options, add generic ones (less ideal)
    while (options.length < 4) {
        options.push(`Option ${options.length + 1} for ${topic}`); 
    }
    
    const shuffledOptions = [...options].sort(() => 0.5 - Math.random());
    const questionText = `Regarding "${topic}", ${sentence.replace(new RegExp(`\\b${correctWord}\\b`, 'gi'), '__________')}`;
    
    return {
      text: questionText,
      options: shuffledOptions.map(opt => opt.charAt(0).toUpperCase() + opt.slice(1)),
      answer: correctWord.charAt(0).toUpperCase() + correctWord.slice(1)
    };
  }

  _generateTrueFalse(sentence, topic) {
    const isActuallyTrue = Math.random() > 0.5;
    let questionText = `True or False: Concerning the topic of "${topic}", the following statement is accurate: "${sentence}"`;
    let answer = "True";

    if (!isActuallyTrue) {
      answer = "False";
      const words = sentence.split(/\s+/);
      // Try a more subtle negation or alteration
      if (words.length > 5) {
        const commonVerbs = ["is", "are", "was", "were", "has", "have", "can", "will", "should"];
        let altered = false;
        for (let i = 0; i < words.length; i++) {
            if (commonVerbs.includes(words[i].toLowerCase())) {
                // Example: "is" -> "is not", or remove a "not"
                if (i + 1 < words.length && words[i+1].toLowerCase() === "not") {
                    words.splice(i + 1, 1); // Remove "not"
                } else {
                    words.splice(i + 1, 0, "not");
                }
                altered = true;
                break;
            }
        }
        if (altered) {
            questionText = `True or False: Concerning the topic of "${topic}", the following statement is accurate: "${words.join(" ")}"`;
        } else {
            // Fallback if no simple verb to negate found
            questionText = `True or False: It is NOT the case that concerning "${topic}", the following holds true: "${sentence}"`;
        }
      } else {
         questionText = `True or False: It is incorrect to state that regarding "${topic}": "${sentence}"`;
      }
    }
    return { text: questionText, answer };
  }

  _generateShortAnswer(sentence, topic) {
    const whWords = ["Explain the significance of", "Describe the main point about", "What is the key takeaway regarding"];
    const whWord = whWords[Math.floor(Math.random() * whWords.length)];
    // Try to make the question focus on the topic within the sentence
    const coreSentence = sentence.replace(new RegExp(`\\b${topic}\\b`, 'gi'), `"${topic.toUpperCase()}"`);
    return {
      text: `${whWord} "${topic}" in the context of the statement: "${sentence.charAt(0).toLowerCase() + sentence.slice(1)}"`,
      answer: `(Provide a concise explanation focusing on "${topic}" based on the sentence).`
    };
  }

  _generateFillBlank(sentence, topic) {
    // Prefer nouns or verbs for blanks
    let words = this._getNounsAndVerbs(sentence).filter(w => w.length > 3 && w.toLowerCase() !== topic.toLowerCase() && w.toLowerCase() !== "this" && w.toLowerCase() !== "concept");
    if (words.length === 0) { // Fallback to any word if no nouns/verbs
        words = this._wordTokenize(sentence).filter(w => w.length > 4 && w.toLowerCase() !== topic.toLowerCase());
    }
    if (!words.length) throw new Error("No suitable word (noun, verb, or long word) to create a blank.");
    
    const blankWord = words[Math.floor(Math.random() * words.length)];
    const questionText = `Fill in the blank related to "${topic}": ${sentence.replace(new RegExp(`\\b${blankWord}\\b`, 'gi'), '__________')}`;
    return { 
        text: questionText, 
        answer: blankWord.charAt(0).toUpperCase() + blankWord.slice(1)
    };
  }
}

export default TopicDrivenQuestionGenerator;
