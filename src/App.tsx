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
    
    // Enhanced analysis for WordPress development roles
    setTimeout(() => {
      const wordpressKeywords = extractWordPressKeywords(jobDescription);
      const missingKeywords = findMissingKeywords(resumeData.extractedText, wordpressKeywords);
      
      const mockAnalysis: AnalysisResult = {
        overallScore: calculateOverallScore(resumeData.extractedText, wordpressKeywords),
        sections: {
          skills: { 
            score: calculateSkillsScore(resumeData.sections.skills, wordpressKeywords), 
            suggestions: generateSkillsSuggestions(resumeData.sections.skills, wordpressKeywords)
          },
          experience: { 
            score: calculateExperienceScore(resumeData.sections.experience, wordpressKeywords), 
            suggestions: generateExperienceSuggestions(resumeData.sections.experience)
          },
          education: { 
            score: 85, 
            suggestions: ['Consider adding WordPress certifications', 'Include relevant web development courses']
          },
          keywords: { 
            score: calculateKeywordScore(resumeData.extractedText, wordpressKeywords), 
            suggestions: ['Add more WordPress-specific terminology', 'Include plugin and theme development experience']
          }
        },
        missingKeywords,
        strengthAreas: identifyStrengths(resumeData.extractedText),
        improvementAreas: identifyImprovements(resumeData.extractedText, wordpressKeywords),
        atsCompatibility: calculateATSCompatibility(resumeData.extractedText, wordpressKeywords)
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

// WordPress-specific analysis functions
const extractWordPressKeywords = (jobDescription: string): string[] => {
  const wordpressKeywords = [
    'WordPress', 'PHP', 'HTML5', 'CSS3', 'JavaScript', 'MySQL', 'Gutenberg', 
    'Elementor', 'WooCommerce', 'SEO', 'Git', 'REST API', 'Custom themes', 
    'Custom plugins', 'Responsive design', 'Performance optimization', 
    'Security best practices', 'Database management', 'Version control',
    'Headless WordPress', 'Jamstack', 'CI/CD', 'Page builders'
  ];
  
  return wordpressKeywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
};

const findMissingKeywords = (resumeText: string, keywords: string[]): string[] => {
  return keywords.filter(keyword => 
    !resumeText.toLowerCase().includes(keyword.toLowerCase())
  );
};

const calculateOverallScore = (resumeText: string, keywords: string[]): number => {
  const keywordMatches = keywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  const baseScore = Math.min(90, (keywordMatches / keywords.length) * 100);
  return Math.max(60, Math.round(baseScore));
};

const calculateSkillsScore = (skills: string[], keywords: string[]): number => {
  const skillsText = skills.join(' ').toLowerCase();
  const matches = keywords.filter(keyword => 
    skillsText.includes(keyword.toLowerCase())
  ).length;
  
  return Math.max(50, Math.min(95, Math.round((matches / keywords.length) * 100)));
};

const calculateExperienceScore = (experience: string[], keywords: string[]): number => {
  const expText = experience.join(' ').toLowerCase();
  const hasQuantification = experience.some(exp => 
    /\d+%|\d+\+|\$[\d,]+|\d+ (users|customers|projects|websites|clients)/i.test(exp)
  );
  
  const baseScore = hasQuantification ? 80 : 65;
  const keywordBonus = keywords.filter(keyword => 
    expText.includes(keyword.toLowerCase())
  ).length * 5;
  
  return Math.min(95, baseScore + keywordBonus);
};

const calculateKeywordScore = (resumeText: string, keywords: string[]): number => {
  const matches = keywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  return Math.round((matches / keywords.length) * 100);
};

const calculateATSCompatibility = (resumeText: string, keywords: string[]): number => {
  const keywordScore = calculateKeywordScore(resumeText, keywords);
  const hasStandardSections = /experience|education|skills/i.test(resumeText);
  const hasContactInfo = /@/.test(resumeText) && /\d{3}/.test(resumeText);
  
  let score = keywordScore * 0.6;
  if (hasStandardSections) score += 20;
  if (hasContactInfo) score += 15;
  
  return Math.min(95, Math.round(score));
};

const generateSkillsSuggestions = (skills: string[], keywords: string[]): string[] => {
  const suggestions = [];
  const skillsText = skills.join(' ').toLowerCase();
  
  if (!skillsText.includes('wordpress')) {
    suggestions.push('Add WordPress as a core skill');
  }
  if (!skillsText.includes('php')) {
    suggestions.push('Include PHP programming language');
  }
  if (!skillsText.includes('mysql')) {
    suggestions.push('Add MySQL database management');
  }
  if (!skillsText.includes('responsive')) {
    suggestions.push('Mention responsive design capabilities');
  }
  
  return suggestions.length > 0 ? suggestions : ['Consider adding more WordPress-specific technical skills'];
};

const generateExperienceSuggestions = (experience: string[]): string[] => {
  const suggestions = [];
  const expText = experience.join(' ').toLowerCase();
  
  if (!expText.includes('website') && !expText.includes('site')) {
    suggestions.push('Highlight website development projects');
  }
  if (!/\d+/.test(expText)) {
    suggestions.push('Quantify your achievements with specific numbers');
  }
  if (!expText.includes('client') && !expText.includes('customer')) {
    suggestions.push('Mention client interaction and project management');
  }
  
  return suggestions.length > 0 ? suggestions : ['Add more specific WordPress development achievements'];
};

const identifyStrengths = (resumeText: string): string[] => {
  const strengths = [];
  const text = resumeText.toLowerCase();
  
  if (text.includes('experience') || text.includes('years')) {
    strengths.push('Relevant work experience');
  }
  if (text.includes('education') || text.includes('degree')) {
    strengths.push('Strong educational background');
  }
  if (text.includes('project') || text.includes('developed')) {
    strengths.push('Hands-on development experience');
  }
  if (text.includes('team') || text.includes('collaborate')) {
    strengths.push('Team collaboration skills');
  }
  
  return strengths.length > 0 ? strengths : ['Professional presentation', 'Clear structure'];
};

const identifyImprovements = (resumeText: string, keywords: string[]): string[] => {
  const improvements = [];
  const missingKeywords = findMissingKeywords(resumeText, keywords);
  
  if (missingKeywords.length > 3) {
    improvements.push('Add more WordPress-specific keywords');
  }
  if (!resumeText.toLowerCase().includes('seo')) {
    improvements.push('Include SEO optimization experience');
  }
  if (!resumeText.toLowerCase().includes('performance')) {
    improvements.push('Highlight website performance optimization');
  }
  if (!/\d+%|\d+\+/.test(resumeText)) {
    improvements.push('Quantify achievements with metrics');
  }
  
  return improvements.length > 0 ? improvements : ['Consider adding more specific examples'];
};

export default App;