import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { BiasFreeAssistant } from "../components/BiasFreeAssistant";
import { useCurrentUser } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { StaffMember } from "../types";

const STEPS = ["Select Raters", "Personalize", "Send"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  done
                    ? "bg-[#A4343A] border-[#A4343A] text-white"
                    : active
                    ? "border-[#A4343A] text-[#A4343A] bg-white"
                    : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {done ? <CheckCircle2 className="size-4" /> : stepNum}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  active ? "text-[#A4343A]" : done ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-1 mb-5 transition-colors ${done ? "bg-[#A4343A]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RequestFlow() {
  const [step, setStep] = useState(1);
  const [selectedRaters, setSelectedRaters] = useState<string[]>([]);
  const [personalNote, setPersonalNote] = useState("");
  const [, navigate] = useLocation();
  const { currentUser } = useCurrentUser();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: staff, isError } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed to load staff");
      return res.json();
    },
  });

  // Exclude the current user from the rater list
  const raterOptions = staff?.filter((s) => s.id !== currentUser.id) ?? [];

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/feedback-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: currentUser.id,
          subjectName: currentUser.name,
          raters: selectedRaters,
          personalNote,
          competencies: [],
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback-requests"] });
      addToast("Feedback request sent successfully!", "success");
      navigate("/");
    },
    onError: () => {
      addToast("Failed to send request. Please try again.", "error");
    },
  });

  const handleToggleRater = (name: string) => {
    setSelectedRaters((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-[#253746] mb-4">Request 360° Feedback</h1>
        <StepIndicator current={step} />
      </header>

      {/* Step 1 — Select Raters */}
      {step === 1 && (
        <section className="ni-card space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-[#253746]">Who should provide feedback?</h2>
            <p className="text-gray-500 text-sm mt-1">
              We recommend <strong>3–5 peers</strong> and <strong>1–2 managers</strong> for a balanced view.
              {selectedRaters.length > 0 && (
                <span className="ml-2 text-[#A4343A] font-bold">{selectedRaters.length} selected</span>
              )}
            </p>
          </div>

          {isError ? (
            <div className="flex items-center gap-2 text-red-600 text-sm p-4 bg-red-50 rounded-lg">
              <AlertCircle className="size-4" /> Could not load staff list. Please refresh.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {raterOptions.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handleToggleRater(person.name)}
                  className={`p-4 rounded-lg border text-left transition-all hover:shadow-sm ${
                    selectedRaters.includes(person.name)
                      ? "border-[#A4343A] bg-red-50 shadow-sm"
                      : "border-gray-200 hover:border-[#253746]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#253746]">{person.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{person.title}</p>
                      <p className="text-xs text-gray-400">{person.department}</p>
                    </div>
                    {selectedRaters.includes(person.name) && (
                      <CheckCircle2 className="text-[#A4343A] size-5 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedRaters.length > 0 && selectedRaters.length < 3 && (
            <p className="text-amber-600 text-sm flex items-center gap-1">
              <AlertCircle className="size-4" /> Consider selecting at least 3 raters for a more balanced view.
            </p>
          )}

          <div className="flex justify-end">
            <button
              disabled={selectedRaters.length === 0}
              onClick={() => setStep(2)}
              className="ni-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Personalize
            </button>
          </div>
        </section>
      )}

      {/* Step 2 — Personalize */}
      {step === 2 && (
        <section className="space-y-4 animate-fade-in">
          <div className="ni-card space-y-4">
            <h2 className="text-xl font-bold text-[#253746]">Personalize your request</h2>
            <p className="text-gray-500 text-sm">
              Briefly explain why you're asking for feedback and what you hope to learn. A personal note increases response rates.
            </p>
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Hi team, I am looking to grow my leadership skills and would value your honest perspective..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A4343A] focus:border-transparent outline-none resize-none text-sm"
            />
            <BiasFreeAssistant text={personalNote} />
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-2 text-[#253746] hover:bg-gray-100 rounded-md transition-colors">
              Back
            </button>
            <button onClick={() => setStep(3)} className="ni-btn-primary">
              Review and Send
            </button>
          </div>
        </section>
      )}

      {/* Step 3 — Review & Send */}
      {step === 3 && (
        <section className="ni-card text-center py-10 space-y-6 animate-fade-in">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Send className="size-9" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#253746]">Ready to send!</h2>
            <p className="text-gray-500">Your request will be sent to {selectedRaters.length} colleague{selectedRaters.length !== 1 ? "s" : ""}.</p>
          </div>

          <div className="max-w-sm mx-auto p-4 bg-gray-50 rounded-lg text-left text-sm space-y-2 border border-gray-200">
            <p className="font-bold text-[#253746]">Summary</p>
            <p><span className="text-gray-500">Raters:</span> {selectedRaters.join(", ")}</p>
            <p><span className="text-gray-500">Tone:</span> Behavior-focused & Constructive</p>
            {personalNote && (
              <p className="text-gray-500 italic text-xs line-clamp-2">"{personalNote}"</p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setStep(2)} className="px-6 py-2 text-[#253746] hover:bg-gray-100 rounded-md transition-colors">
              Edit
            </button>
            <button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="ni-btn-primary disabled:opacity-50"
            >
              {submitMutation.isPending ? "Sending..." : "Confirm and Send"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
