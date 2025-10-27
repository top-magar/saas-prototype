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
import { SearchIcon, PlayIcon, PauseIcon, EditIcon, ListChecksIcon, PlusIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  lastRun: string;
}

const allWorkflows: Workflow[] = [
  { id: "1", name: "Automated Welcome Email", description: "Sends a welcome email to new sign-ups.", status: "Active", lastRun: "2023-10-26 10:00" },
  { id: "2", name: "Abandoned Cart Reminder", description: "Sends a reminder email for abandoned carts.", status: "Inactive", lastRun: "N/A" },
  { id: "3", name: "Weekly Sales Report Generation", description: "Generates and emails weekly sales reports.", status: "Active", lastRun: "2023-10-23 08:00" },
  { id: "4", name: "Customer Feedback Collection", description: "Collects feedback after product delivery.", status: "Active", lastRun: "2023-10-25 16:00" },
];

export default function WorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workflows, setWorkflows] = useState<Workflow[]>(allWorkflows);

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setWorkflows(
      workflows.map((workflow) =>
        workflow.id === id
          ? { ...workflow, status: workflow.status === "Active" ? "Inactive" : "Active" }
          : workflow
      )
    );
  };

  const handleEditWorkflow = (id: string) => {
    console.log(`Editing workflow ${id}`);
    // Navigate to workflow edit page
  };

  const handleViewRuns = (id: string) => {
    console.log(`Viewing runs for workflow ${id}`);
    // Navigate to workflow runs page
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Workflows (Powered by Blaze)</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Create New Workflow
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search workflows..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{workflow.name}</CardTitle>
                <Switch
                  checked={workflow.status === "Active"}
                  onCheckedChange={() => handleToggleStatus(workflow.id)}
                  aria-label={`Toggle ${workflow.name} status`}
                />
              </div>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Status:</span>
                <Badge variant={workflow.status === "Active" ? "default" : "secondary"}>
                  {workflow.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Last Run:</span>
                <span>{workflow.lastRun}</span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="icon-sm" onClick={() => handleEditWorkflow(workflow.id)}>
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={() => handleViewRuns(workflow.id)}>
                  <ListChecksIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredWorkflows.length === 0 && (
        <p className="text-center text-muted-foreground">No workflows found.</p>
      )}
    </div>
  );
}
