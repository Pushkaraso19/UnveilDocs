import React, { useState, useEffect } from 'react';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import DashboardSidebar from '../Dashboard/Dashboardsidebar/DashboardSidebar';

const PolicyInsights = () => {
  const [activeDocument, setActiveDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com"
  });
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "What does my policy cover in case of a car accident?",
      documentId: 1,
      answer: "Your 'Comprehensive Auto Policy' covers damages to your vehicle and injuries to you and your passengers in a car accident. It also covers liability for damages to other people and their property if you are at fault. Specific coverage amounts are subject to the limits and deductibles outlined in your policy.",
      summary: "Your policy includes medical expenses, repair costs, and liability protection.",
      confidence: 95,
      keyClauses: [
        "This policy covers damages to the insured vehicle and injuries to the insured and passengers...",
        "Liability coverage extends to damages to other parties if the insured is at fault, up to the policy's liability limits."
      ],
      risk: 75,
      riskItems: [
        "Bodily injury claims may exceed limits.",
        "Broad definition of 'racing' exclusion.",
        "Strict 24-hour reporting requirement."
      ],
      recommendations: [
        "Consult a lawyer for clarification on 'Clause X'.",
        "Gather documentation for 'Item Y' for your claim.",
        "Consider increasing Umbrella Policy coverage."
      ]
    }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [isAsking, setIsAsking] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    if (activeDocument) {
      const documentQuestion = questions.find(q => q.documentId === activeDocument.id);
      if (documentQuestion) {
        setCurrentQuestion(documentQuestion);
      }
    }
  }, [activeDocument, questions]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleDocumentUpload = (newDocuments) => {
    console.log("New documents uploaded:", newDocuments);
  };

  const askNewQuestion = () => {
    setIsAsking(true);
    setTimeout(() => {
      const newQuestion = {
        id: questions.length + 1,
        text: "What are the liability limits for bodily injury?",
        documentId: activeDocument?.id || 1,
        answer: "Your bodily injury liability coverage has limits of $100,000 per person and $300,000 per accident. This means the policy will pay up to $100,000 for injuries to a single person and up to $300,000 total for injuries to all people in an accident where you are at fault.",
        summary: "Your policy provides $100k/$300k bodily injury liability coverage.",
        confidence: 92,
        keyClauses: [
          "Bodily Injury Liability: $100,000 per person/$300,000 per accident",
          "The policy will defend and settle any claim or suit asking for these damages"
        ],
        risk: 60,
        riskItems: [
          "Medical costs may exceed these limits in serious accidents",
          "Potential for lawsuits if limits are exceeded",
          "Consider umbrella policy for additional protection"
        ],
        recommendations: [
          "Review your assets to determine if current limits are sufficient",
          "Consider increasing to $250k/$500k for better protection",
          "Explore umbrella policy options for excess liability coverage"
        ]
      };
      
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion(newQuestion);
      setIsAsking(false);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-[var(--neutral-100)]">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-black">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-[var(--primary-500)]/10 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-[var(--primary-400)]/10 blur-[100px] animate-pulse-medium"></div>
      </div>
      
      <DashboardHeader onSearch={handleSearch} userProfile={userProfile} />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          activeDocument={activeDocument} 
          setActiveDocument={setActiveDocument}
          onDocumentUpload={handleDocumentUpload}
        />
        
        <main className="z-10 flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-8">
              <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-gradient-to-r from-white/5 to-white/10 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <span className="material-symbols-outlined text-white text-2xl">person</span>
                </div>
                <p className="flex-1 text-base text-white/90 sm:text-lg">{currentQuestion.text}</p>
                <button 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-400)] text-white hover:from-[var(--primary-400)] hover:to-[var(--primary-300)] transition-all duration-300 hover:scale-110"
                  onClick={askNewQuestion}
                  disabled={isAsking}
                >
                  {isAsking ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span className="material-symbols-outlined">auto_awesome</span>
                  )}
                </button>
              </div>
            </div>
            
            {isAsking ? (
              <div className="flex justify-center items-center h-64 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10">
                <div className="text-center">
                  <div className="animate-pulse rounded-full h-16 w-16 bg-[var(--primary-500)]/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[var(--primary-400)] text-3xl animate-pulse">psychology</span>
                  </div>
                  <p className="text-white/70">Analyzing your policy and preparing insights...</p>
                  <div className="mt-4 h-1 w-48 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-400)] animate-progress"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Answer Section */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-white">Answer</h2>
                    <button 
                      className="flex items-center gap-1 text-sm text-white/60 hover:text-[var(--primary-400)] transition-colors"
                      onClick={() => copyToClipboard(currentQuestion.answer)}
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                      <span>{copiedText === currentQuestion.answer ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-white/80">
                    {currentQuestion.answer}
                  </p>
                </div>
                
                {/* Summary Section */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <span className="material-symbols-outlined text-[var(--primary-400)]">summarize</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold tracking-tight text-white">Summary</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        {currentQuestion.summary}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-white/50">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 rounded-full bg-white/10">
                            <div 
                              className="h-1.5 rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-400)] transition-all duration-1000" 
                              style={{width: `${currentQuestion.confidence}%`}}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-[var(--primary-400)]">{currentQuestion.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Key Clauses Section */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30">
                  <h3 className="text-lg font-semibold tracking-tight text-white">Key Clauses</h3>
                  <p className="mt-1 text-sm text-white/60">Direct quotes from your policy documents relevant to your question.</p>
                  <div className="mt-4 space-y-3">
                    {currentQuestion.keyClauses.map((clause, index) => (
                      <blockquote key={index} className="relative rounded-r-lg border-l-2 border-[var(--primary-500)] bg-white/5 p-4 text-sm italic leading-relaxed text-white/80 group">
                        "{clause}"
                        <button 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/60 hover:text-[var(--primary-400)]"
                          onClick={() => copyToClipboard(clause)}
                        >
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>
                      </blockquote>
                    ))}
                  </div>
                </div>
                
                {/* Risk Assessment and Recommended Actions */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Risk Assessment */}
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-900/10 to-red-800/5 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-red-500/10 hover:border-red-500/30">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl text-red-400">gpp_maybe</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold tracking-tight text-red-300">Risk Assessment</h3>
                        <p className="mt-1 text-sm text-red-200/70">Potential risks and liability breakdown.</p>
                        <div className="mt-4 flex items-center gap-4 rounded-lg bg-black/20 p-4">
                          <div className="relative h-20 w-20">
                            <svg className="h-full w-full" viewBox="0 0 36 36">
                              <path className="text-red-900/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                              <path className="text-red-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray={`${currentQuestion.risk}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-red-300">{currentQuestion.risk}</span>
                              <span className="text-xs text-red-200/80">{currentQuestion.risk >= 70 ? 'High Risk' : currentQuestion.risk >= 40 ? 'Medium Risk' : 'Low Risk'}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-red-200/90">
                              {currentQuestion.riskItems.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommended Actions */}
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/10 to-green-800/5 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-green-500/10 hover:border-green-500/30">
                    <div className="flex h-full flex-col">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 pt-0.5">
                          <span className="material-symbols-outlined text-2xl text-green-400">checklist</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight text-green-300">Recommended Actions</h3>
                          <p className="mt-1 text-sm text-green-200/70">Actionable steps based on the analysis.</p>
                        </div>
                      </div>
                      <div className="mt-4 flex-1 space-y-3">
                        {currentQuestion.recommendations.map((action, index) => (
                          <div key={index} className="flex items-start gap-3 group">
                            <span className="material-symbols-outlined mt-0.5 text-xl text-green-400 group-hover:scale-110 transition-transform">arrow_forward</span>
                            <p className="flex-1 text-sm leading-relaxed text-green-200/90 group-hover:text-green-200 transition-colors">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Policy Comparison */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/10 to-blue-800/5 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-0.5">
                      <span className="material-symbols-outlined text-2xl text-blue-400">compare_arrows</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold tracking-tight text-blue-300">Policy Comparison</h3>
                      <p className="mt-1 text-sm text-blue-200/70">Coverage limits and premiums across multiple policies.</p>
                      <div className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-black/20">
                        <table className="w-full text-left text-sm text-blue-200/90">
                          <thead className="bg-white/5 text-xs uppercase text-blue-300 tracking-wider">
                            <tr>
                              <th className="px-4 py-3 font-medium">Feature</th>
                              <th className="px-4 py-3 font-medium">Comprehensive Auto</th>
                              <th className="px-4 py-3 font-medium">Homeowners Add-on</th>
                            </tr>
                          </thead>
                          <tbody className="font-mono text-sm">
                            <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-sans font-medium text-white/80">Bodily Injury Liability</td>
                              <td className="px-4 py-3">$100k / $300k</td>
                              <td className="px-4 py-3">$50k / $100k</td>
                            </tr>
                            <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-sans font-medium text-white/80">Property Damage Liability</td>
                              <td className="px-4 py-3">$50,000</td>
                              <td className="px-4 py-3">$25,000</td>
                            </tr>
                            <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-sans font-medium text-white/80">Collision Deductible</td>
                              <td className="px-4 py-3">$500</td>
                              <td className="px-4 py-3">N/A</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-sans font-medium text-white/80">Annual Premium</td>
                              <td className="px-4 py-3">$1,200</td>
                              <td className="px-4 py-3">$150</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Glossary of Terms */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/10 to-purple-800/5 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-purple-500/10 hover:border-purple-500/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="material-symbols-outlined text-3xl text-purple-400">menu_book</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold tracking-tight text-purple-300">Glossary of Terms</h3>
                      <p className="mt-1 text-sm text-purple-200/70">Definitions of legal jargon.</p>
                      <div className="mt-4 space-y-3 text-sm leading-relaxed text-purple-200/90">
                        <div className="group">
                          <p><strong className="font-semibold text-purple-300">Indemnify:</strong> To compensate for harm or loss.</p>
                        </div>
                        <div className="group">
                          <p><strong className="font-semibold text-purple-300">Subrogation:</strong> Insurer's right to pursue a third party.</p>
                        </div>
                        <div className="group">
                          <p><strong className="font-semibold text-purple-300">Exclusion:</strong> A provision that eliminates coverage.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Suggestion */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-900/10 to-yellow-800/5 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-yellow-500/10 hover:border-yellow-500/30">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl text-yellow-400">lightbulb</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-yellow-300">Suggestion</h3>
                      <p className="text-sm text-yellow-200/80 mt-0.5">
                        For more specific results, try asking "What are the liability limits for bodily injury?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PolicyInsights;