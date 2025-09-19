import React, { useState } from 'react';
import apiService from '../../services/apiService';
import './LegalInsights.css';

const legalInsights = ({ analysisData = null, documentText = '', documentInfo = null, onBack = null }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questionResponse, setQuestionResponse] = useState('');
  const [questionError, setQuestionError] = useState('');

  const handleAskQuestion = async () => {
    if (!question.trim() || !documentText) return;
    
    setIsLoading(true);
    setProgress(0);
    setQuestionError('');
    setQuestionResponse('');
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await apiService.askQuestion(documentText, question);
      setQuestionResponse(response.answer);
      setProgress(100);
      
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Error asking question:', error);
      setQuestionError(error.message || 'Sorry, I encountered an error while processing your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDFReport = async () => {
    try {
      // Dynamic import to load jsPDF only when needed
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Helper function to add text with automatic line breaks
      const addText = (text, fontSize = 12, isBold = false) => {
        if (isBold) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(fontSize);
        
        const lines = doc.splitTextToSize(text, maxLineWidth);
        
        // Check if we need a new page
        if (currentY + (lines.length * fontSize * 0.4) > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        
        doc.text(lines, margin, currentY);
        currentY += lines.length * fontSize * 0.4 + 5;
        return currentY;
      };

      // Helper function to add section with spacing
      const addSection = (title, content, titleSize = 14) => {
        currentY += 10; // Add space before section
        addText(title, titleSize, true);
        currentY += 5;
        if (content) {
          addText(content, 11);
        }
        currentY += 5; // Add space after section
      };

      // Header
      doc.setFillColor(16, 185, 129); // Green color
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text('LEGAL DOCUMENT ANALYSIS REPORT', margin, 20);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      currentY = 45;

      // Document Info
      addSection('Document Information', '');
      addText(`Document: ${documentInfo?.name || 'Legal Document'}`, 11);
      addText(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 11);
      addText(`Analysis Type: Comprehensive AI Legal Review`, 11);

      // Document Summary
      addSection('DOCUMENT SUMMARY', summary);

      // Key Clauses
      if (keyClausesData.length > 0) {
        addSection('KEY CLAUSES', '');
        keyClausesData.forEach((clause, index) => {
          addText(`${index + 1}. ${clause}`, 11);
          currentY += 3;
        });
      }

      // Risk Assessment
      addSection('RISK ASSESSMENT', '');
      addText(`Risk Level: ${riskLevel} (${riskScore}/100)`, 12, true);
      addText('Risk Factors:', 11, true);
      riskFactors.forEach(factor => {
        addText(`• ${factor}`, 11);
      });

      // Recommendations
      if (recommendations.length > 0) {
        addSection('RECOMMENDATIONS', '');
        recommendations.forEach((rec, index) => {
          addText(`${index + 1}. ${rec}`, 11);
          currentY += 3;
        });
      }

      // Legal Comparison
      if (comparisonData.length > 0) {
        addSection('LEGAL COMPARISON', '');
        comparisonData.forEach(row => {
          addText(`${row.aspect}:`, 11, true);
          addText(`  Current: ${row.current}`, 10);
          addText(`  Recommended: ${row.recommended}`, 10);
          addText(`  Impact: ${row.impact}`, 10);
          currentY += 5;
        });
      }

      // Legal Glossary
      if (glossaryTerms.length > 0) {
        addSection('LEGAL GLOSSARY', '');
        glossaryTerms.forEach(item => {
          addText(`${item.term}:`, 11, true);
          addText(`${item.definition}`, 10);
          currentY += 3;
        });
      }

      // AI Q&A if available
      if (questionResponse) {
        addSection('AI CONSULTATION', '');
        addText(`Question: ${question}`, 11, true);
        addText(`Answer: ${questionResponse}`, 11);
      }

      // Footer
      const footerY = pageHeight - 15;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Report generated by UnveilDocs AI Legal Analysis Platform', margin, footerY);
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - margin - 20, footerY);

      // Save the PDF
      const fileName = `legal-analysis-report-${documentInfo?.name?.replace(/[^a-z0-9]/gi, '_') || 'document'}-${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text file if PDF generation fails
      const reportContent = `
LEGAL DOCUMENT ANALYSIS REPORT
================================

Document: ${documentInfo?.name || 'Legal Document'}
Generated: ${new Date().toLocaleDateString()}

DOCUMENT SUMMARY
================
${summary}

KEY CLAUSES
===========
${keyClausesData.map((clause, index) => `${index + 1}. ${clause}`).join('\n\n')}

RISK ASSESSMENT
===============
Risk Level: ${riskLevel} (${riskScore}/100)
Risk Factors:
${riskFactors.map(factor => `• ${factor}`).join('\n')}

RECOMMENDATIONS
===============
${recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

LEGAL COMPARISON
================
${comparisonData.map(row => `${row.aspect}: Current - ${row.current}, Recommended - ${row.recommended}, Impact - ${row.impact}`).join('\n\n')}

LEGAL GLOSSARY
==============
${glossaryTerms.map(item => `${item.term}: ${item.definition}`).join('\n\n')}

${questionResponse ? `\nAI RESPONSE\n===========\nQuestion: ${question}\nAnswer: ${questionResponse}` : ''}

Report generated by UnveilDocs AI Legal Analysis
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `legal-analysis-report-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  // Use dynamic data from backend or fallback to static data
  const summary = analysisData?.summary || "This document has been uploaded for analysis. The comprehensive AI analysis will provide detailed insights about its content, key clauses, risk assessment, and recommendations once processing is complete.";

  const keyClausesData = analysisData?.keyClauses || [
    "Document uploaded successfully and ready for AI analysis.",
    "Comprehensive insights will be generated to help you understand important provisions.",
    "Risk assessment and recommendations will be provided based on document content.",
    "Legal glossary will highlight key terms and definitions found in your document."
  ];

  const riskLevel = analysisData?.riskAssessment?.level || 'PENDING';
  const riskScore = analysisData?.riskAssessment?.score || 0;
  const riskFactors = analysisData?.riskAssessment?.factors || [
    "Analysis in progress",
    "Risk factors will be identified",
    "Compliance issues will be highlighted"
  ];

  const recommendations = analysisData?.recommendations || [
    "Upload a legal document to receive AI-powered recommendations",
    "Analysis will identify areas for improvement and compliance",
    "Specific suggestions will be provided based on document content",
    "Best practices and legal standards will be referenced"
  ];

  const comparisonData = analysisData?.comparison || [
    { aspect: "Analysis Status", current: "In Progress", recommended: "Complete", impact: "Full insights available" },
    { aspect: "Document Review", current: "Pending", recommended: "AI-Powered", impact: "Comprehensive analysis" },
    { aspect: "Risk Assessment", current: "Waiting", recommended: "Automated", impact: "Quick identification" },
    { aspect: "Recommendations", current: "Manual", recommended: "AI-Generated", impact: "Expert suggestions" }
  ];

  const glossaryTerms = analysisData?.glossary || [
    { term: "Document Analysis", definition: "AI-powered review of legal documents to extract key insights and recommendations" },
    { term: "Risk Assessment", definition: "Evaluation of potential legal and compliance risks within the document" },
    { term: "Key Clauses", definition: "Important provisions and terms identified through intelligent document processing" },
    { term: "Legal Insights", definition: "Comprehensive analysis providing actionable recommendations for legal documents" }
  ];

  const confidenceScore = analysisData?.confidence || 0;

  return (
    <div className="legal-insights-container">
      <div className="legal-insights-bg">
        <div className="legal-insights-bg-gradient-1" />
        <div className="legal-insights-bg-gradient-2" />
        <div className="legal-insights-bg-gradient-3" />
        <div className="legal-insights-bg-gradient-4" />
      </div>


      <div className="legal-insights-content">

        <main className="legal-insights-main">
          <div className="legal-insights-main-container">
            {/* Back Button - hidden when embedded in homepage */}
            {onBack && (
              <div className="legal-insights-header" style={{ display: 'none' }}>
                <button onClick={onBack} className="legal-insights-back-btn">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Upload
                </button>
                <h1 className="legal-insights-title">Document Analysis Results</h1>
              </div>
            )}
            
            {/* Analysis Title for embedded view */}
            <div className="legal-insights-embedded-header">
            </div>

            {/* Complete Analysis Container with Background */}
            <div className="legal-insights-report-container">
              {/* Title and Download Button inside container */}
              <div className="legal-insights-container-header">
                <h1 className="legal-insights-title">Document Analysis Results</h1>
                <button 
                  onClick={downloadPDFReport}
                  className="legal-insights-download-btn"
                  title="Download Complete Analysis Report"
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>

            {/* Loading State */}
            {isLoading && (
              <div className="legal-insights-loading">
                <div className="legal-insights-loading-content">
                  <div className="legal-insights-loading-icon">
                    <span className="material-symbols-outlined legal-insights-loading-icon-symbol">
                      psychology
                    </span>
                  </div>
                  <p className="legal-insights-loading-text">
                    Analyzing your question with AI...
                  </p>
                  <div className="legal-insights-progress-bar">
                    <div 
                      className="legal-insights-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Question Error */}
            {questionError && !isLoading && (
              <div className="legal-insights-card legal-insights-error-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-card-title" style={{ color: 'rgb(252, 165, 165)' }}>
                    Error
                  </h2>
                </div>
                <div className="legal-insights-summary-section">
                  <div className="legal-insights-summary-icon">
                    <span className="material-symbols-outlined legal-insights-summary-icon-symbol" style={{ color: 'rgb(252, 165, 165)' }}>
                      error
                    </span>
                  </div>
                  <div className="legal-insights-summary-content">
                    <h3 className="legal-insights-summary-title">Unable to Process Question</h3>
                    <p className="legal-insights-summary-text">
                      {questionError}
                    </p>
                    <button 
                      onClick={() => setQuestionError('')}
                      className="legal-insights-copy-btn"
                      style={{ marginTop: '1rem' }}
                    >
                      <span className="material-symbols-outlined">close</span>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Question Response */}
            {questionResponse && !isLoading && (
              <div className="legal-insights-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-card-title">AI Response</h2>
                </div>
                <div className="legal-insights-summary-section">
                  <div className="legal-insights-summary-icon">
                    <span className="material-symbols-outlined legal-insights-summary-icon-symbol">
                      smart_toy
                    </span>
                  </div>
                  <div className="legal-insights-summary-content">
                    <h3 className="legal-insights-summary-title">Answer to: "{question}"</h3>
                    <p className="legal-insights-summary-text">
                      {questionResponse}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Status Message when no data */}
            {!analysisData && (
              <div className="legal-insights-card legal-insights-info-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-card-title" style={{ color: 'rgb(147, 197, 253)' }}>
                    Getting Started
                  </h2>
                </div>
                <div className="legal-insights-summary-section">
                  <div className="legal-insights-summary-icon">
                    <span className="material-symbols-outlined legal-insights-summary-icon-symbol" style={{ color: 'rgb(147, 197, 253)' }}>
                      info
                    </span>
                  </div>
                  <div className="legal-insights-summary-content">
                    <h3 className="legal-insights-summary-title">Ready for Document Analysis</h3>
                    <p className="legal-insights-summary-text">
                      This is where your comprehensive document analysis will appear. The sections below show what insights you'll receive once you upload and analyze a legal document.
                    </p>
                    {onBack && (
                      <button 
                        onClick={onBack}
                        className="legal-insights-copy-btn"
                        style={{ marginTop: '1rem' }}
                      >
                        <span className="material-symbols-outlined">upload</span>
                        Upload Document
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Sections */}
            <div className="legal-insights-sections">
              {/* Summary Section */}
              <div className="legal-insights-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-card-title">Document Summary</h2>
                </div>
                <div className="legal-insights-summary-section">
                  <div className="legal-insights-summary-icon">
                    <span className="material-symbols-outlined legal-insights-summary-icon-symbol">
                      summarize
                    </span>
                  </div>
                  <div className="legal-insights-summary-content">
                    <h3 className="legal-insights-summary-title">
                      {analysisData ? 'Document Analysis' : 'Document Ready for Analysis'}
                    </h3>
                    <p className="legal-insights-summary-text">
                      {summary}
                    </p>
                    {analysisData && (
                      <div className="legal-insights-confidence">
                        <span className="legal-insights-confidence-label">CONFIDENCE</span>
                        <div className="legal-insights-confidence-bar">
                          <div 
                            className="legal-insights-confidence-fill" 
                            style={{ width: `${confidenceScore}%` }}
                          />
                        </div>
                        <span className="legal-insights-confidence-value">{confidenceScore}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Clauses */}
              <div className="legal-insights-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-clauses-title">Key Clauses</h2>
                </div>
                <p className="legal-insights-clauses-subtitle">
                  Important provisions extracted from the document
                </p>
                <div className="legal-insights-clauses-list">
                  {keyClausesData.map((clause, index) => (
                    <div key={index} className="legal-insights-clause">
                      {clause}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Layout for remaining sections */}
              <div className="legal-insights-grid">
                {/* Risk Assessment */}
                <div className="legal-insights-card legal-insights-risk-card">
                  <div className="legal-insights-card-header">
                    <h2 className="legal-insights-card-title" style={{ color: 'rgb(252, 165, 165)', textDecoration: 'underline', textDecorationColor: 'rgb(252, 165, 165)', }}>
                      Risk Assessment
                    </h2>
                  </div>
                  <div className="legal-insights-risk-section">
                    <div className="legal-insights-risk-icon">
                      <span className="material-symbols-outlined legal-insights-risk-icon-symbol">
                        warning
                      </span>
                    </div>
                    <div className="legal-insights-risk-content">
                      <h3 className="legal-insights-risk-title">Compliance Risk Level</h3>
                      <p className="legal-insights-risk-subtitle">
                        {analysisData ? 'Potential areas of concern identified' : 'Analysis pending - upload document to assess risks'}
                      </p>
                      <div className="legal-insights-risk-meter">
                        <div className="legal-insights-risk-chart">
                          <svg viewBox="0 0 36 36">
                            <path
                              className="legal-insights-risk-chart-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              className="legal-insights-risk-chart-fill"
                              strokeDasharray={`${riskScore}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <div className="legal-insights-risk-value">
                            <span className="legal-insights-risk-number">{riskScore}</span>
                            <span className="legal-insights-risk-level">{riskLevel}</span>
                          </div>
                        </div>
                        <div className="legal-insights-risk-list">
                          <ul className="legal-insights-risk-items">
                            {riskFactors.map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="legal-insights-card legal-insights-recommendations-card">
                  <div className="legal-insights-card-header">
                    <h2 className="legal-insights-card-title" style={{ color: 'rgb(134, 239, 172)', textDecoration: 'underline', textDecorationColor: 'rgb(134, 239, 172)',}}>
                      Recommendations
                    </h2>
                  </div>
                  <div className="legal-insights-recommendations-section">
                    <div className="legal-insights-recommendations-header">
                      <div className="legal-insights-recommendations-icon">
                        <span className="material-symbols-outlined legal-insights-recommendations-icon-symbol">
                          lightbulb
                        </span>
                      </div>
                      <div>
                        <h3 className="legal-insights-recommendations-title">
                          {analysisData ? 'Improvement Suggestions' : 'Analysis Pending'}
                        </h3>
                        <p className="legal-insights-recommendations-subtitle">
                          {analysisData ? 'AI-powered recommendations for better compliance' : 'Upload a document to receive personalized recommendations'}
                        </p>
                      </div>
                    </div>
                    <div className="legal-insights-recommendations-list">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="legal-insights-recommendation-item">
                          <span className="material-symbols-outlined legal-insights-recommendation-icon">
                            check_circle
                          </span>
                          <span className="legal-insights-recommendation-text">
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="legal-insights-card legal-insights-comparison-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-card-title" style={{ color: 'rgb(147, 197, 253)', textDecoration: 'underline', textDecorationColor: 'rgb(147, 197, 253)', }}>
                    Legal Comparison
                  </h2>
                </div>
                <div className="legal-insights-comparison-section">
                  <div className="legal-insights-comparison-icon">
                    <span className="material-symbols-outlined legal-insights-comparison-icon-symbol">
                      compare_arrows
                    </span>
                  </div>
                  <div className="legal-insights-comparison-content">
                    <h3 className="legal-insights-comparison-title">
                      {analysisData ? 'Current vs. Recommended' : 'Analysis Status'}
                    </h3>
                    <p className="legal-insights-comparison-subtitle">
                      {analysisData ? 'Side-by-side comparison of your current legal against best practices' : 'Document processing status and next steps'}
                    </p>
                    <div className="legal-insights-table-container">
                      <table className="legal-insights-table">
                        <thead className="legal-insights-table-header">
                          <tr>
                            <th>Aspect</th>
                            <th>Current</th>
                            <th>Recommended</th>
                            <th>Impact</th>
                          </tr>
                        </thead>
                        <tbody className="legal-insights-table-body">
                          {comparisonData.map((row, index) => (
                            <tr key={index} className="legal-insights-table-row">
                              <td className="legal-insights-table-cell legal-insights-table-cell-label">
                                {row.aspect}
                              </td>
                              <td className="legal-insights-table-cell">{row.current}</td>
                              <td className="legal-insights-table-cell">{row.recommended}</td>
                              <td className="legal-insights-table-cell">{row.impact}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glossary */}
              <div className="legal-insights-card legal-insights-glossary-card">
                <div className="legal-insights-card-header">
                  <h2 className="legal-insights-card-title" style={{ color: 'rgb(196, 181, 253)', textDecoration: 'underline', textDecorationColor: 'rgb(196, 181, 253)', }}>
                    Legal Glossary
                  </h2>
                </div>
                <div className="legal-insights-glossary-section">
                  <div className="legal-insights-glossary-icon">
                    <span className="material-symbols-outlined legal-insights-glossary-icon-symbol">
                      menu_book
                    </span>
                  </div>
                  <div className="legal-insights-glossary-content">
                    <h3 className="legal-insights-glossary-title">Key Terms & Definitions</h3>
                    <p className="legal-insights-glossary-subtitle">
                      {analysisData ? 'Important legal terms found in this document' : 'Key terms that will be identified during analysis'}
                    </p>
                    <div className="legal-insights-glossary-list">
                      {glossaryTerms.map((item, index) => (
                        <div key={index}>
                          <span className="legal-insights-glossary-term">{item.term}:</span> {item.definition}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestion Card */}
              <div className="legal-insights-suggestion-card">
                <div className="legal-insights-suggestion-section">
                  <div className="legal-insights-suggestion-icon">
                    <span className="material-symbols-outlined legal-insights-suggestion-icon-symbol">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h3 className="legal-insights-suggestion-title">Pro Tip</h3>
                    <p className="legal-insights-suggestion-text">
                      Try asking specific questions about clauses or terms you don't understand. Our AI can provide detailed explanations and context.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            </div> {/* Close legal-insights-report-container */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default legalInsights;