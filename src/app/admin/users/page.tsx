"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      toast("User created", "success");
      setShowCreate(false);
      setNewUser({ name: "", email: "", password: "", role: "editor" });
      fetchUsers();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to create user", "error");
    }
  }

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "editor" : "admin";
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    toast(`Role changed to ${newRole}`, "success");
    fetchUsers();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      toast("User deleted", "success");
    } else {
      const err = await res.json();
      toast(err.error || "Failed to delete", "error");
    }
    setDeleteId(null);
    fetchUsers();
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-void-elevated" />
        <div className="h-48 rounded bg-void-elevated" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-void-heading">Users</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          Add User
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-void-border text-left">
              <th className="pb-3 pr-4 text-xs font-medium text-void-muted">
                Name
              </th>
              <th className="hidden pb-3 pr-4 text-xs font-medium text-void-muted sm:table-cell">
                Email
              </th>
              <th className="pb-3 pr-4 text-xs font-medium text-void-muted">
                Role
              </th>
              <th className="hidden pb-3 pr-4 text-xs font-medium text-void-muted md:table-cell">
                Joined
              </th>
              <th className="pb-3 text-xs font-medium text-void-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-void-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-3 pr-4 text-void-text">{user.name}</td>
                <td className="hidden py-3 pr-4 text-void-muted sm:table-cell">
                  {user.email}
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    variant={user.role === "admin" ? "warning" : "default"}
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="hidden py-3 pr-4 text-void-muted md:table-cell">
                  {formatDate(user.createdAt)}
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRole(user.id, user.role)}
                    >
                      Make {user.role === "admin" ? "editor" : "admin"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteId(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create user dialog */}
      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add User"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            id="name"
            label="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
            required
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-void-subtle">
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="w-full rounded-md border border-void-border bg-void-surface px-3 py-2 text-sm text-void-text focus:border-void-border-hover focus:outline-none"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete User"
      >
        <p className="text-sm text-void-muted">
          Are you sure? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
