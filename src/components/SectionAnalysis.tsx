import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface SectionAnalysisProps {
  sections: AnalysisResult['sections'];
}

const SectionAnalysis: React.FC<SectionAnalysisProps> = ({ sections }) => {
  const chartData = Object.entries(sections).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    score: value.score,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary-100">
      <h3 className="text-xl font-bold text-secondary-900 mb-6">Section Scores</h3>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="score" 
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {Object.entries(sections).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-secondary-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-secondary-900 capitalize">{key}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value.score >= 80 ? 'bg-success-100 text-success-700' :
                value.score >= 60 ? 'bg-warning-100 text-warning-700' :
                'bg-error-100 text-error-700'
              }`}>
                {value.score}%
              </span>
            </div>
            <ul className="space-y-1">
              {value.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-secondary-600 flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionAnalysis;