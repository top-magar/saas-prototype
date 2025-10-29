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
import { CopyIcon, PlusIcon, Trash2Icon, EditIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

  const generateNewKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 22)}`;
    setGeneratedKey(newKey);
    // In a real app, you'd save this to the backend and then update the state
    setApiKeys([
      ...apiKeys,
      {
        id: String(apiKeys.length + 1),
        name: newKeyName || `API Key ${apiKeys.length + 1}`,
        key: newKey,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        expiresAt: "Never", // Or a calculated expiry date
      },
    ]);
    setNewKeyName("");
  };

  const revokeKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, status: "Revoked" } : key
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optionally, show a toast notification
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">API Keys</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Generate New Key
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
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </div>
                  </FieldContent>
                </Field>
              )}
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
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => revokeKey(key.id)}
                        disabled={key.status === "Revoked"}
                      >
                        <Trash2Icon className="h-4 w-4" />
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
