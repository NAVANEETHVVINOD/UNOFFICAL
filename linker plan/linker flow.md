# <a name="xa13ac82badfd7a7048df34a6c369ad8f42c1c65"></a>**Updated Kerala College Platform Requirement Document**

_(Reconstructed and expanded from the uploaded “Untitled document.docx”)_

---

# <a name="roles-permissions-rbac-model"></a>**1. Roles & Permissions (RBAC Model)**

## <a name="roles"></a>**Roles**

1. **Student** (Default role for all users)
1. **Club Admin** (Responsible for managing specific clubs)
1. **College Admin** (Moderates college-level content & events)
1. **Platform Admin** (“God level” control – system-wide access)

## <a name="student-permissions"></a>**Student Permissions**

- Join college
- View & join clubs
- View/create marketplace listings (College-level & Kerala-level)
- Upload/view notes
- Suggest events
- Post in campus feed
- Edit own profile, portfolio & social links

## <a name="club-admin-permissions"></a>**Club Admin Permissions**

- Edit club profile (logo, description, banner)
- Add/remove club members & leads
- Create/edit club events
- Approve join requests
- Generate certificates for attendance
- Post updates to club feed

## <a name="college-admin-permissions"></a>**College Admin Permissions**

- Manage college-level details (about, contacts, departments…)
- Approve or highlight events
- Moderate campus feed & feedback

## <a name="platform-admin-permissions"></a>**Platform Admin Permissions**

- Manage all colleges & approvals
- Global bans
- Platform configurations
- Analytics

---

# <a name="information-architecture"></a>**2. Information Architecture**

The platform contains **5 core zones**:

1\. Public / Pre-login

` `2. Global Kerala Dashboard

` `3. College Hub Dashboard

4\. Clubs & Events System

5\. Profile & AI (AI in future phase)

---

# <a name="public-pre-login"></a>**2.1 Public / Pre-login**

### <a name="routes"></a>**Routes:**

- / – Landing Page (already partially designed)
- /login – Add illustrations/content
- /register – Enhanced onboarding flow

### <a name="registration-flow"></a>**Registration Flow**

1. User lands on homepage → clicks **Signup**
1. Enters **email + password** (Google login optional in future)
1. Selects **college from dropdown** (list of Kerala colleges)
1. Enters **basic profile info**: name, bio, interests
1. Verifies email (optional)
1. Auto-redirected to **Global Dashboard**
1. Club/College Admin request — handled separately via approval need a page for that

---

# <a name="global-dashboard-kerala-level"></a>**2.2 Global Dashboard (Kerala-level)**

**Route:** /dashboard (Currently college-level dashboard → will be replaced)

## <a name="sections"></a>**Sections**

### <a name="my-college-card"></a>**1. My College Card**

- Shows user’s college details
- Button: **Go to My College Hub** → /colleges/[slug]

### <a name="kerala-wide-highlights"></a>**2. Kerala-wide Highlights**

- Top Kerala-level events
- Featured marketplace items (scope = STATE)
- Trending notes across Kerala
- Optional social feed preview

### <a name="quick-actions"></a>**3. Quick Actions**

- Sell/Donate item (Marketplace)
- Upload Notes
- Suggest Event
- Edit Profile

### <a name="ai-assistant-entry-next-version"></a>**4. AI Assistant Entry** _(Next Version)_

- Floating widget
- Resume, LinkedIn posts, “What to do next semester”, etc.

---

# <a name="college-hub-per-college-dashboard"></a>**2.3 College Hub (Per-College Dashboard)**

**Route:** /colleges/[collegeSlug]

This is the **main hub** for each college. Contains: - Overview - Clubs & Communities - Events - Marketplace - Notes & Study Resources - Campus Feed & Feedback

---

## <a name="a.-overview-tab"></a>**A. Overview Tab**

- College description, website, map
- Departments, initiatives (IEDC, NSS, etc.)
- Stats: no. of events, clubs, active users
- Edit button for College Admin

---

