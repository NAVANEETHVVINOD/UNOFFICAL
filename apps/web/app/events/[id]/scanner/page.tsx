"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import Container from "../../../components/ui/Container";
import { NewspaperCard, Badge, RetroButton, Tape } from "../../../components/ui/NewspaperUI";
import { PageTransition } from "../../../providers/AnimationProvider";
import { ErrorBoundary, LoadingState } from "../../../components/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../../lib/api";
import {
  QrCode, Users, CheckCircle, XCircle, Clock, Search,
  Wifi, WifiOff, RefreshCw, ChevronLeft, Camera, User,
  AlertTriangle, Volume2, VolumeX, Zap, LogOut
} from "lucide-react";
import Link from "next/link";

// Types
interface CheckInResult {
  success: boolean;
  registrationId: string;
  attendeeName: string;
  ticketType: string;
  checkInTime: Date;
  isFirstScan: boolean;
  error?: string;
  errorCode?: string;
}

interface ScanRecord {
  id: string;
  registrationId: string;
  attendeeName: string;
  ticketType: string;
  checkInTime: Date;
  success: boolean;
  error?: string;
  synced: boolean;
}

interface CheckInStats {
  totalRegistrations: number;
  checkedIn: number;
  pending: number;
  checkInRate: number;
}

interface AttendeeSearchResult {
  registrationId: string;
  userId: string;
  fullName: string;
  email: string;
  ticketType: string;
  status: string;
  checkedIn: boolean;
}

interface Event {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  venue?: string;
  attendanceMode?: 'SINGLE_SCAN' | 'ENTRY_EXIT';
}

// Offline storage key
const OFFLINE_SCANS_KEY = 'linker_offline_scans';

// Sound effects (base64 encoded short beeps)
const SUCCESS_SOUND = typeof window !== 'undefined' ? new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQYAHIveli8AAAA=') : null;
const ERROR_SOUND = typeof window !== 'undefined' ? new Audio('data:audio/wav;base64,UklGRl9vT19teleQYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQYAHIveli8AAAA=') : null;

