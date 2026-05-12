import { useQuery } from "@tanstack/react-query";
import { Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SkeletonCard } from "../components/SkeletonCard";
import type { StaffMember } from "../types";

export function Team() {
  const { data: staff, isLoading } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#253746]">My Team</h1>
          <p className="text-gray-500 mt-1">People you can request feedback from or about.</p>
        </div>
        <Link href="/request">
          <button className="ni-btn-primary flex items-center gap-2">
            Request Feedback <ArrowRight className="size-4" />
          </button>
        </Link>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff?.map((person) => (
            <div key={person.id} className="ni-card hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-full bg-[#f2f4f5] border-2 border-[#A4343A] flex items-center justify-center font-bold text-[#253746] shrink-0">
                  {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#253746] truncate">{person.name}</p>
                  <p className="text-xs text-gray-500 truncate">{person.title}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#f2f4f5] text-[#253746] text-xs rounded-full font-medium">
                    {person.department}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="size-3" /> {person.skills.length} skills</span>
                <span className="flex items-center gap-1 text-amber-600"><Clock className="size-3" /> Feedback: open</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <strong>Coming soon:</strong> Individual team member profiles, feedback history, and direct feedback requests.
      </div>
    </div>
  );
}
