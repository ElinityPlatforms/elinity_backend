# 🧪 ELINITY FRONTEND - COMPREHENSIVE TESTING GUIDE

## 📋 **Testing Overview**

This guide provides step-by-step instructions for testing all features of the Elinity frontend application.

---

## 🚀 **Prerequisites**

### **1. Start the Development Server**

```bash
cd c:\Users\nabhi\Downloads\python_elinity-main2\elinity-backend-github\Elinity-WebApp-master\Elinity_webapp
npm run dev
```

The server should start on **http://localhost:5173** (or the port shown in terminal)

### **2. Backend Status**
- Backend URL: **http://136.113.118.172**
- Ensure backend is accessible

---

## 🧪 **TEST SUITE**

### **TEST 1: Authentication Flow** ✅

#### **1.1 Register New User**
1. Navigate to http://localhost:5173
2. Click "Register" or "Sign Up"
3. Fill in registration form:
   - Email: test@elinity.com
   - Password: Test123!
   - Full Name: Test User
4. Click "Register"
5. **Expected**: Redirect to dashboard or onboarding

#### **1.2 Login**
1. Navigate to login page
2. Enter credentials:
   - Email: test@elinity.com
   - Password: Test123!
3. Click "Login"
4. **Expected**: Redirect to dashboard with user data

#### **1.3 Token Persistence**
1. After login, refresh the page
2. **Expected**: User remains logged in

---

### **TEST 2: Dashboard** ✅

#### **2.1 View Dashboard**
1. After login, check dashboard page
2. **Expected**: See:
   - Personal statistics
   - Daily cards
   - Activity feed
   - Navigation sidebar

---

### **TEST 3: Profile Management** ✅

#### **3.1 View Profile**
1. Click "Profile" in sidebar
2. **Expected**: See user profile with all details

#### **3.2 Edit Profile**
1. Click "Edit Profile" button
2. Navigate through all 7 sections:
   - Personal Info
   - Big Five Personality
   - MBTI Type
   - Interests & Hobbies
   - Values & Life Goals
   - Favorites
   - Lifestyle
3. Make changes in each section
4. Click "Save" for each section
5. **Expected**: Changes saved successfully

---

### **TEST 4: Community Features** ✅

#### **4.1 Browse Community Feed**
1. Navigate to "Community" page
2. **Expected**: See list of posts with:
   - Author information
   - Post content
   - Like counts
   - Comment counts

#### **4.2 Create New Post**
1. Click "Create Post" button
2. Enter post content
3. Click "Submit"
4. **Expected**: Post created and visible in feed

#### **4.3 View Post Details**
1. Click on any post
2. **Expected**: See:
   - Full post content
   - Comments section
   - Like button

#### **4.4 Add Comment**
1. On post detail page
2. Enter comment text
3. Click "Comment"
4. **Expected**: Comment added to post

---

### **TEST 5: Events** ✅

#### **5.1 Browse Events**
1. Navigate to "Events" page
2. **Expected**: See list of events with:
   - Event title
   - Date and time
   - Location
   - Attendee count

#### **5.2 Create Event**
1. Click "Create Event"
2. Fill in event details:
   - Title
   - Description
   - Date
   - Time
   - Location
   - Max attendees
3. Click "Create Event"
4. **Expected**: Event created successfully

#### **5.3 RSVP to Event**
1. Click "RSVP" on any event
2. **Expected**: RSVP status updated

---

### **TEST 6: Quizzes** ✅

#### **6.1 Browse Quizzes**
1. Navigate to "Quizzes" page
2. **Expected**: See available quizzes

#### **6.2 Take Quiz**
1. Click "Start Quiz" on any quiz
2. Answer questions:
   - Multiple choice questions
   - Scale questions
   - Text questions
3. Navigate through questions
4. Submit quiz
5. **Expected**: 
   - Progress bar updates
   - Completion screen shown
   - Answers saved

---

### **TEST 7: Sanctuary & Tools** ✅

#### **7.1 View Rituals**
1. Navigate to "Sanctuary" page
2. **Expected**: See rituals list

#### **7.2 Complete Ritual**
1. Click "Complete" on a ritual
2. **Expected**: Ritual marked as complete

#### **7.3 View Moodboards**
1. Scroll to moodboards section
2. **Expected**: See moodboards

---

### **TEST 8: Lifebook** ✅

#### **8.1 Browse Categories**
1. Navigate to "Lifebook" page
2. **Expected**: See categories:
   - Personal Growth
   - Relationships
   - Career
   - Health
   - etc.

#### **8.2 Create Entry**
1. Click on a category
2. Click "New Entry"
3. Fill in:
   - Title
   - Content
4. Click "Save Entry"
5. **Expected**: Entry created

#### **8.3 View Entries**
1. In category page
2. **Expected**: See all entries for that category

#### **8.4 Delete Entry**
1. Click delete icon on an entry
2. **Expected**: Entry removed

---

### **TEST 9: Blogs** ✅

#### **9.1 Browse Articles**
1. Navigate to "Blogs" page
2. **Expected**: See:
   - Featured article
   - Article grid
   - Search bar

#### **9.2 Search Articles**
1. Enter search term in search bar
2. **Expected**: Articles filtered

