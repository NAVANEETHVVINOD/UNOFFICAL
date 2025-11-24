# <a name="software-requirements-specification-srs"></a>**Software Requirements Specification (SRS)**
## <a name="xd86c4d74f158d48f5c6f654bbcbbab91dfa55b6"></a># **Kerala College Digital Platform (SaaS / PaaS)**
## <a name="introduction"></a>**1. Introduction**
### <a name="purpose"></a>**1.1 Purpose**
This SRS defines all functional and non-functional requirements for a statewide college digital ecosystem intended for students across Kerala. The system acts as a centralized SaaS/PaaS platform enabling: - College-level community features - Statewide features - Marketplace - Notes and study resources - Clubs & events management - QR attendance + certificate automation - Profiles & portfolios - In-app communication - Highly scalable multi-college structure

The platform will later integrate AI capabilities, networking features, alumni mode, and gamified engagement.

-----
## <a name="overall-description"></a>**2. Overall Description**
### <a name="system-perspective"></a>**2.1 System Perspective**
The system is a multi-tenant platform serving **all colleges in Kerala**, with individual college hubs and a global Kerala-wide dashboard.

The system has two main interfaces: 1. **Web Application (Next.js frontend)** 2. **Server-side API (NestJS + Prisma backend)**

A structured RBAC system controls permissions.
### <a name="users-of-the-system"></a>**2.2 Users of the System**
- **Student (default)**
- **Club Admin**
- **College Admin**
- **Platform Admin**

Future roles: - Alumni - Recruiter - Faculty
### <a name="product-features-summary"></a>**2.3 Product Features Summary**
- Global dashboard
- College-level dashboard
- Clubs & membership system
- Events (create, register, QR attendance)
- Certificates from templates
- Marketplace (Items / Services / Rent / Donate)
- Notes & study resources
- Campus feed (normal + anonymous)
- Feedback & suggestion module
- Profiles and portfolios
- In-app messaging
- Social discovery (future)
- AI career assistant (future)
- Gamification and badges (Phase 2)
-----
# <a name="system-requirements"></a>**3. System Requirements**
## <a name="functional-requirements"></a>**3.1 Functional Requirements**

|## **3.1.1 Authentication & Onboarding**|
| :- |
|## **3.1.2 Global Kerala Dashboard** Route: /dashboard|
|### **FR-4: My College Card** Display: - College name - Logo - Button: **Go to College Hub** → /colleges/[slug]|
|### **FR-5: Kerala-wide Highlights** - Trending events - Popular marketplace items (scope = STATE) - Popular notes (high downloads) - Global social feed snippets|
|### **FR-6: Quick Actions** - Sell/Donate item - Upload notes - Edit profile - Suggest event|
## <a name="college-hub-per-college-dashboard"></a>**3.1.3 College Hub (Per-College Dashboard)**
Route: /colleges/[slug]

Tabs: - Overview - Clubs - Events - Marketplace - Notes - Campus Feed
### <a name="fr-7-college-overview"></a>**FR-7: College Overview**
- College description & website
- Initiatives (IEDC, NSS, etc.)
- Stats: events/month, active users, clubs count
- College admin can edit
### <a name="fr-8-clubs-communities"></a>**FR-8: Clubs & Communities**
- List of all clubs for the college
- Club details: members, leads, events
- Students can join
- Club admins manage members & events
- Display hierarchy (Chair / Lead / Core Member / Volunteer)
### <a name="fr-9-events-college-level"></a>**FR-9: Events (College Level)**
- Create events (club/college admin)
- Student registration
- “Interested” tracking
- QR check-in support
- Attendance listing
- Certification generation
### <a name="fr-10-marketplace-college-scope"></a>**FR-10: Marketplace (College Scope)**
- College-specific items & services
- Support categories:
  - Items
  - Services (assignments, design, freelancing)
  - Rent items
  - Donate items
- Scope field: COLLEGE or STATE
- Contact via in-app messaging
### <a name="fr-11-notes-study-resources"></a>**FR-11: Notes & Study Resources**
- Upload study materials
- Tag by subject, course code, KTU, semester
- Filters: Year, Subject, University
- Rating system for quality (Phase 2)
### <a name="fr-12-campus-feed"></a>**FR-12: Campus Feed**
- Normal posts
- Anonymous posts
- Feedback & suggestion module
- Study/Project Circles (Phase 2)

