"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUserType } from "../context/UserTypeContext";
import { UserType, USER_TYPE_CONFIGS } from "../../lib/userTypes";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Shield, Eye, Moon, Smartphone, LogOut, Check, UserX, Trash2, Mail, ArrowLeft, User, Settings, AlertTriangle, Briefcase } from "lucide-react";
import { api } from "../../lib/api";
import {
  NotificationType,
  NOTIFICATION_CATEGORIES,
  useNotifications,
  NotificationPreferences,
  NOTIFICATION_ICONS
} from "../context/NotificationContext";
import ThemeToggle from "../components/ThemeToggle";
import { useBlocking } from "../hooks/useBlocking";
import Link from "next/link";
import BottomNav from "../components/ui/BottomNav";
import NavBox from "../components/ui/NavBox";

function getNotificationIcon(type: NotificationType): string {
  return NOTIFICATION_ICONS[type] || "🔔";
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { userType, setUserType } = useUserType();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "appearance">("notifications");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { blockedUsers, unblockUser, isLoading: isLoadingBlocked } = useBlocking();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingUserType, setIsChangingUserType] = useState(false);

  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      updatePreferences(localPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotificationType = (type: NotificationType) => {
    setLocalPreferences((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type],
      },
    }));
  };

  const handleDeliveryMethodChange = (method: "email" | "push" | "inApp", value: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [method]: value,
    }));
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      await api.deleteAccount();
      logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleChangeUserType = async (newUserType: UserType) => {
    if (newUserType === userType) return;
    
    setIsChangingUserType(true);
    try {
      await setUserType(newUserType);
      // Redirect to dashboard after changing userType
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to change user type:", error);
      alert("Failed to change user type. Please try again.");
    } finally {
      setIsChangingUserType(false);
    }
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Eye },
  ] as const;

  const username = user?.email?.split("@")[0] || "user";

  return (
    <div className="min-h-screen bg-paper relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-paper/95 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h1 className="font-display text-base md:text-lg font-bold uppercase">Settings</h1>
          </div>
          <Link href="/profile">
            <motion.div
              className="w-9 h-9 md:w-10 md:h-10 bg-neutral-100 rounded-xl border-2 border-ink overflow-hidden cursor-pointer shadow-neo-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-ink/50" />
                </div>
              )}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 md:pt-36 pb-24 md:pb-8">
        {/* User Info Card */}
        <motion.div
          className="card-paper p-6 rounded-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-ink overflow-hidden bg-neutral-100">
              <img
                src={
                  user?.profile?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile?.fullName || "User"}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold">
                {user?.profile?.fullName || "Anonymous User"}
              </h2>
              <p className="text-neutral-500 font-mono text-sm">@{username}</p>
            </div>
            <Link href="/profile/edit">
              <button className="px-4 py-2 bg-primary border-2 border-ink rounded-lg font-bold text-sm shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all">
                Edit Profile
              </button>
            </Link>
          </div>
        </motion.div>

        {/* NavBox for Settings Tabs */}
        <NavBox
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, icon: tab.icon }))}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
          sticky
          stickyOffset="top-16"
          className="mb-6"
        />

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {/* Content */}
          <div>
            {activeTab === "notifications" && (
              <div className="card-paper p-6 rounded-xl">
                <h2 className="font-display text-2xl font-bold mb-6">Notification Preferences</h2>

                {/* Delivery Methods */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-sm uppercase text-neutral-500 mb-3">Delivery Methods</h3>

                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-neutral-600" />
                      <div>
                        <p className="font-bold">Email Notifications</p>
                        <p className="text-sm text-neutral-500">Receive notifications via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localPreferences.email}
                      onChange={(e) => handleDeliveryMethodChange("email", e.target.checked)}
                      className="w-5 h-5 accent-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-neutral-600" />
                      <div>
                        <p className="font-bold">Push Notifications</p>
                        <p className="text-sm text-neutral-500">Receive notifications on your device</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localPreferences.push}
                      onChange={(e) => handleDeliveryMethodChange("push", e.target.checked)}
                      className="w-5 h-5 accent-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-neutral-600" />
                      <div>
                        <p className="font-bold">In-App Notifications</p>
                        <p className="text-sm text-neutral-500">Show notifications in the app</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localPreferences.inApp}
                      onChange={(e) => handleDeliveryMethodChange("inApp", e.target.checked)}
                      className="w-5 h-5 accent-primary"
                    />
                  </label>
                </div>

                {/* Notification Types */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm uppercase text-neutral-500 mb-3">Notification Types</h3>

                  {(Object.keys(localPreferences.types) as NotificationType[]).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${localPreferences.types[type]
                        ? "border-ink bg-white"
                        : "border-neutral-200 bg-neutral-50 opacity-60"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getNotificationIcon(type)}</span>
                        <span className="font-medium">{NOTIFICATION_CATEGORIES[type]}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localPreferences.types[type]}
                        onChange={() => handleToggleNotificationType(type)}
                        className="w-5 h-5 accent-primary"
                      />
                    </label>
                  ))}
                </div>

                {/* Save Button */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={savePreferences}
                    disabled={isSaving}
                    className="px-6 py-3 bg-ink text-white font-bold rounded-xl border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </button>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-green-600 font-bold flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Saved!
                    </motion.span>
                  )}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                {/* User Type Section */}
                <div className="card-paper p-6 rounded-xl">
                  <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    User Type
                  </h2>
                  <p className="text-neutral-600 mb-6 text-sm">
                    User Type controls how LINKER looks — not what you're allowed to do.
                  </p>

                  {/* Current User Type */}
                  {userType && (
                    <div className="mb-6 p-4 bg-primary/10 border-2 border-primary rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{USER_TYPE_CONFIGS[userType].icon}</span>
                        <div>
                          <p className="font-bold text-lg">{USER_TYPE_CONFIGS[userType].label}</p>
                          <p className="text-sm text-neutral-600">{USER_TYPE_CONFIGS[userType].description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Type Options */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm uppercase text-neutral-500 mb-3">Change User Type</h3>
                    {Object.values(UserType).map((type) => {
                      const config = USER_TYPE_CONFIGS[type];
                      const isActive = userType === type;
                      
                      return (
                        <button
                          key={type}
                          onClick={() => handleChangeUserType(type)}
                          disabled={isChangingUserType || isActive}
                          className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                            isActive
                              ? "border-primary bg-primary/5 cursor-default"
                              : "border-neutral-200 hover:border-ink hover:bg-neutral-50"
                          } ${isChangingUserType ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-2xl">{config.icon}</span>
                            <div>
                              <p className="font-bold">{config.label}</p>
                              <p className="text-sm text-neutral-600">{config.description}</p>
                            </div>
                          </div>
                          {isActive && (
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="card-paper p-6 rounded-xl">
                  <h2 className="font-display text-2xl font-bold mb-6">Privacy Settings</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                      <div>
                        <p className="font-bold">Public Profile</p>
                        <p className="text-sm text-neutral-500">Allow others to see your profile</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                      <div>
                        <p className="font-bold">Show Activity Status</p>
                        <p className="text-sm text-neutral-500">Let others see when you're online</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                    </label>
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h3 className="font-bold text-sm uppercase text-neutral-500 mb-3">Legal</h3>
                    <div className="flex gap-4">
                      <Link href="/legal/privacy" className="text-sm text-ink underline hover:text-primary font-bold">Privacy Policy</Link>
                      <Link href="/legal/terms" className="text-sm text-ink underline hover:text-primary font-bold">Terms of Service</Link>
                    </div>
                  </div>
                </div>

                {/* Blocked Users */}
                <div className="card-paper p-6 rounded-xl">
                  <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                    <UserX className="w-6 h-6" />
                    Blocked Users
                  </h2>

                  {isLoadingBlocked ? (
                    <div className="text-center py-8 text-neutral-500">Loading...</div>
                  ) : blockedUsers.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                      <UserX className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>You haven't blocked anyone</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blockedUsers.map((blocked) => (
                        <div
                          key={blocked.id}
                          className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
                              {blocked.blockedUser.profile?.avatarUrl ? (
                                <img
                                  src={blocked.blockedUser.profile.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserX className="w-5 h-5 text-neutral-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold">
                                {blocked.blockedUser.profile?.fullName || "Unknown User"}
                              </p>
                              <p className="text-xs text-neutral-500">
                                Blocked {new Date(blocked.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => unblockUser(blocked.blockedUserId)}
                            className="px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete Account Section */}
                <div className="card-paper p-6 rounded-xl border-2 border-red-200">
                  <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                    Danger Zone
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>

                {/* Logout Button */}
                <div className="card-paper p-6 rounded-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="card-paper p-6 rounded-xl">
                <h2 className="font-display text-2xl font-bold mb-6">Appearance</h2>
                <p className="text-neutral-600 mb-4">Customize how LINKER looks</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5" />
                      <div>
                        <p className="font-bold">Dark Mode</p>
                        <p className="text-sm text-neutral-500">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <ThemeToggle size="md" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Delete Account</h3>
                  <p className="text-sm text-neutral-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                All your data will be permanently deleted, including your profile, posts, and activity history.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Type <span className="text-red-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-2 bg-neutral-100 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