## <a name="b.-clubs-communities-tab"></a>**B. Clubs & Communities Tab**

- List of clubs (cards)
- Each card shows:
  - Club name
  - Category (tech, arts, cultural…)
  - Tagline
  - View Club → /clubs/[id]

### <a name="club-features-include"></a>**Club Features Include:**

- Current & upcoming events & events that are completed
- Members & leads
- Club roles (chair, core team, volunteer…) for display only
- Register/Attend buttons for events

### <a name="flow-for-students"></a>**Flow for Students:**

1. Open College Hub → Clubs
1. Browse → Open specific club
1. View details
1. Click **Join Club**
1. Auto-join OR request approval (if required)
1. Appears in “My Clubs” section of profile

### <a name="club-admin-features"></a>**Club Admin Features:**

- Manage members
- Create/Edit events
- Generate certificates for event attendees

### <a name="college-admin"></a>**College Admin:**

- Create new clubs

---

## <a name="c.-events-college-events"></a>**C. Events (College Events)**

### <a name="features"></a>**Features:**

- List of upcoming & past events
- Event info: title, date, time, venue, organizer
- Count of registered attendees
- Tags for event type (Workshop, Hackathon…)

### <a name="student-actions"></a>**Student Actions:**

- Mark as **Interested**
- **Register**
- View attending list
- QR scan for attendance

### <a name="event-creation-flow"></a>**Event Creation Flow:**

1. Club/College Admin opens “Create Event”
1. Fills:
   - Title, description
   - Date/time
   - Venue
   - Event type
   - Banner image
1. Submits
1. Optional: College Admin approves
1. Event is published
1. Students notified

### <a name="certificate-generation"></a>**Certificate Generation:**

- Admin uploads a **template design** once
- For each event → System generates personalized certificates for attendees
- Certificates stored in user profiles

---

## <a name="d.-marketplace-tab"></a>**D. Marketplace Tab**

### <a name="categories"></a>**Categories:**

- Items (books, electronics)
- Services (assignments, design, freelancing)
- Rent items
- Donate / Free

### <a name="features-1"></a>**Features:**

- Scope selection: **College only** / **All Kerala**
- Listing details:
  - Title, description
  - Price / free
  - Images
  - Contact (in-app messaging)

### <a name="listing-flow"></a>**Listing Flow:**

1. User clicks “Create Listing”
1. Selects category
1. Adds images, description, price
1. Selects scope
1. Listing goes live

---

## <a name="e.-notes-study-tab"></a>**E. Notes & Study Tab**

### <a name="features-2"></a>**Features:**

- Upload notes/resources (PDF, docs, images)
- University filter (KTU)
- Course code, subject, semester filters
- Cards display:
  - Title
  - Uploader
  - Type (Notes / PPT / QN Paper)

### <a name="student-actions-1"></a>**Student Actions:**

- View / Download
- Report inappropriate content

---

## <a name="f.-campus-feed-feedback-tab"></a>**F. Campus Feed & Feedback Tab**

Consists of 4 sub-sections: -\
` `Feed (normal posts) - General campus posts \
Anonymous feed -\
` `Feedback/Suggestions \
` `<a name="feed"></a>Channels (study/project circle, podcast announcements)\
**Feed**

- Non-anonymous posts
- Images, tags
- Comments

### <a name="anonymous-corner"></a>**Anonymous Corner**

- Confessions
- Event feedback
- College issues

### <a name="feedback-suggestions-module"></a>**Feedback & Suggestions Module:**

Fields: - Category (Event / Club / Academics / Facility) - Description

### <a name="circles-future"></a>**Circles (Future):**

- GATE prep groups
- Web dev circles
- Podcast announcements

---

# <a name="clubs-deep-page"></a>**2.4 Clubs: Deep Page**

**Route:** /clubs/[id]

### <a name="sections-1"></a>**Sections:**

- Header (logo, name, category, banner)
- Leads & Core Members
- About
- Members
- Upcoming & past events
- Resources section
- Join/Leave button
- Manage (for club admins)

