import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { BertAnalysis, MLRecommendation } from '../types';

interface MLAnalysisPanelProps {
  bertAnalysis: BertAnalysis;
  mlRecommendations: MLRecommendation[];
  isAnalyzing: boolean;
}

const MLAnalysisPanel: React.FC<MLAnalysisPanelProps> = ({
  bertAnalysis,
  mlRecommendations,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'confidence'>('insights');

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success-600 bg-success-100';
    if (confidence >= 60) return 'text-warning-600 bg-warning-100';
    return 'text-error-600 bg-error-100';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-4 w-4 text-success-600" />;
      case 'medium': return <Target className="h-4 w-4 text-warning-600" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-secondary-600" />;
      default: return <AlertCircle className="h-4 w-4 text-secondary-600" />;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-semibold text-secondary-900 mb-3">AI Analysis in Progress</h3>
          <p className="text-secondary-600 mb-6">
            Our advanced ML models are analyzing your resume for semantic understanding and optimization opportunities
          </p>
          <div className="space-y-3 text-secondary-600">
            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span>Performing BERT semantic analysis...</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span>Calculating contextual relevance scores...</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span>Generating intelligent recommendations...</span>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-3 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-secondary-900">AI-Powered Analysis</h2>
            <p className="text-secondary-600">Advanced ML insights and recommendations</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'insights', label: 'ML Insights', icon: Zap },
            { id: 'recommendations', label: 'Smart Recommendations', icon: Lightbulb },
            { id: 'confidence', label: 'Confidence Metrics', icon: Target }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`py-3 px-2 border-b-2 font-semibold text-base transition-colors flex items-center space-x-2 ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'insights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary-700 mb-2">
                {bertAnalysis.semanticSimilarity}%
              </div>
              <div className="text-primary-600 font-medium">Semantic Similarity</div>
              <div className="text-sm text-primary-500 mt-2">
                Job description alignment
              </div>
            </div>

            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-success-700 mb-2">
                {bertAnalysis.industryAlignment}%
              </div>
              <div className="text-success-600 font-medium">Industry Alignment</div>
              <div className="text-sm text-success-500 mt-2">
                Sector-specific relevance
              </div>
            </div>

            <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-warning-700 mb-2">
                {bertAnalysis.skillRelevance}%
              </div>
              <div className="text-warning-600 font-medium">Skill Relevance</div>
              <div className="text-sm text-warning-500 mt-2">
                Technical skill matching
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-secondary-700 mb-2">
                {bertAnalysis.experienceDepth}%
              </div>
              <div className="text-secondary-600 font-medium">Experience Depth</div>
              <div className="text-sm text-secondary-500 mt-2">
                Professional background
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 via-primary-25 to-success-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Contextual Matches</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-secondary-800 mb-3">Strong Matches Found</h4>
                <div className="space-y-2">
                  {bertAnalysis.contextualMatches.slice(0, 5).map((match, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 bg-white rounded-lg p-3"
                    >
                      <CheckCircle className="h-5 w-5 text-success-600" />
                      <span className="text-secondary-700">{match}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold text-secondary-800 mb-4">ML Confidence Score</h4>
                <div className="relative">
                  <div className="w-full bg-secondary-200 rounded-full h-4 mb-4">
                    <motion.div
                      className="bg-gradient-to-r from-primary-500 to-success-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${bertAnalysis.confidenceScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-secondary-900">
                      {bertAnalysis.confidenceScore}%
                    </span>
                    <p className="text-secondary-600 text-sm mt-1">
                      Overall analysis confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Smart Recommendations</h3>
            <p className="text-secondary-600">
              AI-generated suggestions to optimize your resume for maximum impact
            </p>
          </div>

          <div className="space-y-4">
            {mlRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    recommendation.type === 'semantic' ? 'bg-primary-100' :
                    recommendation.type === 'keyword' ? 'bg-warning-100' :
                    recommendation.type === 'achievement' ? 'bg-success-100' :
                    recommendation.type === 'skill' ? 'bg-secondary-100' :
                    'bg-error-100'
                  }`}>
                    {getImpactIcon(recommendation.impact)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          recommendation.type === 'semantic' ? 'bg-primary-100 text-primary-700' :
                          recommendation.type === 'keyword' ? 'bg-warning-100 text-warning-700' :
                          recommendation.type === 'achievement' ? 'bg-success-100 text-success-700' :
                          recommendation.type === 'skill' ? 'bg-secondary-100 text-secondary-700' :
                          'bg-error-100 text-error-700'
                        }`}>
                          {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                        </span>
                        <span className="text-sm text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                          {recommendation.section}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                          {recommendation.confidence}% confidence
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        recommendation.impact === 'high' ? 'bg-success-100 text-success-700' :
                        recommendation.impact === 'medium' ? 'bg-warning-100 text-warning-700' :
                        'bg-secondary-100 text-secondary-700'
                      }`}>
                        {recommendation.impact.toUpperCase()} IMPACT
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-secondary-700 mb-2 block">Current:</span>
                        <p className="text-sm text-secondary-600 bg-red-50 p-3 rounded-lg border-l-4 border-red-200">
                          {recommendation.original}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-secondary-700 mb-2 block">AI Suggestion:</span>
                        <p className="text-sm text-secondary-900 bg-green-50 p-3 rounded-lg border-l-4 border-green-200">
                          {recommendation.improved}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-secondary-700 mb-2 block">Why this helps:</span>
                        <p className="text-sm text-secondary-600 italic bg-blue-50 p-3 rounded-lg">
                          {recommendation.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'confidence' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Confidence Metrics</h3>
            <p className="text-secondary-600">
              Detailed breakdown of AI analysis confidence levels
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-primary-800 mb-4">Analysis Confidence</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary-700">Semantic Analysis</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-primary-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${bertAnalysis.semanticSimilarity}%` }}
                      />
                    </div>
                    <span className="font-semibold text-primary-800 text-sm">
                      {bertAnalysis.semanticSimilarity}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-700">Industry Matching</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-primary-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${bertAnalysis.industryAlignment}%` }}
                      />
                    </div>
                    <span className="font-semibold text-primary-800 text-sm">
                      {bertAnalysis.industryAlignment}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-700">Skill Relevance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-primary-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${bertAnalysis.skillRelevance}%` }}
                      />
                    </div>
                    <span className="font-semibold text-primary-800 text-sm">
                      {bertAnalysis.skillRelevance}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-success-800 mb-4">Recommendation Quality</h4>
              <div className="space-y-4">
                {['High Impact', 'Medium Impact', 'Low Impact'].map((impact, index) => {
                  const count = mlRecommendations.filter(r => 
                    r.impact === impact.toLowerCase().split(' ')[0]
                  ).length;
                  const avgConfidence = mlRecommendations
                    .filter(r => r.impact === impact.toLowerCase().split(' ')[0])
                    .reduce((acc, r) => acc + r.confidence, 0) / count || 0;
                  
                  return (
                    <div key={impact} className="flex justify-between items-center">
                      <span className="text-success-700">{impact} Suggestions</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-success-600">{count} items</span>
                        <span className="font-semibold text-success-800 text-sm">
                          {Math.round(avgConfidence)}% avg
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-8">
            <h4 className="text-lg font-semibold text-secondary-800 mb-6">Overall Assessment</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-700 mb-2">
                  {bertAnalysis.confidenceScore}%
                </div>
                <div className="text-secondary-600">Overall Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-700 mb-2">
                  {mlRecommendations.length}
                </div>
                <div className="text-secondary-600">Total Recommendations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-700 mb-2">
                  {mlRecommendations.filter(r => r.impact === 'high').length}
                </div>
                <div className="text-secondary-600">High Impact Items</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MLAnalysisPanel;