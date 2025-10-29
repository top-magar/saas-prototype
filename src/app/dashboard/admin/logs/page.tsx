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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SearchIcon, DownloadIcon } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "Info" | "Warning" | "Error" | "Debug";
  message: string;
  source: string;
}

const allLogs: LogEntry[] = [
  { id: "1", timestamp: "2023-10-26 10:00:00", level: "Info", message: "User 'admin' logged in.", source: "AuthService" },
  { id: "2", timestamp: "2023-10-26 10:01:15", level: "Debug", message: "Database query executed successfully.", source: "UserService" },
  { id: "3", timestamp: "2023-10-26 10:02:30", level: "Warning", message: "API rate limit approaching for integration X.", source: "IntegrationService" },
  { id: "4", timestamp: "2023-10-26 10:03:45", level: "Error", message: "Failed to process payment for order #12345.", source: "PaymentGateway" },
  { id: "5", timestamp: "2023-10-26 10:04:00", level: "Info", message: "New product 'Super Widget' created.", source: "ProductService" },
  { id: "6", timestamp: "2023-10-26 10:05:20", level: "Info", message: "User 'editor' updated product #54321.", source: "ProductService" },
  { id: "7", timestamp: "2023-10-26 10:06:05", level: "Warning", message: "Disk space low on server 'app-01'.", source: "SystemMonitor" },
  { id: "8", timestamp: "2023-10-26 10:07:10", level: "Error", message: "Unhandled exception in background job 'report_gen'.", source: "JobScheduler" },
  { id: "9", timestamp: "2023-10-26 10:08:30", level: "Info", message: "Webhook 'order.created' triggered successfully.", source: "WebhookService" },
  { id: "10", timestamp: "2023-10-26 10:09:45", level: "Debug", message: "Cache invalidated for user settings.", source: "CacheService" },
  { id: "11", timestamp: "2023-10-26 10:10:00", level: "Info", message: "User 'viewer' accessed analytics dashboard.", source: "AuthService" },
];

const ITEMS_PER_PAGE = 5;

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      filterLevel === "All" || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">System Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Monitor application logs for issues and events.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
                <SelectItem value="Debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" /> Download Logs
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.level === "Error"
                          ? "destructive"
                          : log.level === "Warning"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell className="font-mono text-xs">{log.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
