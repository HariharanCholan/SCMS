import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, UploadCloud, FileText, MessageSquarePlus } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glassmorphic p-6 rounded-xl shadow-xl hover:shadow-blue-500/30 transition-shadow duration-300"
  >
    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#3a7bd5] to-[#004c8f] rounded-full text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#3a7bd5] to-[#004c8f]">{title}</h3>
    <p className="text-white text-sm">{description}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 py-12 bg-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3a7bd5] to-[#004c8f] rounded-full blur-xl opacity-50 animate-pulse"></div>
        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3a7bd5] to-[#004c8f]">
            Question Generation
          </span>
          <span className="block text-gray-300 text-3xl md:text-4xl mt-2">
            Intelligent Document Processing and Question Generation system
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-white max-w-2xl"
      >
        Effortlessly upload your documents, extract key information, and generate insightful questions. Transform your documents into interactive learning tools.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/upload">
          <Button size="lg" className="bg-gradient-to-r from-[#3a7bd5] to-[#004c8f] hover:from-[#3a6073] hover:to-[#004c8f] text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 max-w-5xl w-full">
        <FeatureCard
          icon={<UploadCloud size={24} />}
          title="Upload Documents"
          description="Securely upload PDF and DOCX files. We'll handle the rest."
          delay={0.6}
        />
        <FeatureCard
          icon={<FileText size={24} />}
          title="Extract Text"
          description="Advanced text extraction to capture all relevant content from your files."
          delay={0.8}
        />
        <FeatureCard
          icon={<MessageSquarePlus size={24} />}
          title="Generate Questions"
          description="Create various question types based on document topics to enhance learning."
          delay={1.0}
        />
      </div>
      
      <div className="w-full max-w-5xl pt-10">
         <h2 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#3a7bd5] to-[#004c8f]">How It Works</h2>
         <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex-1 text-left p-6 glassmorphic rounded-lg"
            >
              <h3 className="text-xl font-medium mb-2 text-[#3a7bd5]">1. Upload</h3>
              <p className="text-white">Drag & drop or select your PDF/DOCX files.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex-1 text-left p-6 glassmorphic rounded-lg"
            >
              <h3 className="text-xl font-medium mb-2 text-[#004c8f]">2. Process</h3>
              <p className="text-white">Our system extracts text and prepares it for analysis.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="flex-1 text-left p-6 glassmorphic rounded-lg"
            >
              <h3 className="text-xl font-medium mb-2 text-[#3a6073]">3. Generate</h3>
              <p className="text-white">Create custom questions based on your document's content.</p>
            </motion.div>
         </div>
      </div>
    </div>
  );
};

export default HomePage;
