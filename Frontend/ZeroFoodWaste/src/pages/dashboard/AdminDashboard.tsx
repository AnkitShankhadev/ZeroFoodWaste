import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Gift,
  Trash2,
  Search,
  Filter,
  Shield,
  Package,
  Calendar,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

type UserRole = "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN";
type UserStatus = "ACTIVE" | "BANNED" | "INACTIVE";

interface User {
  id?: string;
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  totalPoints: number;
  phone?: string;
  createdAt: string;
  location?: {
    address?: string;
  };
}

interface Donation {
  _id: string;
  foodType: string;
  quantity: string;
  status: "CREATED" | "ACCEPTED" | "ASSIGNED" | "DELIVERED" | "CANCELLED" | "EXPIRED";
  expiryDate: string;
  createdAt: string;
  donorId?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  acceptedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  assignedVolunteer?: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

const roleColors: Record<UserRole, string> = {
  ADMIN: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  NGO: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  VOLUNTEER: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  DONOR: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
};

const statusColors: Record<UserStatus | string, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  BANNED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  INACTIVE: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  CREATED: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  ASSIGNED: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  DELIVERED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  CANCELLED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
  EXPIRED: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
};

const CHART_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

const AdminDashboard = () => {
  const { user: currentAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "donations">("overview");
  
  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);
  
  // Filters and Search
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("ALL");
  
  const [donationSearch, setDonationSearch] = useState("");
  const [donationStatusFilter, setDonationStatusFilter] = useState<string>("ALL");

  // Confirmation Modals
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null);
  const [confirmDeleteDonation, setConfirmDeleteDonation] = useState<string | null>(null);

  // Fetch users and donations
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await api.getUsers();
      if (response.success) {
        setUsers(response.data?.users || []);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadDonations = async () => {
    setIsLoadingDonations(true);
    try {
      const response = await api.getDonations({ limit: 100 });
      if (response.success) {
        setDonations(response.data?.donations || []);
      }
    } catch (err: any) {
      console.error("Failed to load donations:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch donations.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDonations(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadDonations();
  }, []);

  // Update role handler
  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const response = await api.updateUserRole(userId, newRole);
      if (response.success) {
        toast({
          title: "Success",
          description: `User role updated to ${newRole}.`,
        });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update role.",
        variant: "destructive",
      });
    }
  };

  // Update status handler
  const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
    try {
      const response = await api.updateUserStatus(userId, newStatus);
      if (response.success) {
        toast({
          title: "Success",
          description: `User status updated to ${newStatus}.`,
        });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await api.deleteUser(userId);
      if (response.success) {
        toast({
          title: "Success",
          description: "User deleted successfully.",
        });
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setConfirmDeleteUser(null);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  // Delete donation handler
  const handleDeleteDonation = async (donationId: string) => {
    try {
      const response = await api.deleteDonation(donationId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Donation deleted successfully.",
        });
        setDonations((prev) => prev.filter((d) => d._id !== donationId));
        setConfirmDeleteDonation(null);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete donation.",
        variant: "destructive",
      });
    }
  };

  // Compute stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalDonations = donations.length;
    
    const activeDonations = donations.filter(
      (d) => d.status === "CREATED" || d.status === "ACCEPTED" || d.status === "ASSIGNED"
    ).length;
    
    const totalPoints = users.reduce((sum, u) => sum + (u.totalPoints || 0), 0);

    // Roles distribution
    const rolesCount = users.reduce(
      (acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      },
      { DONOR: 0, NGO: 0, VOLUNTEER: 0, ADMIN: 0 } as Record<UserRole, number>
    );

    // Donations status distribution
    const statusCount = donations.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rolesData = Object.keys(rolesCount).map((role) => ({
      name: role,
      value: rolesCount[role as UserRole],
    }));

    const statusData = Object.keys(statusCount).map((status) => ({
      name: status,
      value: statusCount[status],
    }));

    return {
      totalUsers,
      totalDonations,
      activeDonations,
      totalPoints,
      rolesData,
      statusData,
    };
  }, [users, donations]);

  // Filtered lists
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearch));
      
      const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      const matchesStatus = userStatusFilter === "ALL" || u.status === userStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, userSearch, userRoleFilter, userStatusFilter]);

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchesSearch =
        d.foodType.toLowerCase().includes(donationSearch.toLowerCase()) ||
        (d.donorId?.name && d.donorId.name.toLowerCase().includes(donationSearch.toLowerCase()));

      const matchesStatus =
        donationStatusFilter === "ALL" || d.status === donationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [donations, donationSearch, donationStatusFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Greeting Banner — same style as all other dashboards */}
          <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-primary to-accent shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
            />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-8 md:p-10">
              <div>
                <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-widest mb-1">
                  Admin Dashboard
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight">
                  Welcome, {currentAdmin?.name?.split(" ")[0] || "Admin"}
                </h1>
                <p className="text-primary-foreground/60 mt-2 text-base">
                  Manage users, oversee donations, update roles, and evaluate impact metrics.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
                <Shield className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Logged in as</p>
                  <p className="font-bold text-primary-foreground">{currentAdmin?.name || "System Admin"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid — same pattern as DonorDashboard / NGO / Volunteer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Registered Users",
                value: stats.totalUsers.toString(),
                change: "Donors, NGOs, and Volunteers",
                color: "text-primary",
                bg: "bg-primary/10",
                icon: Users,
              },
              {
                title: "Total Food Donations",
                value: stats.totalDonations.toString(),
                change: "All submitted listings",
                color: "text-emerald-600",
                bg: "bg-emerald-100",
                icon: Gift,
              },
              {
                title: "Active Food Listings",
                value: stats.activeDonations.toString(),
                change: "Pending · Accepted · Assigned",
                color: "text-amber-600",
                bg: "bg-amber-100",
                icon: Package,
              },
              {
                title: "Impact Points Issued",
                value: stats.totalPoints.toLocaleString(),
                change: "Earned by the whole community",
                color: "text-blue-600",
                bg: "bg-blue-100",
                icon: Award,
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          {card.title}
                        </p>
                        <p className="text-4xl font-black text-foreground tracking-tight">
                          {card.value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1.5">
                          {card.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-2xl ${card.bg} flex-shrink-0`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 p-1 bg-muted rounded-2xl w-full max-w-md mb-8 border border-border">
            {(["overview", "users", "donations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative py-2.5 px-4 flex-1 text-sm font-semibold rounded-xl transition-colors focus:outline-none capitalize text-center"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeAdminTab"
                    className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {tab}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Users Role Chart */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Users by Platform Role
                    </CardTitle>
                    <CardDescription>
                      Distribution of accounts across Donors, NGOs, Volunteers, and Admins.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    {stats.totalUsers === 0 ? (
                      <p className="text-muted-foreground text-sm">No data available</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.rolesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.rolesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} Accounts`, "Count"]} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Donations Status Chart */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      Food Donation Life Cycle
                    </CardTitle>
                    <CardDescription>
                      Status distribution of all active, accepted, completed, or cancelled donations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    {stats.totalDonations === 0 ? (
                      <p className="text-muted-foreground text-sm">No data available</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip formatter={(value) => [`${value} Donations`, "Count"]} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {stats.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Users Action Toolbar */}
                <Card className="border-border">
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name, email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-9 h-10 rounded-xl"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Role:</span>
                      </div>
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="h-10 rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
                      >
                        <option value="ALL">All Roles</option>
                        <option value="DONOR">Donor</option>
                        <option value="NGO">NGO</option>
                        <option value="VOLUNTEER">Volunteer</option>
                        <option value="ADMIN">Admin</option>
                      </select>

                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Status:</span>
                      </div>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="h-10 rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BANNED">Banned</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Users List Card */}
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    {isLoadingUsers ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        Loading users...
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-12 text-center text-sm text-muted-foreground">
                        No users found matching the search criteria.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Points</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Signed Up</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground">{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                  {user.phone && <span className="text-[10px] text-muted-foreground/80 mt-0.5">{user.phone}</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-sm">
                                {user.totalPoints ?? 0} pts
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateRole(user._id, e.target.value as UserRole)}
                                  disabled={user._id === currentAdmin?.id}
                                  className="h-8 rounded-lg border border-border bg-background px-2.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                                >
                                  <option value="DONOR">Donor</option>
                                  <option value="NGO">NGO</option>
                                  <option value="VOLUNTEER">Volunteer</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={user.status}
                                  onChange={(e) => handleUpdateStatus(user._id, e.target.value as UserStatus)}
                                  disabled={user._id === currentAdmin?.id}
                                  className={`h-8 rounded-lg border border-border px-2.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium ${
                                    user.status === "ACTIVE"
                                      ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                                      : user.status === "BANNED"
                                      ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                  }`}
                                >
                                  <option value="ACTIVE">Active</option>
                                  <option value="BANNED">Banned</option>
                                  <option value="INACTIVE">Inactive</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={user._id === currentAdmin?.id}
                                  onClick={() => setConfirmDeleteUser(user._id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "donations" && (
              <motion.div
                key="donations-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Donations Action Toolbar */}
                <Card className="border-border">
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search donations by food type or donor..."
                        value={donationSearch}
                        onChange={(e) => setDonationSearch(e.target.value)}
                        className="pl-9 h-10 rounded-xl"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Status:</span>
                      <select
                        value={donationStatusFilter}
                        onChange={(e) => setDonationStatusFilter(e.target.value)}
                        className="h-10 rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px]"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="CREATED">Pending</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="EXPIRED">Expired</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Donations List Card */}
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    {isLoadingDonations ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        Loading donations...
                      </div>
                    ) : filteredDonations.length === 0 ? (
                      <div className="p-12 text-center text-sm text-muted-foreground">
                        No food donations found matching the search criteria.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <th className="px-6 py-4">Donation Details</th>
                            <th className="px-6 py-4">Quantity</th>
                            <th className="px-6 py-4">Donor</th>
                            <th className="px-6 py-4">Accepted By / Volunteer</th>
                            <th className="px-6 py-4">Expiry Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredDonations.map((donation) => (
                            <tr key={donation._id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground">{donation.foodType}</span>
                                  <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[200px]">
                                    ID: {donation._id}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-sm">
                                {donation.quantity}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">
                                    {donation.donorId?.name || "System Seed/Deleted"}
                                  </span>
                                  {donation.donorId?.email && (
                                    <span className="text-xs text-muted-foreground">{donation.donorId.email}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs">
                                <div className="flex flex-col gap-0.5">
                                  {donation.acceptedBy ? (
                                    <span className="text-foreground">
                                      <span className="font-semibold text-muted-foreground uppercase text-[10px]">NGO:</span> {donation.acceptedBy.name}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground/60 italic">Unaccepted</span>
                                  )}
                                  {donation.assignedVolunteer && (
                                    <span className="text-foreground">
                                      <span className="font-semibold text-muted-foreground uppercase text-[10px]">Rider:</span> {donation.assignedVolunteer.name}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">
                                {new Date(donation.expiryDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className={`text-xs ${statusColors[donation.status]}`}>
                                  {donation.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setConfirmDeleteDonation(donation._id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Confirmation Modal: Delete User */}
      <AnimatePresence>
        {confirmDeleteUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border p-6 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete User Account</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you absolutely sure you want to delete this user? This action is permanent and will remove their point history, profile details, and role assignments.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setConfirmDeleteUser(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(confirmDeleteUser)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal: Delete Donation */}
      <AnimatePresence>
        {confirmDeleteDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border p-6 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Donation Record</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete this donation listing? Regular users can only delete unaccepted listings, but as admin you are bypassing status constraints.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setConfirmDeleteDonation(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteDonation(confirmDeleteDonation)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Delete Listing
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
