import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { clsx } from "clsx";
import type { BiasRule } from "../types";

const BIAS_RULES: BiasRule[] = [
  { pattern: /\balways\b/i, message: "Avoid 'always' — use specific, observed behavior examples.", type: "warning" },
  { pattern: /\bnever\b/i, message: "Avoid 'never' — use specific, observed behavior examples.", type: "warning" },
  { pattern: /\b(he|she|him|her)\b/i, message: "Consider gender-neutral language (they/them) to reduce subconscious bias.", type: "info" },
  { pattern: /\b(good|bad|nice)\b/i, message: "Use specific, impact-focused words instead of vague descriptors.", type: "info" },
  { pattern: /\bpersonality\b/i, message: "Focus on observable behaviors, not personality traits.", type: "warning" },
  { pattern: /\bfeeling\b/i, message: "Describe the behavioral impact rather than your personal feelings.", type: "info" },
];

export function BiasFreeAssistant({ text }: { text: string }) {
  const [suggestions, setSuggestions] = useState<BiasRule[]>([]);

  // Debounce analysis — don't fire on every keystroke
  useEffect(() => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      const found = BIAS_RULES.filter((rule) => rule.pattern.test(text));
      setSuggestions(found);
    }, 400);
    return () => clearTimeout(timer);
  }, [text]);

  if (!text.trim()) return null;

  const isClean = suggestions.length === 0;

  return (
    <div
      className={clsx(
        "p-4 rounded-lg border text-sm transition-all duration-300",
        isClean ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold flex items-center gap-2">
          {isClean ? (
            <CheckCircle2 className="size-4 text-green-600" />
          ) : (
            <AlertCircle className="size-4 text-amber-600" />
          )}
          Bias-Free Feedback Coach
        </h4>
        <span className="text-[10px] uppercase font-bold text-gray-400">Powered by P&C Strategy</span>
      </div>

      {isClean ? (
        <p className="text-green-800 italic">
          This feedback looks neutral and behavior-focused. Great work!
        </p>
      ) : (
        <ul className="space-y-1.5">
          {suggestions.map((s, i) => (
            <li key={i} className={clsx("flex items-start gap-2", s.type === "warning" ? "text-amber-800" : "text-blue-800")}>
              <span className="mt-1 shrink-0">{s.type === "warning" ? "⚠️" : "ℹ️"}</span>
              {s.message}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-[11px]">
        <Info className="size-3 shrink-0" />
        Focus on specific observed behaviors and their impact on the organization.
      </div>
    </div>
  );
}
