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
    toast.success('Resume uploaded successfully! Ready for analysis.');
  };

  const handleAnalyze = async () => {
    if (!resumeData || !jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    setIsMLAnalyzing(true);
    
    // Enhanced analysis for any job role
    setTimeout(() => {
      const jobKeywords = extractJobKeywords(jobDescription);
      const missingKeywords = findMissingKeywords(resumeData.extractedText, jobKeywords);
      const candidateName = extractCandidateName(resumeData.extractedText);
      const jobTitle = extractJobTitle(jobDescription);
      
      const mockAnalysis: AnalysisResult = {
        overallScore: calculateOverallScore(resumeData.extractedText, jobKeywords),
        sections: {
          skills: { 
            score: calculateSkillsScore(resumeData.sections.skills, jobKeywords), 
            suggestions: generateSkillsSuggestions(resumeData.sections.skills, jobKeywords, jobTitle),
            confidence: 90,
            mlInsights: ['Strong technical foundation', 'Good skill diversity', 'Relevant expertise demonstrated']
          },
          experience: { 
            score: calculateExperienceScore(resumeData.sections.experience, jobKeywords), 
            suggestions: generateExperienceSuggestions(resumeData.sections.experience, jobTitle),
            confidence: 85,
            mlInsights: ['Well-structured experience', 'Good progression shown', 'Quantified achievements present']
          },
          education: { 
            score: 82, 
            suggestions: generateEducationSuggestions(jobTitle),
            confidence: 75,
            mlInsights: ['Solid educational background', 'Relevant coursework highlighted']
          },
          keywords: { 
            score: calculateKeywordScore(resumeData.extractedText, jobKeywords), 
            suggestions: generateKeywordSuggestions(missingKeywords, jobTitle),
            confidence: 93,
            mlInsights: ['Good keyword coverage', 'Industry-relevant terminology used']
          }
        },
        missingKeywords,
        strengthAreas: identifyStrengths(resumeData.extractedText, jobTitle),
        improvementAreas: identifyImprovements(resumeData.extractedText, jobKeywords, jobTitle),
        atsCompatibility: calculateATSCompatibility(resumeData.extractedText, jobKeywords),
        semanticScore: 82
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
        name: `Original Resume - ${candidateName}`,
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
      toast.success(`Analysis complete! Resume optimized for ${jobTitle} position.`);
    }, 3000);
  };

  const handleSaveImprovedResume = (improved: string, improvements: any) => {
    setImprovedResume(improved);
    
    if (analysisResult && bertAnalysis) {
      const candidateName = extractCandidateName(resumeData?.extractedText || '');
      // Create new version
      const newVersion: ResumeVersion = {
        id: `version-${Date.now()}`,
        name: `AI-Optimized v${versions.length + 1} - ${candidateName}`,
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
      toast.success('New optimized version saved with enhanced job-specific focus!');
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
            Transform any resume with advanced ML analysis, semantic understanding, and intelligent optimization 
            to maximize your chances of landing your dream job across all industries.
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

// Universal analysis functions that work for any job role
const extractJobKeywords = (jobDescription: string): string[] => {
  const text = jobDescription.toLowerCase();
  const allKeywords = new Set<string>();
  
  // Technical skills patterns
  const techPatterns = [
    /\b(javascript|python|java|react|angular|vue|node\.?js|typescript|html5?|css3?|sql|mongodb|postgresql|mysql|aws|azure|docker|kubernetes|git|ci\/cd|devops|agile|scrum)\b/gi,
    /\b(machine learning|data science|artificial intelligence|ai|ml|deep learning|tensorflow|pytorch|pandas|numpy|scikit-learn)\b/gi,
    /\b(wordpress|php|drupal|magento|shopify|woocommerce|elementor|gutenberg)\b/gi,
    /\b(photoshop|illustrator|figma|sketch|adobe|ui\/ux|user experience|user interface)\b/gi,
    /\b(salesforce|hubspot|crm|erp|sap|oracle|microsoft office|excel|powerpoint|word)\b/gi,
    /\b(project management|pmp|prince2|jira|confluence|trello|asana|slack)\b/gi
  ];
  
  // Soft skills patterns
  const softSkillPatterns = [
    /\b(leadership|management|communication|teamwork|collaboration|problem.solving|analytical|creative|innovative)\b/gi,
    /\b(customer service|client relations|stakeholder management|presentation|negotiation|time management)\b/gi
  ];
  
  // Industry-specific patterns
  const industryPatterns = [
    /\b(marketing|digital marketing|seo|sem|social media|content marketing|email marketing|analytics)\b/gi,
    /\b(finance|accounting|financial analysis|budgeting|forecasting|investment|banking)\b/gi,
    /\b(healthcare|medical|clinical|patient care|hipaa|medical records|nursing)\b/gi,
    /\b(education|teaching|curriculum|instructional design|e-learning|training)\b/gi,
    /\b(sales|business development|lead generation|crm|pipeline management|revenue)\b/gi
  ];
  
  [...techPatterns, ...softSkillPatterns, ...industryPatterns].forEach(pattern => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      matches.forEach(match => allKeywords.add(match.toLowerCase().trim()));
    }
  });
  
  // Extract requirements and qualifications
  const requirementSections = jobDescription.match(/(?:requirements?|qualifications?|skills?|experience)[:\s]+(.*?)(?=\n\n|\n[A-Z]|$)/gis);
  if (requirementSections) {
    requirementSections.forEach(section => {
      const words = section.split(/[,\n•\-\*]/).map(w => w.trim().toLowerCase()).filter(w => w.length > 2);
      words.forEach(word => {
        if (word.length > 2 && word.length < 30) {
          allKeywords.add(word);
        }
      });
    });
  }
  
  return Array.from(allKeywords).slice(0, 25); // Limit to top 25 keywords
};

const extractCandidateName = (resumeText: string): string => {
  const lines = resumeText.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if first line looks like a name (2-4 words, no special characters except spaces)
    if (/^[A-Za-z\s]{2,50}$/.test(firstLine) && firstLine.split(' ').length <= 4) {
      return firstLine;
    }
  }
  return 'Candidate';
};

const extractJobTitle = (jobDescription: string): string => {
  const titlePatterns = [
    /(?:position|role|job title)[:\s]+([^\n.]+)/i,
    /(?:seeking|hiring|looking for)\s+(?:a\s+)?([^.]+?)(?:\s+to|\s+who|\.|$)/i,
    /^([A-Z][^.]+?)(?:\s*-|\s*\||\n)/m
  ];
  
  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fallback: look for common job titles
  const commonTitles = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager',
    'Sales Representative', 'Business Analyst', 'Project Manager', 'Designer',
    'Developer', 'Analyst', 'Specialist', 'Coordinator', 'Manager', 'Director'
  ];
  
  for (const title of commonTitles) {
    if (jobDescription.toLowerCase().includes(title.toLowerCase())) {
      return title;
    }
  }
  
  return 'Professional';
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
  
  const baseScore = Math.min(95, (keywordMatches / keywords.length) * 100);
  const hasQuantification = /\d+%|\d+\+|\$[\d,]+|\d+ (users|customers|projects|clients|years|months)/i.test(resumeText);
  const hasActionVerbs = /(led|managed|developed|created|implemented|designed|optimized|improved)/i.test(resumeText);
  
  let bonus = 0;
  if (hasQuantification) bonus += 5;
  if (hasActionVerbs) bonus += 5;
  
  return Math.max(65, Math.min(95, Math.round(baseScore + bonus)));
};

const calculateSkillsScore = (skills: string[], keywords: string[]): number => {
  if (skills.length === 0) return 40;
  
  const skillsText = skills.join(' ').toLowerCase();
  const matches = keywords.filter(keyword => 
    skillsText.includes(keyword.toLowerCase())
  ).length;
  
  return Math.max(50, Math.min(98, Math.round((matches / keywords.length) * 100 + 20)));
};

const calculateExperienceScore = (experience: string[], keywords: string[]): number => {
  if (experience.length === 0) return 30;
  
  const expText = experience.join(' ').toLowerCase();
  const hasQuantification = experience.some(exp => 
    /\d+%|\d+\+|\$[\d,]+|\d+ (users|customers|projects|clients|years|months)/i.test(exp)
  );
  
  const baseScore = hasQuantification ? 85 : 70;
  const keywordBonus = keywords.filter(keyword => 
    expText.includes(keyword.toLowerCase())
  ).length * 3;
  
  return Math.min(96, baseScore + keywordBonus);
};

const calculateKeywordScore = (resumeText: string, keywords: string[]): number => {
  if (keywords.length === 0) return 50;
  
  const matches = keywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  return Math.round((matches / keywords.length) * 100);
};

const calculateATSCompatibility = (resumeText: string, keywords: string[]): number => {
  const keywordScore = calculateKeywordScore(resumeText, keywords);
  const hasStandardSections = /experience|education|skills/i.test(resumeText);
  const hasContactInfo = /@/.test(resumeText) && /\d{3}/.test(resumeText);
  const hasProperFormatting = /•/.test(resumeText) || /\n/.test(resumeText);
  
  let score = keywordScore * 0.6;
  if (hasStandardSections) score += 20;
  if (hasContactInfo) score += 15;
  if (hasProperFormatting) score += 10;
  
  return Math.min(95, Math.round(score));
};

const generateSkillsSuggestions = (skills: string[], keywords: string[], jobTitle: string): string[] => {
  const suggestions = [];
  const skillsText = skills.join(' ').toLowerCase();
  
  const missingTechSkills = keywords.filter(keyword => 
    !skillsText.includes(keyword.toLowerCase()) && 
    /^(javascript|python|java|react|sql|aws|docker|git|agile)$/i.test(keyword)
  );
  
  if (missingTechSkills.length > 0) {
    suggestions.push(`Add relevant technical skills: ${missingTechSkills.slice(0, 3).join(', ')}`);
  }
  
  if (!skillsText.includes('communication')) {
    suggestions.push('Include communication and collaboration skills');
  }
  
  if (jobTitle.toLowerCase().includes('manager') && !skillsText.includes('leadership')) {
    suggestions.push('Add leadership and management skills');
  }
  
  return suggestions.length > 0 ? suggestions : ['Consider adding more industry-specific skills'];
};

const generateExperienceSuggestions = (experience: string[], jobTitle: string): string[] => {
  const suggestions = [];
  const expText = experience.join(' ').toLowerCase();
  
  if (!/\d+%|\d+\+|\$[\d,]+/.test(expText)) {
    suggestions.push('Quantify your achievements with specific numbers and percentages');
  }
  
  if (!expText.includes('team') && !expText.includes('collaborate')) {
    suggestions.push('Highlight teamwork and collaboration experience');
  }
  
  if (jobTitle.toLowerCase().includes('senior') && !expText.includes('led') && !expText.includes('managed')) {
    suggestions.push('Emphasize leadership and mentoring responsibilities');
  }
  
  return suggestions.length > 0 ? suggestions : ['Strong experience section with good detail'];
};

const generateEducationSuggestions = (jobTitle: string): string[] => {
  const suggestions = [];
  
  if (jobTitle.toLowerCase().includes('data') || jobTitle.toLowerCase().includes('analyst')) {
    suggestions.push('Consider adding data analysis or statistics courses');
  }
  
  if (jobTitle.toLowerCase().includes('manager')) {
    suggestions.push('Include any management or leadership training');
  }
  
  suggestions.push('Add relevant certifications for your field');
  
  return suggestions;
};

const generateKeywordSuggestions = (missingKeywords: string[], jobTitle: string): string[] => {
  if (missingKeywords.length === 0) {
    return ['Excellent keyword coverage for this role'];
  }
  
  return [
    `Add these important keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
    'Incorporate job-specific terminology naturally throughout your resume',
    'Use industry-standard terms and acronyms where appropriate'
  ];
};

const identifyStrengths = (resumeText: string, jobTitle: string): string[] => {
  const strengths = [];
  const text = resumeText.toLowerCase();
  
  if (/\d+%|\d+\+|\$[\d,]+/.test(text)) {
    strengths.push('Quantified achievements and measurable results');
  }
  
  if (/led|managed|supervised|directed/.test(text)) {
    strengths.push('Leadership and management experience');
  }
  
  if (/project|initiative|program/.test(text)) {
    strengths.push('Project management and execution skills');
  }
  
  if (/team|collaborate|cross-functional/.test(text)) {
    strengths.push('Strong teamwork and collaboration abilities');
  }
  
  if (/improved|optimized|enhanced|increased/.test(text)) {
    strengths.push('Process improvement and optimization focus');
  }
  
  return strengths.length > 0 ? strengths : ['Professional presentation', 'Clear structure'];
};

const identifyImprovements = (resumeText: string, keywords: string[], jobTitle: string): string[] => {
  const improvements = [];
  const missingKeywords = findMissingKeywords(resumeText, keywords);
  
  if (missingKeywords.length > 5) {
    improvements.push('Add more role-specific keywords and terminology');
  }
  
  if (!/\d+%|\d+\+|\$[\d,]+/.test(resumeText)) {
    improvements.push('Quantify achievements with specific metrics and numbers');
  }
  
  if (!resumeText.toLowerCase().includes('result') && !resumeText.toLowerCase().includes('impact')) {
    improvements.push('Emphasize results and business impact of your work');
  }
  
  if (jobTitle.toLowerCase().includes('senior') && !resumeText.toLowerCase().includes('mentor')) {
    improvements.push('Highlight mentoring and knowledge-sharing activities');
  }
  
  return improvements.length > 0 ? improvements : ['Strong overall presentation'];
};

export default App;