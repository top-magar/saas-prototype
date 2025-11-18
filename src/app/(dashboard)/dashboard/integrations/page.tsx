"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Settings, LogOut } from "lucide-react";
import { ItemMedia } from "@/components/ui/item"; // Assuming ItemMedia can be used standalone or with ItemGroup

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "Connected" | "Disconnected" | "Config Required";
  icon: React.ElementType; // Using React.ElementType for Lucide icons
}

const allIntegrations: Integration[] = [
  {
    id: "1",
    name: "Stripe",
    description: "Process payments and manage subscriptions.",
    status: "Connected",
    icon: Plus,
  },
  {
    id: "2",
    name: "Mailchimp",
    description: "Sync customer data for email marketing campaigns.",
    status: "Disconnected",
    icon: Plus,
  },
  {
    id: "3",
    name: "Slack",
    description: "Receive notifications about important events.",
    status: "Config Required",
    icon: Plus,
  },
  {
    id: "4",
    name: "Google Analytics",
    description: "Track website traffic and user behavior.",
    status: "Connected",
    icon: Plus,
  },
  {
    id: "5",
    name: "Zapier",
    description: "Automate workflows between your apps.",
    status: "Disconnected",
    icon: Plus,
  },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState(""    
  );
  const [integrations, setIntegrations] = useState<Integration[]>(allIntegrations    
  );

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchTerm.toLowerCase())
      
  );

  const handleConnect = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, status: "Connected" } : integration
    )    
  );
    // In a real app, this would involve an API call to connect the integration
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, status: "Disconnected" } : integration
    )    
  );
    // In a real app, this would involve an API call to disconnect the integration
  };

  const handleConfigure = (id: string) => {
    // In a real app, this would navigate to a configuration page or open a dialog
    console.log('Configure integration requested');
  };

  return (
    
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <ItemMedia variant="icon">
                <integration.icon className="h-6 w-6" />
              </ItemMedia>
              <div>
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge
                variant={
                  integration.status === "Connected"
                    ? "default"
                    : integration.status === "Disconnected"
                    ? "destructive"
                    : "secondary"
                }
              >
                {integration.status}
              </Badge>
              <div className="flex gap-2">
                {integration.status === "Connected" && (
                  <>
                    <Button variant="outline" size="icon-sm" onClick={() => handleConfigure(integration.id)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon-sm" onClick={() => handleDisconnect(integration.id)}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {integration.status === "Disconnected" && (
                  <Button size="sm" onClick={() => handleConnect(integration.id)}>Connect</Button>
                )}
                {integration.status === "Config Required" && (
                  <Button size="sm" variant="secondary" onClick={() => handleConfigure(integration.id)}>Configure</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredIntegrations.length === 0 && (
        <p className="text-center text-muted-foreground">No integrations found.</p>
      )}
    </div>
      
  );
}
