"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-6 py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-background/80 p-8 shadow-xl backdrop-blur">
        {children}
      </div>
    </div>
  );
}

