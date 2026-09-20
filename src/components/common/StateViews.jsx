import React from 'react';
import { ShieldAlert, FolderSearch, AlertTriangle, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  title = "No Evidence Found",
  description = "Evidence collected or transferred to this organization will appear here.",
  icon: Icon = FolderSearch,
  actionButton
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-surface/50 border border-surface-border">
      <div className="p-3.5 rounded-full bg-surface-subtle border border-surface-border text-slate-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">
        {title}
      </h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionButton}
    </div>
  );
};

export const LoadingState = ({ message = "Querying cryptographic audit layer..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-xl bg-surface/30 border border-surface-border">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      </div>
      <div className="text-xs font-mono text-cyan-400 tracking-wider">
        {message}
      </div>
    </div>
  );
};

export const ErrorState = ({
  title = "Unable to load evidence",
  description = "Please verify connection to audit ledger nodes and try again.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-rose-950/20 border border-rose-900/30">
      <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-300">
        {title}
      </h4>
      <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-mono font-medium text-slate-200 hover:text-white hover:bg-surface-hover transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
