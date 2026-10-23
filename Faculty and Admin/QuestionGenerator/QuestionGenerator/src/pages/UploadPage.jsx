import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, FileText, XCircle, Loader2 } from 'lucide-react';
import { extractTextFromFile } from '@/lib/file-processor';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Only PDF and DOCX files are supported.'
      });
      return;
    }

    setSelectedFile(file);
    setExtractedText('');
    toast({ title: 'File Selected', description: file.name });
  };

  const handleProcessFile = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file first.'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const text = await extractTextFromFile(selectedFile);
      setExtractedText(text);

      const response = await fetch('http://localhost:5000/api/generator/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          textContent: text,
          uploadDate: new Date().toISOString(),
          status: 'processed'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      toast({
        title: 'Success!',
        description: `Document saved with ID: ${result.insertedId}`
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExtractedText('');
    toast({ title: 'File Removed' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto p-4"
    >
      <header>
        <h1
          className="text-4xl font-bold tracking-tight text-white"
          style={{ backgroundImage: 'none' }}
        >
          Document Upload
        </h1>
        <p className="mt-2 text-gray-400">
          Upload PDF or DOCX files to extract text and store in database
        </p>
      </header>

      <div
        className="w-full p-12 border-2 border-dashed border-white/50 rounded-xl text-center cursor-pointer hover:border-white transition-colors duration-300 bg-slate-800/20"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx"
        />
        <UploadCloud className="mx-auto h-12 w-12 text-white mb-4" />
        <Label className="text-lg font-semibold text-gray-200">
          Drag & drop files or click to browse
        </Label>
        <p className="text-sm text-gray-400 mt-2">
          Max file size: 10MB • Supported: PDF, DOCX
        </p>
      </div>

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-white/80" />
              <div>
                <p className="font-medium text-gray-100 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-red-400 hover:bg-red-400/10"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={handleProcessFile}
            disabled={isProcessing}
            className="w-full mt-4 bg-white text-black hover:bg-gray-300"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Extract Text & Save to Database'
            )}
          </Button>
        </motion.div>
      )}

      {extractedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-lg bg-slate-800/20 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Extracted Content
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-gray-400">
              {selectedFile?.name}
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 bg-slate-900/30 rounded-md">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300">
              {extractedText}
            </pre>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadPage;
