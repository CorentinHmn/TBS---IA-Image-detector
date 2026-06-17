'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto"><Shield className="w-6 h-6 text-white" /></div>
          <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
        </div>
        {sent ? (
          <div className="bg-card rounded-xl border border-emerald-500/20 p-6 text-center space-y-2">
            <p className="text-sm font-medium text-emerald-400">Reset link sent</p>
            <p className="text-xs text-muted-foreground">Check your email for instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@company.com" required className="mt-1.5 bg-background border-border" /></div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Back to sign in</Link></p>
      </div>
    </div>
  );
}
