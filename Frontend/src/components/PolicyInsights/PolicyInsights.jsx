import React, { useState } from 'react';
import DashboardSidebar from '../Dashboard/Dashboardsidebar/DashboardSidebar';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './PolicyInsights.css';

const PolicyInsights = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const summary = "This privacy policy governs how UnveilDocs collects, uses, and protects your personal information when you use our legal document analysis service. We implement industry-standard security measures to safeguard your data and only process information necessary to provide our AI-powered document insights.";

  const keyClausesData = [
    "Data collection is limited to uploaded documents and basic user information required for service delivery.",
    "User documents are processed securely and are not stored permanently on our servers beyond the analysis period.",
    "Personal information is never shared with third parties without explicit user consent.",
    "Users retain full ownership and control over their uploaded documents and can request deletion at any time."
  ];

  const recommendations = [
    "Review data retention periods to ensure compliance with your industry standards",
    "Consider implementing additional encryption for sensitive document uploads",
    "Add clearer opt-out mechanisms for data processing activities",
    "Include specific provisions for cross-border data transfers if applicable"
  ];

  const comparisonData = [
    { aspect: "Data Retention", current: "90 days", recommended: "30 days", impact: "Reduced exposure" },
    { aspect: "Encryption", current: "TLS 1.2", recommended: "TLS 1.3", impact: "Enhanced security" },
    { aspect: "Access Controls", current: "Basic", recommended: "Multi-factor", impact: "Stronger protection" },
    { aspect: "Audit Logging", current: "Limited", recommended: "Comprehensive", impact: "Better compliance" }
  ];

  const glossaryTerms = [
    { term: "Personal Data", definition: "Any information relating to an identified or identifiable natural person" },
    { term: "Data Controller", definition: "The entity that determines the purposes and means of processing personal data" },
    { term: "Data Processor", definition: "The entity that processes personal data on behalf of the data controller" },
    { term: "Consent", definition: "Freely given, specific, informed indication of agreement to data processing" }
  ];

  return (
    <div className="policy-insights-container">
      <div className="policy-insights-bg">
        <div className="policy-insights-bg-gradient-1" />
        <div className="policy-insights-bg-gradient-2" />
        <div className="policy-insights-bg-gradient-3" />
        <div className="policy-insights-bg-gradient-4" />
      </div>

      <DashboardHeader />

      <div className="policy-insights-content">
        <DashboardSidebar />

        <main className="policy-insights-main">
          <div className="policy-insights-main-container">
            {/* Question Section */}
            <div className="policy-insights-question-section">
              <div className="policy-insights-question-card">
                <div className="policy-insights-question-avatar">
                  <span className="material-symbols-outlined policy-insights-question-avatar-icon">
                    chat
                  </span>
                </div>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about this document..."
                  className="policy-insights-question-text"
                  style={{ background: 'transparent', border: 'none', outline: 'none' }}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={isLoading || !question.trim()}
                  className="policy-insights-ask-btn"
                >
                  <span className="material-symbols-outlined">
                    {isLoading ? 'hourglass_empty' : 'send'}
                  </span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="policy-insights-loading">
                <div className="policy-insights-loading-content">
                  <div className="policy-insights-loading-icon">
                    <span className="material-symbols-outlined policy-insights-loading-icon-symbol">
                      psychology
                    </span>
                  </div>
                  <p className="policy-insights-loading-text">
                    Analyzing document with AI...
                  </p>
                  <div className="policy-insights-progress-bar">
                    <div 
                      className="policy-insights-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Sections */}
            <div className="policy-insights-sections">
              {/* Summary Section */}
              <div className="policy-insights-card">
                <div className="policy-insights-card-header">
                  <h2 className="policy-insights-card-title">Document Summary</h2>
                  <button 
                    onClick={() => copyToClipboard(summary)}
                    className="policy-insights-copy-btn"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                    Copy
                  </button>
                </div>
                <div className="policy-insights-summary-section">
                  <div className="policy-insights-summary-icon">
                    <span className="material-symbols-outlined policy-insights-summary-icon-symbol">
                      summarize
                    </span>
                  </div>
                  <div className="policy-insights-summary-content">
                    <h3 className="policy-insights-summary-title">Privacy Policy Analysis</h3>
                    <p className="policy-insights-summary-text">
                      {summary}
                    </p>
                    <div className="policy-insights-confidence">
                      <span className="policy-insights-confidence-label">CONFIDENCE</span>
                      <div className="policy-insights-confidence-bar">
                        <div 
                          className="policy-insights-confidence-fill" 
                          style={{ width: '92%' }}
                        />
                      </div>
                      <span className="policy-insights-confidence-value">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Clauses */}
              <div className="policy-insights-card">
                <div className="policy-insights-card-header">
                  <h2 className="policy-insights-clauses-title">Key Clauses</h2>
                  <button 
                    onClick={() => copyToClipboard(keyClausesData.join('\n\n'))}
                    className="policy-insights-copy-btn"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                    Copy All
                  </button>
                </div>
                <p className="policy-insights-clauses-subtitle">
                  Important provisions extracted from the document
                </p>
                <div className="policy-insights-clauses-list">
                  {keyClausesData.map((clause, index) => (
                    <div key={index} className="policy-insights-clause">
                      {clause}
                      <button 
                        onClick={() => copyToClipboard(clause)}
                        className="policy-insights-clause-copy"
                      >
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Layout for remaining sections */}
              <div className="policy-insights-grid">
                {/* Risk Assessment */}
                <div className="policy-insights-card policy-insights-risk-card">
                  <div className="policy-insights-card-header">
                    <h2 className="policy-insights-card-title" style={{ color: 'rgb(252, 165, 165)' }}>
                      Risk Assessment
                    </h2>
                    <button className="policy-insights-copy-btn">
                      <span className="material-symbols-outlined">content_copy</span>
                      Copy
                    </button>
                  </div>
                  <div className="policy-insights-risk-section">
                    <div className="policy-insights-risk-icon">
                      <span className="material-symbols-outlined policy-insights-risk-icon-symbol">
                        warning
                      </span>
                    </div>
                    <div className="policy-insights-risk-content">
                      <h3 className="policy-insights-risk-title">Compliance Risk Level</h3>
                      <p className="policy-insights-risk-subtitle">
                        Potential areas of concern identified
                      </p>
                      <div className="policy-insights-risk-meter">
                        <div className="policy-insights-risk-chart">
                          <svg viewBox="0 0 36 36">
                            <path
                              className="policy-insights-risk-chart-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              className="policy-insights-risk-chart-fill"
                              strokeDasharray="35, 100"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <div className="policy-insights-risk-value">
                            <span className="policy-insights-risk-number">35</span>
                            <span className="policy-insights-risk-level">LOW</span>
                          </div>
                        </div>
                        <div className="policy-insights-risk-list">
                          <ul className="policy-insights-risk-items">
                            <li>Data retention period could be shortened</li>
                            <li>Missing specific consent withdrawal process</li>
                            <li>Third-party data sharing needs clarification</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="policy-insights-card policy-insights-recommendations-card">
                  <div className="policy-insights-card-header">
                    <h2 className="policy-insights-card-title" style={{ color: 'rgb(134, 239, 172)' }}>
                      Recommendations
                    </h2>
                    <button className="policy-insights-copy-btn">
                      <span className="material-symbols-outlined">content_copy</span>
                      Copy
                    </button>
                  </div>
                  <div className="policy-insights-recommendations-section">
                    <div className="policy-insights-recommendations-header">
                      <div className="policy-insights-recommendations-icon">
                        <span className="material-symbols-outlined policy-insights-recommendations-icon-symbol">
                          lightbulb
                        </span>
                      </div>
                      <div>
                        <h3 className="policy-insights-recommendations-title">Improvement Suggestions</h3>
                        <p className="policy-insights-recommendations-subtitle">
                          AI-powered recommendations for better compliance
                        </p>
                      </div>
                    </div>
                    <div className="policy-insights-recommendations-list">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="policy-insights-recommendation-item">
                          <span className="material-symbols-outlined policy-insights-recommendation-icon">
                            check_circle
                          </span>
                          <span className="policy-insights-recommendation-text">
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="policy-insights-card policy-insights-comparison-card">
                <div className="policy-insights-card-header">
                  <h2 className="policy-insights-card-title" style={{ color: 'rgb(147, 197, 253)' }}>
                    Policy Comparison
                  </h2>
                  <button className="policy-insights-copy-btn">
                    <span className="material-symbols-outlined">content_copy</span>
                    Copy
                  </button>
                </div>
                <div className="policy-insights-comparison-section">
                  <div className="policy-insights-comparison-icon">
                    <span className="material-symbols-outlined policy-insights-comparison-icon-symbol">
                      compare_arrows
                    </span>
                  </div>
                  <div className="policy-insights-comparison-content">
                    <h3 className="policy-insights-comparison-title">Current vs. Recommended</h3>
                    <p className="policy-insights-comparison-subtitle">
                      Side-by-side comparison of your current policy against best practices
                    </p>
                    <div className="policy-insights-table-container">
                      <table className="policy-insights-table">
                        <thead className="policy-insights-table-header">
                          <tr>
                            <th>Aspect</th>
                            <th>Current</th>
                            <th>Recommended</th>
                            <th>Impact</th>
                          </tr>
                        </thead>
                        <tbody className="policy-insights-table-body">
                          {comparisonData.map((row, index) => (
                            <tr key={index} className="policy-insights-table-row">
                              <td className="policy-insights-table-cell policy-insights-table-cell-label">
                                {row.aspect}
                              </td>
                              <td className="policy-insights-table-cell">{row.current}</td>
                              <td className="policy-insights-table-cell">{row.recommended}</td>
                              <td className="policy-insights-table-cell">{row.impact}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glossary */}
              <div className="policy-insights-card policy-insights-glossary-card">
                <div className="policy-insights-card-header">
                  <h2 className="policy-insights-card-title" style={{ color: 'rgb(196, 181, 253)' }}>
                    Legal Glossary
                  </h2>
                  <button className="policy-insights-copy-btn">
                    <span className="material-symbols-outlined">content_copy</span>
                    Copy
                  </button>
                </div>
                <div className="policy-insights-glossary-section">
                  <div className="policy-insights-glossary-icon">
                    <span className="material-symbols-outlined policy-insights-glossary-icon-symbol">
                      menu_book
                    </span>
                  </div>
                  <div className="policy-insights-glossary-content">
                    <h3 className="policy-insights-glossary-title">Key Terms & Definitions</h3>
                    <p className="policy-insights-glossary-subtitle">
                      Important legal terms found in this document
                    </p>
                    <div className="policy-insights-glossary-list">
                      {glossaryTerms.map((item, index) => (
                        <div key={index}>
                          <span className="policy-insights-glossary-term">{item.term}:</span> {item.definition}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion Card */}
              <div className="policy-insights-suggestion-card">
                <div className="policy-insights-suggestion-section">
                  <div className="policy-insights-suggestion-icon">
                    <span className="material-symbols-outlined policy-insights-suggestion-icon-symbol">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h3 className="policy-insights-suggestion-title">Pro Tip</h3>
                    <p className="policy-insights-suggestion-text">
                      Try asking specific questions about clauses or terms you don't understand. Our AI can provide detailed explanations and context.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Floating Theme Toggle */}
      <ThemeToggle className="floating" />
    </div>
  );
};

export default PolicyInsights;