#### **9.3 Read Article**
1. Click on any article
2. **Expected**: See:
   - Full article content
   - Author information
   - Related articles

---

### **TEST 10: Lumi AI Chat** ✅

#### **10.1 Open Chat**
1. Navigate to "Lumi" page
2. **Expected**: See chat interface

#### **10.2 Send Message**
1. Type message in input
2. Press Enter or click Send
3. **Expected**:
   - Message appears in chat
   - Typing indicator shows
   - AI response received

#### **10.3 Use Suggestions**
1. Click on suggestion chip
2. **Expected**: Message sent automatically

---

### **TEST 11: Subscription** ✅

#### **11.1 View Plans**
1. Navigate to "Subscription" page
2. **Expected**: See:
   - Free tier
   - Premium tier
   - Elite tier
   - Feature comparisons

#### **11.2 View Referrals**
1. Scroll to referral section
2. **Expected**: See:
   - Referral code
   - Referral stats

---

### **TEST 12: Notifications** ✅

#### **12.1 View Notifications**
1. Navigate to "Notifications" page
2. **Expected**: See notifications list

#### **12.2 Filter Notifications**
1. Click filter tabs (All, Unread, Matches, Messages, Events)
2. **Expected**: Notifications filtered

#### **12.3 Mark as Read**
1. Click mark as read icon
2. **Expected**: Notification marked as read

---

### **TEST 13: Admin Dashboard** ✅

#### **13.1 View Statistics**
1. Navigate to "Admin" page (if admin user)
2. **Expected**: See:
   - Total users
   - Active users
   - Total matches
   - System health

---

### **TEST 14: Chat & Messaging** ✅

#### **14.1 View Chats**
1. Navigate to "Chat" page
2. **Expected**: See chat list

#### **14.2 Send Message**
1. Click on a chat
2. Type and send message
3. **Expected**: Message sent

---

### **TEST 15: Recommendations** ✅

#### **15.1 View Matches**
1. Navigate to "Recommendations" page
2. **Expected**: See:
   - Recommended users
   - Compatibility scores
   - Match details

---

### **TEST 16: Journal** ✅

#### **16.1 Create Entry**
1. Navigate to "Journal" page
2. Click "New Entry"
3. Fill in mood and content
4. Save entry
5. **Expected**: Entry created

---

### **TEST 17: Games** ✅

#### **17.1 Browse Games**
1. Navigate to "Games" page
2. **Expected**: See 40+ games

---

## 🐛 **Bug Reporting Template**

When you find a bug, report it with:

```markdown
### Bug: [Short Description]

**Page**: [Page name]
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happens]
**Error Message**: [If any]
**Screenshot**: [If applicable]
**Browser**: [Chrome/Firefox/etc.]
**Priority**: [High/Medium/Low]
```

---

## ✅ **Test Results Checklist**

### **Core Functionality**
- [ ] Authentication works
- [ ] Dashboard loads
- [ ] Profile editing works
- [ ] Navigation works

### **Social Features**
- [ ] Posts can be created
- [ ] Comments work
- [ ] Likes work
- [ ] Events can be created

### **Content Features**
- [ ] Quizzes work
- [ ] Lifebook entries work
- [ ] Blogs load
- [ ] Journal works

### **AI Features**
- [ ] Lumi chat works
- [ ] Recommendations load

### **Admin Features**
- [ ] Admin dashboard loads
- [ ] Statistics display

### **UI/UX**
- [ ] Design looks premium
- [ ] Animations are smooth
- [ ] Loading states show
- [ ] Error handling works
- [ ] Mobile responsive

---

## 📊 **Expected Results**

### **All Tests Should Pass**
- ✅ No console errors
- ✅ All pages load
- ✅ All forms submit
- ✅ All API calls work
- ✅ UI is responsive
- ✅ Animations are smooth

### **Known Issues (Expected)**
- Some TypeScript warnings (non-blocking)
- Some API endpoints may return mock data
- Network pages use placeholders

---

## 🎯 **Success Criteria**

The application is considered **READY FOR PRODUCTION** if:

1. ✅ All authentication flows work
2. ✅ All pages load without errors
3. ✅ All forms can be submitted
4. ✅ All API integrations work
5. ✅ UI is visually appealing
6. ✅ No critical bugs
7. ✅ Mobile responsive
8. ✅ Performance is acceptable

---

## 📝 **Testing Notes**

### **Backend Connection**
- Backend: http://136.113.118.172
- If backend is down, some features may not work
- Check browser console for API errors

### **Browser Console**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### **Local Storage**
- JWT tokens stored in localStorage
- Clear localStorage to test fresh login

---

## 🚀 **Quick Start Testing**

### **5-Minute Smoke Test**
1. Open http://localhost:5173
2. Register/Login
3. View dashboard
4. Edit profile
5. Create a post
6. Take a quiz
7. Chat with Lumi
8. Create lifebook entry

If all 8 steps work, **core functionality is confirmed** ✅

---

## 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Verify backend is accessible
3. Clear browser cache
4. Try incognito mode
5. Report bugs using template above

---

**Happy Testing!** 🎉

---

*Testing Guide Created: January 27, 2026, 12:00 PM IST*
