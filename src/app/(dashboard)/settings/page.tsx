'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUser } from '@/lib/mock-data';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Profile Settings</h3>
          <div className="space-y-3">
            <div><Label htmlFor="name">Full name</Label><Input id="name" defaultValue={mockUser.name} className="mt-1.5 bg-background border-border" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue={mockUser.email} className="mt-1.5 bg-background border-border" /></div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Save changes</Button>
            {saved && <span className="text-sm text-emerald-400">Settings saved</span>}
          </div>
        </TabsContent>

        <TabsContent value="organization" className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Organization</h3>
          <div><Label htmlFor="org">Organization name</Label><Input id="org" defaultValue={mockUser.organization} className="mt-1.5 bg-background border-border" /></div>
          <Button onClick={handleSave}>Save changes</Button>
        </TabsContent>

        <TabsContent value="notifications" className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Notifications</h3>
          <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
        </TabsContent>

        <TabsContent value="danger" className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
          <Button variant="destructive" onClick={() => alert('Account deletion is disabled in this demo.')}>
            Delete account
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
