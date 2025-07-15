import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import {
  FileText, Trash2, Search, CalendarDays,
  FileType, HardDrive
} from 'lucide-react';

const DocumentManagerPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:8004/api/documents');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleDeleteDocument = async (docId) => {
    try {
      const res = await fetch(`http://localhost:8004/api/documents/${docId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setDocuments(prev => prev.filter(doc => doc._id !== docId));
      toast({
        title: "Document Deleted",
        description: "The document has been removed from MongoDB."
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Error",
        description: "Failed to delete the document."
      });
    }
  };

  const filteredDocuments = documents.filter(doc =>
    (doc.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold tracking-tight text-white">
        Document Manager
      </h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search documents by name..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3 bg-slate-800/50 border-slate-700 focus:ring-purple-500 focus:border-purple-500 text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText size={64} className="mx-auto text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">
            {documents.length === 0
              ? "No documents uploaded yet."
              : "No documents match your search."}
          </p>
          {documents.length === 0 && (
            <Button variant="link" className="text-white hover:text-white/80" asChild>
              <a href="/upload">Upload your first document</a>
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/70 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 glassmorphic">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-white">
                    <FileText className="mr-2 h-6 w-6" />
                    {doc.filename || 'Untitled Document'}
                  </CardTitle>
                  <CardDescription className="text-gray-400 pt-1">
                    <div className="flex items-center text-xs mt-1">
                      <FileType size={14} className="mr-1.5" /> unknown
                      <HardDrive size={14} className="ml-3 mr-1.5" /> N/A KB
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-300 text-sm space-y-2">
                  <div className="flex items-center">
                    <CalendarDays size={16} className="mr-2 text-white" />
                    <span>Uploaded: Unknown</span>
                  </div>
                  <p className="line-clamp-3">
                    No text preview available.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="bg-red-500/80 hover:bg-red-600/90">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          This action cannot be undone. This will permanently delete the document
                          <span className="font-semibold text-gray-300"> {doc.filename}</span> and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 border-slate-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
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

export default DocumentManagerPage;
