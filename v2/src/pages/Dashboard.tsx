import { useQuery } from "@tanstack/react-query";
import { User, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function Dashboard() {
  const { data: competencies, isLoading } = useQuery({
    queryKey: ["/api/competencies"],
    queryFn: async () => {
      const res = await fetch("/api/competencies");
      return res.json();
    }
  });

  const currentUser = competencies?.find((c: any) => c.name === "Grant Carioni");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#253746]">Welcome back, Grant</h1>
          <p className="text-gray-600 mt-1">Here is a summary of your 360° feedback journey.</p>
        </div>
        <Link href="/request">
          <button className="ni-btn-primary flex items-center gap-2">
            New Feedback Request <ArrowRight className="size-4" />
          </button>
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <section className="lg:col-span-1 ni-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="size-24 rounded-full bg-[#f2f4f5] flex items-center justify-center border-2 border-[#A4343A]">
              <User className="size-12 text-[#253746]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#253746]">Grant Carioni</h2>
              <p className="text-[#A4343A] font-medium italic">Senior Director, People & Culture</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">HR Strategy</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">Leadership</span>
            </div>
          </div>
        </section>

        {/* Competencies Section */}
        <section className="lg:col-span-2 ni-card space-y-4">
          <h2 className="text-lg font-bold text-[#253746] flex items-center gap-2">
            <ShieldCheck className="text-[#A4343A]" /> Your Identified Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <p>Loading competencies...</p>
            ) : (
              currentUser?.skills.map((skill: any) => (
                <div key={skill.id} className="p-3 bg-[#f2f4f5] rounded-md border border-gray-100 flex justify-between items-center group hover:border-[#A4343A] transition-colors">
                  <span className="text-sm font-medium text-[#253746]">{skill.name}</span>
                  <span className="text-[10px] uppercase tracking-tighter text-gray-400 group-hover:text-[#A4343A]">{skill.category}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Psychological Safety Banner */}
      <footer className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-4">
        <div className="bg-blue-600 p-2 rounded-full text-white">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900">Psychological Safety Commitment</h3>
          <p className="text-sm text-blue-800">
            NI is committed to a feedback culture based on growth and trust. All 360° feedback is strictly for professional development and is not linked to performance reviews or disciplinary actions.
          </p>
        </div>
      </footer>
    </div>
  );
}
