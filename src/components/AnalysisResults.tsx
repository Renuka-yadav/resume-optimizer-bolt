import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types';
import ScoreCard from './ScoreCard';
import SectionAnalysis from './SectionAnalysis';
import KeywordAnalysis from './KeywordAnalysis';
import RecommendationsList from './RecommendationsList';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">Analysis Results</h2>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Here's your comprehensive resume analysis with personalized recommendations for improvement
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ScoreCard
            title="Overall Score"
            score={result.overallScore}
            description="Your resume's overall effectiveness"
            color="primary"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ScoreCard
            title="ATS Compatibility"
            score={result.atsCompatibility}
            description="How well your resume works with ATS systems"
            color="success"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <KeywordAnalysis missingKeywords={result.missingKeywords} />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SectionAnalysis sections={result.sections} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <RecommendationsList 
            strengthAreas={result.strengthAreas}
            improvementAreas={result.improvementAreas}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisResults;