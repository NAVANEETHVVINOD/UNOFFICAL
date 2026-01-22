# LINKER Android Build Guide

This guide covers building the LINKER Android app using Trusted Web Activity (TWA).

## Prerequisites

1. **Node.js** (v18+)
2. **Java JDK 17+**
3. **Android Studio** (for SDK and emulator)
4. **Bubblewrap CLI**

```bash
npm install -g @anthropic/bubblewrap-cli
```

## Quick Start

### 1. Initialize TWA Project

```bash
# From project root
bubblewrap init --manifest=https://linker-inky.vercel.app/manifest.json
```

Or use the existing twa-manifest.json:

```bash
bubblewrap build
```

### 2. Generate Signing Keystore

```bash
keytool -genkey -v -keystore android.keystore -alias linker -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Store the keystore password securely. You'll need it for every release.

### 3. Extract SHA256 Fingerprint

```bash
keytool -list -v -keystore android.keystore -alias linker
```

Look for the SHA256 fingerprint in the output:
```
SHA256: AA:BB:CC:DD:EE:FF:...
```

### 4. Update Digital Asset Links

Update `apps/web/public/.well-known/assetlinks.json` with your SHA256 fingerprint:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.linker.campus",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
    }
  }
]
```

Deploy the updated assetlinks.json to production.

### 5. Build APK (Testing)

```bash
bubblewrap build
```

Output: `app-release-signed.apk`

### 6. Build AAB (Play Store)

```bash
bubblewrap build --skipSigning
```

Then sign with bundletool or upload unsigned to Play Console for Google signing.

## Testing

### Install on Device

```bash
adb install app-release-signed.apk
```

### Verify TWA Mode

1. Open the app
2. Should display fullscreen (no browser URL bar)
3. If URL bar appears, check:
   - assetlinks.json is accessible at `https://your-domain/.well-known/assetlinks.json`
   - SHA256 fingerprint matches
   - Package name matches

### Test Checklist

- [ ] App opens in fullscreen mode
- [ ] No browser UI visible
- [ ] Back button navigates within app
- [ ] Login/logout works
- [ ] Push notifications work (if enabled)
- [ ] Deep links open in app
- [ ] Offline page displays when disconnected

## Play Store Submission

### Required Assets

1. **App Icon**: 512x512 PNG (already in `/icons/icon-512.png`)
2. **Feature Graphic**: 1024x500 PNG
3. **Screenshots**: 
   - Phone: 2-8 screenshots (16:9 or 9:16)
   - Tablet: 2-8 screenshots (optional but recommended)

### Store Listing

- **App Name**: LINKER – Campus OS
- **Short Description**: Connect with your campus community
- **Full Description**: [See PLAY_STORE_LISTING.md]
- **Category**: Education > Social
- **Content Rating**: 13+
- **Privacy Policy**: https://linker-inky.vercel.app/legal/privacy
- **Terms of Service**: https://linker-inky.vercel.app/legal/terms

### Release Tracks

1. **Internal Testing**: 5-10 testers (dev team)
2. **Closed Testing**: 50-100 testers (campus beta)
3. **Production**: Staged rollout (10% → 50% → 100%)

## Troubleshooting

### URL Bar Showing (Not Fullscreen)

1. Verify assetlinks.json is accessible
2. Check SHA256 fingerprint matches keystore
3. Clear Chrome data on test device
4. Wait 24-48 hours for Google to cache assetlinks

### Build Fails

1. Ensure Java 17+ is installed
2. Check Android SDK is configured
3. Run `bubblewrap doctor` to diagnose

### Push Notifications Not Working

1. Verify `enableNotifications: true` in twa-manifest.json
2. Check Firebase configuration
3. Test notification permissions on device

## Version Management

Update version in `twa-manifest.json`:

```json
{
  "appVersionCode": 2,
  "appVersionName": "1.0.1"
}
```

- `appVersionCode`: Integer, must increase with each release
- `appVersionName`: User-visible version string

## Security Notes

- **Never commit** `android.keystore` to git
- Store keystore and passwords in secure vault
- Use Play App Signing for production releases
- Rotate keys if compromised

## Chrome Requirements

TWA requires Chrome 72+ on the device. The app handles missing Chrome gracefully with a fallback to Custom Tabs (shows browser UI).

Minimum Chrome version can be configured in twa-manifest.json:
```json
{
  "minSdkVersion": 19
}
```