|## **3.1.4 Clubs System**|
| :- |
|## **3.1.5 Events System**|
|### **FR-15: Event Creation** Event form must include: - Title, description - Organizer (club/college) - Banner image - Venue, date, time - Max attendees - Scope (College / State)|
|### **FR-16: Student Registration** Students can: - Register - Mark “Interested” - See attendees|
|### **FR-17: QR Attendance** - System generates unique QR per event - Students scan & auto-check-in - Attendance saved in database|
|### **FR-18: Certificate Generation** - Admin uploads certificate design - System generates personalized certificates for all attendees - Stores in user’s profile|
## <a name="marketplace"></a>**3.1.6 Marketplace**
### <a name="fr-19-create-listing"></a>**FR-19: Create Listing**
Form includes: - Title - Price / Free - Category - Images - Scope: COLLEGE / STATE - Contact method (in-app chat)
### <a name="fr-20-search-filter"></a>**FR-20: Search & Filter**
- Category filter
- Price filter
- College filter (if STATE scope)
### <a name="fr-21-in-app-messaging"></a>**FR-21: In-App Messaging**
- Buyer ↔ Seller chat
- Saved conversations
- Notification on new messages

|## **3.1.7 Notes Module**|
| :- |
|## **3.1.8 Profile & Portfolio**|
|### **FR-24: Basic Profile** Includes: - Name, bio - College, department, year - Interests - KTU ID - Social links|
|### **FR-25: Activities Section** Shows: - Events attended - Club roles - Volunteering - Uploaded notes - Marketplace items|
|### **FR-26: Certificates Section** - Auto-generated certificates from events - Admin uploaded certificates|
## <a name="messaging-system"></a>**3.1.9 Messaging System**
### <a name="fr-27-one-on-one-messaging"></a>**FR-27: One-on-one Messaging**
- For marketplace primarily
- For club communication
### <a name="fr-28-group-messaging-optional-future"></a>**FR-28: Group Messaging (Optional Future)**
- Club group chats
- Event group chats

|## **3.1.10 Admin Functionality**|
| :- |
|### **FR-29: Club Admin** - Manage members - Create/edit events - Upload certificate templates|
|### **FR-30: College Admin** - Approve events - Edit college information - Moderate campus feed|
|### **FR-31: Platform Admin** - Manage colleges - Global bans - Verify admins - Analytics dashboard|
# <a name="non-functional-requirements"></a>**3.2 Non-Functional Requirements**
### <a name="nfr-1-performance"></a>**NFR-1: Performance**
- Page loads must complete within 2 seconds under normal load.
- Marketplace & events queries must be optimized via pagination.
### <a name="nfr-2-security"></a>**NFR-2: Security**
- JWT-based auth
- RBAC enforced server-side
- Rate limiting on posting
- Sanitization for uploads
### <a name="nfr-3-availability"></a>**NFR-3: Availability**
- 99.5% uptime target
- Vercel deployment for web
- Scalable server deployment
### <a name="nfr-4-usability"></a>**NFR-4: Usability**
- Mobile-first design
- Simple onboarding flow
- Consistent UI/UX across pages
### <a name="nfr-5-extensibility"></a>**NFR-5: Extensibility**
Future features must be easy to integrate: - Alumni mode - Recruiter portal - AI-powered assistant - Gamification system - Broadcast messaging

-----
# <a name="system-models"></a>**4. System Models**
## <a name="use-case-summary"></a>**4.1 Use Case Summary**
### <a name="uc-1-student-login"></a>**UC-1: Student Login**
- Student logs in → redirected to global dashboard.
### <a name="uc-2-enter-college-hub"></a>**UC-2: Enter College Hub**
- Student views college-level interface with clubs, events, marketplace.
### <a name="uc-3-create-event-club-admin"></a>**UC-3: Create Event (Club Admin)**
- Club admin creates event → college admin approves → event goes live.
### <a name="uc-4-attend-event-via-qr"></a>**UC-4: Attend Event via QR**
- Student scans QR → attendance auto-updated.
### <a name="uc-5-generate-certificates"></a>**UC-5: Generate Certificates**
- Admin selects template → system generates bulk certificates.
### <a name="uc-6-marketplace-transaction"></a>**UC-6: Marketplace Transaction**
- Buyer views listing → messages seller → completes deal.
-----
# <a name="future-scope"></a>**5. Future Scope**
- AI assistant for resume, suggestions, career mapping
- Alumni network
- Internship/job board
- Gamified levels & badges
- Advanced analytics for colleges (paid feature)
- Student-project marketplace
- Live activity feed & personalized recommendations
-----
# <a name="appendices"></a>**6. Appendices**
- DB schema expansion plan
- API route map (backend)
- Component map (frontend)
-----
# <a name="end-of-document"></a>**END OF DOCUMENT**
