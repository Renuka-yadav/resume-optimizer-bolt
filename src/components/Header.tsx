import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary-600 p-2 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">ResumeAI</h1>
              <p className="text-sm text-secondary-600">Smart Resume Optimization</p>
            </div>
          </motion.div>

          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 text-secondary-600">
              <Zap className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-secondary-600">
              <Target className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium">ATS Optimization</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;