"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  Store,
  User as UserIcon,
  Loader2,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAllUsers, useUpdateUserStatus } from "@/hooks/useAdminUser";
import { toast } from "sonner";

export default function UserManagementPage() {
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const { data: usersData, isLoading } = useAllUsers();
  const updateStatus = useUpdateUserStatus();

  const users = usersData?.data || [];

  const filteredUsers =
    roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);

  const roleTabs = [
    { label: "All Users", value: "ALL" },
    { label: "Customers", value: "Customer" },
    { label: "Providers", value: "Provider" },
    { label: "Admins", value: "Admin" },
  ];

  const handleToggleStatus = async (
    id: string,
    currentStatus: string,
    name: string
  ) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    if (
      !confirm(
        `Are you sure you want to change ${name}'s status to ${nextStatus}?`
      )
    )
      return;

    try {
      await updateStatus.mutateAsync({ id, active_status: nextStatus });
      toast.success(`User ${name} is now ${nextStatus}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <Badge className="flex items-center gap-1 bg-amber-500 text-white">
            <Shield className="h-3 w-3" /> Admin
          </Badge>
        );
      case "Provider":
        return (
          <Badge className="flex items-center gap-1 bg-blue-500 text-white">
            <Store className="h-3 w-3" /> Provider
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-emerald-600 text-emerald-600"
          >
            <UserIcon className="h-3 w-3" /> Customer
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          User Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all platform accounts and toggle active / inactive access
          statuses.
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-800">
        {roleTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              roleFilter === tab.value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Users className="mx-auto mb-2 h-12 w-12 text-slate-400" />
          <p className="text-sm text-slate-500">
            No users found under the selected role filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="flex items-center gap-2 p-4 font-bold text-slate-900 dark:text-slate-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4">
                      <Badge
                        className={
                          user.active_status === "Active"
                            ? "bg-emerald-500 font-bold text-white"
                            : "bg-red-500 font-bold text-white"
                        }
                      >
                        {user.active_status}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {user.role !== "Admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          className={
                            user.active_status === "Active"
                              ? "border-red-200 font-bold text-red-600 hover:bg-red-50"
                              : "border-blue-200 font-bold text-blue-600 hover:bg-blue-50"
                          }
                          onClick={() =>
                            handleToggleStatus(
                              user.id,
                              user.active_status,
                              user.name
                            )
                          }
                        >
                          <Power className="mr-1 h-3.5 w-3.5" />
                          {user.active_status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
