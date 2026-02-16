
import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        copied 
          ? "bg-green-500 text-white" 
          : "bg-slate-700 hover:bg-slate-600 text-slate-200"
      } ${className}`}
    >
      {copied ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="fas fa-copy mr-1"></i> Copy</>}
    </button>
  );
};
