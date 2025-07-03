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
  
  // Return a generic resume template that can be customized
  return `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in developing scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality solutions that drive business growth and improve user experience.

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, Java, TypeScript
Frameworks: React, Node.js, Express, Django
Databases: MySQL, PostgreSQL, MongoDB
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
Tools: Git, Jira, Confluence, VS Code

PROFESSIONAL EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-2023
• Led development of microservices architecture serving 100K+ daily active users
• Improved application performance by 40% through code optimization and caching strategies
• Mentored team of 3 junior developers and conducted code reviews
• Collaborated with product managers to define technical requirements and project timelines

Software Engineer | StartupXYZ | 2018-2020
• Developed responsive web applications using React and Node.js
• Implemented automated testing procedures reducing bugs by 30%
• Participated in agile development process and sprint planning
• Contributed to open-source projects and technical documentation

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2018
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

CERTIFICATIONS
• AWS Certified Solutions Architect (2022)
• Certified Scrum Master (2021)`;
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
    const firstLine = lines[0].trim();
    // Check if first line looks like a name
    if (/^[A-Za-z\s]{2,50}$/.test(firstLine) && firstLine.split(' ').length <= 4) {
      sections.name = firstLine;
    }
  }

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    sections.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = text.match(/\+?[\d\s\-\(\)]{10,}/);
  if (phoneMatch) {
    sections.phone = phoneMatch[0];
  }

  // Extract skills (look for skills section)
  const skillsMatch = text.match(/(?:TECHNICAL SKILLS|SKILLS|TECHNOLOGIES|CORE COMPETENCIES)[:\n](.*?)(?:\n\n|\nPROFESSIONAL EXPERIENCE|\nEXPERIENCE|\nEDUCATION|$)/is);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    sections.skills = skillsText
      .split(/[,\n•\-\*]/)
      .map(skill => skill.trim())
      .filter(skill => skill && skill.length > 1 && !skill.includes(':'))
      .slice(0, 20); // Limit to 20 skills
  }

  // Extract experience bullets
  const experienceMatches = text.match(/[•\-\*]\s*[^•\-\*\n]+/g);
  if (experienceMatches) {
    sections.experience = experienceMatches
      .map(exp => exp.replace(/^[•\-\*]\s*/, '').trim())
      .filter(exp => exp.length > 10); // Filter out short entries
  }

  // Extract education
  const educationMatch = text.match(/(?:EDUCATION|ACADEMIC BACKGROUND)[:\n](.*?)(?:\n\n|CERTIFICATIONS|PROJECTS|$)/is);
  if (educationMatch) {
    sections.education = educationMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.length > 5);
  }

  return sections;
};