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
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadIcon, DownloadIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ImportExportPage() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportScope, setExportScope] = useState("all");
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (importFile) {
      console.log("Importing file:", importFile.name);
      setImportProgress(0);
      const interval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      // In a real app, this would involve an API call to upload and process the file
    } else {
      alert("Please select a file to import.");
    }
  };

  const handleExport = () => {
    console.log("Exporting data:", { format: exportFormat, scope: exportScope });
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    // In a real app, this would involve an API call to generate and download the export file
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">Product Import/Export</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Import Products</CardTitle>
            <CardDescription>Upload a CSV or Excel file to import new products or update existing ones.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field>
              <FieldLabel>Select File</FieldLabel>
              <FieldContent>
                <Input type="file" accept=".csv, .xlsx" onChange={handleImportFileChange} />
                <FieldDescription>
                  Supported formats: CSV, XLSX. Max file size: 10MB.
                </FieldDescription>
              </FieldContent>
            </Field>
            {importFile && (
              <FieldDescription>Selected file: {importFile.name}</FieldDescription>
            )}
            {importProgress > 0 && importProgress < 100 && (
              <Progress value={importProgress} className="w-full" />
            )}
            {importProgress === 100 && (
              <FieldDescription className="text-green-500">Import complete!</FieldDescription>
            )}
            <Button onClick={handleImport} disabled={!importFile || (importProgress > 0 && importProgress < 100)}>
              <UploadIcon className="mr-2 h-4 w-4" /> Import Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Products</CardTitle>
            <CardDescription>Download your product data in various formats.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field>
              <FieldLabel>Export Format</FieldLabel>
              <FieldContent>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Data Scope</FieldLabel>
              <FieldContent>
                <Select value={exportScope} onValueChange={setExportScope}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="selected">Selected Categories</SelectItem>
                    <SelectItem value="filtered">Current View</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            {exportProgress > 0 && exportProgress < 100 && (
              <Progress value={exportProgress} className="w-full" />
            )}
            {exportProgress === 100 && (
              <FieldDescription className="text-green-500">Export ready for download!</FieldDescription>
            )}
            <Button onClick={handleExport} disabled={exportProgress > 0 && exportProgress < 100}>
              <DownloadIcon className="mr-2 h-4 w-4" /> Export Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
