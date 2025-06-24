import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface RecommendationsListProps {
  strengthAreas: string[];
  improvementAreas: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  strengthAreas, 
  improvementAreas 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary-100">
      <h3 className="text-xl font-bold text-secondary-900 mb-6">Recommendations</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <h4 className="font-semibold text-success-700">Strength Areas</h4>
          </div>
          <ul className="space-y-2">
            {strengthAreas.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-2 text-sm text-secondary-700"
              >
                <span className="text-success-500 mt-1">✓</span>
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="h-5 w-5 text-warning-600" />
            <h4 className="font-semibold text-warning-700">Areas for Improvement</h4>
          </div>
          <ul className="space-y-2">
            {improvementAreas.map((improvement, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-2 text-sm text-secondary-700"
              >
                <span className="text-warning-500 mt-1">!</span>
                <span>{improvement}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200"
      >
        <h5 className="font-semibold text-primary-800 mb-2">Pro Tip</h5>
        <p className="text-sm text-primary-700">
          Focus on incorporating the missing keywords naturally into your experience descriptions 
          and skills section to improve your ATS compatibility score.
        </p>
      </motion.div>
    </div>
  );
};

export default RecommendationsList;