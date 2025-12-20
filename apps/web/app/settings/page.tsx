"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Shield, Eye, Moon, Smartphone, LogOut, Check, UserX, Trash2, Mail, ArrowLeft, User, Settings } from "lucide-react";
import {
  NotificationType,
  NOTIFICATION_CATEGORIES,
  useNotifications,
  NotificationPreferences,
  NOTIFICATION_ICONS
} from "../context/NotificationContext";
import { useBlocking } from "../hooks/useBlocking";
import Link from "next/link";
import BottomNav from "../components/ui/BottomNav";

function getNotificationIcon(type: NotificationType): string {
  return NOTIFICATION_ICONS[type] || "🔔";
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "appearance">("notifications");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { blockedUsers, unblockUser, isLoading: isLoadingBlocked } = useBlocking();

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card-paper p-3 md:p-4 rounded-xl">
              <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition-all ${activeTab === tab.id
                      ? "bg-primary border-2 border-ink shadow-neo-sm"
                      : "hover:bg-neutral-100 border-2 border-transparent"
                      }`}
                  >
                    <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-bold text-xs md:text-sm whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}

                <hr className="hidden md:block my-4 border-neutral-200" />

                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-bold text-xs md:text-sm whitespace-nowrap">Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
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
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="card-paper p-6 rounded-xl">
                <h2 className="font-display text-2xl font-bold mb-6">Appearance</h2>
                <p className="text-neutral-600 mb-4">Customize how LINKER looks</p>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5" />
                      <div>
                        <p className="font-bold">Dark Mode</p>
                        <p className="text-sm text-neutral-500">Coming soon</p>
                      </div>
                    </div>
                    <input type="checkbox" disabled className="w-5 h-5 accent-primary opacity-50" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
