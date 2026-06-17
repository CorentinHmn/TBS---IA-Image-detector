'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/dashboard'), 1000);
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto"><Shield className="w-6 h-6 text-white" /></div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground">Start analyzing images today</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div><Label htmlFor="name">Full name</Label><Input id="name" placeholder="Alex Martin" required className="mt-1.5 bg-background border-border" /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@company.com" required className="mt-1.5 bg-background border-border" /></div>
          <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required className="mt-1.5 bg-background border-border" /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
