import React, { useState, useEffect } from 'react';
import { Brain, Terminal, Loader2, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

const TypewriterText = ({ text, delay = 30 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayed}</span>;
};

export const AIThreatTriage = ({ evidence }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      const response = await apiClient.post('/ai/triage', {
        evidence_id: evidence.id,
        title: evidence.title,
        type: evidence.type
      });

      setReport(response.data);
    } catch (err) {
      console.error("AI Triage Error:", err);
      // Fallback if the user hasn't set up the API key yet, so the demo doesn't break
      setReport({
        threatLevel: 'API ERROR',
        confidence: '0%',
        summary: `Failed to connect to the LLM backend: ${err.message}. Please ensure GEMINI_API_KEY is set in the backend environment.`,
        iocs: ['No data (API Failure)'],
        recommendation: 'Check server configuration.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border p-6 relative overflow-hidden shadow-sm mt-6">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Brain className="w-48 h-48" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-ce-border">
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-md bg-ce-info/10 border border-ce-info/30 text-ce-info">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ce-text-primary font-mono flex items-center gap-2">
              GEN-AI THREAT TRIAGE <span className="text-[9px] px-1.5 py-0.5 rounded bg-ce-info/20 text-ce-info">EXPERIMENTAL</span>
            </h3>
            <p className="text-xs text-ce-text-muted mt-0.5">
              Run automated LLM forensic analysis on evidence metadata and hashes.
            </p>
          </div>
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="relative z-10 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-ce-info hover:bg-ce-info/90 text-white text-xs font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Vectors...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>{report ? 'Re-Run AI Analysis' : 'Run AI Auto-Triage'}</span>
            </>
          )}
        </button>
      </div>

      {isAnalyzing && (
        <div className="h-40 flex flex-col items-center justify-center gap-3 text-ce-info font-mono text-xs">
          <Loader2 className="w-8 h-8 animate-spin opacity-50" />
          <TypewriterText text="Initializing neural forensic models... mapping SHA-256 hash to global threat intel databases... extracting static features..." delay={20} />
        </div>
      )}

      {report && !isAnalyzing && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 relative z-10">
          <div className="flex gap-4">
            <div className={`px-3 py-1.5 rounded border text-xs font-mono font-bold flex items-center gap-1.5 ${report.threatLevel === 'CRITICAL' ? 'bg-ce-danger/10 border-ce-danger/30 text-ce-danger' : 'bg-ce-warning/10 border-ce-warning/30 text-ce-warning'}`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              THREAT LEVEL: {report.threatLevel}
            </div>
            <div className="px-3 py-1.5 rounded bg-ce-surface-subtle border border-ce-border text-xs font-mono font-bold text-ce-text-primary flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-ce-success" />
              AI CONFIDENCE: {report.confidence}
            </div>
          </div>

          <div className="bg-ce-bg border border-ce-border rounded-md p-4 font-mono text-xs space-y-4">
            <div>
              <span className="text-ce-info font-bold block mb-1.5 tracking-wider">&gt;&gt; EXECUTIVE SUMMARY</span>
              <p className="text-ce-text-primary leading-relaxed">
                <TypewriterText text={report.summary} delay={15} />
              </p>
            </div>
            
            <div>
              <span className="text-ce-info font-bold block mb-1.5 tracking-wider">&gt;&gt; IDENTIFIED INDICATORS (IoCs)</span>
              <ul className="space-y-1.5 text-ce-text-primary">
                {report.iocs.map((ioc, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-ce-info">-</span>
                    <TypewriterText text={ioc} delay={10 + (idx * 5)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-ce-border">
              <span className="text-ce-brand font-bold block mb-1.5 tracking-wider">&gt;&gt; RECOMMENDED ACTION</span>
              <p className="text-ce-success font-bold bg-ce-success/10 border border-ce-success/20 inline-block px-3 py-1.5 rounded">
                <TypewriterText text={report.recommendation} delay={15} />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
