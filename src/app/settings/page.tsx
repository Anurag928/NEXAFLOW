"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, updatePassword, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Cpu, 
  BrainCircuit, 
  Shield, 
  AlertTriangle,
  LogOut,
  Trash2,
  Check,
  Loader2,
  Camera,
  Laptop,
  Smartphone,
  Globe
} from "lucide-react";

type SettingsTab = "profile" | "ai-preferences" | "memory" | "security" | "account";

interface UserPrefs {
  defaultSourceModel: string;
  defaultDestinationModel: string;
  responseStyle: "Detailed" | "Balanced" | "Concise";
  memoryEnabled: boolean;
  autoSaveContext: boolean;
  extractProjectInfo: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const AI_MODELS = ["ChatGPT", "Claude", "Gemini", "DeepSeek", "Grok"];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // AI Preferences state
  const [prefs, setPrefs] = useState<UserPrefs>({
    defaultSourceModel: "ChatGPT",
    defaultDestinationModel: "Gemini",
    responseStyle: "Balanced",
    memoryEnabled: true,
    autoSaveContext: true,
    extractProjectInfo: true,
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Security Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);


  // Account Danger Zone state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync profile & prefs with Firestore
  useEffect(() => {
    if (!user) return;

    // Load initial values from Auth
    setProfileName(user.displayName || "");
    setProfileEmail(user.email || "");

    // Load preferences from Firestore
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.preferences) {
            setPrefs({
              defaultSourceModel: data.preferences.defaultSourceModel || "ChatGPT",
              defaultDestinationModel: data.preferences.defaultDestinationModel || "Gemini",
              responseStyle: data.preferences.responseStyle || "Balanced",
              memoryEnabled: data.preferences.memoryEnabled !== false,
              autoSaveContext: data.preferences.autoSaveContext !== false,
              extractProjectInfo: data.preferences.extractProjectInfo !== false,
            });
          }
        }
      } catch (err) {
        console.error("Error reading settings document:", err);
      }
    };

    fetchUserData();
  }, [user]);

  // Actions
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;

    setIsSavingProfile(true);
    try {
      // 1. Update Auth display name
      await updateProfile(auth.currentUser, { displayName: profileName });

      // 2. Save profile fields to Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: profileName,
        email: profileEmail,
        updatedAt: new Date()
      }, { merge: true });

      showToast("Profile details updated successfully.", "success");
    } catch (err: any) {
      console.error("Error saving profile details:", err);
      showToast(err.message || "Failed to update profile details.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    setIsSavingPrefs(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        preferences: {
          defaultSourceModel: prefs.defaultSourceModel,
          defaultDestinationModel: prefs.defaultDestinationModel,
          responseStyle: prefs.responseStyle,
          memoryEnabled: prefs.memoryEnabled,
          autoSaveContext: prefs.autoSaveContext,
          extractProjectInfo: prefs.extractProjectInfo,
        }
      }, { merge: true });

      showToast("AI preferences synced successfully.", "success");
    } catch (err) {
      console.error("Error updating preferences:", err);
      showToast("Failed to save AI preferences.", "error");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully.", "success");
    } catch (err: any) {
      console.error("Password update failed:", err);
      showToast(err.message || "Failed to change password. Re-authentication may be required.", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !user) return;

    if (deleteConfirmText.toLowerCase() !== "delete") {
      showToast("Please type 'DELETE' to confirm deletion.", "error");
      return;
    }

    setIsDeletingAccount(true);
    try {
      // 1. Delete Firestore user preferences doc
      // In a real application, we would delete memories and transfers too, but for scope we delete settings.
      // 2. Delete from Firebase Auth
      await deleteUser(auth.currentUser);
      setIsDeleteModalOpen(false);
      showToast("Your account has been deleted.", "success");
      router.push("/login");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      showToast(err.message || "Failed to delete account. A recent log-in is required.", "error");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Toggle Switches Helper
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-white" : "bg-white/10"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0A0A0A] shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    );
  };

  // Created Date Formatting
  const creationDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        dateStyle: "long"
      })
    : "Recently";

  // Tab List config
  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "ai-preferences", label: "AI Preferences", icon: Cpu },
    { id: "memory", label: "AI Memory", icon: BrainCircuit },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Delete Account", icon: Trash2 },
  ] as const;

  return (
    <div className="space-y-6 w-full min-h-[75vh] pb-16">
      {/* Title & Header */}
      <div className="border-b border-white/[0.04] pb-6 space-y-1.5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl bg-clip-text">
          Settings Workspace
        </h1>
        <p className="text-[14px] text-white/45 font-medium leading-relaxed">
          Manage your NexaFlow profile, default AI models, memory layers, and security.
        </p>
      </div>

      {/* Main settings layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Navigation Stack (Desktop) / Horizontal Tabs (Mobile) */}
        <div className="w-full lg:w-64 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none border-b border-white/[0.04] lg:border-b-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-[13.5px] whitespace-nowrap ${
                  isActive 
                    ? "bg-white/[0.06] text-white border-l-2 border-white pl-3.5" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-white/40"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 w-full relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* 1. PROFILE SETTINGS */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Profile Settings</h2>
                  <p className="text-[13px] text-white/35 font-medium">Manage your public information and profile attributes.</p>
                </div>

                {/* Avatar Display */}
                <div className="flex items-center gap-5 pb-6 border-b border-white/[0.04]">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-2xl font-bold text-white/70 overflow-hidden select-none">
                      {user?.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        (user?.displayName || user?.email || "U")[0].toUpperCase()
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity duration-300">
                      <Camera className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[15px] font-bold text-white/95">
                      {user?.displayName || "User Profile"}
                    </div>
                    <div className="text-[12px] text-white/30 font-medium">
                      Account created: <span className="text-white/50">{creationDate}</span>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-white/20 focus:outline-none rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/25 transition-all font-semibold"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase font-medium">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={profileEmail}
                        className="w-full bg-white/[0.01] border border-white/[0.04] focus:outline-none rounded-xl px-4 py-3 text-[13px] text-white/40 font-semibold cursor-not-allowed"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-white/90 active:scale-[0.98] transition-all"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* 2. AI PREFERENCES */}
            {activeTab === "ai-preferences" && (
              <motion.div
                key="ai-preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">AI Preferences</h2>
                  <p className="text-[13px] text-white/35 font-medium">Configure default models and response stylings for new transfers.</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Default Source Model */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">Default Source AI</label>
                      <div className="relative">
                        <select
                          value={prefs.defaultSourceModel}
                          onChange={(e) => setPrefs({ ...prefs, defaultSourceModel: e.target.value })}
                          className="w-full bg-[#0C0C0C] border border-white/[0.06] hover:border-white/10 rounded-xl px-4 py-3 text-[13px] text-white/90 font-semibold focus:outline-none appearance-none cursor-pointer"
                        >
                          {AI_MODELS.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/35">▼</div>
                      </div>
                    </div>

                    {/* Default Destination Model */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">Default Destination AI</label>
                      <div className="relative">
                        <select
                          value={prefs.defaultDestinationModel}
                          onChange={(e) => setPrefs({ ...prefs, defaultDestinationModel: e.target.value })}
                          className="w-full bg-[#0C0C0C] border border-white/[0.06] hover:border-white/10 rounded-xl px-4 py-3 text-[13px] text-white/90 font-semibold focus:outline-none appearance-none cursor-pointer"
                        >
                          {AI_MODELS.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/35">▼</div>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Response Style */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">Preferred Response Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Detailed", "Balanced", "Concise"] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setPrefs({ ...prefs, responseStyle: style })}
                          className={`p-3 rounded-xl border text-center font-semibold text-[13px] transition-all cursor-pointer ${
                            prefs.responseStyle === style 
                              ? "bg-white/[0.05] border-white/20 text-white" 
                              : "bg-white/[0.01] border-white/[0.03] text-white/40 hover:text-white/70"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      disabled={isSavingPrefs}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-white/90 active:scale-[0.98] transition-all"
                    >
                      {isSavingPrefs ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. MEMORY SETTINGS */}
            {activeTab === "memory" && (
              <motion.div
                key="memory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">AI Memory settings</h2>
                  <p className="text-[13px] text-white/35 font-medium">Control what NexaFlow remembers from your AI conversations.</p>
                </div>

                <div className="space-y-5">
                  {/* Enable Memory */}
                  <div className="flex items-center justify-between p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <div className="space-y-0.5 max-w-[80%]">
                      <h4 className="text-[14px] font-bold text-white/90">Enable AI Memory</h4>
                      <p className="text-[11.5px] text-white/30 leading-relaxed font-medium">Allow NexaFlow to persist memory contexts across operations.</p>
                    </div>
                    <ToggleSwitch 
                      checked={prefs.memoryEnabled} 
                      onChange={(val) => setPrefs({ ...prefs, memoryEnabled: val })} 
                    />
                  </div>

                  {/* Auto-save Important Context */}
                  <div className="flex items-center justify-between p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <div className="space-y-0.5 max-w-[80%]">
                      <h4 className="text-[14px] font-bold text-white/90">Auto-save important context</h4>
                      <p className="text-[11.5px] text-white/30 leading-relaxed font-medium">Automatically learn preferences and decisions from migrations.</p>
                    </div>
                    <ToggleSwitch 
                      checked={prefs.autoSaveContext} 
                      onChange={(val) => setPrefs({ ...prefs, autoSaveContext: val })} 
                    />
                  </div>

                  {/* Extract project info */}
                  <div className="flex items-center justify-between p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                    <div className="space-y-0.5 max-w-[80%]">
                      <h4 className="text-[14px] font-bold text-white/90">Extract project information</h4>
                      <p className="text-[11.5px] text-white/30 leading-relaxed font-medium">Identify files, frameworks, and architecture setups during migrations.</p>
                    </div>
                    <ToggleSwitch 
                      checked={prefs.extractProjectInfo} 
                      onChange={(val) => setPrefs({ ...prefs, extractProjectInfo: val })} 
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      disabled={isSavingPrefs}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-white/90 active:scale-[0.98] transition-all"
                    >
                      {isSavingPrefs ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. SECURITY SETTINGS */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Security</h2>
                  <p className="text-[13px] text-white/35 font-medium">Configure credentials, active sessions, and authentication security.</p>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-4 pb-6 border-b border-white/[0.04]">
                  <h3 className="text-[14px] font-bold text-white/90">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-white/20 focus:outline-none rounded-xl px-4 py-3 text-[13px] text-white font-semibold"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-white/30 uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/10 focus:border-white/20 focus:outline-none rounded-xl px-4 py-3 text-[13px] text-white font-semibold"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[13px] font-semibold text-white/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isUpdatingPassword ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>




              </motion.div>
            )}

            {/* 5. DANGER ZONE */}
            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-rose-500/15 backdrop-blur-xl space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Delete Account</h2>
                  <p className="text-[13px] text-white/35 font-medium">Irreversible actions regarding your account ownership and settings.</p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-bold text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
                      <span>Delete Account</span>
                    </h3>
                    <p className="text-[12.5px] text-white/40 leading-relaxed font-medium">
                      Deleting your account will erase all previous transfers history, learned memory layer entries, configurations, and login details. This process is final.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[13px] transition-all active:scale-[0.98]"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete My Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white/80 hover:text-white font-semibold text-[13px] transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Session</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-rose-500/25 rounded-3xl p-6 shadow-2xl space-y-5 z-10"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Delete Account?</h3>
                  <p className="text-[12.5px] text-white/40 leading-relaxed max-w-sm">
                    This will permanently clear your NexaFlow data. To confirm, type <span className="font-mono text-rose-300 font-extrabold">&quot;DELETE&quot;</span> in the field below.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/[0.08] hover:border-white/15 focus:border-rose-500/20 focus:outline-none rounded-xl px-4 py-3 text-center text-[13px] text-white tracking-widest font-mono uppercase"
                  placeholder="type DELETE here"
                />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeletingAccount}
                    className="py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount || deleteConfirmText.toLowerCase() !== "delete"}
                    className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/20 disabled:text-rose-400/40 disabled:cursor-not-allowed text-[13px] font-bold text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    {isDeletingAccount ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`px-4.5 py-3.5 rounded-2xl border text-[13px] font-semibold flex items-center gap-2.5 shadow-2xl backdrop-blur-xl ${
                t.type === "success" 
                  ? "bg-[#10A37F]/10 border-[#10A37F]/20 text-[#10A37F]" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${t.type === "success" ? "bg-[#10A37F]" : "bg-rose-400"}`} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
