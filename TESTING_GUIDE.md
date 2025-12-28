# Quick Testing Guide

## 🧪 Testing the Authentication Flow

### Test Scenario 1: Login Flow
**Expected Behavior**: When not logged in, user sees Login/Sign Up buttons

**Steps**:
1. Open http://localhost:5174
2. On Home page, observe top-right corner of navigation
3. You should see "Login" and "Sign Up" buttons
4. Click "Login" button
5. You're redirected to StudentLogin.jsx
6. Enter valid credentials (or create new account first)
7. After successful login, you're redirected to StudentDashboard
8. Return to Home page (click logo or Home button)
9. Top-right corner now shows **Profile Icon** instead of Login/Sign Up buttons
10. Click Profile Icon → Opens Profile page ✓

---

## 🛡️ Test Scenario 2: Protected Routes
**Expected Behavior**: When logged out, protected routes redirect to login

**Steps**:
1. Make sure you're **logged out** (clear browser storage or open private window)
2. Open http://localhost:5174
3. Click "Browse" button in navigation
4. You should be **redirected to Login page** immediately
5. Click "Upload" button in navigation
6. You should be **redirected to Login page** immediately
7. Click "Requests" button in navigation
8. You should be **redirected to Login page** immediately
9. **Now login** with valid credentials
10. Repeat steps 3, 5, 8
11. This time you should **access the pages directly** without redirect ✓

---

## 👤 Test Scenario 3: Profile Icon Display
**Expected Behavior**: Profile icon shows only when logged in

**Steps**:
1. **Logged Out**: Home page shows "Login" and "Sign Up" buttons in top-right ✓
2. **Logged In**: Home page shows Profile icon button in top-right ✓
3. Click Profile icon → Opens Profile.jsx ✓
4. Verify you can see:
   - Your email and name
   - Change password option
   - Notifications settings
   - Account access/sessions
5. Click logout → Returns to Home page with Login/Sign Up buttons ✓

---

## 📱 Test Scenario 4: Mobile Menu
**Expected Behavior**: Mobile menu reflects authentication state

**Steps**:
1. Resize browser to mobile size (< 768px width)
2. **When logged out**:
   - Click hamburger menu icon
   - See Browse, Requests, Upload nav items
   - See "Login" and "Sign Up" buttons at bottom
3. **When logged in**:
   - Click hamburger menu icon
   - See Browse, Requests, Upload nav items
   - See "View Profile" button at bottom
4. Close menu and resize back to desktop ✓

---

## 🔄 Test Scenario 5: Real-Time Updates
**Expected Behavior**: Profile updates reflect immediately

**Steps**:
1. Login to account
2. Go to Profile page
3. Update your bio or avatar
4. Changes should save immediately
5. Refresh page → Changes persist ✓
6. Open profile in another tab
7. Update in first tab → Second tab reflects changes (real-time) ✓

---

## 📚 Test Scenario 6: Resource Navigation
**Expected Behavior**: Can access resource pages when logged in

**Steps**:
1. Login to account
2. Click "Browse" → Opens BrowseResources.jsx ✓
3. Search for resources → Should work
4. Click "Upload" → Opens PostResource.jsx ✓
5. Fill form and upload → Should save to Firestore
6. Click "Requests" → Opens MyRequests.jsx ✓
7. Click "Favorites" → Opens MyFavorites.jsx ✓
8. All pages should be **accessible only when logged in** ✓

---

## 🧑‍💼 Test Scenario 7: Role-Based Access
**Expected Behavior**: Student and Admin routes are separate

**Steps**:
1. **Student Account**:
   - Login as student
   - Can access: Browse, Upload, Requests, Favorites, Dashboard
   - Cannot access: Admin routes directly
   
2. **Admin Account**:
   - Logout and login as admin
   - Can access: Admin Dashboard
   - Student routes may not apply same restrictions

---

## ❌ Test Scenario 8: Error Handling
**Expected Behavior**: App handles errors gracefully

**Steps**:
1. Try to login with **wrong password** → See error message ✓
2. Try to signup with **existing email** → See error message ✓
3. Try to upload **without selecting file** → See error message ✓
4. All errors should be shown in **Toast notifications** ✓

---

## 🔄 Test Scenario 9: Session Persistence
**Expected Behavior**: Login session persists on page refresh

**Steps**:
1. Login to account
2. Verify you're on Dashboard
3. Press F5 (refresh page)
4. You should **remain logged in** ✓
5. Close browser tab and reopen URL
6. You should **still be logged in** ✓
7. Go to ProfileAccess page
8. Click "Logout from all devices"
9. Refresh page
10. You should be **logged out now** ✓

---

## ✅ Manual Verification Checklist

After running these tests, verify:

- [ ] Home page shows correct auth buttons (Login/SignUp or Profile icon)
- [ ] Protected routes redirect to login when logged out
- [ ] Can access all student pages when logged in
- [ ] Mobile menu shows correct options
- [ ] Profile can be updated
- [ ] Updates appear in real-time
- [ ] Error messages display properly
- [ ] Session persists after refresh
- [ ] Logout works correctly
- [ ] Profile icon navigates to Profile page

---

## 🐛 If You Find Issues

1. **Check Browser Console** (F12)
   - Look for JavaScript errors
   - Check for network errors (API calls failing)

2. **Check Network Tab** (F12)
   - Verify Firebase requests are working
   - Check .env file has correct Firebase credentials

3. **Check Storage** (F12 → Application)
   - Look for stored user data
   - Check if localStorage has auth token

4. **Check Redux DevTools** (if installed)
   - Verify Zustand store state updates
   - Check if actions are dispatched correctly

5. **Check Build Errors**
   - Run: `npm run dev` (should have no errors)
   - All files should compile without issues

---

## 🚀 Performance Testing

### Test Load Times
1. Open DevTools → Network tab
2. Reload page
3. Check:
   - Page load time < 3 seconds ✓
   - No failed requests ✓
   - No console errors ✓

### Test Real-Time Performance
1. Open multiple tabs with same account
2. Update profile in one tab
3. Other tabs should reflect changes within 1 second ✓
4. No duplicate requests should fire ✓

---

## 📞 Support Checklist

If authentication isn't working:

- [ ] Firebase .env variables are correct
- [ ] Firebase project is initialized
- [ ] Firestore security rules allow user read/write
- [ ] Firebase Auth is enabled in console
- [ ] No network requests are blocked
- [ ] Browser doesn't have auth cookies disabled

If components aren't showing:

- [ ] Import paths are correct (relative imports)
- [ ] Component export is `export default`
- [ ] All dependencies are installed (`npm install`)
- [ ] No typos in component names
- [ ] CSS files are imported in components

---

## 🎉 Success Criteria

Your project is fully working when:

✅ Home page shows auth-aware navigation  
✅ Login/Logout flow works end-to-end  
✅ Protected routes redirect when needed  
✅ Profile page displays and updates  
✅ Resource pages are accessible when logged in  
✅ Real-time updates work across tabs  
✅ Mobile navigation works properly  
✅ No console errors  
✅ All builds without errors  
✅ Ready for deployment  

---

**Testing Environment**:
- Dev Server: http://localhost:5174
- Browser: Chrome/Firefox/Safari (latest)
- Network: Connected (Firebase requires internet)

**Good luck with testing!** 🚀
