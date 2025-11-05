"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, FileText, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ImportHistory {
  id: string;
  filename: string;
  date: string;
  status: "completed" | "failed" | "processing";
  records: number;
  errors?: number;
}

const importHistory: ImportHistory[] = [
  { id: "1", filename: "products_batch_1.csv", date: "2024-01-15", status: "completed", records: 250 },
  { id: "2", filename: "inventory_update.xlsx", date: "2024-01-14", status: "completed", records: 180, errors: 5 },
  { id: "3", filename: "new_products.csv", date: "2024-01-13", status: "failed", records: 0, errors: 15 },
  { id: "4", filename: "categories_import.xlsx", date: "2024-01-12", status: "processing", records: 95 },
];

export default function ImportExportPage() {
  const [importFile, setImportFile] = useState<File | null>(null    
  );
  const [exportFormat, setExportFormat] = useState("csv"    
  );
  const [exportScope, setExportScope] = useState("all"    
  );
  const [importProgress, setImportProgress] = useState(0    
  );
  const [exportProgress, setExportProgress] = useState(0    
  );
  const [dragActive, setDragActive] = useState(false    
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(    
  );
    e.stopPropagation(    
  );
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true    
  );
    } else if (e.type === "dragleave") {
      setDragActive(false    
  );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(    
  );
    e.stopPropagation(    
  );
    setDragActive(false    
  );
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0]    
  );
    }
  };

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportFile(event.target.files[0]    
  );
    }
  };

  const handleImport = () => {
    if (!importFile) {
      toast.error("Please select a file to import"    
  );
      return;
    }

    setImportProgress(0    
  );
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval    
  );
          toast.success("Import completed successfully!"    
  );
          return 100;
        }
        return prev + 10;
      }    
  );
    }, 200    
  );
  };

  const handleExport = () => {
    setExportProgress(0    
  );
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval    
  );
          toast.success("Export ready for download!"    
  );
          return 100;
        }
        return prev + 10;
      }    
  );
    }, 200    
  );
  };

  const downloadTemplate = (format: string) => {
    toast.success(`${format.toUpperCase()} template downloaded`    
  );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "processing": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default" as const,
      failed: "destructive" as const,
      processing: "secondary" as const,
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Product Import/Export</h1>
        <p className="text-muted-foreground">Manage your product data with bulk import and export operations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Products
            </CardTitle>
            <CardDescription>Upload CSV or Excel files to add or update products in bulk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports CSV, XLSX files up to 10MB</p>
              </div>
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleImportFileChange}
                className="mt-4 max-w-xs mx-auto"
              />
            </div>

            {importFile && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{importFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(importFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setImportFile(null)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {importProgress > 0 && importProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={!importFile || (importProgress > 0 && importProgress < 100)} className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Import Products
              </Button>
              <Button variant="outline" onClick={() => downloadTemplate("csv")}>
                Template
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Products
            </CardTitle>
            <CardDescription>Download your product data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Field>
                <FieldLabel>Export Format</FieldLabel>
                <FieldContent>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV - Comma Separated</SelectItem>
                      <SelectItem value="xlsx">XLSX - Excel Format</SelectItem>
                      <SelectItem value="json">JSON - Data Format</SelectItem>
                      <SelectItem value="pdf">PDF - Report Format</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Data Scope</FieldLabel>
                <FieldContent>
                  <Select value={exportScope} onValueChange={setExportScope}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products (1,247 items)</SelectItem>
                      <SelectItem value="published">Published Only (892 items)</SelectItem>
                      <SelectItem value="draft">Drafts Only (355 items)</SelectItem>
                      <SelectItem value="categories">By Categories</SelectItem>
                      <SelectItem value="lowstock">Low Stock Items (23 items)</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            </div>

            {exportProgress > 0 && exportProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preparing export...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
              </div>
            )}

            <div className="grid gap-2">
              <Button onClick={handleExport} disabled={exportProgress > 0 && exportProgress < 100}>
                <Download className="mr-2 h-4 w-4" />
                Export Products
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadTemplate("csv")}>
                  Quick CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadTemplate("xlsx")}>
                  Quick Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Track your recent import operations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.filename}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>
                  <TableCell>{item.records}</TableCell>
                  <TableCell>{item.errors || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      {item.errors && <Button variant="ghost" size="sm">Errors</Button>}
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