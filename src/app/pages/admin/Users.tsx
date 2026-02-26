import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Search, CheckCircle2, UserX, UserCheck, Eye, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../../components/ui/EmptyState";

type Role = "Mentor" | "Mentee" | "Admin";
type Status = "Active" | "Pending" | "Suspended";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  avatar: string;
  joinDate: string;
  sessions: number;
};

const PER_PAGE = 8;

const initialUsers: User[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", joinDate: "Jan 15, 2026", sessions: 45 },
  { id: 2, name: "Michael Chen", email: "michael.c@example.com", role: "Mentee", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", joinDate: "Feb 1, 2026", sessions: 12 },
  { id: 3, name: "Emily Rodriguez", email: "emily.r@example.com", role: "Mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", joinDate: "Dec 20, 2025", sessions: 67 },
  { id: 4, name: "Alex Kumar", email: "alex.k@example.com", role: "Mentee", status: "Suspended", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", joinDate: "Jan 8, 2026", sessions: 5 },
  { id: 5, name: "Jessica Park", email: "jessica.p@example.com", role: "Mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", joinDate: "Nov 12, 2025", sessions: 89 },
  { id: 6, name: "David Kim", email: "david.k@example.com", role: "Admin", status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", joinDate: "Oct 1, 2025", sessions: 0 },
  { id: 7, name: "Rachel Green", email: "rachel.g@example.com", role: "Mentee", status: "Pending", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", joinDate: "Feb 10, 2026", sessions: 0 },
  { id: 8, name: "James Wilson", email: "james.w@example.com", role: "Mentor", status: "Pending", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", joinDate: "Feb 12, 2026", sessions: 0 },
  { id: 9, name: "Maria Garcia", email: "maria.g@example.com", role: "Mentee", status: "Active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", joinDate: "Jan 22, 2026", sessions: 8 },
  { id: 10, name: "Chris Taylor", email: "chris.t@example.com", role: "Mentor", status: "Suspended", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", joinDate: "Sep 5, 2025", sessions: 34 },
  { id: 11, name: "Amy Lee", email: "amy.l@example.com", role: "Admin", status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", joinDate: "Aug 15, 2025", sessions: 0 },
  { id: 12, name: "Kevin Brown", email: "kevin.b@example.com", role: "Mentee", status: "Pending", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", joinDate: "Feb 14, 2026", sessions: 0 },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [userForAction, setUserForAction] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const totalUsers = users.length;
  const totalMentors = users.filter((u) => u.role === "Mentor").length;
  const totalMentees = users.filter((u) => u.role === "Mentee").length;
  const pendingApproval = users.filter((u) => u.status === "Pending").length;

  const handleApprove = (user: User) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "Active" as Status } : u)));
    toast.success(`${user.name} has been approved.`);
  };

  const openSuspendDialog = (user: User) => {
    setUserForAction(user);
    setSuspendDialogOpen(true);
  };

  const handleSuspendConfirm = () => {
    if (!userForAction) return;
    const nextStatus: Status = userForAction.status === "Active" ? "Suspended" : "Active";
    setUsers((prev) => prev.map((u) => (u.id === userForAction.id ? { ...u, status: nextStatus } : u)));
    toast.success(nextStatus === "Suspended" ? `${userForAction.name} has been suspended.` : `${userForAction.name} has been activated.`);
    setSuspendDialogOpen(false);
    setUserForAction(null);
  };

  const handleViewProfile = (user: User) => {
    toast.info(`View profile for ${user.name}`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Badge className="bg-indigo-50 text-indigo-600 border-0 text-sm font-semibold">
            {totalUsers} users
          </Badge>
        </div>
        <p className="text-gray-600 mt-1">Manage platform users and permissions</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-0 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Total Mentors</p>
          <p className="text-2xl font-bold text-gray-900">{totalMentors}</p>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Total Mentees</p>
          <p className="text-2xl font-bold text-gray-900">{totalMentees}</p>
        </Card>
        <Card className="p-5 border-0 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
          <p className="text-2xl font-bold text-orange-600">{pendingApproval}</p>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        {/* Filter bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
            >
              <option value="All">All roles</option>
              <option value="Mentor">Mentors</option>
              <option value="Mentee">Mentees</option>
              <option value="Admin">Admins</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <div className="p-8">
                      <EmptyState
                        icon={<Users size={48} />}
                        title="No users found"
                        subtitle="Try adjusting your search or filter criteria to find users."
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "Mentor"
                            ? "bg-indigo-50 text-indigo-600 border-0"
                            : user.role === "Admin"
                              ? "bg-purple-50 text-purple-600 border-0"
                              : "bg-gray-100 text-gray-700 border-0"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border-0"
                            : user.status === "Pending"
                              ? "bg-yellow-50 text-yellow-600 border-0"
                              : "bg-red-50 text-red-600 border-0"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{user.sessions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600 hover:text-emerald-700 hover:border-emerald-300"
                            onClick={() => handleApprove(user)}
                          >
                            <CheckCircle2 size={16} className="mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className={
                            user.status === "Suspended"
                              ? "text-emerald-600 hover:text-emerald-700"
                              : "text-red-600 hover:text-red-700 hover:border-red-300"
                          }
                          onClick={() => openSuspendDialog(user)}
                        >
                          {user.status === "Suspended" ? (
                            <>
                              <UserCheck size={16} className="mr-1" />
                              Activate
                            </>
                          ) : (
                            <>
                              <UserX size={16} className="mr-1" />
                              Suspend
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewProfile(user)}
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filtered.length > PER_PAGE && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Suspend / Activate confirmation */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userForAction?.status === "Active" ? "Suspend user?" : "Activate user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userForAction?.status === "Active"
                ? `Are you sure you want to suspend ${userForAction?.name}? They will not be able to access the platform until activated.`
                : `Are you sure you want to activate ${userForAction?.name}? They will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserForAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspendConfirm}
              className={userForAction?.status === "Active" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
            >
              {userForAction?.status === "Active" ? "Suspend" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
