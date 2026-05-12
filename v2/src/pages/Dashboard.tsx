import { useQuery } from "@tanstack/react-query";
import { User, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, Clock, CheckCircle2, Send } from "lucide-react";
import { Link } from "wouter";
import { useCurrentUser } from "../context/AuthContext";
import { SkeletonCompetency, SkeletonCard } from "../components/SkeletonCard";
import type { StaffMember, FeedbackRequest } from "../types";

export function Dashboard() {
  const { currentUser } = useCurrentUser();

  const {
    data: staff,
    isLoading: staffLoading,
    isError: staffError,
    refetch: refetchStaff,
  } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed to load staff");
      return res.json();
    },
  });

  const {
    data: feedbackRequests,
    isLoading: requestsLoading,
  } = useQuery<FeedbackRequest[]>({
    queryKey: ["/api/feedback-requests", currentUser.id],
    queryFn: async () => {
      const res = await fetch(`/api/feedback-requests?subjectId=${currentUser.id}`);
      if (!res.ok) throw new Error("Failed to load feedback requests");
      return res.json();
    },
  });

  const currentUserProfile = staff?.find((s) => s.id === currentUser.id);
  const pending = feedbackRequests?.filter((r) => r.status === "pending").length ?? 0;
  const completed = feedbackRequests?.filter((r) => r.status === "completed").length ?? 0;
  const total = feedbackRequests?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#253746]">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-gray-500 mt-1">Here is a summary of your 360° feedback journey.</p>
        </div>
        <Link href="/request">
          <button className="ni-btn-primary flex items-center gap-2">
            New Feedback Request <ArrowRight className="size-4" />
          </button>
        </Link>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Requests", value: total, icon: Send, color: "text-[#253746]", bg: "bg-[#f2f4f5]" },
          { label: "Awaiting Response", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Completed", value: completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="ni-card flex items-center gap-4">
            <div className={`p-3 rounded-full ${bg}`}>
              <Icon className={`size-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#253746]">
                {requestsLoading ? "—" : value}
              </p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <section className="lg:col-span-1 ni-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="size-24 rounded-full bg-[#f2f4f5] flex items-center justify-center border-2 border-[#A4343A]">
              <User className="size-12 text-[#253746]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#253746]">{currentUser.name}</h2>
              <p className="text-[#A4343A] font-medium italic">{currentUser.title}</p>
              <p className="text-xs text-gray-400 mt-1">{currentUser.department}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
                {currentUser.department}
              </span>
            </div>
          </div>

          {/* Recent requests mini-list */}
          {!requestsLoading && feedbackRequests && feedbackRequests.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Requests</p>
              {feedbackRequests.slice(0, 2).map((req) => (
                <div key={req.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate">{req.dateRequested}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    req.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Competencies Section */}
        <section className="lg:col-span-2 ni-card space-y-4">
          <h2 className="text-lg font-bold text-[#253746] flex items-center gap-2">
            <ShieldCheck className="text-[#A4343A]" /> Your Skill Profile
          </h2>

          {staffError ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <AlertCircle className="size-8 text-red-400" />
              <p className="text-gray-500 text-sm">Could not load your profile data.</p>
              <button onClick={() => refetchStaff()} className="flex items-center gap-1 text-sm text-[#A4343A] hover:underline">
                <RefreshCw className="size-3" /> Retry
              </button>
            </div>
          ) : staffLoading ? (
            <SkeletonCompetency />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentUserProfile?.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 bg-[#f2f4f5] rounded-md border border-gray-100 flex justify-between items-center group hover:border-[#A4343A] hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-medium text-[#253746]">{skill.name}</span>
                  <span className="text-[10px] uppercase tracking-tighter text-gray-400 group-hover:text-[#A4343A] transition-colors">
                    {skill.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Psychological Safety Banner */}
      <footer className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-4">
        <div className="bg-blue-600 p-2 rounded-full text-white shrink-0">
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
