import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  disabled: boolean;
  isAnalyzing: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  onAnalyze,
  disabled,
  isAnalyzing
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Job Description</h2>
        <p className="text-secondary-600">
          Paste the job description to get personalized optimization suggestions
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="job-description" className="block text-sm font-medium text-secondary-700 mb-2">
            Job Description Text
          </label>
          <textarea
            id="job-description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste the job description here to get tailored resume optimization suggestions..."
            className="w-full h-48 px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
            disabled={disabled}
          />
        </div>

        <motion.button
          onClick={onAnalyze}
          disabled={disabled || !value.trim()}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2
            ${disabled || !value.trim()
              ? 'bg-secondary-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
            }
          `}
          whileHover={!disabled && value.trim() ? { scale: 1.02 } : {}}
          whileTap={!disabled && value.trim() ? { scale: 0.98 } : {}}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Resume...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Analyze & Optimize Resume</span>
            </>
          )}
        </motion.button>

        {disabled && !value.trim() && (
          <p className="text-sm text-secondary-500 text-center">
            Please upload a resume first to enable analysis
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionInput;