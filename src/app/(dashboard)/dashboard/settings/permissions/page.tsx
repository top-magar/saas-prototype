"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, Plus, Edit, Trash2, Crown, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER";
  status: "active" | "inactive";
  lastLogin: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const users: User[] = [
  { id: "1", name: "Rajesh Sharma", email: "rajesh@pasaal.io", role: "ADMIN", status: "active", lastLogin: "2024-01-15" },
  { id: "2", name: "Priya Patel", email: "priya@pasaal.io", role: "MANAGER", status: "active", lastLogin: "2024-01-14" },
  { id: "3", name: "Amit Kumar", email: "amit@pasaal.io", role: "USER", status: "active", lastLogin: "2024-01-13" },
  { id: "4", name: "Sneha Thapa", email: "sneha@pasaal.io", role: "USER", status: "inactive", lastLogin: "2024-01-10" },
];

const roles: Role[] = [
  { id: "admin", name: "Administrator", description: "Full system access", userCount: 1, permissions: ["all"], color: "bg-red-500" },
  { id: "manager", name: "Manager", description: "Manage products and orders", userCount: 1, permissions: ["products", "orders", "customers"], color: "bg-blue-500" },
  { id: "user", name: "User", description: "Basic access", userCount: 2, permissions: ["dashboard", "profile"], color: "bg-green-500" },
];

const permissions: Permission[] = [
  { id: "dashboard", name: "Dashboard Access", description: "View dashboard and analytics", category: "General" },
  { id: "products", name: "Product Management", description: "Create, edit, delete products", category: "Products" },
  { id: "orders", name: "Order Management", description: "View and manage orders", category: "Orders" },
  { id: "customers", name: "Customer Management", description: "View and manage customers", category: "Customers" },
  { id: "analytics", name: "Analytics Access", description: "View detailed analytics", category: "Analytics" },
  { id: "settings", name: "System Settings", description: "Modify system settings", category: "Administration" },
  { id: "users", name: "User Management", description: "Manage users and permissions", category: "Administration" },
  { id: "billing", name: "Billing Access", description: "View and manage billing", category: "Administration" },
];

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    admin: ["dashboard", "products", "orders", "customers", "analytics", "settings", "users", "billing"],
    manager: ["dashboard", "products", "orders", "customers", "analytics"],
    user: ["dashboard"],
  }
  );

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: { variant: "destructive" as const, icon: Crown },
      MANAGER: { variant: "default" as const, icon: UserCheck },
      USER: { variant: "secondary" as const, icon: Users },
    };
    const config = variants[role as keyof typeof variants];
    const Icon = config.icon;
    return (
    
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {role}
      </Badge>
        
  );
  };

  const getStatusBadge = (status: string) => {
    return (
    
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status}
      </Badge>
        
  );
  };

  const handlePermissionChange = (roleId: string, permissionId: string, checked: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: checked 
        ? [...(prev[roleId] || []), permissionId]
        : (prev[roleId] || []).filter(p => p !== permissionId)
    })    
  );
  };

  const savePermissions = () => {
    toast.success("Permissions updated successfully"    
  );
  };

  const inviteUser = () => {
    toast.success("Invitation sent successfully"    
  );
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission    
  );
    return acc;
  }, {} as Record<string, Permission[]>    
  );

  return (
    
    <div className="flex flex-col gap-6 p-4 lg:p-6">


      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Manage user roles and access levels</CardDescription>
                </div>
                <Button onClick={inviteUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                    <Badge variant="secondary">{role.userCount} users</Badge>
                  </div>
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Role</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Permission Settings
                    </CardTitle>
                    <CardDescription>Configure permissions for the selected role</CardDescription>
                  </div>
                  <Button onClick={savePermissions}>Save Changes</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {category}
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {perms.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={permission.id}
                              checked={rolePermissions[selectedRole]?.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(selectedRole, permission.id, checked as boolean)
                              }
                            />
                            <div className="flex-1">
                              <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                {permission.name}
                              </label>
                              <p className="text-xs text-muted-foreground mt-1">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
      
  );
}