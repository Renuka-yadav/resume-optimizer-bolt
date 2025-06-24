import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ResumeData } from '../types';
import { parseResumeFile } from '../utils/resumeParser';

interface UploadSectionProps {
  onResumeUpload: (data: ResumeData) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onResumeUpload }) => {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadedFile(file);

    try {
      const resumeData = await parseResumeFile(file);
      onResumeUpload(resumeData);
      toast.success('Resume uploaded and parsed successfully!');
    } catch (error) {
      toast.error('Failed to parse resume. Please try again.');
      console.error('Resume parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onResumeUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Upload Your Resume</h2>
        <p className="text-secondary-600">
          Upload your resume in PDF, DOCX, or TXT format for AI-powered analysis
        </p>
      </div>

      <motion.div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-primary-400 bg-primary-50' 
            : uploadedFile 
              ? 'border-success-400 bg-success-50' 
              : 'border-secondary-300 bg-secondary-50 hover:border-primary-400 hover:bg-primary-50'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            <p className="text-primary-600 font-medium">Processing your resume...</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-4">
            <CheckCircle className="h-16 w-16 text-success-600 mx-auto" />
            <div>
              <p className="text-success-700 font-semibold text-lg">Resume Uploaded Successfully!</p>
              <p className="text-secondary-600 mt-1">{uploadedFile.name}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-16 w-16 text-secondary-400 mx-auto" />
            <div>
              <p className="text-secondary-700 font-semibold text-lg">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
              </p>
              <p className="text-secondary-500 mt-1">or click to browse files</p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-secondary-500">
              <span className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </span>
              <span className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>DOCX</span>
              </span>
              <span className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>TXT</span>
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {uploadedFile && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-secondary-50 rounded-lg"
        >
          <h3 className="font-semibold text-secondary-900 mb-2">File Details</h3>
          <div className="space-y-1 text-sm text-secondary-600">
            <p><span className="font-medium">Name:</span> {uploadedFile.name}</p>
            <p><span className="font-medium">Size:</span> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><span className="font-medium">Type:</span> {uploadedFile.type}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadSection;