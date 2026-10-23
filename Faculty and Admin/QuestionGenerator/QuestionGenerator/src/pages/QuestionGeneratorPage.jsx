import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquarePlus, FileText, Save } from 'lucide-react';
import QuestionConfigForm from '@/components/question-generator/QuestionConfigForm';

const QuestionGeneratorPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [editableQuestionsText, setEditableQuestionsText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('http://localhost:5000/api/generator/documents');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDocuments(data);
        if (data.length > 0) setSelectedDocId(data[0]._id);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Fetch Error',
          description: 'Failed to load documents from server.',
        });
      }
    }
    fetchDocuments();
  }, [toast]);

  const formatQuestionsToText = useCallback((questions) => {
    return questions.map((q, index) => {
      let text = `Q${index + 1} (${q.type}${q.mode ? ` - ${q.mode}` : ''}):\n`;
      text += `Text: ${q.text}\n`;
      if (q.options?.length > 0) {
        text += `Options:\n${q.options.map((opt, i) => `  ${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n`;
      }
      text += `Answer: ${q.answer}\n`;
      text += `Source Document: ${q.docName}\n`;
      return text;
    }).join('\n\n');
  }, []);

  useEffect(() => {
    if (generatedQuestions.length > 0) {
      setEditableQuestionsText(formatQuestionsToText(generatedQuestions));
    } else {
      setEditableQuestionsText('');
    }
  }, [generatedQuestions, formatQuestionsToText]);

  const handleGenerateQuestions = async () => {
    if (!selectedDocId) {
      toast({
        variant: 'destructive',
        title: 'No Document Selected',
        description: 'Please select a document.',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedQuestions([]);
    toast({ title: 'Generating Questions...', description: 'Please wait.' });

    try {
      const response = await fetch('http://localhost:5000/api/generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocId,
          numQuestions,
        }),
      });

      const data = await response.json();

      if (data.questions) {
        setGeneratedQuestions(data.questions);
        toast({
          title: 'Questions Generated!',
          description: `${data.questions.length} questions created.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'No questions returned by the server.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Question generation failed.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (!selectedDocId) {
      toast({
        variant: 'destructive',
        title: 'No Document Selected',
        description: 'Please select a document before saving.',
      });
      return;
    }

    if (generatedQuestions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Questions',
        description: 'Generate questions before saving.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/generator/saveQuestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocId,
          questions: generatedQuestions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Save Successful',
          description: 'Questions saved successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: data.message || data.error || 'Failed to save questions.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: 'An error occurred while saving questions.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold tracking-tight text-white">
        Question Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <QuestionConfigForm
          documents={documents}
          selectedDocId={selectedDocId}
          setSelectedDocId={setSelectedDocId}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          onGenerate={handleGenerateQuestions}
          isGenerating={isGenerating}
        />

        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/70 glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-2xl text-white">
              <div className="flex items-center">
                <MessageSquarePlus className="mr-2 h-7 w-7" />
                Generated Questions
              </div>
              <Button
                onClick={handleSaveQuestions}
                disabled={isGenerating || editableQuestionsText.trim() === ''}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save to DB
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <p className="text-center text-gray-400 py-8">Generating questions, please wait...</p>
            ) : generatedQuestions.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-lg text-gray-400">Your generated questions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {generatedQuestions.map((q, i) => (
                  <Card key={i} className="bg-slate-700/50 border border-slate-600 p-4">
                    <h3 className="font-semibold text-white">{`Q${i + 1} (${q.type}${q.mode ? ` - ${q.mode}` : ''})`}</h3>
                    <p className="mb-2 text-gray-200">{q.text}</p>
                    {q.options && q.options.length > 0 && (
                      <ul className="list-disc list-inside text-gray-300 mb-2">
                        {q.options.map((opt, idx) => (
                          <li key={idx}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-green-400 font-semibold">Answer: {q.answer}</p>
                    <p className="text-xs text-gray-500 mt-1">Source: {q.docName}</p>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default QuestionGeneratorPage;
