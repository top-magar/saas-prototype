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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, SaveIcon } from "lucide-react";

interface UserPermission {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
}

interface PermissionCategory {
  id: string;
  name: string;
  permissions: { id: string; name: string; enabled: boolean }[];
}

const initialUsers: UserPermission[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: "3", name: "Peter Jones", email: "peter@example.com", role: "Viewer" },
];

const initialPermissions: PermissionCategory[] = [
  {
    id: "dashboard",
    name: "Dashboard Access",
    permissions: [
      { id: "view_overview", name: "View Overview", enabled: true },
      { id: "view_analytics", name: "View Analytics", enabled: true },
    ],
  },
  {
    id: "products",
    name: "Product Management",
    permissions: [
      { id: "create_product", name: "Create Products", enabled: false },
      { id: "edit_product", name: "Edit Products", enabled: true },
      { id: "delete_product", name: "Delete Products", enabled: false },
    ],
  },
  {
    id: "users",
    name: "User Management",
    permissions: [
      { id: "manage_roles", name: "Manage Roles", enabled: true },
      { id: "add_users", name: "Add New Users", enabled: false },
    ],
  },
];

export default function PermissionsPage() {
  const [users, setUsers] = useState<UserPermission[]>(initialUsers);
  const [permissions, setPermissions] = useState<PermissionCategory[]>(initialPermissions);

  const handleRoleChange = (userId: string, newRole: UserPermission["role"]) => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
  };

  const handlePermissionChange = (
    categoryId: string,
    permissionId: string,
    enabled: boolean
  ) => {
    setPermissions(
      permissions.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              permissions: category.permissions.map((perm) =>
                perm.id === permissionId ? { ...perm, enabled } : perm
              ),
            }
          : category
      )
    );
  };

  const handleSavePermissions = () => {
    console.log("Saving permissions:", { users, permissions });
    // In a real app, this would involve an API call to save permissions
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Permissions & Roles</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Assign roles to users to define their access levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => handleRoleChange(user.id, newRole as UserPermission["role"])}
                    >
                      <SelectTrigger className="w-[180px]">
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
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4">
            <PlusIcon className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Granular Permissions</CardTitle>
          <CardDescription>Define specific permissions for each role.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {permissions.map((category) => (
            <div key={category.id} className="grid gap-2">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              {category.permissions.map((perm) => (
                <div key={perm.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={perm.id}
                    checked={perm.enabled}
                    onCheckedChange={(checked) => handlePermissionChange(category.id, perm.id, checked as boolean)}
                  />
                  <label
                    htmlFor={perm.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {perm.name}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <Button className="mt-4" onClick={handleSavePermissions}>
            <SaveIcon className="mr-2 h-4 w-4" /> Save Permissions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