function ScannerContent() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [lastScanResult, setLastScanResult] = useState<CheckInResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AttendeeSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [processingCheckIn, setProcessingCheckIn] = useState(false);
  const [scanMode, setScanMode] = useState<'entry' | 'exit'>('entry');
  
  // Refs
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline scans from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(OFFLINE_SCANS_KEY);
    if (stored) {
      try {
        const offlineScans = JSON.parse(stored);
        setScanHistory(prev => [...offlineScans, ...prev]);
      } catch (e) {
        console.error('Failed to load offline scans:', e);
      }
    }
  }, []);

  // Sync offline scans when back online
  useEffect(() => {
    if (isOnline) {
      syncOfflineScans();
    }
  }, [isOnline]);

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  // Fetch event and check permissions
  useEffect(() => {
    if (params.id && isAuthenticated) {
      fetchEventAndPermissions();
    }
  }, [params.id, isAuthenticated]);

  const fetchEventAndPermissions = async () => {
    setLoading(true);
    try {
      const [eventData, permissionData, statsData, historyData] = await Promise.all([
        api.getEvent(params.id as string),
        api.checkEventPermission(params.id as string, 'SCAN_QR'),
        api.getCheckInStats(params.id as string).catch(() => null),
        api.getCheckInHistory(params.id as string, 50).catch(() => []),
      ]);
      
      setEvent(eventData);
      setHasPermission(permissionData?.hasPermission || false);
      if (statsData) setStats(statsData);
      if (Array.isArray(historyData)) {
        setScanHistory(historyData.map((h: any) => ({
          id: h.registrationId,
          registrationId: h.registrationId,
          attendeeName: h.attendeeName,
          ticketType: h.ticketType,
          checkInTime: new Date(h.checkInTime),
          success: true,
          synced: true,
        })));
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineScans = async () => {
    const unsyncedScans = scanHistory.filter(s => !s.synced);
    if (unsyncedScans.length === 0) return;
    
    for (const scan of unsyncedScans) {
      try {
        // Re-attempt the check-in
        await api.scanCheckIn(params.id as string, scan.registrationId);
        setScanHistory(prev => prev.map(s => 
          s.id === scan.id ? { ...s, synced: true } : s
        ));
      } catch (error) {
        console.error('Failed to sync scan:', scan.id, error);
      }
    }
    
    // Clear synced scans from localStorage
    const remaining = scanHistory.filter(s => !s.synced);
    if (remaining.length > 0) {
      localStorage.setItem(OFFLINE_SCANS_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(OFFLINE_SCANS_KEY);
    }
  };

  // Camera handling
  const startCamera = async () => {
    setIsScanning(true);
    // The actual camera start happens in startScanning via html5-qrcode
    startScanning();
  };

  const stopCamera = () => {
    // Stop html5-qrcode scanner
    const html5QrCode = (window as any).__html5QrCode;
    if (html5QrCode) {
      html5QrCode.stop().catch(() => {});
      (window as any).__html5QrCode = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    if (scanIntervalRef.current) return;
    
    // Use html5-qrcode for scanning
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      const html5QrCode = new Html5Qrcode("qr-reader-element");
      
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleQrDetected(decodedText);
        },
        () => {} // Ignore errors during scanning
      ).catch((err) => {
        console.error("Failed to start scanner:", err);
      });
      
      // Store reference for cleanup
      (window as any).__html5QrCode = html5QrCode;
    });
  };

  const handleQrDetected = useCallback(async (token: string) => {
    if (processingCheckIn) return;
    setProcessingCheckIn(true);
    
    // Pause scanning briefly
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    try {
      let result: CheckInResult;
      
      if (isOnline) {
        if (scanMode === 'entry') {
          result = await api.scanCheckIn(params.id as string, token);
        } else {
          // For exit mode, we need to extract registration ID from token
          // The token format is: eventId:userId:registrationId:timestamp:random:signature
          const parts = token.split(':');
          if (parts.length >= 3) {
            const registrationId = parts[2];
            const checkoutResult = await api.checkOut(params.id as string, registrationId);
            result = {
              success: checkoutResult.success,
              registrationId,
              attendeeName: 'Attendee',
              ticketType: '',
              checkInTime: new Date(checkoutResult.checkOutTime),
              isFirstScan: false,
            };
          } else {
            result = {
              success: false,
              registrationId: '',
              attendeeName: '',
              ticketType: '',
              checkInTime: new Date(),
              isFirstScan: false,
              error: 'Invalid QR code format',
              errorCode: 'INVALID_QR_TOKEN',
            };
          }
        }
      } else {
        // Offline mode - store for later sync
        result = {
          success: true,
          registrationId: token,
          attendeeName: 'Offline Scan',
          ticketType: 'Pending Sync',
          checkInTime: new Date(),
          isFirstScan: true,
        };
      }
      
      setLastScanResult(result);
      
      // Play sound
      if (soundEnabled) {
        if (result.success) {
          SUCCESS_SOUND?.play().catch(() => {});
        } else {
          ERROR_SOUND?.play().catch(() => {});
        }
      }
      
      // Add to history
      const scanRecord: ScanRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        registrationId: result.registrationId,
        attendeeName: result.attendeeName,
        ticketType: result.ticketType,
        checkInTime: result.checkInTime,
        success: result.success,
        error: result.error,
        synced: isOnline,
      };
      
      setScanHistory(prev => [scanRecord, ...prev.slice(0, 99)]);
      
      // Store offline scans
      if (!isOnline) {
        const offlineScans = JSON.parse(localStorage.getItem(OFFLINE_SCANS_KEY) || '[]');
        offlineScans.unshift(scanRecord);
        localStorage.setItem(OFFLINE_SCANS_KEY, JSON.stringify(offlineScans.slice(0, 100)));
      }
      
      // Update stats
      if (result.success && stats) {
        setStats(prev => prev ? {
          ...prev,
          checkedIn: prev.checkedIn + 1,
          pending: prev.pending - 1,
          checkInRate: Math.round(((prev.checkedIn + 1) / prev.totalRegistrations) * 100),
        } : null);
      }
      
    } catch (error: any) {
      const errorResult: CheckInResult = {
        success: false,
        registrationId: '',
        attendeeName: '',
        ticketType: '',
        checkInTime: new Date(),
        isFirstScan: false,
        error: error.message || 'Check-in failed',
      };
      setLastScanResult(errorResult);
      
      if (soundEnabled) {
        ERROR_SOUND?.play().catch(() => {});
      }
    } finally {
      setProcessingCheckIn(false);
      // Resume scanning after delay
      setTimeout(() => {
        if (isScanning) startScanning();
      }, 1500);
    }
  }, [params.id, isOnline, scanMode, processingCheckIn, soundEnabled, stats, isScanning]);

  // Manual search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const result = await api.searchAttendeesForCheckIn(params.id as string, searchQuery);
      setSearchResults(result.attendees || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleManualCheckIn = async (attendee: AttendeeSearchResult) => {
    const reason = prompt('Please enter a reason for manual check-in:');
    if (!reason || reason.trim().length < 3) {
      alert('A reason is required for manual check-in (minimum 3 characters)');
      return;
    }
    
    try {
      const result = await api.manualCheckIn(params.id as string, attendee.registrationId, reason);
      
      if (result.success) {
        setLastScanResult(result);
        setSearchResults(prev => prev.map(a => 
          a.registrationId === attendee.registrationId ? { ...a, checkedIn: true } : a
        ));
        
        // Add to history
        const scanRecord: ScanRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          registrationId: result.registrationId,
          attendeeName: result.attendeeName,
          ticketType: result.ticketType,
          checkInTime: new Date(result.checkInTime),
          success: true,
          synced: true,
        };
        setScanHistory(prev => [scanRecord, ...prev.slice(0, 99)]);
        
        if (soundEnabled) SUCCESS_SOUND?.play().catch(() => {});
      }
    } catch (error: any) {
      alert(error.message || 'Manual check-in failed');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (authLoading || loading) return <LoadingState />;
  if (!isAuthenticated) return null;
  
  if (!hasPermission) {
    return (
      <PageTransition>
        <Container>
          <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-paper'}`}>
            <AlertTriangle className={`w-16 h-16 mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h1 className={`font-display text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
              Access Denied
            </h1>
            <p className={`font-mono text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              You don't have permission to scan QR codes for this event.
            </p>
            <RetroButton onClick={() => router.push(`/events/${params.id}`)}>
              Back to Event
            </RetroButton>
          </div>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-paper'}`}>
        {/* Header */}
        <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-black'} border-b-2 px-4 py-3`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/events/${params.id}`} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
              </Link>
              <div>
                <h1 className={`font-display text-lg font-black ${isDark ? 'text-white' : 'text-black'}`}>
                  QR Scanner
                </h1>
                <p className={`font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate max-w-[200px]`}>
                  {event?.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Online/Offline indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono ${
                isOnline 
                  ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                  : isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>
              
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {soundEnabled 
                  ? <Volume2 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
                  : <VolumeX className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                }
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Stats Bar */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`grid grid-cols-3 gap-2 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-black'}`}
            >
              <div className="text-center">
                <div className={`text-2xl font-display font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {stats.checkedIn}
                </div>
                <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Checked In</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-display font-black ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {stats.pending}
                </div>
                <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-display font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.checkInRate}%
                </div>
                <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rate</p>
              </div>
            </motion.div>
          )}

          {/* Entry/Exit Mode Toggle (for ENTRY_EXIT mode) */}
          {event?.attendanceMode === 'ENTRY_EXIT' && (
            <div className={`flex rounded-xl overflow-hidden border-2 ${isDark ? 'border-gray-700' : 'border-black'}`}>
              <button
                onClick={() => setScanMode('entry')}
                className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  scanMode === 'entry'
                    ? isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                    : isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                }`}
              >
                <Zap className="w-4 h-4" />
                Entry
              </button>
              <button
                onClick={() => setScanMode('exit')}
                className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  scanMode === 'exit'
                    ? isDark ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
                    : isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Exit
              </button>
            </div>
          )}

          {/* Scanner Area */}
          <div className={`relative rounded-2xl overflow-hidden border-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-black bg-gray-100'}`}>
            {isScanning ? (
              <div className="relative aspect-[4/3]">
                <div id="qr-reader-element" className="w-full h-full" />
                
                {/* Processing indicator */}
                {processingCheckIn && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
                  </div>
                )}
                
                {/* Stop button */}
                <button
                  onClick={stopCamera}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-red-500 text-white font-bold rounded-full border-2 border-white shadow-lg z-20"
                >
                  Stop Scanning
                </button>
              </div>
            ) : (
              <div className="aspect-[4/3] flex flex-col items-center justify-center p-8">
                <Camera className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`font-mono text-sm mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tap to start scanning QR codes
                </p>
                <RetroButton
                  onClick={startCamera}
                  className={`${isDark ? 'bg-green-600 text-white border-green-400' : 'bg-green-500 text-white border-black'}`}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </RetroButton>
              </div>
            )}
          </div>

          {/* Last Scan Result */}
          <AnimatePresence mode="wait">
            {lastScanResult && (
              <motion.div
                key={lastScanResult.checkInTime.toString()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className={`p-4 rounded-xl border-4 ${
                  lastScanResult.success
                    ? isDark ? 'bg-green-900/50 border-green-500' : 'bg-green-50 border-green-500'
                    : isDark ? 'bg-red-900/50 border-red-500' : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    lastScanResult.success
                      ? isDark ? 'bg-green-500' : 'bg-green-500'
                      : isDark ? 'bg-red-500' : 'bg-red-500'
                  }`}>
                    {lastScanResult.success 
                      ? <CheckCircle className="w-6 h-6 text-white" />
                      : <XCircle className="w-6 h-6 text-white" />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-display text-lg font-black ${
                      lastScanResult.success
                        ? isDark ? 'text-green-300' : 'text-green-700'
                        : isDark ? 'text-red-300' : 'text-red-700'
                    }`}>
                      {lastScanResult.success ? 'Check-In Successful!' : 'Check-In Failed'}
                    </h3>
                    {lastScanResult.success ? (
                      <>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {lastScanResult.attendeeName}
                        </p>
                        <p className={`font-mono text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {lastScanResult.ticketType}
                        </p>
                      </>
                    ) : (
                      <p className={`font-mono text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                        {lastScanResult.error}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual Search Section */}
          <div className={`rounded-xl border-2 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-black bg-white'} overflow-hidden`}>
            <button
              onClick={() => setShowManualSearch(!showManualSearch)}
              className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Manual Check-In</span>
              </div>
              <motion.div
                animate={{ rotate: showManualSearch ? 180 : 0 }}
                className={isDark ? 'text-gray-400' : 'text-gray-600'}
              >
                ▼
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showManualSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by name or email..."
                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-mono text-sm ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-black text-black placeholder-gray-400'
                        }`}
                      />
                      <RetroButton
                        onClick={handleSearch}
                        disabled={searching}
                        className={isDark ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-500 text-white border-black'}
                      >
                        {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </RetroButton>
                    </div>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {searchResults.map((attendee) => (
                          <div
                            key={attendee.registrationId}
                            className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                              isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isDark ? 'bg-gray-600' : 'bg-gray-200'
                              }`}>
                                <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                              </div>
                              <div>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                  {attendee.fullName}
                                </p>
                                <p className={`font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {attendee.ticketType}
                                </p>
                              </div>
                            </div>
                            {attendee.checkedIn ? (
                              <Badge className="bg-green-500 text-white border-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Checked In
                              </Badge>
                            ) : (
                              <RetroButton
                                onClick={() => handleManualCheckIn(attendee)}
                                className="text-xs py-1 px-3 bg-green-500 text-white border-black"
                              >
                                Check In
                              </RetroButton>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scan History */}
          <div className={`rounded-xl border-2 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-black bg-white'}`}>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Scan History</span>
              </div>
              <span className={`font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {scanHistory.length} scans
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {scanHistory.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {scanHistory.slice(0, 20).map((scan) => (
                    <div
                      key={scan.id}
                      className={`p-3 flex items-center gap-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        scan.success
                          ? isDark ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
                          : isDark ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'
                      }`}>
                        {scan.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-black'}`}>
                          {scan.attendeeName}
                        </p>
                        <p className={`font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(scan.checkInTime).toLocaleTimeString()}
                          {!scan.synced && (
                            <span className="ml-2 text-yellow-500">• Pending sync</span>
                          )}
                        </p>
                      </div>
                      <span className={`font-mono text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {scan.ticketType}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-mono text-sm">No scans yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default function EventScannerPage() {
  return (
    <ErrorBoundary>
      <ScannerContent />
    </ErrorBoundary>
  );
}
