export interface ResumeData {
  fileName: string;
  content: string;
  extractedText: string;
  sections: {
    name?: string;
    email?: string;
    phone?: string;
    skills: string[];
    experience: string[];
    education: string[];
  };
}

export interface SectionAnalysis {
  score: number;
  suggestions: string[];
  confidence?: number;
  mlInsights?: string[];
}

export interface AnalysisResult {
  overallScore: number;
  sections: {
    skills: SectionAnalysis;
    experience: SectionAnalysis;
    education: SectionAnalysis;
    keywords: SectionAnalysis;
  };
  missingKeywords: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  atsCompatibility: number;
  semanticScore?: number;
  bertAnalysis?: BertAnalysis;
}

export interface BertAnalysis {
  semanticSimilarity: number;
  contextualMatches: string[];
  industryAlignment: number;
  skillRelevance: number;
  experienceDepth: number;
  confidenceScore: number;
}

export interface ResumeVersion {
  id: string;
  name: string;
  content: string;
  timestamp: Date;
  analysisResult: AnalysisResult;
  improvements: {
    keywordsAdded: number;
    achievementsQuantified: number;
    skillsEnhanced: number;
    totalChanges: number;
  };
  mlScore: number;
  version: number;
}

export interface VersionComparison {
  baseline: ResumeVersion;
  current: ResumeVersion;
  improvements: {
    scoreIncrease: number;
    keywordImprovement: number;
    atsImprovement: number;
    semanticImprovement: number;
  };
  recommendations: string[];
}

export interface MLRecommendation {
  type: 'keyword' | 'achievement' | 'skill' | 'formatting' | 'semantic';
  section: string;
  original: string;
  improved: string;
  reason: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export interface UploadedFile {
  file: File;
  preview?: string;
}