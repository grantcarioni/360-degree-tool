import { useState } from "react";
import { User, Bell, ShieldCheck, Save } from "lucide-react";
import { useCurrentUser } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#A4343A]" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

export function Settings() {
  const { currentUser } = useCurrentUser();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState({
    emailOnRequest: true,
    emailOnSubmit: true,
    weeklyDigest: false,
    reminderEmails: true,
  });

  const handleSave = () => {
    addToast("Settings saved successfully!", "success");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#253746]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and notification preferences.</p>
      </header>

      {/* Profile Section */}
      <section className="ni-card space-y-6">
        <h2 className="font-bold text-[#253746] flex items-center gap-2 text-lg">
          <User className="size-5 text-[#A4343A]" /> Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-[#A4343A] flex items-center justify-center text-white text-xl font-bold">
            {currentUser.initials}
          </div>
          <div>
            <p className="font-bold text-[#253746] text-lg">{currentUser.name}</p>
            <p className="text-gray-500 text-sm">{currentUser.title}</p>
            <p className="text-xs text-gray-400">{currentUser.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Display Name", value: currentUser.name },
            { label: "Job Title", value: currentUser.title },
            { label: "Department", value: currentUser.department },
            { label: "Employee ID", value: `NI-${currentUser.id.padStart(4, "0")}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
              <div className="mt-1 p-3 bg-[#f2f4f5] rounded-md text-[#253746] text-sm font-medium">
                {value}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 italic">Profile information is managed by your HR administrator.</p>
      </section>

      {/* Notifications */}
      <section className="ni-card space-y-6">
        <h2 className="font-bold text-[#253746] flex items-center gap-2 text-lg">
          <Bell className="size-5 text-[#A4343A]" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          {([
            ["emailOnRequest", "Email when someone requests feedback from me"],
            ["emailOnSubmit", "Email when a rater submits their feedback"],
            ["weeklyDigest", "Weekly feedback digest summary"],
            ["reminderEmails", "Reminder emails for pending feedback"],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{label}</span>
              <Toggle
                enabled={notifications[key]}
                onChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="ni-card space-y-4">
        <h2 className="font-bold text-[#253746] flex items-center gap-2 text-lg">
          <ShieldCheck className="size-5 text-[#A4343A]" /> Privacy & Confidentiality
        </h2>
        <p className="text-sm text-gray-600">
          All 360° feedback submitted to NI is <strong>anonymized</strong> and is strictly for professional development.
          It is never linked to performance evaluations, compensation decisions, or disciplinary actions.
        </p>
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 font-medium">
          ✅ Your feedback responses are protected under NI's Psychological Safety Policy.
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={handleSave} className="ni-btn-primary flex items-center gap-2">
          <Save className="size-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
