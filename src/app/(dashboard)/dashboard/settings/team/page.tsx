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
}
from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Pencil, Trash } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Pending Invitation";
}

const initialTeamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Peter Jones", email: "peter@example.com", role: "Viewer", status: "Pending Invitation" },
];

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamMember["role"]>("Viewer");

  const handleInviteMember = async () => {
    if (!newMemberEmail || !newMemberRole) return;
    
    try {
      const newMember: TeamMember = {
        id: String(teamMembers.length + 1),
        name: newMemberEmail.split("@")[0],
        email: newMemberEmail,
        role: newMemberRole,
        status: "Pending Invitation",
      };
      
      // API call to send invitation
      await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newMemberEmail, role: newMemberRole })
      });
      
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail("");
      setNewMemberRole("Viewer");
    } catch (error) {
      // Handle invitation error
    }
  };

  const handleRoleChange = (memberId: string, newRole: TeamMember["role"]) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // API call to remove member
      await fetch(`/api/team/members/${memberId}`, { method: 'DELETE' });
      setTeamMembers(teamMembers.filter((member) => member.id !== memberId));
    } catch (error) {
      // Handle removal error
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">Team Members</h1>

      <Card>
        <CardHeader>
          <CardTitle>Manage Team</CardTitle>
          <CardDescription>Invite and manage your team members.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New Team Member</DialogTitle>
                  <DialogDescription>
                    Enter the email and assign a role for the new team member.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <FieldContent>
                      <Input
                        type="email"
                        placeholder="member@example.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <FieldContent>
                      <Select value={newMemberRole} onValueChange={(value) => setNewMemberRole(value as TeamMember["role"])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                </div>
                <DialogFooter>
                  <Button onClick={handleInviteMember}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(newRole) => handleRoleChange(member.id, newRole as TeamMember["role"])}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon-sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleRemoveMember(member.id)}
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
