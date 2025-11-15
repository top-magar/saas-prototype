'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TenantSetup() {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    email: '',
    userName: '',
    primaryColor: '#3B82F6',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tenant/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { tenant } = await response.json();
        // Sanitize subdomain to prevent XSS
        const sanitizedSubdomain = tenant.subdomain.replace(/[^a-z0-9-]/g, '');
        window.location.href = `http://${sanitizedSubdomain}.localhost:3000`;
      } else {
        const { error } = await response.json();
        alert(error);
      }
    } catch (error) {
      alert('Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="subdomain">Subdomain</Label>
            <Input
              id="subdomain"
              value={formData.subdomain}
              onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
              placeholder="your-workspace"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.subdomain}.{process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Workspace'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}