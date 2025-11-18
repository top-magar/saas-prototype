'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { FileText, Download, Calendar, Settings, Plus, Play, Pause, Trash } from "lucide-react";
import { useState } from "react";

interface EnhancedReportsTabProps {
  data: {
    saved: Array<{ id: number; name: string; type: string; created: string; status: string; lastRun: string }>;
  };
}

export function EnhancedReportsTab({ data }: EnhancedReportsTabProps) {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [reportFrequency, setReportFrequency] = useState("");

  const reportTypes = [
    { value: "revenue", label: "Revenue Analysis" },
    { value: "customers", label: "Customer Analytics" },
    { value: "products", label: "Product Performance" },
    { value: "marketing", label: "Marketing ROI" },
    { value: "comprehensive", label: "Comprehensive Report" }
  ];

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" }
  ];

  return (
    <div className="grid gap-6">
      {/* Report Builder */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <Plus className="h-4 w-4" />
            REPORT BUILDER
          </CardTitle>
          <CardDescription>Create custom analytics reports with automated scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel className="text-xs font-mono uppercase tracking-wider">Report Name</FieldLabel>
              <FieldContent>
                <Input 
                  placeholder="e.g., Q4 Revenue Analysis" 
                  value={reportName} 
                  onChange={(e) => setReportName(e.target.value)}
                  className="font-mono"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs font-mono uppercase tracking-wider">Report Type</FieldLabel>
              <FieldContent>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="font-mono">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="font-mono">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel className="text-xs font-mono uppercase tracking-wider">Schedule Frequency</FieldLabel>
              <FieldContent>
                <Select value={reportFrequency} onValueChange={setReportFrequency}>
                  <SelectTrigger className="font-mono">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value} className="font-mono">
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-xs font-mono uppercase tracking-wider">Include Visualizations</FieldLabel>
              <FieldContent className="flex items-center gap-3">
                <Switch checked={includeCharts} onCheckedChange={setIncludeCharts} />
                <FieldDescription className="text-xs font-mono">
                  Include charts and graphs in the report
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button className="font-mono">
              <FileText className="h-4 w-4 mr-2" />
              Generate Preview
            </Button>
            <Button variant="outline" className="font-mono">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Reports */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SAVED REPORTS
          </CardTitle>
          <CardDescription>Manage and access your previously created reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.saved.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-border/50 hover:border-border transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono font-medium">{report.name}</div>
                  <Badge 
                    variant={
                      report.status === "Active" ? "default" : 
                      report.status === "Scheduled" ? "secondary" : 
                      "outline"
                    }
                    className="text-xs font-mono"
                  >
                    {report.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span>Type: {report.type}</span>
                  <span>Created: {report.created}</span>
                  <span>Last run: {report.lastRun}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-mono">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="font-mono">
                  <Settings className="h-4 w-4" />
                </Button>
                {report.status === "Active" ? (
                  <Button variant="outline" size="sm" className="font-mono">
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="font-mono">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="destructive" size="sm" className="font-mono">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-background border border-border/50 cursor-pointer hover:border-border transition-all">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <div className="text-sm font-mono font-medium mb-2">Revenue Summary</div>
            <div className="text-xs font-mono text-muted-foreground mb-4">
              Monthly revenue breakdown with trends
            </div>
            <Button variant="outline" size="sm" className="font-mono">
              Generate Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50 cursor-pointer hover:border-border transition-all">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <div className="text-sm font-mono font-medium mb-2">Customer Insights</div>
            <div className="text-xs font-mono text-muted-foreground mb-4">
              Customer behavior and segmentation analysis
            </div>
            <Button variant="outline" size="sm" className="font-mono">
              Generate Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50 cursor-pointer hover:border-border transition-all">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <div className="text-sm font-mono font-medium mb-2">Performance Report</div>
            <div className="text-xs font-mono text-muted-foreground mb-4">
              Comprehensive business performance metrics
            </div>
            <Button variant="outline" size="sm" className="font-mono">
              Generate Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <Download className="h-4 w-4" />
            EXPORT OPTIONS
          </CardTitle>
          <CardDescription>Download reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="font-mono">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" className="font-mono">
              <FileText className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" className="font-mono">
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" className="font-mono">
              <FileText className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}