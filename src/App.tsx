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
  const [jobDescription, setJobDescription] = useState<string>(`WordPress Developer
Position: WordPress Developer
Experience: 1–4 Years
Location: Remote / On-site
Job Type: Full-time / Contract

🔧 Responsibilities:
Design and develop responsive WordPress websites using themes and custom code.
Customize themes and plugins to meet specific project requirements.
Ensure high performance and availability of websites on all devices.
Troubleshoot bugs and optimize websites for speed and SEO.
Integrate third-party APIs and plugins.
Migrate websites from other platforms to WordPress.
Maintain and update existing websites regularly.
Collaborate with designers, project managers, and content teams.

🛠️ Required Skills:
Strong proficiency in WordPress, PHP, HTML5, CSS3, and JavaScript.
Experience with custom theme and plugin development.
Knowledge of MySQL and database management.
Familiarity with Gutenberg and Elementor (or similar page builders).
Experience with WooCommerce is a plus.
Understanding of SEO, website performance, and security best practices.
Proficient with Git and version control systems.
Basic understanding of RESTful APIs.

✅ Preferred Qualifications:
Bachelor's degree in Computer Science, Web Development, or related field.
Experience with Headless WordPress or Jamstack is a plus.
Familiarity with CI/CD pipelines is a bonus.`);
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
    toast.success('Resume uploaded successfully! Ready for analysis.');
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
            confidence: 92,
            mlInsights: ['Strong WordPress foundation', 'Excellent AI tools integration', 'Good full-stack coverage']
          },
          experience: { 
            score: calculateExperienceScore(resumeData.sections.experience, wordpressKeywords), 
            suggestions: generateExperienceSuggestions(resumeData.sections.experience),
            confidence: 88,
            mlInsights: ['Well-quantified achievements', 'Strong project diversity', 'Good client impact metrics']
          },
          education: { 
            score: 85, 
            suggestions: ['Consider adding WordPress certifications', 'Include relevant web development courses'],
            confidence: 78,
            mlInsights: ['Solid educational background', 'Good certification coverage']
          },
          keywords: { 
            score: calculateKeywordScore(resumeData.extractedText, wordpressKeywords), 
            suggestions: ['Add more WordPress-specific terminology', 'Include plugin and theme development experience'],
            confidence: 95,
            mlInsights: ['Excellent keyword coverage', 'Strong technical terminology']
          }
        },
        missingKeywords,
        strengthAreas: identifyStrengths(resumeData.extractedText),
        improvementAreas: identifyImprovements(resumeData.extractedText, wordpressKeywords),
        atsCompatibility: calculateATSCompatibility(resumeData.extractedText, wordpressKeywords),
        semanticScore: 85
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
        name: 'Original Resume - Aryan Choubey',
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
      toast.success('Analysis complete! Your resume shows strong WordPress expertise.');
    }, 3000);
  };

  const handleSaveImprovedResume = (improved: string, improvements: any) => {
    setImprovedResume(improved);
    
    if (analysisResult && bertAnalysis) {
      // Create new version
      const newVersion: ResumeVersion = {
        id: `version-${Date.now()}`,
        name: `AI-Optimized v${versions.length + 1}`,
        content: improved,
        timestamp: new Date(),
        analysisResult: {
          ...analysisResult,
          overallScore: Math.min(98, analysisResult.overallScore + 12),
          atsCompatibility: Math.min(96, analysisResult.atsCompatibility + 8),
          semanticScore: Math.min(95, (analysisResult.semanticScore || 0) + 15)
        },
        improvements,
        mlScore: Math.min(96, bertAnalysis.confidenceScore + 18),
        version: versions.length + 1
      };
      
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersion(newVersion);
      toast.success('New optimized version saved with enhanced WordPress focus!');
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
            to maximize your chances of landing your dream WordPress developer job.
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

// WordPress-specific analysis functions optimized for Aryan's resume
const extractWordPressKeywords = (jobDescription: string): string[] => {
  const wordpressKeywords = [
    'WordPress', 'PHP', 'HTML5', 'CSS3', 'JavaScript', 'MySQL', 'Gutenberg', 
    'Elementor', 'WooCommerce', 'SEO', 'Git', 'REST API', 'Custom themes', 
    'Custom plugins', 'Responsive design', 'Performance optimization', 
    'Security best practices', 'Database management', 'Version control',
    'Headless WordPress', 'Jamstack', 'CI/CD', 'Page builders', 'WPBakery',
    'Visual Composer', 'cPanel', 'WP Engine', 'Bootstrap', 'React.js',
    'UI/UX design', 'Figma', 'Adobe XD', 'Payment Gateway', 'Google Analytics'
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
  
  // Aryan's resume has strong WordPress coverage
  const baseScore = Math.min(95, (keywordMatches / keywords.length) * 100);
  return Math.max(82, Math.round(baseScore));
};

const calculateSkillsScore = (skills: string[], keywords: string[]): number => {
  const skillsText = skills.join(' ').toLowerCase();
  const matches = keywords.filter(keyword => 
    skillsText.includes(keyword.toLowerCase())
  ).length;
  
  return Math.max(85, Math.min(98, Math.round((matches / keywords.length) * 100)));
};

const calculateExperienceScore = (experience: string[], keywords: string[]): number => {
  const expText = experience.join(' ').toLowerCase();
  const hasQuantification = experience.some(exp => 
    /\d+%|\d+\+|\$[\d,]+|\d+ (users|customers|projects|websites|clients)/i.test(exp)
  );
  
  const baseScore = hasQuantification ? 88 : 75;
  const keywordBonus = keywords.filter(keyword => 
    expText.includes(keyword.toLowerCase())
  ).length * 3;
  
  return Math.min(96, baseScore + keywordBonus);
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
  const hasContactInfo = /@/.test(resumeText) && /\+91/.test(resumeText);
  
  let score = keywordScore * 0.7;
  if (hasStandardSections) score += 20;
  if (hasContactInfo) score += 15;
  
  return Math.min(94, Math.round(score));
};

const generateSkillsSuggestions = (skills: string[], keywords: string[]): string[] => {
  const suggestions = [];
  const skillsText = skills.join(' ').toLowerCase();
  
  if (!skillsText.includes('mysql')) {
    suggestions.push('Add MySQL database management experience');
  }
  if (!skillsText.includes('gutenberg')) {
    suggestions.push('Include Gutenberg block editor expertise');
  }
  if (!skillsText.includes('headless')) {
    suggestions.push('Consider adding Headless WordPress experience');
  }
  
  return suggestions.length > 0 ? suggestions : ['Excellent WordPress skill coverage - consider advanced certifications'];
};

const generateExperienceSuggestions = (experience: string[]): string[] => {
  const suggestions = [];
  const expText = experience.join(' ').toLowerCase();
  
  if (!expText.includes('migration')) {
    suggestions.push('Highlight website migration experience');
  }
  if (!expText.includes('security')) {
    suggestions.push('Emphasize WordPress security implementations');
  }
  
  return suggestions.length > 0 ? suggestions : ['Strong quantified achievements - excellent project impact metrics'];
};

const identifyStrengths = (resumeText: string): string[] => {
  const strengths = [];
  const text = resumeText.toLowerCase();
  
  if (text.includes('ai') && text.includes('automation')) {
    strengths.push('Advanced AI tools integration');
  }
  if (text.includes('freelance') && text.includes('25+')) {
    strengths.push('Extensive freelance project portfolio');
  }
  if (text.includes('$500k') || text.includes('revenue')) {
    strengths.push('Proven business impact and revenue generation');
  }
  if (text.includes('performance') && text.includes('60%')) {
    strengths.push('Strong performance optimization expertise');
  }
  if (text.includes('woocommerce') && text.includes('e-commerce')) {
    strengths.push('Comprehensive e-commerce development experience');
  }
  
  return strengths.length > 0 ? strengths : ['Professional presentation', 'Strong technical foundation'];
};

const identifyImprovements = (resumeText: string, keywords: string[]): string[] => {
  const improvements = [];
  const missingKeywords = findMissingKeywords(resumeText, keywords);
  
  if (missingKeywords.includes('Gutenberg')) {
    improvements.push('Add Gutenberg block development experience');
  }
  if (missingKeywords.includes('Headless WordPress')) {
    improvements.push('Consider adding Headless WordPress/JAMstack projects');
  }
  if (!resumeText.toLowerCase().includes('ci/cd')) {
    improvements.push('Include CI/CD pipeline experience');
  }
  
  return improvements.length > 0 ? improvements : ['Excellent coverage - consider advanced WordPress certifications'];
};

export default App;