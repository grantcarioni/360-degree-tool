import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { clsx } from "clsx";

const BIAS_RULES = [
  { pattern: /\balways\b/i, message: "Avoid 'always'. Use specific behavior-based examples.", type: "warning" },
  { pattern: /\bnever\b/i, message: "Avoid 'never'. Use specific behavior-based examples.", type: "warning" },
  { pattern: /\b(he|she|him|her)\b/i, message: "Consider gender-neutral language (they/them/the person) to reduce subconscious bias.", type: "info" },
  { pattern: /\b(good|bad|nice)\b/i, message: "Use more descriptive, professional impact words.", type: "info" }
];

export function BiasFreeAssistant({ text }: { text: string }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    const found = BIAS_RULES.filter((rule) => rule.pattern.test(text));
    setSuggestions(found);
  }, [text]);

  if (!text) return null;

  return (
    <div className={clsx(
      "p-4 rounded-lg border text-sm transition-all duration-300",
      suggestions.length > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
    )}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold flex items-center gap-2">
          {suggestions.length > 0 ? (
            <AlertCircle className="size-4 text-amber-600" />
          ) : (
            <CheckCircle2 className="size-4 text-green-600" />
          )}
          HR Bias-Free Feedback Coaching
        </h4>
        <span className="text-[10px] uppercase font-bold text-gray-400">Powered by P&C Strategy</span>
      </div>
      
      {suggestions.length > 0 ? (
        <ul className="space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-amber-800">
              <span className="mt-1">•</span>
              {s.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-green-800 italic">This feedback looks neutral and behavior-focused. Great job!</p>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-[11px]">
        <Info className="size-3" />
        Focus on specific observed behaviors and their impact on the organization.
      </div>
    </div>
  );
}
