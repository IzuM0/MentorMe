import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signUp, isLoading } = useAuth();
  const [role, setRole] = useState<"mentee" | "mentor">("mentee");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    bio: "",
    experience: "",
  });

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user) {
      const dashboard =
        user.role === "mentee"
          ? "/dashboard"
          : user.role === "mentor"
            ? "/mentor/dashboard"
            : "/admin/dashboard";
      navigate(dashboard, { replace: true });
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { sessionCreated } = await signUp(
        formData.email.trim(),
        formData.password,
        { name: formData.name.trim() || "New User", role }
      );
      if (sessionCreated) {
        toast.success("Account created successfully! Welcome to MentorMe!");
        if (role === "mentee") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/mentor/dashboard", { replace: true });
        }
      } else {
        toast.success("Check your email to confirm your account, then sign in.");
        navigate("/login", { replace: true });
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Sign up failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to home</span>
        </Link>

        <Card className="p-8 border-0 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">MentorMe</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join thousands growing their careers</p>
          </div>

          <div className="mb-8">
            <Label className="mb-3 block">I want to join as</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("mentee")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  role === "mentee"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Mentee</div>
                <div className="text-sm text-gray-600">I'm looking for guidance</div>
              </button>
              <button
                type="button"
                onClick={() => setRole("mentor")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  role === "mentor"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Mentor</div>
                <div className="text-sm text-gray-600">I want to share my expertise</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {role === "mentor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="5"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills & Expertise</Label>
                  <Input
                    id="skills"
                    type="text"
                    placeholder="React, Node.js, Product Management"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
              </>
            )}

            {role === "mentee" && (
              <div className="space-y-2">
                <Label htmlFor="skills">Areas of Interest</Label>
                <Input
                  id="skills"
                  type="text"
                  placeholder="Web Development, Career Growth, Leadership"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">
                {role === "mentor"
                  ? "Professional Bio"
                  : "Tell us about yourself"}
              </Label>
              <Textarea
                id="bio"
                placeholder={
                  role === "mentor"
                    ? "Share your background and what you can help with..."
                    : "What are your goals and what do you want to learn?"
                }
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              By signing up, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-700">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-700">
                Privacy Policy
              </a>
            </p>
          </form>

          <p className="text-center text-gray-600 mt-6 pt-6 border-t border-gray-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
