import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, Download, Eye, GitCompare as Compare, Star, Zap } from 'lucide-react';
import { ResumeVersion, VersionComparison } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface VersionManagerProps {
  versions: ResumeVersion[];
  currentVersion: ResumeVersion | null;
  onVersionSelect: (version: ResumeVersion) => void;
  onVersionCompare: (version1: ResumeVersion, version2: ResumeVersion) => void;
  onVersionDownload: (version: ResumeVersion) => void;
}

const VersionManager: React.FC<VersionManagerProps> = ({
  versions,
  currentVersion,
  onVersionSelect,
  onVersionCompare,
  onVersionDownload
}) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'performance' | 'comparison'>('timeline');

  const handleVersionToggle = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
  };

  const getPerformanceData = () => {
    return versions.map((version, index) => ({
      version: `v${version.version}`,
      overallScore: version.analysisResult.overallScore,
      atsScore: version.analysisResult.atsCompatibility,
      semanticScore: version.analysisResult.semanticScore || 0,
      mlScore: version.mlScore,
      timestamp: version.timestamp.toLocaleDateString()
    }));
  };

  const getRadarData = (version: ResumeVersion) => [
    { subject: 'Skills', score: version.analysisResult.sections.skills.score },
    { subject: 'Experience', score: version.analysisResult.sections.experience.score },
    { subject: 'Education', score: version.analysisResult.sections.education.score },
    { subject: 'Keywords', score: version.analysisResult.sections.keywords.score },
    { subject: 'ATS', score: version.analysisResult.atsCompatibility },
    { subject: 'Semantic', score: version.analysisResult.semanticScore || 0 }
  ];

  const compareVersions = () => {
    if (selectedVersions.length === 2) {
      const version1 = versions.find(v => v.id === selectedVersions[0])!;
      const version2 = versions.find(v => v.id === selectedVersions[1])!;
      onVersionCompare(version1, version2);
      setShowComparison(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-3">Resume Versions</h2>
        <p className="text-secondary-600 text-lg">
          Track your resume evolution and compare performance across different versions
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'timeline', label: 'Version Timeline', icon: Clock },
            { id: 'performance', label: 'Performance Tracking', icon: TrendingUp },
            { id: 'comparison', label: 'Version Comparison', icon: Compare }
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

      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary-900">Version History</h3>
              {selectedVersions.length === 2 && (
                <motion.button
                  onClick={compareVersions}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Compare className="h-5 w-5" />
                  <span>Compare Selected</span>
                </motion.button>
              )}
            </div>

            <div className="space-y-4">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-xl p-6 transition-all duration-200 cursor-pointer ${
                    currentVersion?.id === version.id
                      ? 'border-primary-300 bg-primary-50'
                      : selectedVersions.includes(version.id)
                      ? 'border-warning-300 bg-warning-50'
                      : 'border-secondary-200 bg-white hover:border-secondary-300 hover:shadow-md'
                  }`}
                  onClick={() => handleVersionToggle(version.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        currentVersion?.id === version.id
                          ? 'bg-primary-100'
                          : 'bg-secondary-100'
                      }`}>
                        <Star className={`h-6 w-6 ${
                          currentVersion?.id === version.id
                            ? 'text-primary-600'
                            : 'text-secondary-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-secondary-900">
                          {version.name}
                        </h4>
                        <p className="text-secondary-600">
                          {version.timestamp.toLocaleDateString()} at {version.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">
                          {version.analysisResult.overallScore}%
                        </div>
                        <div className="text-sm text-secondary-600">Overall Score</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success-600">
                          {version.mlScore}%
                        </div>
                        <div className="text-sm text-secondary-600">ML Score</div>
                      </div>

                      <div className="flex space-x-2">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVersionSelect(version);
                          }}
                          className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-5 w-5" />
                        </motion.button>
                        
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVersionDownload(version);
                          }}
                          className="p-2 bg-success-100 text-success-600 rounded-lg hover:bg-success-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-secondary-50 rounded-lg">
                      <div className="text-lg font-semibold text-secondary-900">
                        {version.improvements.keywordsAdded}
                      </div>
                      <div className="text-sm text-secondary-600">Keywords Added</div>
                    </div>
                    <div className="text-center p-3 bg-secondary-50 rounded-lg">
                      <div className="text-lg font-semibold text-secondary-900">
                        {version.improvements.achievementsQuantified}
                      </div>
                      <div className="text-sm text-secondary-600">Achievements Enhanced</div>
                    </div>
                    <div className="text-center p-3 bg-secondary-50 rounded-lg">
                      <div className="text-lg font-semibold text-secondary-900">
                        {version.analysisResult.atsCompatibility}%
                      </div>
                      <div className="text-sm text-secondary-600">ATS Score</div>
                    </div>
                    <div className="text-center p-3 bg-secondary-50 rounded-lg">
                      <div className="text-lg font-semibold text-secondary-900">
                        {version.analysisResult.semanticScore || 0}%
                      </div>
                      <div className="text-sm text-secondary-600">Semantic Match</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-secondary-900 mb-6">Performance Trends</h3>
              <div className="h-80 bg-secondary-50 rounded-xl p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getPerformanceData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="version" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="overallScore" stroke="#0ea5e9" strokeWidth={3} name="Overall Score" />
                    <Line type="monotone" dataKey="atsScore" stroke="#22c55e" strokeWidth={3} name="ATS Score" />
                    <Line type="monotone" dataKey="semanticScore" stroke="#f59e0b" strokeWidth={3} name="Semantic Score" />
                    <Line type="monotone" dataKey="mlScore" stroke="#8b5cf6" strokeWidth={3} name="ML Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {currentVersion && (
              <div>
                <h3 className="text-xl font-bold text-secondary-900 mb-6">Current Version Analysis</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-secondary-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Section Breakdown</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={getRadarData(currentVersion)}>
                          <PolarGrid stroke="#cbd5e1" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <Radar
                            name="Score"
                            dataKey="score"
                            stroke="#0ea5e9"
                            fill="#0ea5e9"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Zap className="h-6 w-6 text-primary-600" />
                        <h4 className="text-lg font-semibold text-primary-800">ML Insights</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">Semantic Similarity</span>
                          <span className="font-semibold text-primary-800">
                            {currentVersion.analysisResult.bertAnalysis?.semanticSimilarity || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">Industry Alignment</span>
                          <span className="font-semibold text-primary-800">
                            {currentVersion.analysisResult.bertAnalysis?.industryAlignment || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">Skill Relevance</span>
                          <span className="font-semibold text-primary-800">
                            {currentVersion.analysisResult.bertAnalysis?.skillRelevance || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-700">Confidence Score</span>
                          <span className="font-semibold text-primary-800">
                            {currentVersion.analysisResult.bertAnalysis?.confidenceScore || 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-success-800 mb-3">Improvement Highlights</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success-700">
                            +{currentVersion.improvements.keywordsAdded}
                          </div>
                          <div className="text-sm text-success-600">Keywords</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success-700">
                            +{currentVersion.improvements.achievementsQuantified}
                          </div>
                          <div className="text-sm text-success-600">Achievements</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'comparison' && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center py-12">
              <Compare className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Version Comparison</h3>
              <p className="text-secondary-600 mb-6">
                Select two versions from the timeline to compare their performance and improvements
              </p>
              <div className="text-sm text-secondary-500">
                Selected: {selectedVersions.length}/2 versions
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VersionManager;