### <a name="club-membership-model"></a>**Club Membership Model:**

Internal roles: - Admin - Member

Display roles: - Chair - Vice Chair - Lead - Core Team - Volunteer

Display roles do **not** affect permissions.

---

# <a name="profile-ai-future"></a>**2.5 Profile & AI (Future)**

**Routes:** /profile, /profile/edit

Profile includes: - Name, photo, bio - College, department, year - KTU ID - Social links - Interests & skills - Section for: - Events attended - Clubs joined - Volunteering - Projects - Certificates

- Future additions: - Resume builder - LinkedIn content generator - Personalized recommendations\
  \
   **Basic Info**\
  \
  - Name, avatar, bio
  - College, department, year
  - Socials: LinkedIn, GitHub, Instagram, personal website

- **Experience & Activities** _(driven from other modules)_\
  \
  - Event roles (from events_participation table: role = organiser/speaker/volunteer/participant)
  - Club roles (club lead, coordinator)
  - Volunteering experiences
  - Projects (can either be manually added or linked from a projects module later)
  - Internships / work experience

- **Interests & Skills**\
  \
  - Tags like Web dev, AI/ML, Design, NSS, etc.
  - This will be important for AI + networking

- **Portfolio / Resume Tools**\
  \
  - Buttons:
    - Generate Resume (export PDF later)
    - Generate LinkedIn About
    - Generate Social Media Post about X

These will call your **AI Assistant backend**, which uses profile + activity data.

\

---

# <a name="key-workflows"></a>**3. Key Workflows**

## <a name="login-register"></a>**Login & Register**

- Register → backend creates User + Profile
- Login → redirect /dashboard
- If no college set → /select-college
- If onboarding: let user add interests + social links fill up the profile page

## <a name="dashboard-college-hub"></a>**Dashboard → College Hub**

- User clicks **Go to My College**
- Redirect /colleges/[slug]

## <a name="marketplace-create-listing"></a>**Marketplace Create Listing**

- User fills form → backend saves → redirect to listing page

## <a name="upload-notes"></a>**Upload Notes**

- Form → POST → redirect back to college notes tab

## <a name="join-club"></a>**Join Club**

- Click → auto-join or request approval

## <a name="suggest-event"></a>**Suggest Event**

- Student fills form
- College admin approves/rejects

## <a name="anonymous-post"></a>**Anonymous Post**

- Warning shown → submit → pending moderation

### Generate Resume / LinkedIn Post

Button: Generate Resume

1. Frontend:
   1. POST /ai/resume with minimal payload or just userId (backend fetches rest)
1. Backend:
   1. Aggregates:
      1. Profile basic info
      1. Events with roles (organiser/volunteer)
      1. Clubs with positions (lead/member)
      1. Projects, volunteering, internships
   1. Calls AI model / service to generate structured resume content
1. Frontend:
   1. Show generated content in editor
   1. Options: Download PDF, Copy text

Similarly for Generate LinkedIn About:

POST /ai/linkedin-about → return text paragraph.

##

## <a name="certificate-generation-flow"></a>**Certificate Generation Flow**

1. Admin opens event attendance list
1. Selects template
1. System generates certificates for each attendee
1. Uploads to user profiles

---

# <a name="route-structure-updated"></a>**4. Route Structure (Updated)**

### <a name="public"></a>**Public**

- / – Landing
- /login
- /register

### <a name="global"></a>**Global**

- /dashboard – Kerala-wide dashboard

### <a name="college-level"></a>**College-Level**

- /colleges
- /colleges/[slug] – College hub
  - /overview
  - /clubs
  - /events
  - /marketplace
  - /notes
  - /feed

### <a name="clubs"></a>**Clubs**

- /clubs/[id]

### <a name="marketplace"></a>**Marketplace**

- /marketplace/create
- /marketplace/[id]

### <a name="notes"></a>**Notes**

- /notes/upload
- /notes/[id]

### <a name="profile"></a>**Profile**

- /profile
- /profile/edit
