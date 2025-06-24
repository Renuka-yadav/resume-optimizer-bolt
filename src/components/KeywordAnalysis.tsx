import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface KeywordAnalysisProps {
  missingKeywords: string[];
}

const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ missingKeywords }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary-100 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning-600" />
        <h3 className="text-xl font-bold text-secondary-900">Missing Keywords</h3>
      </div>
      
      <p className="text-secondary-600 mb-4 text-sm">
        Important keywords from the job description that are missing from your resume
      </p>

      <div className="space-y-2">
        {missingKeywords.map((keyword, index) => (
          <motion.div
            key={keyword}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="inline-block bg-warning-100 text-warning-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
          >
            {keyword}
          </motion.div>
        ))}
      </div>

      {missingKeywords.length === 0 && (
        <div className="text-center py-8">
          <div className="text-success-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-success-700 font-medium">Great keyword coverage!</p>
          <p className="text-secondary-600 text-sm">Your resume includes most relevant keywords</p>
        </div>
      )}
    </div>
  );
};

export default KeywordAnalysis;