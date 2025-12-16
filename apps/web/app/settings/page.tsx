"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import DashboardNavbar from "../components/ui/DashboardNavbar";
import { NewspaperCard, RetroButton, Tape } from "../components/ui/NewspaperUI";
import { PageTransition } from "../providers/AnimationProvider";
import { motion } from "framer-motion";
import { Bell, Shield, Eye, Moon, Smartphone, LogOut, Check, UserX, Trash2, Mail } from "lucide-react";
import { 
  NotificationType, 
  NOTIFICATION_CATEGORIES, 
  useNotifications,
  NotificationPreferences,
  NOTIFICATION_ICONS
} from "../context/NotificationContext";
import { useBlocking } from "../hooks/useBlocking";

// Helper function to get notification icon
function getNotificationIcon(type: NotificationType): string {
  return NOTIFICATION_ICONS[type] || "🔔";
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy" | "appearance">("notifications");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { blockedUsers, unblockUser, isLoading: isLoadingBlocked } = useBlocking();
  
  // Use notification context for preferences
  const { preferences, updatePreferences } = useNotifications();

  // Local state for editing (to allow cancel/save workflow)
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  // Sync local preferences when context preferences change
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Save preferences to context (which persists to localStorage)
  const savePreferences = async () => {
    setIsSaving(true);
    try {
      updatePreferences(localPreferences);
      // TODO: Also save to backend when API is ready
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle notification type in local state
  const handleToggleNotificationType = (type: NotificationType) => {
    setLocalPreferences((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type],
      },
    }));
  };

  // Update delivery method in local state
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <DashboardNavbar />
        <Container className="py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-4xl font-black mb-2">SETTINGS</h1>
              <p className="text-gray-600 font-serif">Customize your LINKER experience</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <NewspaperCard className="p-4">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-accent-yellow border-2 border-black"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-bold text-sm">{tab.label}</span>
                      </button>
                    ))}
                    
                    <hr className="my-4 border-gray-200" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold text-sm">Log Out</span>
                    </button>
                  </nav>
                </NewspaperCard>
              </div>

              {/* Content */}
              <div className="md:col-span-3">
                {activeTab === "notifications" && (
                  <NewspaperCard className="p-6">
                    <Tape className="absolute -top-3 left-8" />
                    <h2 className="font-display text-2xl font-black mb-6">Notification Preferences</h2>
                    
                    {/* Global toggles */}
                    <div className="space-y-4 mb-8">
                      <h3 className="font-bold text-sm uppercase text-gray-500 mb-3">Delivery Methods</h3>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-bold">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localPreferences.email}
                          onChange={(e) => handleDeliveryMethodChange("email", e.target.checked)}
                          className="w-5 h-5 accent-accent-yellow"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-bold">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications on your device</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localPreferences.push}
                          onChange={(e) => handleDeliveryMethodChange("push", e.target.checked)}
                          className="w-5 h-5 accent-accent-yellow"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-bold">In-App Notifications</p>
                            <p className="text-sm text-gray-500">Show notifications in the app</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={localPreferences.inApp}
                          onChange={(e) => handleDeliveryMethodChange("inApp", e.target.checked)}
                          className="w-5 h-5 accent-accent-yellow"
                        />
                      </label>
                      
                      {!localPreferences.inApp && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200"
                        >
                          ⚠️ In-app notifications are disabled. You won't see any notifications in the app.
                        </motion.p>
                      )}
                    </div>

                    {/* Notification types */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm uppercase text-gray-500 mb-3">Notification Types</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Choose which types of notifications you want to receive. Disabled types won't appear in your notification feed.
                      </p>
                      
                      {(Object.keys(localPreferences.types) as NotificationType[]).map((type) => (
                        <label
                          key={type}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            localPreferences.types[type]
                              ? "border-gray-200 hover:border-gray-300 bg-white"
                              : "border-gray-100 bg-gray-50 opacity-60"
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
                            className="w-5 h-5 accent-accent-yellow"
                          />
                        </label>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => {
                          const allEnabled = Object.fromEntries(
                            Object.keys(localPreferences.types).map((k) => [k, true])
                          ) as Record<NotificationType, boolean>;
                          setLocalPreferences((p) => ({ ...p, types: allEnabled }));
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Enable all
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => {
                          const allDisabled = Object.fromEntries(
                            Object.keys(localPreferences.types).map((k) => [k, false])
                          ) as Record<NotificationType, boolean>;
                          setLocalPreferences((p) => ({ ...p, types: allDisabled }));
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Disable all
                      </button>
                    </div>

                    {/* Save button */}
                    <div className="mt-8 flex items-center gap-4">
                      <RetroButton onClick={savePreferences} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Preferences"}
                      </RetroButton>
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
                  </NewspaperCard>
                )}

                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <NewspaperCard className="p-6">
                      <Tape className="absolute -top-3 left-8" />
                      <h2 className="font-display text-2xl font-black mb-6">Privacy Settings</h2>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-bold">Public Profile</p>
                            <p className="text-sm text-gray-500">Allow others to see your profile</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent-yellow" />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-bold">Show Activity Status</p>
                            <p className="text-sm text-gray-500">Let others see when you're online</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent-yellow" />
                        </label>
                      </div>
                    </NewspaperCard>

                    {/* Blocked Users */}
                    <NewspaperCard className="p-6">
                      <h2 className="font-display text-2xl font-black mb-6 flex items-center gap-2">
                        <UserX className="w-6 h-6" />
                        Blocked Users
                      </h2>
                      
                      {isLoadingBlocked ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                      ) : blockedUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <UserX className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>You haven't blocked anyone</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {blockedUsers.map((blocked) => (
                            <div
                              key={blocked.id}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {blocked.blockedUser.profile?.avatarUrl ? (
                                    <img
                                      src={blocked.blockedUser.profile.avatarUrl}
                                      alt=""
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <UserX className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold">
                                    {blocked.blockedUser.profile?.fullName || "Unknown User"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Blocked {new Date(blocked.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => unblockUser(blocked.blockedUserId)}
                                className="px-3 py-1 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Unblock
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </NewspaperCard>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <NewspaperCard className="p-6">
                    <Tape className="absolute -top-3 left-8" />
                    <h2 className="font-display text-2xl font-black mb-6">Appearance</h2>
                    <p className="text-gray-600 mb-4">Customize how LINKER looks</p>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Moon className="w-5 h-5" />
                          <div>
                            <p className="font-bold">Dark Mode</p>
                            <p className="text-sm text-gray-500">Coming soon</p>
                          </div>
                        </div>
                        <input type="checkbox" disabled className="w-5 h-5 accent-accent-yellow opacity-50" />
                      </label>
                    </div>
                  </NewspaperCard>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
