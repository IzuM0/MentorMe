import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Save } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { fetchProfile, updateProfile, type Profile } from "../../../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

function parseList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatList(arr: string[]): string {
  return (arr ?? []).join(", ");
}

export default function MenteeSettings() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roleSaving, setRoleSaving] = useState(false);
  const [accountRole, setAccountRole] = useState<"mentee" | "mentor">("mentee");
  const [form, setForm] = useState({
    name: "",
    bio: "",
    gender: "",
    skillsText: "",
    goalsText: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    sessionReminders: true,
    mentorMessages: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        setProfile(p);
        setAccountRole(
          p.role === "mentor" ? "mentor" : "mentee"
        );
        setForm({
          name: p.name ?? "",
          bio: p.bio ?? "",
          gender: p.gender ?? "",
          skillsText: formatList(p.skills ?? []),
          goalsText: formatList(p.goals ?? []),
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: form.name.trim() || undefined,
        bio: form.bio.trim() || undefined,
        gender: form.gender.trim() || undefined,
        skills: parseList(form.skillsText),
        goals: parseList(form.goalsText),
      });
      setProfile(updated);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAccountType = async () => {
    if (accountRole === (profile?.role === "mentor" ? "mentor" : "mentee")) return;
    setRoleSaving(true);
    try {
      await updateProfile({ role: accountRole });
      await refreshUser();
      toast.success(
        accountRole === "mentor"
          ? "You are now set as a mentor. Redirecting to mentor dashboard."
          : "You are now set as a mentee. Redirecting to dashboard."
      );
      navigate(accountRole === "mentor" ? "/mentor/dashboard" : "/dashboard", {
        replace: true,
      });
    } catch {
      toast.error("Failed to update account type");
    } finally {
      setRoleSaving(false);
    }
  };

  const layoutRole = (user?.role === "mentor" || user?.role === "admin") ? user.role : "mentee";

  return (
    <DashboardLayout role={layoutRole}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <>
                  <div className="flex items-center gap-6 mb-8">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatarUrl ?? DEFAULT_AVATAR} />
                      <AvatarFallback>{(profile?.name ?? user?.name ?? "U")[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-600">Profile photo can be updated later.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={form.gender}
                        onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                        placeholder="e.g. male, female, other, prefer not to say"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Areas of Interest / Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        value={form.skillsText}
                        onChange={(e) => setForm((f) => ({ ...f, skillsText: e.target.value }))}
                        placeholder="Web Development, Career Growth, Leadership"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goals">Goals (comma-separated)</Label>
                      <Input
                        id="goals"
                        value={form.goalsText}
                        onChange={(e) => setForm((f) => ({ ...f, goalsText: e.target.value }))}
                        placeholder="System Design, Interview prep, Leadership"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        rows={4}
                        placeholder="Tell us about yourself and your goals..."
                      />
                    </div>

                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <Save size={18} className="mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profile?.email ?? ""} disabled />
                  <p className="text-xs text-gray-500">Email is managed by your account provider.</p>
                </div>
                <div className="space-y-2">
                  <Label>Account type</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Choose whether you use MentorMe as a mentee (finding mentors) or a mentor (offering mentorship).
                  </p>
                  <Select
                    value={accountRole}
                    onValueChange={(v) => setAccountRole(v as "mentee" | "mentor")}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentee">Mentee</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleUpdateAccountType}
                    disabled={
                      roleSaving ||
                      accountRole === (profile?.role === "mentor" ? "mentor" : "mentee")
                    }
                  >
                    {roleSaving ? "Updating..." : "Update account type"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({ ...n, emailNotifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Session Reminders</p>
                    <p className="text-sm text-gray-600">Get reminded before your sessions</p>
                  </div>
                  <Switch
                    checked={notifications.sessionReminders}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({ ...n, sessionReminders: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Mentor Messages</p>
                    <p className="text-sm text-gray-600">Notifications when mentors message you</p>
                  </div>
                  <Switch
                    checked={notifications.mentorMessages}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({ ...n, mentorMessages: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Weekly Digest</p>
                    <p className="text-sm text-gray-600">Weekly summary of your activity</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({ ...n, weeklyDigest: checked }))
                    }
                  />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-6">
                  <Save size={18} className="mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
