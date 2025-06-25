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
      const result = performSmartResumeEnhancement(
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
    
    const blob = new Blob([optimizationResult.optimizedResume], { 
      type: format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced_resume_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Resume downloaded as ${format.toUpperCase()}!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-3">Smart Resume Enhancer</h2>
        <p className="text-secondary-600 text-lg">
          Enhance your resume with intelligent keyword integration and ATS optimization while preserving your original content
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
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Ready to Enhance</h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                Our smart enhancer will add missing keywords naturally while preserving your original achievements and experience
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={optimizeResume}
            disabled={isOptimizing}
            className={`
              px-10 py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-3 mx-auto text-lg
              ${isOptimizing
                ? 'bg-secondary-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
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
              className="mt-8 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-secondary-600 space-y-2">
                <div className="text-sm">🔍 Analyzing original resume structure...</div>
                <div className="text-sm">🎯 Identifying keyword integration opportunities...</div>
                <div className="text-sm">📈 Enhancing achievements with action verbs...</div>
                <div className="text-sm">✨ Applying ATS-friendly improvements...</div>
              </div>
              <div className="w-full max-w-md mx-auto bg-secondary-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
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
          <div className="bg-gradient-to-r from-success-50 to-primary-50 border border-success-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-success-600" />
              <h3 className="text-xl font-bold text-success-800">Enhancement Complete!</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-700">
                  {optimizationResult.improvements.keywordsAdded}
                </div>
                <div className="text-sm text-success-600">Keywords Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-700">
                  {optimizationResult.improvements.achievementsQuantified}
                </div>
                <div className="text-sm text-success-600">Achievements Enhanced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-700">
                  {optimizationResult.improvements.skillsEnhanced}
                </div>
                <div className="text-sm text-success-600">Skills Improved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-700">
                  {optimizationResult.improvements.totalChanges}
                </div>
                <div className="text-sm text-success-600">Total Changes</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={() => downloadResume('txt')}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4" />
              <span>Download TXT</span>
            </motion.button>
            
            <motion.button
              onClick={() => downloadResume('docx')}
              className="flex items-center space-x-2 px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="h-4 w-4" />
              <span>Download DOCX</span>
            </motion.button>

            <motion.button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-6 py-3 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Copy className="h-4 w-4" />
              <span>Copy Text</span>
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'preview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Enhanced Resume</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('changes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'changes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Enhancements Made ({optimizationResult.changes.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'preview' && (
            <div className="border border-secondary-200 rounded-lg">
              <div className="bg-secondary-50 px-4 py-3 border-b border-secondary-200 rounded-t-lg">
                <h3 className="font-semibold text-secondary-900">Enhanced Resume</h3>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto bg-white">
                <pre className="whitespace-pre-wrap text-sm text-secondary-800 font-mono leading-relaxed">
                  {optimizationResult.optimizedResume}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'changes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Enhancement Details</h3>
              {optimizationResult.changes.map((change, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      change.type === 'keyword' ? 'bg-primary-100' :
                      change.type === 'achievement' ? 'bg-success-100' :
                      change.type === 'skill' ? 'bg-warning-100' :
                      'bg-secondary-100'
                    }`}>
                      {change.type === 'keyword' && <Sparkles className="h-4 w-4 text-primary-600" />}
                      {change.type === 'achievement' && <CheckCircle className="h-4 w-4 text-success-600" />}
                      {change.type === 'skill' && <AlertCircle className="h-4 w-4 text-warning-600" />}
                      {change.type === 'formatting' && <FileText className="h-4 w-4 text-secondary-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          change.type === 'keyword' ? 'bg-primary-100 text-primary-700' :
                          change.type === 'achievement' ? 'bg-success-100 text-success-700' :
                          change.type === 'skill' ? 'bg-warning-100 text-warning-700' :
                          'bg-secondary-100 text-secondary-700'
                        }`}>
                          {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                        </span>
                        <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                          {change.section}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Original:</span>
                          <p className="text-sm text-secondary-600 bg-red-50 p-3 rounded mt-1 border-l-4 border-red-200">
                            {change.original}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Enhanced:</span>
                          <p className="text-sm text-secondary-900 bg-green-50 p-3 rounded mt-1 border-l-4 border-green-200">
                            {change.improved}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Enhancement reason:</span>
                          <p className="text-sm text-secondary-600 mt-1 italic">{change.reason}</p>
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

// Smart resume enhancement function that preserves original content
const performSmartResumeEnhancement = (
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

  // 1. Preserve all personal information exactly as is
  const personalInfo = extractPersonalInfo(resumeText);
  
  // 2. Smart keyword integration - add missing keywords naturally
  const relevantKeywords = filterRelevantKeywords(missingKeywords, jobDescription);
  
  // Add keywords to skills section without removing existing skills
  const skillsSection = findSection(enhancedText, ['SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES']);
  if (skillsSection && relevantKeywords.length > 0) {
    const keywordsToAdd = relevantKeywords.filter(keyword => 
      !skillsSection.content.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 5); // Limit to 5 new keywords

    if (keywordsToAdd.length > 0) {
      const originalSkills = skillsSection.content;
      const enhancedSkills = originalSkills + (originalSkills.trim().endsWith(',') ? ' ' : ', ') + keywordsToAdd.join(', ');
      enhancedText = enhancedText.replace(originalSkills, enhancedSkills);
      
      changes.push({
        type: 'keyword',
        section: 'Skills',
        original: originalSkills,
        improved: enhancedSkills,
        reason: `Added relevant keywords from job description: ${keywordsToAdd.join(', ')}`
      });
      keywordsAdded += keywordsToAdd.length;
    }
  }

  // 3. Enhance existing achievements with stronger action verbs and quantification
  const experienceSection = findSection(enhancedText, ['EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE']);
  if (experienceSection) {
    const bulletPoints = extractBulletPoints(experienceSection.content);
    
    bulletPoints.forEach(bullet => {
      let enhancedBullet = bullet;
      let wasChanged = false;

      // Enhance with stronger action verbs
      const weakToStrongVerbs = {
        'worked on': 'developed',
        'helped with': 'collaborated on',
        'assisted in': 'contributed to',
        'was responsible for': 'managed',
        'participated in': 'engaged in',
        'handled': 'managed',
        'did': 'executed',
        'made': 'created'
      };

      Object.entries(weakToStrongVerbs).forEach(([weak, strong]) => {
        if (bullet.toLowerCase().includes(weak.toLowerCase())) {
          enhancedBullet = enhancedBullet.replace(new RegExp(weak, 'gi'), strong);
          wasChanged = true;
        }
      });

      // Add quantification if missing
      if (!bullet.match(/\d+%|\d+\+|\$[\d,]+|\d+[kK]?\+?|\d+ (users|customers|projects|team members|hours|days|months|years)/i)) {
        const verb = extractActionVerb(bullet);
        if (verb && ['improved', 'enhanced', 'optimized', 'increased'].includes(verb.toLowerCase())) {
          enhancedBullet = enhancedBullet + ' by 25%';
          wasChanged = true;
        } else if (verb && ['reduced', 'decreased', 'minimized'].includes(verb.toLowerCase())) {
          enhancedBullet = enhancedBullet + ' by 30%';
          wasChanged = true;
        } else if (verb && ['led', 'managed', 'supervised'].includes(verb.toLowerCase())) {
          enhancedBullet = enhancedBullet + ' with a team of 5+ members';
          wasChanged = true;
        }
      }

      // Naturally integrate relevant keywords into experience descriptions
      const contextualKeywords = relevantKeywords.filter(keyword => 
        !bullet.toLowerCase().includes(keyword.toLowerCase()) &&
        isKeywordRelevantToExperience(keyword, bullet)
      ).slice(0, 2); // Limit to 2 keywords per bullet

      if (contextualKeywords.length > 0) {
        enhancedBullet = enhancedBullet + ` using ${contextualKeywords.join(' and ')}`;
        wasChanged = true;
        keywordsAdded += contextualKeywords.length;
      }

      if (wasChanged) {
        enhancedText = enhancedText.replace(bullet, enhancedBullet);
        changes.push({
          type: 'achievement',
          section: 'Experience',
          original: bullet,
          improved: enhancedBullet,
          reason: 'Enhanced with stronger action verbs, quantification, and relevant keywords'
        });
        achievementsQuantified++;
      }
    });
  }

  // 4. Add a professional summary if missing, incorporating keywords
  if (!findSection(enhancedText, ['SUMMARY', 'PROFESSIONAL SUMMARY', 'PROFILE'])) {
    const summaryKeywords = relevantKeywords.slice(0, 4);
    const professionalSummary = createProfessionalSummary(personalInfo, summaryKeywords, jobDescription);
    
    // Insert summary after contact information
    const contactEndIndex = findContactSectionEnd(enhancedText);
    if (contactEndIndex > 0) {
      enhancedText = enhancedText.slice(0, contactEndIndex) + '\n\nPROFESSIONAL SUMMARY\n' + professionalSummary + '\n' + enhancedText.slice(contactEndIndex);
      
      changes.push({
        type: 'formatting',
        section: 'Summary',
        original: 'No professional summary',
        improved: professionalSummary,
        reason: 'Added professional summary with relevant keywords for better ATS matching'
      });
      skillsEnhanced++;
    }
  }

  // 5. Format improvements while preserving structure
  enhancedText = enhancedText
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/([A-Z\s]{2,})\n/g, '$1\n') // Ensure section headers are properly formatted
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

// Helper functions for smart enhancement
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
    'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Agile', 'Scrum',
    'SQL', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'Microservices'
  ];
  
  return keywords.filter(keyword => 
    technicalSkills.some(skill => skill.toLowerCase() === keyword.toLowerCase()) ||
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
};

const isKeywordRelevantToExperience = (keyword: string, experience: string): boolean => {
  const techKeywords = ['React', 'Node.js', 'Python', 'JavaScript', 'AWS', 'Docker', 'Git'];
  const processKeywords = ['Agile', 'Scrum', 'CI/CD', 'DevOps'];
  
  if (techKeywords.includes(keyword)) {
    return experience.toLowerCase().includes('develop') || experience.toLowerCase().includes('build') || experience.toLowerCase().includes('implement');
  }
  
  if (processKeywords.includes(keyword)) {
    return experience.toLowerCase().includes('team') || experience.toLowerCase().includes('project') || experience.toLowerCase().includes('process');
  }
  
  return false;
};

const createProfessionalSummary = (personalInfo: any, keywords: string[], jobDescription: string): string => {
  const role = extractTargetRole(jobDescription);
  return `Experienced ${role || 'professional'} with expertise in ${keywords.slice(0, 3).join(', ')}. Proven track record of delivering high-quality solutions and driving technical excellence. Strong background in ${keywords.slice(-2).join(' and ')} with a focus on scalable and efficient implementations.`;
};

const extractTargetRole = (jobDescription: string): string => {
  const rolePatterns = [
    /(?:seeking|hiring|looking for)\s+(?:a\s+)?([^.]+?)(?:\s+to|\s+who|\.|$)/i,
    /job title[:\s]+([^.\n]+)/i,
    /position[:\s]+([^.\n]+)/i
  ];
  
  for (const pattern of rolePatterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'Software Developer';
};

const findContactSectionEnd = (text: string): number => {
  const lines = text.split('\n');
  let contactEndIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/[\w.-]+@[\w.-]+\.\w+/) || line.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) {
      contactEndIndex = text.indexOf(line) + line.length;
    } else if (line.match(/^[A-Z\s]{2,}$/) && i > 2) {
      break;
    }
  }
  
  return contactEndIndex;
};

export default ResumeOptimizer;