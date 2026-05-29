import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf,  CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface LocationState {
  email?: string;
  userId?: string;
}

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showResend, setShowResend] = useState(false);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/auth?mode=register");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "OTP must be 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        otp,
      });

      if ((response as any).success) {
        toast({
          title: "✅ Email Verified!",
          description: "Your email has been verified. Welcome aboard!",
          variant: "default",
        });

        // Store token and user data (backend may not return all fields)
        const resData = response as any;
        const user = resData.data?.user || {};
        const token = resData.token || "";

        if (token) {
          localStorage.setItem("token", token);
        }
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id || user._id || "",
            name: user.name || "",
            email: user.email || email,
            role: user.role || "",
            location: user.location || null,
            isEmailVerified: true,
            totalPoints: user.totalPoints || 0,
            phone: user.phone || "",
            status: user.status || "ACTIVE",
            profileImage: user.profileImage || "",
          }),
        );

        // Redirect to appropriate dashboard
        const dashboardMap: Record<string, string> = {
          VOLUNTEER: "/dashboard/volunteer",
          DONOR: "/dashboard/donor",
          NGO: "/dashboard/ngo",
          ADMIN: "/dashboard/admin",
        };
        navigate(dashboardMap[user.role] || "/dashboard/donor");
      }
    } catch (error: any) {
      const message =
        error.message ||
        "Failed to verify OTP. Please try again.";
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const response = await api.post("/auth/resend-otp", { email });

      if (response.success) {
        toast({
          title: "Success",
          description: "OTP sent to your email",
          variant: "default",
        });
        setOtp("");
        setTimeLeft(600); // Reset timer
        setShowResend(false);
      }
    } catch (error: any) {
      const message = error.message || "Failed to resend OTP";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a verification code to
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </motion.div>

          {/* Timer Alert */}
          {!showResend && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-3"
            >
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  OTP expires in {formatTime(timeLeft)}
                </p>
              </div>
            </motion.div>
          )}

          {/* OTP Expiry Message */}
          {showResend && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  OTP has expired. Please request a new one.
                </p>
              </div>
            </motion.div>
          )}

          {/* OTP Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleVerifyOtp}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="otp" className="text-gray-700 font-semibold">
                Enter OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                maxLength={6}
                className="mt-2 text-center text-2xl tracking-widest font-mono border-2"
                disabled={isLoading || showResend}
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6 || showResend}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Verify Email
                </div>
              )}
            </Button>
          </motion.form>

          {/* Resend OTP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            {showResend ? (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Didn't receive the code?
                </p>
                <Button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </Button>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-green-600 font-semibold hover:underline"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
            )}
          </motion.div>

          {/* Change Email Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center border-t pt-6"
          >
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="text-gray-600 text-sm hover:text-green-600 transition-colors"
            >
              Wrong email? Go back to registration
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPage;
