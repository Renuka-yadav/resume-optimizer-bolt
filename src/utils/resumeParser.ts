import { ResumeData } from '../types';
import mammoth from 'mammoth';

export const parseResumeFile = async (file: File): Promise<ResumeData> => {
  const fileName = file.name;
  const fileType = file.type;
  
  let extractedText = '';
  
  try {
    if (fileType === 'text/plain') {
      extractedText = await file.text();
    } else if (fileType === 'application/pdf') {
      // For demo purposes, we'll simulate PDF parsing
      extractedText = await simulatePDFParsing(file);
    } else if (fileType.includes('word') || fileType.includes('document')) {
      // Use mammoth to parse DOCX files
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    // Extract structured data from the text
    const sections = extractSections(extractedText);

    return {
      fileName,
      content: extractedText,
      extractedText,
      sections
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume file');
  }
};

const simulatePDFParsing = async (file: File): Promise<string> => {
  // Simulate PDF parsing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-2023
• Developed and maintained web applications using React, Node.js, and MongoDB
• Led a team of 5 developers in implementing new features
• Improved application performance by 40% through optimization

Software Engineer | StartupXYZ | 2018-2020
• Built responsive web applications using modern JavaScript frameworks
• Collaborated with cross-functional teams to deliver high-quality products
• Implemented automated testing procedures

SKILLS
JavaScript, React, Node.js, Python, MongoDB, PostgreSQL, AWS, Docker, Git

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2018`;
};

const extractSections = (text: string) => {
  const sections = {
    name: '',
    email: '',
    phone: '',
    skills: [] as string[],
    experience: [] as string[],
    education: [] as string[]
  };

  // Extract name (first line typically)
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    sections.name = lines[0].trim();
  }

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    sections.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    sections.phone = phoneMatch[0];
  }

  // Extract skills (look for skills section)
  const skillsMatch = text.match(/(?:SKILLS|TECHNICAL SKILLS|TECHNOLOGIES)[:\n](.*?)(?:\n\n|\nEDUCATION|\nEXPERIENCE|$)/is);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    sections.skills = skillsText
      .split(/[,\n•]/)
      .map(skill => skill.trim())
      .filter(skill => skill && skill.length > 1);
  }

  // Extract experience bullets
  const experienceMatches = text.match(/•[^•\n]+/g);
  if (experienceMatches) {
    sections.experience = experienceMatches.map(exp => exp.replace('•', '').trim());
  }

  // Extract education
  const educationMatch = text.match(/(?:EDUCATION|ACADEMIC)[:\n](.*?)(?:\n\n|$)/is);
  if (educationMatch) {
    sections.education = educationMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
  }

  return sections;
};