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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash } from "lucide-react";

const savedReports = [
  { id: 1, name: "Monthly Sales Summary", type: "Sales", created: "2023-10-01", status: "Active" },
  { id: 2, name: "Customer Acquisition Funnel", type: "Customers", created: "2023-09-15", status: "Active" },
  { id: 3, name: "Product Performance Q3", type: "Products", created: "2023-09-01", status: "Archived" },
];

export default function CustomReportsPage() {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Custom Reports</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Builder</CardTitle>
            <CardDescription>Define parameters for your custom report.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field>
              <FieldLabel>Report Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="e.g., Q4 Marketing Performance"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Report Type</FieldLabel>
              <FieldContent>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Include Charts</FieldLabel>
              <FieldContent>
                <Switch
                  checked={includeCharts}
                  onCheckedChange={setIncludeCharts}
                />
                <FieldDescription>
                  Toggle to include visual charts in your report.
                </FieldDescription>
              </FieldContent>
            </Field>

            <Button className="mt-4">Generate Report Preview</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
            <CardDescription>Manage your previously created reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === "Active" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon-sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon-sm">
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
    </div>
  );
}