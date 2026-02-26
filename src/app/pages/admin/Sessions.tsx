import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, Calendar, Filter } from "lucide-react";

type SessionStatus = "Scheduled" | "Completed" | "Cancelled";

type Session = {
  id: number;
  mentor: string;
  mentee: string;
  date: string;
  time: string;
  duration: string;
  status: SessionStatus;
};

const allSessions: Session[] = [
  { id: 1, mentor: "Dr. Sarah Johnson", mentee: "Michael Chen", date: "Feb 18, 2026", time: "2:00 PM", duration: "60 min", status: "Scheduled" },
  { id: 2, mentor: "Michael Chen", mentee: "Emily Rodriguez", date: "Feb 18, 2026", time: "10:00 AM", duration: "45 min", status: "Scheduled" },
  { id: 3, mentor: "Emily Rodriguez", mentee: "Alex Kumar", date: "Feb 17, 2026", time: "3:00 PM", duration: "60 min", status: "Completed" },
  { id: 4, mentor: "Dr. Sarah Johnson", mentee: "Jessica Park", date: "Feb 17, 2026", time: "11:00 AM", duration: "60 min", status: "Completed" },
  { id: 5, mentor: "Alex Kumar", mentee: "David Thompson", date: "Feb 16, 2026", time: "4:00 PM", duration: "45 min", status: "Completed" },
  { id: 6, mentor: "Jessica Park", mentee: "Sarah Williams", date: "Feb 16, 2026", time: "2:00 PM", duration: "60 min", status: "Cancelled" },
  { id: 7, mentor: "Dr. Sarah Johnson", mentee: "David Thompson", date: "Feb 15, 2026", time: "1:00 PM", duration: "60 min", status: "Completed" },
  { id: 8, mentor: "Michael Chen", mentee: "Alex Kumar", date: "Feb 15, 2026", time: "9:00 AM", duration: "45 min", status: "Completed" },
  { id: 9, mentor: "Emily Rodriguez", mentee: "Michael Chen", date: "Feb 20, 2026", time: "3:00 PM", duration: "60 min", status: "Scheduled" },
  { id: 10, mentor: "Alex Kumar", mentee: "Emily Rodriguez", date: "Feb 19, 2026", time: "10:00 AM", duration: "45 min", status: "Scheduled" },
  { id: 11, mentor: "Jessica Park", mentee: "Alex Kumar", date: "Feb 14, 2026", time: "2:30 PM", duration: "60 min", status: "Completed" },
  { id: 12, mentor: "Dr. Sarah Johnson", mentee: "Sarah Williams", date: "Feb 21, 2026", time: "4:00 PM", duration: "60 min", status: "Scheduled" },
];

export default function AdminSessions() {
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = allSessions.filter((session) => {
    if (statusFilter && session.status !== statusFilter) return false;
    const matchSearch =
      !searchQuery ||
      session.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.mentee.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (dateFrom || dateTo) {
      const sessionDate = new Date(session.date);
      if (dateFrom && sessionDate < new Date(dateFrom)) return false;
      if (dateTo && sessionDate > new Date(dateTo)) return false;
    }
    return true;
  });

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions</h1>
        <p className="text-gray-600">View and manage all mentorship sessions across the platform</p>
      </div>

      <Card className="border-0 shadow-lg">
        {/* Filter bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search mentor or mentee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SessionStatus | "")}
              className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No sessions match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium text-gray-900">{session.mentor}</TableCell>
                    <TableCell className="text-gray-600">{session.mentee}</TableCell>
                    <TableCell className="text-gray-600">{session.date}</TableCell>
                    <TableCell className="text-gray-600">{session.time}</TableCell>
                    <TableCell className="text-gray-600">{session.duration}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          session.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600 border-0"
                            : session.status === "Scheduled"
                              ? "bg-indigo-50 text-indigo-600 border-0"
                              : "bg-red-50 text-red-600 border-0"
                        }
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
