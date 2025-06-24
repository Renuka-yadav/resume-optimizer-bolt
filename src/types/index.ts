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
}

export interface UploadedFile {
  file: File;
  preview?: string;
}