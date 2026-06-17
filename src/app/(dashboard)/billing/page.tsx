'use client';

import { mockPricingPlans } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockInvoices = [
  { id: 'inv_001', date: 'Jan 1, 2024', amount: '$49.00', status: 'Paid' },
  { id: 'inv_002', date: 'Dec 1, 2023', amount: '$49.00', status: 'Paid' },
  { id: 'inv_003', date: 'Nov 1, 2023', amount: '$49.00', status: 'Paid' },
];

export default function BillingPage() {
  const currentPlan = mockPricingPlans.find(p => p.current);
  const usagePercent = Math.round((247 / 500) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current plan</p>
            <p className="text-xl font-bold text-foreground">{currentPlan?.name} — ${currentPlan?.price}/mo</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly usage</span>
            <span className="text-foreground font-medium">247 / 500 analyses</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usagePercent}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockPricingPlans.map(plan => (
          <div key={plan.id} className={cn(
            'bg-card rounded-xl border p-5 space-y-4',
            plan.current ? 'border-primary' : 'border-border'
          )}>
            {plan.current && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Current</span>}
            <div>
              <p className="text-base font-bold text-foreground">{plan.name}</p>
              <p className="text-2xl font-bold text-foreground mt-1">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
            <ul className="space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.current ? 'outline' : 'default'} size="sm" className="w-full" disabled={plan.current}>
              {plan.current ? 'Current plan' : <><Zap className="w-3.5 h-3.5 mr-1" />Upgrade</>}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Billing history</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Invoice', 'Date', 'Amount', 'Status'].map(h => (
                <th key={h} className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockInvoices.map(inv => (
              <tr key={inv.id}>
                <td className="py-3 text-sm text-foreground">{inv.id}</td>
                <td className="py-3 text-sm text-muted-foreground">{inv.date}</td>
                <td className="py-3 text-sm text-foreground font-medium">{inv.amount}</td>
                <td className="py-3"><span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
