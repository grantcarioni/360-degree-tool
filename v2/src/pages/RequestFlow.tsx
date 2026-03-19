import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, CheckCircle2, Send, Info } from "lucide-react";
import { BiasFreeAssistant } from "../components/BiasFreeAssistant";

export function RequestFlow() {
  const [step, setStep] = useState(1);
  const [selectedRaters, setSelectedRaters] = useState<string[]>([]);
  const [personalNote, setPersonalNote] = useState("");

  const { data: competencies } = useQuery({
    queryKey: ["/api/competencies"],
    queryFn: async () => {
      const res = await fetch("/api/competencies");
      return res.json();
    }
  });

  const handleToggleRater = (name: string) => {
    setSelectedRaters(prev => 
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
          <span className={step >= 1 ? "text-[#A4343A] font-bold" : ""}>1. Select Raters</span>
          <span>→</span>
          <span className={step >= 2 ? "text-[#A4343A] font-bold" : ""}>2. Personalize Request</span>
          <span>→</span>
          <span className={step >= 3 ? "text-[#A4343A] font-bold" : ""}>3. Send</span>
        </div>
        <h1 className="text-3xl font-bold text-[#253746]">Request 360° Feedback</h1>
      </header>

      {step === 1 && (
        <section className="ni-card space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#253746]">Who should provide feedback?</h2>
            <p className="text-gray-600 text-sm">We recommend selecting 3-5 peers and 1-2 managers for a balanced view.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {competencies?.map((person: any) => (
              <button
                key={person.name}
                onClick={() => handleToggleRater(person.name)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedRaters.includes(person.name) 
                    ? "border-[#A4343A] bg-red-50" 
                    : "border-gray-200 hover:border-[#253746]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#253746]">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.title}</p>
                  </div>
                  {selectedRaters.includes(person.name) && <CheckCircle2 className="text-[#A4343A] size-5" />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button 
              disabled={selectedRaters.length === 0}
              onClick={() => setStep(2)}
              className="ni-btn-primary disabled:opacity-50"
            >
              Continue to Personalize
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <div className="ni-card space-y-4">
            <h2 className="text-xl font-bold text-[#253746]">Personalize your request</h2>
            <p className="text-gray-600 text-sm">Briefly explain why you're asking for feedback and what you hope to learn.</p>
            
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Hi team, I am looking to grow my leadership skills and would value your honest perspective..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A4343A] focus:border-transparent outline-none"
            />
            
            <BiasFreeAssistant text={personalNote} />
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-2 text-[#253746] hover:bg-gray-100 rounded-md">
              Back
            </button>
            <button onClick={() => setStep(3)} className="ni-btn-primary">
              Review and Send
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="ni-card text-center py-12 space-y-6">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Send className="size-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#253746]">Ready to go!</h2>
            <p className="text-gray-600">Your request will be sent to {selectedRaters.length} colleagues.</p>
          </div>
          
          <div className="max-w-sm mx-auto p-4 bg-gray-50 rounded-lg text-left text-sm space-y-2">
            <p className="font-bold">Summary:</p>
            <p><strong>Raters:</strong> {selectedRaters.join(", ")}</p>
            <p><strong>Tone:</strong> Behavior-focused and Constructive</p>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setStep(2)} className="px-6 py-2 text-[#253746] hover:bg-gray-100 rounded-md">
              Edit
            </button>
            <button 
              onClick={() => {
                alert("Feedback Request successfully sent!");
                window.location.href = "/";
              }}
              className="ni-btn-primary"
            >
              Confirm and Send Request
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
