import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Star,
  Users,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  profileImage?: string;
  totalPoints?: number;
  status: string;
  createdAt: string;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  DONOR: { bg: "bg-blue-100", text: "text-blue-700" },
  NGO: { bg: "bg-green-100", text: "text-green-700" },
  VOLUNTEER: { bg: "bg-orange-100", text: "text-orange-700" },
  ADMIN: { bg: "bg-purple-100", text: "text-purple-700" },
};

const roleLabels: Record<string, string> = {
  DONOR: "Food Donor",
  NGO: "Non-Profit Organization",
  VOLUNTEER: "Volunteer",
  ADMIN: "Administrator",
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (user?.id) {
          const response = (await api.getUser(user.id)) as any;
          if (response.success && response.data?.user) {
            setProfile(response.data.user);
            setFormData({
              name: response.data.user.name || "",
              phone: response.data.user.phone || "",
              address: response.data.user.location?.address || "",
            });
            setProfilePreview(response.data.user.profileImage || "");
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setProfilePreview(preview);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        location: {
          ...(profile?.location || { lat: 0, lng: 0 }),
          address: formData.address,
        },
        ...(profilePreview &&
          profilePreview !== profile?.profileImage && {
            profileImage: profilePreview,
          }),
      };

      const response = (await api.put(`/users/${user.id}`, updateData)) as any;

      if (response.success && response.data?.user) {
        setProfile(response.data.user);
        await refreshUser();
        setIsEditing(false);
        toast({
          title: "Success!",
          description: "Your profile has been updated.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Profile Not Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Unable to load your profile. Please try again later.
                </p>
                <Button onClick={() => navigate("/")} variant="hero">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <CardHeader>
                <CardTitle className="text-2xl">My Profile</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">
                            {profile.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-xs text-primary-foreground/60">
                            No photo
                          </p>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={handleProfileImageClick}
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {profile.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge
                        className={`${
                          roleColors[profile.role]?.bg
                        } ${roleColors[profile.role]?.text}`}
                      >
                        {roleLabels[profile.role] || profile.role}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700">
                        {profile.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Member since{" "}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Edit/Save Buttons */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="hero"
                      className="flex-1"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1"
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1"
                        variant="hero"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </motion.div>

            {/* Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                  />
                </div>
              </CardContent>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Your Stats
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {profile.totalPoints || 0}
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Account Status
                    </p>
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                  <Badge
                    className={`${
                      roleColors[profile.role]?.bg
                    } ${roleColors[profile.role]?.text} mt-2`}
                  >
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-2xl border border-border p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Account Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-mono text-xs text-foreground break-all">
                    {profile._id}
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-medium text-foreground">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProfilePage;
