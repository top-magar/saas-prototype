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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Webhook {
  id: string;
  name: string;
  url: string;
  event: string;
  status: "Active" | "Inactive";
  lastTriggered: string;
}

const initialWebhooks: Webhook[] = [
  { id: "1", name: "New Order Notification", url: "https://example.com/webhook/new-order", event: "order.created", status: "Active", lastTriggered: "2023-10-25 14:30" },
  { id: "2", name: "Customer Update Sync", url: "https://api.crm.com/webhook/customer-update", event: "customer.updated", status: "Inactive", lastTriggered: "N/A" },
  { id: "3", name: "Product Stock Alert", url: "https://alerts.internal/stock-low", event: "product.stock_low", status: "Active", lastTriggered: "2023-10-24 09:00" },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvent, setNewWebhookEvent] = useState("");

  const handleAddWebhook = () => {
    if (newWebhookName && newWebhookUrl && newWebhookEvent) {
      const newWebhook: Webhook = {
        id: String(webhooks.length + 1),
        name: newWebhookName,
        url: newWebhookUrl,
        event: newWebhookEvent,
        status: "Active",
        lastTriggered: "N/A",
      };
      setWebhooks([...webhooks, newWebhook]);
      setNewWebhookName("");
      setNewWebhookUrl("");
      setNewWebhookEvent("");
      console.log("Adding new webhook:", newWebhook);
      // In a real app, this would involve an API call to add the webhook
    }
  };

  const handleToggleStatus = (id: string) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id
          ? { ...webhook, status: webhook.status === "Active" ? "Inactive" : "Active" }
          : webhook
      )
    );
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id));
    console.log("Deleting webhook:", id);
    // In a real app, this would involve an API call to delete the webhook
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Webhooks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Webhook</DialogTitle>
              <DialogDescription>
                Configure a new webhook to send automated notifications.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Field>
                <FieldLabel>Webhook Name</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="e.g., Order Confirmation"
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Target URL</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="https://your-app.com/webhook-endpoint"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Event Trigger</FieldLabel>
                <FieldContent>
                  <Select value={newWebhookEvent} onValueChange={setNewWebhookEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order.created">Order Created</SelectItem>
                      <SelectItem value="customer.updated">Customer Updated</SelectItem>
                      <SelectItem value="product.stock_low">Product Stock Low</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWebhook}>Add Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Webhooks</CardTitle>
          <CardDescription>
            Manage your configured webhooks and their statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {webhook.url.length > 30 ? `${webhook.url.substring(0, 27)}...` : webhook.url}
                  </TableCell>
                  <TableCell>{webhook.event}</TableCell>
                  <TableCell>
                    <Badge variant={webhook.status === "Active" ? "default" : "secondary"}>
                      {webhook.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{webhook.lastTriggered}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleToggleStatus(webhook.id)}
                      >
                        {webhook.status === "Active" ? (
                          <Switch className="h-4 w-4" />
                        ) : (
                          <Switch className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="icon-sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
