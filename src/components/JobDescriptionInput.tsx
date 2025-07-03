import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Edit3 } from 'lucide-react';

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
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const clearJobDescription = () => {
    onChange('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-secondary-900">Job Description</h2>
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-primary-600" />
            <span className="text-sm text-primary-600 font-medium">Editable</span>
          </div>
        </div>
        <p className="text-secondary-600">
          Paste or edit the job description to get personalized optimization suggestions
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="job-description" className="block text-sm font-medium text-secondary-700">
              Job Description Text
            </label>
            {value && (
              <button
                onClick={clearJobDescription}
                className="text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
                type="button"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            id="job-description"
            value={value}
            onChange={handleTextChange}
            placeholder="Paste the job description here to get tailored resume optimization suggestions..."
            className="w-full h-48 px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200 text-sm leading-relaxed"
            disabled={isAnalyzing}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-secondary-500">
              {value.length} characters
            </span>
            <span className="text-xs text-secondary-500">
              {value.split('\n').length} lines
            </span>
          </div>
        </div>

        <motion.button
          onClick={onAnalyze}
          disabled={disabled || !value.trim() || isAnalyzing}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2
            ${disabled || !value.trim() || isAnalyzing
              ? 'bg-secondary-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
            }
          `}
          whileHover={!disabled && value.trim() && !isAnalyzing ? { scale: 1.02 } : {}}
          whileTap={!disabled && value.trim() && !isAnalyzing ? { scale: 0.98 } : {}}
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

        {!disabled && value.trim() && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary-800 mb-1">Ready for Analysis</h4>
                <p className="text-sm text-primary-700">
                  Your job description is loaded and ready. Click "Analyze & Optimize Resume" to get personalized suggestions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionInput;