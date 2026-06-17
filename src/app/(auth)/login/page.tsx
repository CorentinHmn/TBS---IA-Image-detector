'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function LoginPage() {
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
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@company.com" required className="mt-1.5 bg-background border-border" /></div>
          <div>
            <div className="flex justify-between items-center"><Label htmlFor="password">Password</Label><Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link></div>
            <Input id="password" type="password" required className="mt-1.5 bg-background border-border" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link href="/signup" className="text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
