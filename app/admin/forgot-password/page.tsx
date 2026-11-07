"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [error, setError] = useState("");
  const [devOtpUrl, setDevOtpUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDevOtpUrl(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("reset");
        if (data.previewUrl) setDevOtpUrl(data.previewUrl);
      } else {
        setError(data.error || "Request failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successfully. You can now log in.");
      } else {
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            {step === "email" ? "Enter your email to receive a reset OTP" : `Enter the OTP sent to ${email} and a new password`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{success}</div>
              <Link href="/admin/login" className="block text-center text-sm font-medium hover:underline">Go to login</Link>
            </div>
          ) : step === "email" ? (
            <form onSubmit={handleRequest} className="space-y-4">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-800 dark:bg-stone-950"
                  placeholder="admin@yanti.com" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
              <div className="text-center mt-4">
                <Link href="/admin/login" className="text-sm font-medium hover:underline">Back to login</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
              {devOtpUrl && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Dev OTP preview:</p>
                  <a href={devOtpUrl} target="_blank" rel="noopener noreferrer" className="underline break-all">Open email preview</a>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="otp">OTP Code</label>
                <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-800 dark:bg-stone-950"
                  placeholder="123456" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="newPassword">New Password</label>
                <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-800 dark:bg-stone-950"
                  required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
              <div className="text-center mt-2">
                <button type="button" disabled={resending} onClick={async () => {
                  setResending(true); setError("");
                  try {
                    const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
                    const data = await res.json();
                    if (res.ok) { if (data.previewUrl) setDevOtpUrl(data.previewUrl); setError(""); }
                    else setError(data.error || "Resend failed");
                  } catch { setError("An unexpected error occurred"); }
                  finally { setResending(false); }
                }} className="text-sm font-medium hover:underline text-stone-900 dark:text-stone-100 disabled:opacity-50">
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}