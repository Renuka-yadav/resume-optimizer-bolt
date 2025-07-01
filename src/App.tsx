import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResumeOptimizer from './components/ResumeOptimizer';
import VersionManager from './components/VersionManager';
import MLAnalysisPanel from './components/MLAnalysisPanel';
import { ResumeData, AnalysisResult, ResumeVersion, BertAnalysis, MLRecommendation } from './types';
import { performBertAnalysis, generateMLRecommendations } from './utils/mlAnalysis';
import toast from 'react-hot-toast';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [improvedResume, setImprovedResume] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analysis' | 'ml' | 'versions'>('analysis');
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<ResumeVersion | null>(null);
  const [bertAnalysis, setBertAnalysis] = useState<BertAnalysis | null>(null);
  const [mlRecommendations, setMlRecommendations] = useState<MLRecommendation[]>([]);
  const [isMLAnalyzing, setIsMLAnalyzing] = useState(false);

  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data);
    setAnalysisResult(null);
    setShowOptimizer(false);
    setBertAnalysis(null);
    setMlRecommendations([]);
  };

  const handleAnalyze = async () => {
    if (!resumeData) return;
    
    setIsAnalyzing(true);
    setIsMLAnalyzing(true);
    
    // Enhanced analysis for WordPress development roles
    setTimeout(() => {
      const wordpressKeywords = extractWordPressKeywords(jobDescription);
      const missingKeywords = findMissingKeywords(resumeData.extractedText, wordpressKeywords);
      
      const mockAnalysis: AnalysisResult = {
        overallScore: calculateOverallScore(resumeData.extractedText, wordpressKeywords),
        sections: {
          skills: { 
            score: calculateSkillsScore(resumeData.sections.skills, wordpressKeywords), 
            suggestions: generateSkillsSuggestions(resumeData.sections.skills, wordpressKeywords),
            confidence: 85,
            mlInsights: ['Strong technical foundation', 'Good framework knowledge']
          },
          experience: { 
            score: calculateExperienceScore(resumeData.sections.experience, wordpressKeywords), 
            suggestions: generateExperienceSuggestions(resumeData.sections.experience),
            confidence: 78,
            mlInsights: ['Needs more quantified achievements', 'Good project diversity']
          },
          education: { 
            score: 85, 
            suggestions: ['Consider adding WordPress certifications', 'Include relevant web development courses'],
            confidence: 70,
            mlInsights: ['Solid educational background', 'Could benefit from specialized training']
          },
          keywords: { 
            score: calculateKeywordScore(resumeData.extractedText, wordpressKeywords), 
            suggestions: ['Add more WordPress-specific terminology', 'Include plugin and theme development experience'],
            confidence: 92,
            mlInsights: ['Good keyword coverage', 'Missing some industry-specific terms']
          }
        },
        missingKeywords,
        strengthAreas: identifyStrengths(resumeData.extractedText),
        improvementAreas: identifyImprovements(resumeData.extractedText, wordpressKeywords),
        atsCompatibility: calculateATSCompatibility(resumeData.extractedText, wordpressKeywords),
        semanticScore: 78
      };
      
      // Perform BERT analysis
      const bert = performBertAnalysis(resumeData.extractedText, jobDescription, resumeData);
      mockAnalysis.bertAnalysis = bert;
      setBertAnalysis(bert);
      
      // Generate ML recommendations
      const recommendations = generateMLRecommendations(resumeData.extractedText, jobDescription, resumeData, bert);
      setMlRecommendations(recommendations);
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      setIsMLAnalyzing(false);
      setShowOptimizer(true);
      
      // Create initial version
      const initialVersion: ResumeVersion = {
        id: `version-${Date.now()}`,
        name: 'Original Resume',
        content: resumeData.extractedText,
        timestamp: new Date(),
        analysisResult: mockAnalysis,
        improvements: {
          keywordsAdded: 0,
          achievementsQuantified: 0,
          skillsEnhanced: 0,
          totalChanges: 0
        },
        mlScore: bert.confidenceScore,
        version: 1
      };
      
      setVersions([initialVersion]);
      setCurrentVersion(initialVersion);
    }, 3000);
  };

  const handleSaveImprovedResume = (improved: string, improvements: any) => {
    setImprovedResume(improved);
    
    if (analysisResult && bertAnalysis) {
      // Create new version
      const newVersion: ResumeVersion = {
        id: `version-${Date.now()}`,
        name: `Optimized v${versions.length + 1}`,
        content: improved,
        timestamp: new Date(),
        analysisResult: {
          ...analysisResult,
          overallScore: Math.min(95, analysisResult.overallScore + 15),
          atsCompatibility: Math.min(95, analysisResult.atsCompatibility + 12),
          semanticScore: Math.min(95, (analysisResult.semanticScore || 0) + 18)
        },
        improvements,
        mlScore: Math.min(95, bertAnalysis.confidenceScore + 20),
        version: versions.length + 1
      };
      
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersion(newVersion);
      toast.success('New optimized version saved!');
    }
  };

  const handleVersionSelect = (version: ResumeVersion) => {
    setCurrentVersion(version);
    setAnalysisResult(version.analysisResult);
    toast.success(`Switched to ${version.name}`);
  };

  const handleVersionCompare = (version1: ResumeVersion, version2: ResumeVersion) => {
    // Implementation for version comparison
    toast.success(`Comparing ${version1.name} with ${version2.name}`);
  };

  const handleVersionDownload = (version: ResumeVersion) => {
    const blob = new Blob([version.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${version.name.replace(/\s+/g, '_')}_${version.timestamp.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${version.name} downloaded successfully!`);
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
            Transform your resume with advanced ML analysis, semantic understanding, and intelligent optimization 
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

        {(analysisResult || bertAnalysis || versions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Enhanced Tab Navigation */}
            <div className="border-b border-secondary-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'analysis', label: 'Resume Analysis', count: analysisResult ? 1 : 0 },
                  { id: 'ml', label: 'AI Insights', count: mlRecommendations.length },
                  { id: 'versions', label: 'Version History', count: versions.length }
                ].map(({ id, label, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`py-4 px-2 border-b-2 font-semibold text-lg transition-colors flex items-center space-x-2 ${
                      activeTab === id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    <span>{label}</span>
                    {count > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === id
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-secondary-100 text-secondary-600'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'analysis' && analysisResult && (
              <AnalysisResults result={analysisResult} />
            )}

            {activeTab === 'ml' && (
              <MLAnalysisPanel
                bertAnalysis={bertAnalysis || {
                  semanticSimilarity: 0,
                  contextualMatches: [],
                  industryAlignment: 0,
                  skillRelevance: 0,
                  experienceDepth: 0,
                  confidenceScore: 0
                }}
                mlRecommendations={mlRecommendations}
                isAnalyzing={isMLAnalyzing}
              />
            )}

            {activeTab === 'versions' && (
              <VersionManager
                versions={versions}
                currentVersion={currentVersion}
                onVersionSelect={handleVersionSelect}
                onVersionCompare={handleVersionCompare}
                onVersionDownload={handleVersionDownload}
              />
            )}
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

// WordPress-specific analysis functions (keeping existing functions)
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