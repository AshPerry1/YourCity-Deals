# PWA Testing Guide for YourCity Deals

This guide covers testing the Progressive Web App (PWA) functionality across different platforms and environments.

## Prerequisites

- YourCity Deals app running locally (`npm run dev`)
- Chrome DevTools (for desktop testing)
- Android device or emulator
- iPhone/iPad device or simulator
- Vercel account (for HTTPS testing)

## 1. Desktop Testing (Chrome)

### Basic PWA Testing
1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open Chrome DevTools:**
   - Press `F12` or right-click → "Inspect"
   - Go to **Application** tab

3. **Check Manifest:**
   - In DevTools → Application → Manifest
   - Verify manifest loads without errors
   - Check that all icons are accessible

4. **Check Service Worker:**
   - In DevTools → Application → Service Workers
   - Verify service worker is registered
   - Check for any registration errors

5. **Run Lighthouse Audit:**
   - In DevTools → Lighthouse tab
   - Select "Progressive Web App" category
   - Click "Generate report"
   - Verify all PWA checks pass

### Install Prompt Testing
1. **Test Install Button:**
   - Look for the install prompt at bottom of screen
   - Click "Install" button
   - Verify app installs to desktop

2. **Test Chrome Menu:**
   - Click the install icon in Chrome address bar
   - Verify install dialog appears

## 2. Android Testing

### Local Network Testing
1. **Find your local IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # or on Windows: ipconfig
   ```

2. **Access from Android:**
   - Connect Android device to same WiFi
   - Open Chrome on Android
   - Navigate to `http://YOUR_LOCAL_IP:3000`

3. **Test Install:**
   - Look for install prompt
   - Tap "Install" button
   - Verify app installs to home screen

### HTTPS Testing with ngrok
1. **Install ngrok:**
   ```bash
   brew install ngrok/ngrok/ngrok
   ```

2. **Create HTTPS tunnel:**
   ```bash
   ngrok http 3000
   ```

3. **Test on Android:**
   - Use the HTTPS URL from ngrok
   - Test install functionality
   - Verify offline capabilities

## 3. iOS Testing (iPhone/iPad)

### Safari Testing
1. **Access the app:**
   - Use HTTPS URL (ngrok or Vercel)
   - Open in Safari (not Chrome)

2. **Test Add to Home Screen:**
   - Tap the Share button (square with arrow)
   - Scroll down to "Add to Home Screen"
   - Tap "Add"
   - Verify app appears on home screen

3. **Test Standalone Mode:**
   - Launch app from home screen
   - Verify it opens in standalone mode (no Safari UI)
   - Test navigation and functionality

### iOS Simulator Testing
1. **Open iOS Simulator:**
   ```bash
   open -a Simulator
   ```

2. **Test in Safari:**
   - Navigate to your app URL
   - Test Add to Home Screen functionality
   - Verify standalone mode works

## 4. Vercel Deployment Testing

### Deploy to Vercel
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "PWA ready for testing"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repo to Vercel
   - Deploy automatically or manually
   - Get HTTPS URL

3. **Test All Platforms:**
   - Desktop Chrome
   - Android Chrome
   - iOS Safari
   - Verify install prompts work

## 5. PWA Features Testing

### Offline Functionality
1. **Test Offline Mode:**
   - Disconnect internet
   - Navigate through app
   - Verify core pages load from cache

2. **Test Cache Updates:**
   - Reconnect internet
   - Refresh page
   - Verify new content loads

### App-like Experience
1. **Test Standalone Mode:**
   - Launch from home screen
   - Verify no browser UI visible
   - Test full-screen experience

2. **Test Navigation:**
   - Use app navigation
   - Test back/forward buttons
   - Verify smooth transitions

## 6. Troubleshooting

### Common Issues

**Manifest not loading:**
- Check `/manifest.json` exists
- Verify file is accessible at `/manifest.json`
- Check for JSON syntax errors

**Service Worker not registering:**
- Check browser console for errors
- Verify `sw.js` file exists
- Check HTTPS requirement for production

**Install prompt not showing:**
- Verify PWA criteria are met
- Check Lighthouse audit results
- Test on different browsers

**iOS Add to Home Screen not working:**
- Ensure HTTPS is used
- Test in Safari (not Chrome)
- Check manifest has required fields

### Debug Commands

**Check PWA status:**
```bash
# Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(registrations => console.log(registrations))

# Check if app is installed
window.matchMedia('(display-mode: standalone)').matches
```

**Force service worker update:**
```bash
# In DevTools console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.update())
})
```

## 7. Performance Testing

### Lighthouse Metrics
- **Performance:** > 90
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 90
- **PWA:** > 90

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

## 8. Acceptance Criteria

✅ **Manifest loads without errors**
✅ **Service worker registers cleanly**
✅ **Android: Install via Chrome menu or button**
✅ **iOS: Install via Safari Add to Home Screen**
✅ **Lighthouse PWA audit passes all checks**
✅ **Works on Vercel preview and ngrok**
✅ **Offline functionality works**
✅ **Standalone mode functions properly**

## 9. Next Steps

After successful testing:
1. Deploy to production
2. Update webhook URLs for Stripe
3. Test payment flows in production
4. Monitor PWA usage analytics
5. Optimize based on user feedback

---

**Note:** Always test on real devices when possible, as simulators may not accurately represent PWA behavior.
