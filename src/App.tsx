import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResumeOptimizer from './components/ResumeOptimizer';
import { ResumeData, AnalysisResult } from './types';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [improvedResume, setImprovedResume] = useState<string>('');

  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data);
    setAnalysisResult(null);
    setShowOptimizer(false);
  };

  const handleAnalyze = async () => {
    if (!resumeData) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        overallScore: 78,
        sections: {
          skills: { score: 85, suggestions: ['Add more technical skills relevant to the role', 'Include proficiency levels'] },
          experience: { score: 75, suggestions: ['Quantify achievements with numbers', 'Use stronger action verbs'] },
          education: { score: 90, suggestions: ['Consider adding relevant certifications'] },
          keywords: { score: 65, suggestions: ['Include more industry-specific keywords', 'Match job description terminology'] }
        },
        missingKeywords: ['React', 'TypeScript', 'AWS', 'Agile', 'CI/CD'],
        strengthAreas: ['Strong educational background', 'Relevant work experience', 'Good technical foundation'],
        improvementAreas: ['Keyword optimization', 'Achievement quantification', 'Skills section enhancement'],
        atsCompatibility: 82
      };
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      setShowOptimizer(true);
    }, 2000);
  };

  const handleSaveImprovedResume = (improved: string) => {
    setImprovedResume(improved);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <Toaster position="top-right" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
            AI-Powered Resume
            <span className="text-primary-600 block">Optimizer</span>
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Transform your resume with intelligent analysis, keyword optimization, and personalized suggestions 
            to maximize your chances of landing your dream job.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <UploadSection onResumeUpload={handleResumeUpload} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <JobDescriptionInput 
              value={jobDescription}
              onChange={setJobDescription}
              onAnalyze={handleAnalyze}
              disabled={!resumeData || isAnalyzing}
              isAnalyzing={isAnalyzing}
            />
          </motion.div>
        </div>

        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <AnalysisResults result={analysisResult} />
          </motion.div>
        )}

        {showOptimizer && resumeData && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ResumeOptimizer
              resumeData={resumeData}
              jobDescription={jobDescription}
              missingKeywords={analysisResult.missingKeywords}
              onSaveImprovedResume={handleSaveImprovedResume}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;