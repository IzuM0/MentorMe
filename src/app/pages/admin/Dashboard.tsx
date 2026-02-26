import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Users, Video, TrendingUp, DollarSign, Activity, UserCheck } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "10,543", change: "+12.5%", icon: Users, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { label: "Active Sessions", value: "234", change: "+8.2%", icon: Video, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Revenue", value: "$45.2K", change: "+23.1%", icon: DollarSign, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Growth Rate", value: "18.5%", change: "+2.4%", icon: TrendingUp, iconBg: "bg-orange-50", iconColor: "text-orange-600" }
  ];

  const chartData = [
    { name: "Jan", users: 4000, sessions: 2400, revenue: 2400 },
    { name: "Feb", users: 3000, sessions: 1398, revenue: 2210 },
    { name: "Mar", users: 2000, sessions: 9800, revenue: 2290 },
    { name: "Apr", users: 2780, sessions: 3908, revenue: 2000 },
    { name: "May", users: 1890, sessions: 4800, revenue: 2181 },
    { name: "Jun", users: 2390, sessions: 3800, revenue: 2500 }
  ];

  const recentActivity = [
    { user: "Sarah Johnson", action: "Completed a session", time: "5 min ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { user: "Michael Chen", action: "Joined as new mentee", time: "12 min ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { user: "Emily Rodriguez", action: "Rated a mentor 5 stars", time: "23 min ago", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    { user: "Alex Kumar", action: "Became a verified mentor", time: "1 hour ago", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-0">
                {stat.change}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Session Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Bar dataKey="sessions" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
