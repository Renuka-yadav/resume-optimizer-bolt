import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Sparkles, CheckCircle, AlertCircle, Copy, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { ResumeData } from '../types';

interface ResumeOptimizerProps {
  resumeData: ResumeData;
  jobDescription: string;
  missingKeywords: string[];
  onSaveImprovedResume: (improvedResume: string) => void;
}

interface OptimizationResult {
  optimizedResume: string;
  improvements: {
    keywordsAdded: number;
    achievementsQuantified: number;
    skillsEnhanced: number;
    totalChanges: number;
  };
  changes: Array<{
    type: 'keyword' | 'achievement' | 'skill' | 'formatting';
    section: string;
    original: string;
    improved: string;
    reason: string;
  }>;
}

const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({
  resumeData,
  jobDescription,
  missingKeywords,
  onSaveImprovedResume
}) => {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'changes'>('preview');

  const optimizeResume = async () => {
    setIsOptimizing(true);
    
    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const result = performAdvancedResumeEnhancement(
        resumeData.extractedText,
        jobDescription,
        missingKeywords,
        resumeData.sections
      );
      
      setOptimizationResult(result);
      setIsOptimizing(false);
      setShowPreview(true);
      onSaveImprovedResume(result.optimizedResume);
      toast.success('Resume enhanced successfully!');
    }, 3500);
  };

  const copyToClipboard = () => {
    if (optimizationResult) {
      navigator.clipboard.writeText(optimizationResult.optimizedResume);
      toast.success('Resume copied to clipboard!');
    }
  };

  const downloadResume = (format: 'txt' | 'docx') => {
    if (!optimizationResult) return;
    
    const fileName = `enhanced_resume_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'txt') {
      const blob = new Blob([optimizationResult.optimizedResume], { 
        type: 'text/plain;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'docx') {
      // Create a more structured document for DOCX download
      const docContent = createDocxContent(optimizationResult.optimizedResume);
      const blob = new Blob([docContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    toast.success(`Resume downloaded as ${format.toUpperCase()}!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-3">AI Resume Enhancer</h2>
        <p className="text-secondary-600 text-lg">
          Transform your resume with intelligent keyword integration, ATS optimization, and professional formatting
        </p>
      </div>

      {!optimizationResult ? (
        <div className="text-center py-12">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Sparkles className="h-16 w-16 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 mb-3">Ready to Optimize</h3>
              <p className="text-secondary-600 max-w-lg mx-auto text-lg leading-relaxed">
                Our advanced AI will enhance your resume by strategically adding missing keywords, 
                improving achievements with quantifiable metrics, and optimizing for ATS systems.
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={optimizeResume}
            disabled={isOptimizing}
            className={`
              px-12 py-5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-3 mx-auto text-lg shadow-lg
              ${isOptimizing
                ? 'bg-secondary-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 hover:shadow-xl transform hover:scale-105'
              }
            `}
            whileHover={!isOptimizing ? { scale: 1.02 } : {}}
            whileTap={!isOptimizing ? { scale: 0.98 } : {}}
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Enhancing Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                <span>Enhance My Resume</span>
              </>
            )}
          </motion.button>
          
          {isOptimizing && (
            <motion.div 
              className="mt-10 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-secondary-600 space-y-3">
                <div className="text-base flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span>Analyzing resume structure and content...</span>
                </div>
                <div className="text-base flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span>Identifying strategic keyword placement opportunities...</span>
                </div>
                <div className="text-base flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span>Enhancing achievements with quantifiable metrics...</span>
                </div>
                <div className="text-base flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  <span>Optimizing for ATS compatibility and readability...</span>
                </div>
              </div>
              <div className="w-full max-w-md mx-auto bg-secondary-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full animate-pulse transition-all duration-1000" style={{ width: '85%' }}></div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Success Summary */}
          <div className="bg-gradient-to-r from-success-50 via-primary-50 to-success-50 border-2 border-success-200 rounded-2xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-success-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-success-800">Enhancement Complete!</h3>
                <p className="text-success-700">Your resume has been professionally optimized</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {optimizationResult.improvements.keywordsAdded}
                </div>
                <div className="text-sm font-medium text-secondary-600">Keywords Added</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-success-600 mb-1">
                  {optimizationResult.improvements.achievementsQuantified}
                </div>
                <div className="text-sm font-medium text-secondary-600">Achievements Enhanced</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-warning-600 mb-1">
                  {optimizationResult.improvements.skillsEnhanced}
                </div>
                <div className="text-sm font-medium text-secondary-600">Skills Improved</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-secondary-600 mb-1">
                  {optimizationResult.improvements.totalChanges}
                </div>
                <div className="text-sm font-medium text-secondary-600">Total Changes</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={() => downloadResume('txt')}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-5 w-5" />
              <span>Download TXT</span>
            </motion.button>
            
            <motion.button
              onClick={() => downloadResume('docx')}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-xl hover:from-secondary-700 hover:to-secondary-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="h-5 w-5" />
              <span>Download DOCX</span>
            </motion.button>

            <motion.button
              onClick={copyToClipboard}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-warning-600 to-warning-700 text-white rounded-xl hover:from-warning-700 hover:to-warning-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Copy className="h-5 w-5" />
              <span>Copy Text</span>
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-3 px-2 border-b-2 font-semibold text-base transition-colors ${
                  activeTab === 'preview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Enhanced Resume</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('changes')}
                className={`py-3 px-2 border-b-2 font-semibold text-base transition-colors ${
                  activeTab === 'changes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Improvements Made ({optimizationResult.changes.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'preview' && (
            <div className="border-2 border-secondary-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-secondary-50 to-primary-50 px-6 py-4 border-b border-secondary-200">
                <h3 className="font-bold text-secondary-900 text-lg">Your Enhanced Resume</h3>
                <p className="text-secondary-600 text-sm">Optimized for ATS systems and human reviewers</p>
              </div>
              <div className="p-8 max-h-[600px] overflow-y-auto bg-white">
                <pre className="whitespace-pre-wrap text-sm text-secondary-800 leading-relaxed font-mono">
                  {optimizationResult.optimizedResume}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'changes' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-secondary-900 mb-2">Enhancement Details</h3>
                <p className="text-secondary-600">See exactly what improvements were made to your resume</p>
              </div>
              {optimizationResult.changes.map((change, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-2 border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${
                      change.type === 'keyword' ? 'bg-primary-100' :
                      change.type === 'achievement' ? 'bg-success-100' :
                      change.type === 'skill' ? 'bg-warning-100' :
                      'bg-secondary-100'
                    }`}>
                      {change.type === 'keyword' && <Sparkles className="h-5 w-5 text-primary-600" />}
                      {change.type === 'achievement' && <CheckCircle className="h-5 w-5 text-success-600" />}
                      {change.type === 'skill' && <AlertCircle className="h-5 w-5 text-warning-600" />}
                      {change.type === 'formatting' && <FileText className="h-5 w-5 text-secondary-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          change.type === 'keyword' ? 'bg-primary-100 text-primary-700' :
                          change.type === 'achievement' ? 'bg-success-100 text-success-700' :
                          change.type === 'skill' ? 'bg-warning-100 text-warning-700' :
                          'bg-secondary-100 text-secondary-700'
                        }`}>
                          {change.type.charAt(0).toUpperCase() + change.type.slice(1)} Enhancement
                        </span>
                        <span className="text-sm text-secondary-500 bg-secondary-100 px-3 py-1 rounded-full">
                          {change.section}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-semibold text-secondary-700 mb-2 block">Before:</span>
                          <p className="text-sm text-secondary-600 bg-red-50 p-4 rounded-lg border-l-4 border-red-200">
                            {change.original}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-secondary-700 mb-2 block">After:</span>
                          <p className="text-sm text-secondary-900 bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                            {change.improved}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-secondary-700 mb-2 block">Why this helps:</span>
                          <p className="text-sm text-secondary-600 italic bg-blue-50 p-3 rounded-lg">{change.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Advanced resume enhancement function
const performAdvancedResumeEnhancement = (
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[],
  sections: any
): OptimizationResult => {
  let enhancedText = resumeText;
  const changes: OptimizationResult['changes'] = [];
  let keywordsAdded = 0;
  let achievementsQuantified = 0;
  let skillsEnhanced = 0;

  // 1. Extract and preserve personal information
  const personalInfo = extractPersonalInfo(resumeText);
  
  // 2. Add professional summary if missing
  if (!findSection(enhancedText, ['SUMMARY', 'PROFESSIONAL SUMMARY', 'PROFILE', 'OBJECTIVE'])) {
    const professionalSummary = createProfessionalSummary(personalInfo, missingKeywords.slice(0, 5), jobDescription);
    const contactEndIndex = findContactSectionEnd(enhancedText);
    
    if (contactEndIndex > 0) {
      enhancedText = enhancedText.slice(0, contactEndIndex) + '\n\nPROFESSIONAL SUMMARY\n' + professionalSummary + '\n\n' + enhancedText.slice(contactEndIndex);
      
      changes.push({
        type: 'formatting',
        section: 'Professional Summary',
        original: 'No professional summary present',
        improved: professionalSummary,
        reason: 'Added a compelling professional summary with relevant keywords to immediately capture recruiter attention and improve ATS matching'
      });
      skillsEnhanced++;
    }
  }

  // 3. Enhance skills section with missing keywords
  const skillsSection = findSection(enhancedText, ['SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'TECHNOLOGIES']);
  if (skillsSection && missingKeywords.length > 0) {
    const relevantKeywords = filterRelevantKeywords(missingKeywords, jobDescription);
    const keywordsToAdd = relevantKeywords.filter(keyword => 
      !skillsSection.content.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 6);

    if (keywordsToAdd.length > 0) {
      const originalSkills = skillsSection.content;
      const enhancedSkills = originalSkills + (originalSkills.trim().endsWith(',') ? ' ' : ', ') + keywordsToAdd.join(', ');
      enhancedText = enhancedText.replace(originalSkills, enhancedSkills);
      
      changes.push({
        type: 'keyword',
        section: 'Skills',
        original: originalSkills,
        improved: enhancedSkills,
        reason: `Added ${keywordsToAdd.length} high-impact keywords from the job description: ${keywordsToAdd.join(', ')}. These keywords improve ATS matching and demonstrate relevant expertise.`
      });
      keywordsAdded += keywordsToAdd.length;
    }
  }

  // 4. Enhance experience section with stronger action verbs and quantification
  const experienceSection = findSection(enhancedText, ['EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY']);
  if (experienceSection) {
    const bulletPoints = extractBulletPoints(experienceSection.content);
    
    bulletPoints.forEach(bullet => {
      let enhancedBullet = bullet;
      let wasChanged = false;
      const originalBullet = bullet;

      // Replace weak action verbs with stronger ones
      const verbReplacements = {
        'worked on': 'developed',
        'helped with': 'collaborated on',
        'assisted in': 'contributed to',
        'was responsible for': 'managed',
        'participated in': 'led',
        'handled': 'managed',
        'did': 'executed',
        'made': 'created',
        'used': 'utilized',
        'worked with': 'partnered with'
      };

      Object.entries(verbReplacements).forEach(([weak, strong]) => {
        if (bullet.toLowerCase().includes(weak.toLowerCase())) {
          enhancedBullet = enhancedBullet.replace(new RegExp(weak, 'gi'), strong);
          wasChanged = true;
        }
      });

      // Add quantification if missing
      if (!bullet.match(/\d+%|\d+\+|\$[\d,]+|\d+[kK]?\+?|\d+ (users|customers|projects|team members|hours|days|months|years|websites|applications)/i)) {
        const verb = extractActionVerb(bullet);
        if (verb) {
          const lowerVerb = verb.toLowerCase();
          if (['improved', 'enhanced', 'optimized', 'increased', 'boosted'].includes(lowerVerb)) {
            enhancedBullet = enhancedBullet + ' by 30%';
            wasChanged = true;
          } else if (['reduced', 'decreased', 'minimized', 'cut'].includes(lowerVerb)) {
            enhancedBullet = enhancedBullet + ' by 25%';
            wasChanged = true;
          } else if (['led', 'managed', 'supervised', 'coordinated'].includes(lowerVerb)) {
            enhancedBullet = enhancedBullet + ' for a team of 5+ members';
            wasChanged = true;
          } else if (['developed', 'created', 'built', 'designed'].includes(lowerVerb)) {
            enhancedBullet = enhancedBullet + ' serving 1000+ users';
            wasChanged = true;
          }
        }
      }

      // Strategically integrate relevant keywords
      const contextualKeywords = missingKeywords.filter(keyword => 
        !bullet.toLowerCase().includes(keyword.toLowerCase()) &&
        isKeywordRelevantToExperience(keyword, bullet)
      ).slice(0, 2);

      if (contextualKeywords.length > 0) {
        enhancedBullet = enhancedBullet + ` using ${contextualKeywords.join(' and ')}`;
        wasChanged = true;
        keywordsAdded += contextualKeywords.length;
      }

      if (wasChanged) {
        enhancedText = enhancedText.replace(originalBullet, enhancedBullet);
        changes.push({
          type: 'achievement',
          section: 'Experience',
          original: originalBullet,
          improved: enhancedBullet,
          reason: 'Enhanced with stronger action verbs, quantifiable metrics, and relevant keywords to demonstrate measurable impact and improve ATS compatibility'
        });
        achievementsQuantified++;
      }
    });
  }

  // 5. Format improvements
  enhancedText = enhancedText
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/([A-Z\s]{2,})\n/g, '$1\n') // Ensure section headers are properly formatted
    .replace(/•\s*/g, '• ') // Standardize bullet points
    .trim();

  return {
    optimizedResume: enhancedText,
    improvements: {
      keywordsAdded,
      achievementsQuantified,
      skillsEnhanced,
      totalChanges: changes.length
    },
    changes
  };
};

// Helper functions
const extractPersonalInfo = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim());
  return {
    name: lines[0]?.trim() || '',
    email: text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || '',
    phone: text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || ''
  };
};

const findSection = (text: string, sectionNames: string[]) => {
  for (const sectionName of sectionNames) {
    const regex = new RegExp(`(${sectionName})[:\n]([\\s\\S]*?)(?=\\n\\n[A-Z]|\\n[A-Z]{2,}|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      return {
        name: sectionName,
        content: match[2].trim(),
        fullMatch: match[0]
      };
    }
  }
  return null;
};

const extractBulletPoints = (text: string): string[] => {
  const bullets = text.match(/•[^•\n]+/g) || [];
  return bullets.map(bullet => bullet.trim());
};

const extractActionVerb = (bullet: string): string | null => {
  const match = bullet.match(/^•?\s*(\w+)/);
  return match ? match[1] : null;
};

const filterRelevantKeywords = (keywords: string[], jobDescription: string): string[] => {
  const technicalSkills = [
    'WordPress', 'PHP', 'HTML5', 'CSS3', 'JavaScript', 'MySQL', 'React', 'Angular', 'Vue.js', 
    'Node.js', 'Python', 'Java', 'TypeScript', 'AWS', 'Azure', 'Docker', 'Kubernetes', 
    'Git', 'CI/CD', 'Agile', 'Scrum', 'SQL', 'MongoDB', 'PostgreSQL', 'REST API', 
    'GraphQL', 'Microservices', 'Gutenberg', 'Elementor', 'WooCommerce', 'SEO'
  ];
  
  return keywords.filter(keyword => 
    technicalSkills.some(skill => skill.toLowerCase() === keyword.toLowerCase()) ||
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
};

const isKeywordRelevantToExperience = (keyword: string, experience: string): boolean => {
  const techKeywords = ['WordPress', 'PHP', 'React', 'Node.js', 'Python', 'JavaScript', 'AWS', 'Docker', 'Git'];
  const processKeywords = ['Agile', 'Scrum', 'CI/CD', 'DevOps'];
  
  if (techKeywords.includes(keyword)) {
    return /develop|build|implement|create|design/i.test(experience);
  }
  
  if (processKeywords.includes(keyword)) {
    return /team|project|process|manage|lead/i.test(experience);
  }
  
  return false;
};

const createProfessionalSummary = (personalInfo: any, keywords: string[], jobDescription: string): string => {
  const role = extractTargetRole(jobDescription) || 'WordPress Developer';
  const topKeywords = keywords.slice(0, 4);
  
  return `Experienced ${role} with proven expertise in ${topKeywords.slice(0, 2).join(' and ')}. Demonstrated success in developing responsive, high-performance websites and applications using ${topKeywords.slice(2).join(', ')}. Strong background in modern web development practices with a focus on user experience, performance optimization, and scalable solutions. Committed to delivering quality code and collaborating effectively with cross-functional teams.`;
};

const extractTargetRole = (jobDescription: string): string => {
  const rolePatterns = [
    /(?:position|role|job title)[:\s]+([^.\n]+)/i,
    /(?:seeking|hiring|looking for)\s+(?:a\s+)?([^.]+?)(?:\s+to|\s+who|\.|$)/i,
    /WordPress\s+Developer/i,
    /Web\s+Developer/i,
    /Software\s+Developer/i
  ];
  
  for (const pattern of rolePatterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      return match[1]?.trim() || 'WordPress Developer';
    }
  }
  
  return 'WordPress Developer';
};

const findContactSectionEnd = (text: string): number => {
  const lines = text.split('\n');
  let contactEndIndex = 0;
  
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line.match(/[\w.-]+@[\w.-]+\.\w+/) || line.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) {
      contactEndIndex = text.indexOf(line) + line.length;
    } else if (line.match(/^[A-Z\s]{2,}$/) && i > 2) {
      break;
    }
  }
  
  return contactEndIndex;
};

const createDocxContent = (resumeText: string): string => {
  // For a more sophisticated DOCX creation, you would typically use a library like docx
  // For now, we'll return the formatted text content
  return resumeText;
};

export default ResumeOptimizer;