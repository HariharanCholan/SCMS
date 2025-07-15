import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import {
  Trash2,
  Download,
  ListChecks,
  HelpCircle,
  CheckSquare,
  FileText,
  Tag,
  Zap,
  Brain
} from 'lucide-react';

const QuestionsDashboardPage = () => {
  const [questionDocs, setQuestionDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch('http://localhost:8004/api/questions/all')
      .then(res => res.json())
      .then(data => {
        setQuestionDocs(data);
        if (data.length > 0) {
          setSelectedDocId(data[0]._id);
          setSelectedQuestions(Array.isArray(data[0].questions) ? data[0].questions : []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch questions:', err);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load questions' });
      });
  }, []);

  useEffect(() => {
    if (!selectedDocId) {
      setSelectedQuestions([]);
      return;
    }
    const doc = questionDocs.find(d => d._id === selectedDocId);
    setSelectedQuestions(Array.isArray(doc?.questions) ? doc.questions : []);
  }, [selectedDocId, questionDocs]);

  const handleDeleteQuestion = (index) => {
    if (!selectedDocId) return;
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions.splice(index, 1);
    setSelectedQuestions(updatedQuestions);

    fetch(`http://localhost:8004/api/saveQuestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: selectedDocId,
        docName: questionDocs.find(d => d._id === selectedDocId)?.docName || 'Unnamed Document',
        questions: updatedQuestions
      }),
    }).then(res => {
      if (res.ok) {
        toast({ title: "Question Deleted", description: "The question has been removed." });
        setQuestionDocs(prev =>
          prev.map(d => d._id === selectedDocId ? { ...d, questions: updatedQuestions } : d)
        );
      } else {
        toast({ variant: "destructive", title: "Failed to Delete", description: "Failed to delete question." });
      }
    }).catch(() => {
      toast({ variant: "destructive", title: "Failed to Delete", description: "Failed to delete question." });
    });
  };

  const handleDeleteDocument = async (docId) => {
    try {
      const res = await fetch(`http://localhost:8004/api/questions/deleteDocument/${docId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to delete document');

      setQuestionDocs((prev) => prev.filter(doc => doc._id !== docId));

      if (selectedDocId === docId) {
        const remainingDocs = questionDocs.filter(doc => doc._id !== docId);
        if (remainingDocs.length > 0) {
          setSelectedDocId(remainingDocs[0]._id);
          setSelectedQuestions(Array.isArray(remainingDocs[0].questions) ? remainingDocs[0].questions : []);
        } else {
          setSelectedDocId(null);
          setSelectedQuestions([]);
        }
      }

      toast({ title: 'Document deleted', description: 'The document has been removed.' });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete document' });
    }
  };

  const handleDownloadQuestions = () => {
    if (!selectedQuestions.length) {
      toast({ variant: "destructive", title: "No Questions", description: "No questions to download." });
      return;
    }
    const docName = questionDocs.find(d => d._id === selectedDocId)?.docName || 'Unnamed Document';
    let textContent = `Questions from document: ${docName}\n\n`;
    selectedQuestions.forEach((q, i) => {
      textContent += `Q${i + 1} (${q.type}): ${q.text}\n`;
      if (q.options && q.options.length > 0) {
        textContent += `Options:\n${q.options.map(opt => `  - ${opt}`).join('\n')}\n`;
      }
      textContent += `Answer: ${q.answer}\n\n`;
    });
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Download Started" });
  };

  const handlePostQuestions = () => {
    const selectedDoc = questionDocs.find(d => d._id === selectedDocId);
    if (!selectedDoc) {
      toast({ variant: "destructive", title: "No Document", description: "No document selected to post." });
      return;
    }

    const postBody = {
      documentId: selectedDoc._id, // Ensuring document ID is included
      docName: selectedDoc.docName || 'Unnamed Document',
      questions: Array.isArray(selectedDoc.questions) ? selectedDoc.questions : [],
    };

    fetch('http://localhost:8004/api/questions/postStudentDocument', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody),
    })
      .then(res => {
        if (res.ok) {
          toast({ title: 'Document posted successfully', description: 'The document has been saved to student_Questions.' });
        } else {
          toast({ variant: 'destructive', title: 'Failed to post document' });
        }
      })
      .catch(() => {
        toast({ variant: 'destructive', title: 'Failed to post document' });
      });
  };

  const questionTypeIcons = {
    MCQ: <ListChecks className="h-5 w-5 mr-2 text-blue-400" />,
    MSQ: <ListChecks className="h-5 w-5 mr-2 text-green-400" />,
    FILL: <CheckSquare className="h-5 w-5 mr-2 text-orange-400" />,
    TRUEFALSE: <HelpCircle className="h-5 w-5 mr-2 text-green-400" />,
    SHORT: <Zap className="h-5 w-5 mr-2 text-yellow-400" />,
    custom: <HelpCircle className="h-5 w-5 mr-2 text-gray-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#ffffff' }}>
          Questions Dashboard
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadQuestions}
            disabled={selectedQuestions.length === 0}
            className="bg-[#006400] hover:bg-[#004d00] text-white"
          >
            <Download className="mr-2 h-5 w-5" /> Download Selected Questions
          </Button>
          <Button
            onClick={handlePostQuestions}
            disabled={selectedQuestions.length === 0}
            style={{ backgroundColor: '#ffffff', color: '#006400', border: '1px solid #006400' }}
            className="hover:bg-[#e6f2e6]"
          >
            Post Selected Questions
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-4 mb-6">
        {questionDocs.length === 0 && (
          <p className="text-gray-400">No question documents found.</p>
        )}
        {questionDocs.map(doc => (
          <div key={doc._id} className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedDocId(doc._id)}
              className={`px-4 py-2 rounded-md border transition ${
                selectedDocId === doc._id
                  ? 'text-white border border-[#1f2937] bg-[#1f2937]'
                  : 'bg-slate-700 text-gray-300 border-transparent hover:border-[#1f2937]'
              }`}
            >
              {doc.docName || 'Unnamed Document'}
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="text-red-400 hover:text-red-600 p-1 rounded"
                  aria-label={`Delete document ${doc.docName || 'Unnamed Document'}`}
                >
                  <Trash2 size={16} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                <AlertDialogHeader>
                  <AlertDialogTitle style={{ color: '#ffffff' }}>Confirm Document Deletion</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to delete the entire document "{doc.docName || 'Unnamed Document'}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 border-slate-600">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>

      {selectedQuestions.length === 0 ? (
        <div className="text-center text-gray-400">No questions available for this document.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedQuestions.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="flex flex-col h-full bg-slate-800/50 border-slate-700/70 shadow-lg hover:shadow-[#006400]/20 transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg" style={{ color: '#ffffff' }}>
                    <div className="flex items-center">
                      {questionTypeIcons[q.type?.toUpperCase()] || questionTypeIcons.custom}
                      <span className="capitalize">{q.type || 'Unknown'} Question</span>
                    </div>
                    {q.mode === 'LLM' && <Zap size={16} className="text-yellow-400" title="AI Generated (LLM)" />}
                    {q.mode === 'Rule-Based' && <Brain size={16} className="text-blue-400" title="Rule-Based" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <p className="text-gray-200 line-clamp-4">{q.text}</p>
                  {q.options && q.options.length > 0 && (
                    <ul className="list-disc list-inside pl-4 text-xs text-gray-300 space-y-0.5 max-h-20 overflow-y-auto">
                      {q.options.map((opt, i) => (
                        <li key={i} className="truncate">{opt}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-green-400 pt-1">Answer: <span className="font-medium">{q.answer}</span></p>
                  <div className="text-xs text-gray-400 pt-1 space-y-0.5">
                    <p className="flex items-center"><FileText size={12} className="mr-1.5" style={{ color: '#ffffff' }} />Doc: {q.docName || 'N/A'}</p>
                    <p className="flex items-center"><Tag size={12} className="mr-1.5" style={{ color: '#ffffff' }} />Topics: {(q.topics || []).join(', ') || 'N/A'}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="bg-red-500/80 hover:bg-red-600/90">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle style={{ color: '#ffffff' }}>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete this question? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 border-slate-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteQuestion(idx)} className="bg-red-500 hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QuestionsDashboardPage;
