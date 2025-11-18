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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Plus, Trash, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: "Active" | "Revoked";
  createdAt: string;
  expiresAt: string;
}

const initialApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Default API Key",
    key: "sk_live_xxxxxxxxxxxxxxxxxxxx",
    status: "Active",
    createdAt: "2023-01-01",
    expiresAt: "Never",
  },
  {
    id: "2",
    name: "Marketing Integration",
    key: "sk_live_yyyyyyyyyyyyyyyyyyyy",
    status: "Active",
    createdAt: "2023-03-15",
    expiresAt: "2024-03-15",
  },
  {
    id: "3",
    name: "Development Test",
    key: "sk_test_zzzzzzzzzzzzzzzzzzzz",
    status: "Revoked",
    createdAt: "2023-05-20",
    expiresAt: "2023-06-20",
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys    
  );
  const [newKeyName, setNewKeyName] = useState(""    
  );
  const [generatedKey, setGeneratedKey] = useState(""    
  );
  const [expiryDate, setExpiryDate] = useState<Date>(    
  );

  const generateNewKey = async () => {
    try {
      const newKey = `sk_live_${Math.random().toString(36).substring(2, 22)}`;
      
      // API call to save key to backend
      await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || `API Key ${apiKeys.length + 1}` })
      }    
  );
      
      setGeneratedKey(newKey    
  );
      setApiKeys([
        ...apiKeys,
        {
          id: String(apiKeys.length + 1),
          name: newKeyName || `API Key ${apiKeys.length + 1}`,
          key: newKey,
          status: "Active",
          createdAt: new Date().toISOString().split("T")[0],
          expiresAt: expiryDate ? expiryDate.toISOString().split("T")[0] : "Never",
        },
      ]    
  );
      setNewKeyName(""    
  );
      setExpiryDate(undefined    
  );
    } catch (error) {
      // Handle key generation error
    }
  };

  const revokeKey = async (id: string) => {
    try {
      // API call to revoke key
      await fetch(`/api/keys/${id}/revoke`, { method: 'POST' }    
  );
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, status: "Revoked" } : key
        )
          
  );
    } catch (error) {
      // Handle revoke error
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text    
  );
      // Show success notification
    } catch (error) {
      // Handle clipboard error
    }
  };

  return (
    
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>
                Enter a name for your new API key.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Field>
                <FieldLabel>Key Name</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="e.g., My New Integration"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </FieldContent>
              </Field>
              {generatedKey && (
                <Field>
                  <FieldLabel>Generated Key</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input value={generatedKey} readOnly />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => copyToClipboard(generatedKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </div>
                  </FieldContent>
                </Field>
              )}
              <div>
                <Label>Expiry Date (Optional)</Label>
                <DatePicker
                  date={expiryDate}
                  onSelect={setExpiryDate}
                  placeholder="Never expires"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={generateNewKey}>Generate Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for secure access to your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-mono text-sm cursor-pointer" onClick={() => copyToClipboard(key.key)}>
                          {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Click to copy full key</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.status === "Active" ? "default" : "destructive"}>
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{key.createdAt}</TableCell>
                  <TableCell>{key.expiresAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon-sm" disabled={key.status === "Revoked"}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => revokeKey(key.id)}
                        disabled={key.status === "Revoked"}
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
