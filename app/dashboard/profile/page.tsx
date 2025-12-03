"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  User,
  WifiOff,
} from "lucide-react";

import { SectionCard, StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { StreakCalendar } from "@/components/badges/StreakCalendar";

const profile = {
  name: "Aditi Rao",
  email: "aditi@earniq.in",
  phone: "••••• 913",
  upi: "aditir@upi",
};

export default function DashboardProfilePage() {
  const [name, setName] = useState(profile.name);
  const [upi, setUpi] = useState(profile.upi);
  const [saved, setSaved] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setAppInstalled(isStandalone);
    setInstallAvailable(!isStandalone);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const handleInstallApp = () => {
    setInstallAvailable(false);
    setAppInstalled(true);
    alert("Mock install prompt: Sparkio will be added to your home screen.");
  };

  return (
    <div className="space-y-8">
      {isOffline && (
        <div
          className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            Offline mode active. You can view cached data, but actions like withdrawals will retry when you're online.
          </div>
        </div>
      )}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Profile & identity</p>
        <h1 className="text-3xl font-semibold text-white">Account preferences</h1>
        <p className="text-sm text-muted-foreground">
          Keep your contact details and payout IDs up to date. Everything here is demo-only.
        </p>
      </header>

      <SectionCard title="Profile & contact" subtitle="Masked where needed for privacy.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Display name</p>
            <div className="mt-2 flex items-center gap-2 text-white">
              <User className="h-4 w-4 text-orange-300" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-transparent text-white focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="mt-3 rounded-full border border-orange-500/40 px-3 py-1 text-xs text-orange-200"
            >
              Save name (demo)
            </button>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Email</p>
            <div className="mt-2 flex items-center gap-2 text-white">
              <Mail className="h-4 w-4 text-orange-300" />
              {profile.email}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Phone</p>
            <div className="mt-2 flex items-center gap-2 text-white">
              <Phone className="h-4 w-4 text-orange-300" />
              {profile.phone}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">KYC status</p>
            <div className="mt-3 flex items-center gap-3">
              <StatusPill label="Not required in demo" tone="info" />
              <span className="text-xs">We’ll prompt for documents when payouts go live.</span>
            </div>
          </div>
        </div>
        {saved && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Saved locally (demo)
          </div>
        )}
      </SectionCard>

      <SectionCard title="Payout details" subtitle="UPI stays masked until you need it.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">UPI ID</p>
            <input
              value={upi}
              onChange={(event) => setUpi(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-full border border-orange-500/40 px-3 py-1 text-xs text-orange-200"
            >
              Save UPI (demo)
            </button>
            <p className="text-xs text-muted-foreground">
              UPI verification happens only when real payouts launch. Until then, we mask it in history.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Status</p>
            <StatusPill label="Not verified yet (demo)" tone="warning" />
            <p className="text-xs">
              Verification requires a ₹1 test payout once Earniq connects to live banking partners.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Security & controls" subtitle="Keep your account safe.">
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <div>
              <p className="text-white">Login alerts</p>
              <p className="text-xs text-muted-foreground">Get an SMS + email whenever you sign in.</p>
            </div>
            <button
              onClick={() => setAlertsEnabled((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs text-white transition hover:border-white/40"
            >
              {alertsEnabled ? (
                <>
                  <ToggleRight className="h-4 w-4 text-emerald-300" /> On
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 text-red-300" /> Off
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <div>
              <p className="text-white">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Protect account with OTP and authenticator.</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
              Coming soon
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <div>
              <p className="text-white">Device history</p>
              <p className="text-xs text-muted-foreground">Review where you signed in recently.</p>
            </div>
            <button className="text-xs text-orange-200">View list</button>
          </div>

          <button className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-500 hover:bg-red-500/20">
            Delete account (demo only)
          </button>
          <p className="text-xs text-muted-foreground">
            This button does nothing right now—real deletion will require OTP + support confirmation.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="KYC toolkit" subtitle="Upload documents when real payouts launch.">
        <div className="grid gap-3 md:grid-cols-3">
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-muted-foreground transition hover:border-white/40 hover:text-white">
            <Shield className="h-5 w-5 text-orange-300" />
            <span className="font-semibold">Upload ID</span>
            <span className="text-xs">Aadhaar / PAN</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-muted-foreground transition hover:border-white/40 hover:text-white">
            <ShieldCheck className="h-5 w-5 text-orange-300" />
            <span className="font-semibold">Verify PAN</span>
            <span className="text-xs">Link to IT portal</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-muted-foreground transition hover:border-white/40 hover:text-white">
            <User className="h-5 w-5 text-orange-300" />
            <span className="font-semibold">Selfie check</span>
            <span className="text-xs">Face verification</span>
          </button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          KYC coming soon: PAN, Aadhaar, and a quick selfie. Not collected in this demo, but you'll see the checklist
          here once live.
        </p>
      </SectionCard>

      <SectionCard title="Daily Streak Calendar" subtitle="Track your daily activity and maintain your streak.">
        <StreakCalendar />
      </SectionCard>

      <SectionCard title="Install Sparkio" subtitle="Add the dashboard to your home screen for faster access.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-orange-300" />
              <p className="font-semibold text-white">
                {appInstalled ? "App already installed" : "Install Sparkio PWA"}
              </p>
            </div>
            <p className="mt-2 text-xs text-white/60">
              Install the web app to launch Sparkio like a native experience. Works offline with cached data.
            </p>
            <button
              onClick={handleInstallApp}
              disabled={!installAvailable}
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition",
                installAvailable
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-200 hover:border-orange-500 hover:bg-orange-500/20"
                  : "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
              )}
            >
              <Download className="h-4 w-4" />
              {installAvailable ? "Install app" : "Available soon"}
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="font-semibold text-white">Offline support</p>
            <ul className="mt-3 space-y-2 text-xs text-white/60">
              <li>• View cached tasks, referrals, and balances</li>
              <li>• Draft withdrawals and chats ready for when you're online</li>
              <li>• Sync happens automatically once connection returns</li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

