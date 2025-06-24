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
      const result = performResumeOptimization(
        resumeData.extractedText,
        jobDescription,
        missingKeywords,
        resumeData.sections
      );
      
      setOptimizationResult(result);
      setIsOptimizing(false);
      setShowPreview(true);
      onSaveImprovedResume(result.optimizedResume);
      toast.success('Resume optimized successfully!');
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
    a.download = `optimized_resume_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Resume downloaded as ${format.toUpperCase()}!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-3">AI Resume Optimizer</h2>
        <p className="text-secondary-600 text-lg">
          Transform your resume with intelligent optimization, keyword enhancement, and ATS compatibility improvements
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
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Ready to Optimize</h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                Our AI will analyze your resume against the job description and apply professional improvements
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
                <span>Optimizing Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                <span>Optimize My Resume</span>
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
                <div className="text-sm">🔍 Analyzing resume structure...</div>
                <div className="text-sm">🎯 Matching keywords with job description...</div>
                <div className="text-sm">📈 Quantifying achievements...</div>
                <div className="text-sm">✨ Applying professional enhancements...</div>
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
              <h3 className="text-xl font-bold text-success-800">Optimization Complete!</h3>
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
                  <span>Resume Preview</span>
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
                  <span>Changes Made ({optimizationResult.changes.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'preview' && (
            <div className="border border-secondary-200 rounded-lg">
              <div className="bg-secondary-50 px-4 py-3 border-b border-secondary-200 rounded-t-lg">
                <h3 className="font-semibold text-secondary-900">Optimized Resume</h3>
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
              <h3 className="text-lg font-semibold text-secondary-900">Detailed Changes</h3>
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
                          <span className="text-sm font-medium text-secondary-700">Before:</span>
                          <p className="text-sm text-secondary-600 bg-red-50 p-3 rounded mt-1 border-l-4 border-red-200">
                            {change.original}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-700">After:</span>
                          <p className="text-sm text-secondary-900 bg-green-50 p-3 rounded mt-1 border-l-4 border-green-200">
                            {change.improved}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Why this change:</span>
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

// Advanced resume optimization function
const performResumeOptimization = (
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[],
  sections: any
): OptimizationResult => {
  let optimizedText = resumeText;
  const changes: OptimizationResult['changes'] = [];
  let keywordsAdded = 0;
  let achievementsQuantified = 0;
  let skillsEnhanced = 0;

  // 1. Preserve personal information
  const personalInfo = {
    name: sections.name || extractName(resumeText),
    email: sections.email || extractEmail(resumeText),
    phone: sections.phone || extractPhone(resumeText)
  };

  // 2. Keyword optimization
  const relevantKeywords = [...missingKeywords, ...extractJobKeywords(jobDescription)];
  const uniqueKeywords = [...new Set(relevantKeywords)];

  uniqueKeywords.forEach(keyword => {
    if (!optimizedText.toLowerCase().includes(keyword.toLowerCase())) {
      // Add to skills section
      const skillsMatch = optimizedText.match(/(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
      if (skillsMatch) {
        const originalSkills = skillsMatch[0];
        const newSkills = originalSkills + (originalSkills.endsWith(',') ? ' ' : ', ') + keyword;
        optimizedText = optimizedText.replace(originalSkills, newSkills);
        
        changes.push({
          type: 'keyword',
          section: 'Skills',
          original: originalSkills,
          improved: newSkills,
          reason: `Added "${keyword}" to improve ATS keyword matching and job relevance`
        });
        keywordsAdded++;
      }
    }
  });

  // 3. Achievement quantification
  const achievementPatterns = [
    /• (Developed|Built|Created|Implemented|Designed|Led|Managed|Improved|Enhanced|Optimized|Increased|Reduced) ([^•\n]+)/gi
  ];

  achievementPatterns.forEach(pattern => {
    const matches = Array.from(optimizedText.matchAll(pattern));
    matches.forEach(match => {
      const original = match[0];
      let improved = original;

      // Add metrics if not present
      if (!original.match(/\d+%|\d+\+|\$[\d,]+|\d+[kK]?\+?|\d+ (users|customers|projects|team members|hours|days|months)/i)) {
        const verb = match[1].toLowerCase();
        
        if (['improved', 'enhanced', 'optimized', 'increased'].includes(verb)) {
          improved = original + ' by 25-40%';
        } else if (['reduced', 'decreased'].includes(verb)) {
          improved = original + ' by 30%';
        } else if (['led', 'managed'].includes(verb)) {
          improved = original + ' with a cross-functional team of 5+ members';
        } else if (['developed', 'built', 'created'].includes(verb)) {
          improved = original + ' serving 1,000+ active users';
        } else if (['implemented', 'designed'].includes(verb)) {
          improved = original + ' resulting in improved system efficiency';
        }

        if (improved !== original) {
          optimizedText = optimizedText.replace(original, improved);
          changes.push({
            type: 'achievement',
            section: 'Experience',
            original,
            improved,
            reason: 'Added quantifiable metrics to demonstrate measurable impact and results'
          });
          achievementsQuantified++;
        }
      }
    });
  });

  // 4. Skills section enhancement
  const jobSkills = extractTechnicalSkills(jobDescription);
  const currentSkillsMatch = optimizedText.match(/(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
  
  if (currentSkillsMatch && jobSkills.length > 0) {
    const currentSkillsText = currentSkillsMatch[2];
    const missingSkills = jobSkills.filter(skill => 
      !currentSkillsText.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 4); // Limit to 4 new skills

    if (missingSkills.length > 0) {
      const originalSection = currentSkillsMatch[0];
      const enhancedSection = originalSection + ', ' + missingSkills.join(', ');
      optimizedText = optimizedText.replace(originalSection, enhancedSection);
      
      changes.push({
        type: 'skill',
        section: 'Skills',
        original: originalSection,
        improved: enhancedSection,
        reason: `Added relevant technical skills from job requirements: ${missingSkills.join(', ')}`
      });
      skillsEnhanced++;
    }
  }

  // 5. Action verb enhancement
  const verbReplacements = {
    'worked on': 'developed',
    'helped with': 'collaborated on',
    'assisted in': 'contributed to',
    'participated in': 'engaged in',
    'was responsible for': 'managed',
    'did': 'executed',
    'made': 'created'
  };

  Object.entries(verbReplacements).forEach(([weak, strong]) => {
    const regex = new RegExp(`• ${weak}`, 'gi');
    const matches = Array.from(optimizedText.matchAll(regex));
    matches.forEach(match => {
      const original = match[0];
      const improved = original.replace(new RegExp(weak, 'i'), strong);
      optimizedText = optimizedText.replace(original, improved);
      
      changes.push({
        type: 'achievement',
        section: 'Experience',
        original,
        improved,
        reason: `Replaced weak action verb "${weak}" with stronger verb "${strong}" for more impact`
      });
    });
  });

  // 6. Format improvements
  optimizedText = optimizedText
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/([A-Z\s]+)\n/g, '$1\n') // Ensure section headers are properly formatted
    .trim();

  return {
    optimizedResume: optimizedText,
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
const extractName = (text: string): string => {
  const lines = text.split('\n').filter(line => line.trim());
  return lines[0]?.trim() || '';
};

const extractEmail = (text: string): string => {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return emailMatch ? emailMatch[0] : '';
};

const extractPhone = (text: string): string => {
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return phoneMatch ? phoneMatch[0] : '';
};

const extractJobKeywords = (jobDescription: string): string[] => {
  const keywords = [];
  const commonPatterns = [
    /\b(React|Angular|Vue\.js|Node\.js|Python|Java|JavaScript|TypeScript)\b/gi,
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Git|CI\/CD)\b/gi,
    /\b(Agile|Scrum|DevOps|REST|API|GraphQL|Microservices)\b/gi,
    /\b(SQL|MongoDB|PostgreSQL|MySQL|Redis|Elasticsearch)\b/gi
  ];

  commonPatterns.forEach(pattern => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      keywords.push(...matches);
    }
  });

  return [...new Set(keywords)];
};

const extractTechnicalSkills = (jobDescription: string): string[] => {
  const skills = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Python', 'Django', 'Flask',
    'Java', 'Spring Boot', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SASS', 'LESS',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
    'CI/CD', 'Agile', 'Scrum', 'DevOps', 'REST API', 'GraphQL', 'Microservices',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Firebase'
  ];

  return skills.filter(skill => 
    jobDescription.toLowerCase().includes(skill.toLowerCase())
  );
};

export default ResumeOptimizer;