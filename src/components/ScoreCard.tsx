import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  color: 'primary' | 'success' | 'warning' | 'error';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          text: 'text-primary-700',
          pathColor: '#0ea5e9',
          trailColor: '#e0f2fe'
        };
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          text: 'text-success-700',
          pathColor: '#22c55e',
          trailColor: '#dcfce7'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          text: 'text-warning-700',
          pathColor: '#f59e0b',
          trailColor: '#fef3c7'
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          border: 'border-error-200',
          text: 'text-error-700',
          pathColor: '#ef4444',
          trailColor: '#fee2e2'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div
      className={`${colors.bg} ${colors.border} border rounded-2xl p-6 text-center`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-24 h-24 mx-auto mb-4">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textSize: '20px',
            pathColor: colors.pathColor,
            textColor: colors.pathColor,
            trailColor: colors.trailColor,
            backgroundColor: 'transparent',
          })}
        />
      </div>
      <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>{title}</h3>
      <p className="text-secondary-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default ScoreCard;