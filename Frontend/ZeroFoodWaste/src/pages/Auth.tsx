import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Users, 
  HandHeart,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type AuthMode = "login" | "register";
type UserRole = "donor" | "ngo" | "volunteer";

const roles = [
  { id: "donor" as UserRole, label: "Donor", icon: HandHeart, description: "Donate surplus food" },
  { id: "ngo" as UserRole, label: "NGO", icon: Building2, description: "Collect and distribute" },
  { id: "volunteer" as UserRole, label: "Volunteer", icon: Users, description: "Help with delivery" },
];

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>((searchParams.get("mode") as AuthMode) || "login");
  const [selectedRole, setSelectedRole] = useState<UserRole>((searchParams.get("role") as UserRole) || "donor");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const modeParam = searchParams.get("mode") as AuthMode;
    const roleParam = searchParams.get("role") as UserRole;
    if (modeParam) setMode(modeParam);
    if (roleParam) setSelectedRole(roleParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: mode === "login" ? "Welcome back!" : "Account created!",
      description: mode === "login" 
        ? "You've successfully logged in." 
        : `Your ${selectedRole} account has been created.`,
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Leaf className="w-7 h-7" />
              </div>
              <span className="text-3xl font-bold">ZeroFoodWaste</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {mode === "login" ? "Welcome Back!" : "Join Our Mission"}
            </h1>
            <p className="text-xl text-green-100">
              {mode === "login" 
                ? "Sign in to continue making a difference in your community."
                : "Create an account and start saving food today."}
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: "🍎", text: "50,000+ kg of food saved" },
              { icon: "🤝", text: "10,000+ active community members" },
              { icon: "🏆", text: "Earn rewards for every donation" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg text-green-100">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-tl-full" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Zero<span className="text-primary">FoodWaste</span>
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label>I want to join as</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          selectedRole === role.id
                            ? "border-primary bg-green-50 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <role.icon className={`w-6 h-6 mx-auto mb-2 ${
                          selectedRole === role.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <div className="font-medium text-sm">{role.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-12"
                      required={mode === "register"}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">or continue with</span>
              </div>
            </div>

            <Button type="button" variant="outline" size="lg" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
