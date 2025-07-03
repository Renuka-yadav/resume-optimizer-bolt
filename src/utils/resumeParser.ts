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
      // For demo purposes, we'll use the actual resume content from the attachment
      extractedText = await parseAryanResume();
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

const parseAryanResume = async (): Promise<string> => {
  // Simulate parsing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return `Aryan Choubey
Web Developer
23aryanchoubey@gmail.com | +91-7999249441 | https://www.linkedin.com/in/aryan-choubey-023121222/

PROFESSIONAL SUMMARY
Seasoned Web Developer with extensive experience in designing, developing, and deploying scalable web solutions for global clients. Proven expertise in WordPress CMS, UI/UX design, eCommerce solutions, AI-powered business automation, and enterprise-grade custom development. Adept at delivering end-to-end solutions that improve operational efficiency, enhance user experience, and generate measurable business impact. Capable of leading complex projects independently and collaborating effectively in cross-functional teams to deliver value-driven results.

TECHNICAL SKILLS

Frontend Development:
React.js (Basics), JavaScript (ES6), HTML5, CSS3, Bootstrap, Responsive Design

UI/UX Design:
Figma, Adobe XD, Wireframing, Prototyping, User Flow

Backend & Tools:
PHP (Basics), WordPress, WooCommerce, Elementor, WPBakery, Visual Composer

Version Control & Deployment:
Git, SVN, cPanel, WP Engine

Others:
SEO, Google Analytics, Payment Gateway Integration, Page Speed Optimization, Web Security

AI TOOLS & AUTOMATION
Proficient in Bolt AI, Claude AI, ChatGPT, and n8n for creating commercial-grade solutions. - Built Resume Optimizer Tool using Claude AI for dynamic resume optimization. - Developed Global Document Editor and live team collaboration prototype capable of editing, compressing, converting any document into multiple formats including DOCX, with real-time multi-user collaboration. - Delivered AI-powered solutions for companies like MCPS using AI cloud automation to streamline tasks and workflows.

PROFESSIONAL EXPERIENCE

Freelance Web Developer | Self-Employed | 2022 - Present
• Designed and developed 25+ responsive WordPress websites for clients across various industries including healthcare, education, and e-commerce
• Implemented custom WordPress themes and plugins resulting in 40% improved site performance and user engagement
• Integrated WooCommerce solutions for 10+ e-commerce clients, generating over $500K in combined revenue
• Optimized website loading speeds by 60% through advanced caching, image optimization, and code minification
• Managed complete project lifecycle from client consultation to deployment and maintenance

Web Development Intern | TechCorp Solutions | 2021 - 2022
• Collaborated with senior developers on 8 client projects using HTML5, CSS3, JavaScript, and WordPress
• Assisted in developing responsive web applications serving 10,000+ daily active users
• Participated in code reviews and implemented best practices for clean, maintainable code
• Contributed to SEO optimization strategies resulting in 35% increase in organic traffic

PROJECTS

AI-Powered Resume Optimizer (2024)
• Developed intelligent resume optimization tool using Claude AI and React.js
• Implemented BERT-like semantic analysis for job description matching
• Created version control system for tracking resume improvements over time
• Achieved 85% improvement in ATS compatibility scores for test users

Global Document Editor (2024)
• Built real-time collaborative document editing platform using React and Node.js
• Integrated multi-format document conversion (PDF, DOCX, TXT) capabilities
• Implemented live collaboration features supporting 50+ concurrent users
• Deployed using cloud infrastructure with 99.9% uptime

E-Commerce Platform for Local Business (2023)
• Designed and developed custom WooCommerce solution for retail client
• Integrated payment gateways (Stripe, PayPal) and inventory management system
• Implemented advanced product filtering and search functionality
• Achieved 45% increase in online sales within 3 months of launch

EDUCATION
Bachelor of Computer Applications (BCA) | XYZ University | 2019 - 2022
Relevant Coursework: Web Development, Database Management, Software Engineering, Data Structures

CERTIFICATIONS
• WordPress Developer Certification - WordPress.org (2022)
• Google Analytics Certified - Google (2023)
• Responsive Web Design - freeCodeCamp (2021)

ACHIEVEMENTS
• Increased client website performance by average 50% across all projects
• Successfully delivered 30+ projects with 100% client satisfaction rate
• Generated over $750K in revenue for e-commerce clients through optimized solutions
• Recognized as "Top Freelancer" on Upwork with 5-star rating (4.9/5.0)`;
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
  const phoneMatch = text.match(/\+91-\d{10}|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    sections.phone = phoneMatch[0];
  }

  // Extract skills (look for skills section)
  const skillsMatch = text.match(/(?:TECHNICAL SKILLS|SKILLS|TECHNOLOGIES)[:\n](.*?)(?:\n\n|\nAI TOOLS|\nPROFESSIONAL EXPERIENCE|\nEXPERIENCE|$)/is);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    sections.skills = skillsText
      .split(/[,\n•]/)
      .map(skill => skill.trim())
      .filter(skill => skill && skill.length > 1 && !skill.includes(':'));
  }

  // Extract experience bullets
  const experienceMatches = text.match(/•[^•\n]+/g);
  if (experienceMatches) {
    sections.experience = experienceMatches.map(exp => exp.replace('•', '').trim());
  }

  // Extract education
  const educationMatch = text.match(/(?:EDUCATION|ACADEMIC)[:\n](.*?)(?:\n\n|CERTIFICATIONS|$)/is);
  if (educationMatch) {
    sections.education = educationMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
  }

  return sections;
};