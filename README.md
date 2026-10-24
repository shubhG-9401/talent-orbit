# TalentOrbit — Tech Discovery & Organizer Workspace

An ultra-clean, minimalist, and spacious web application for students discovering hackathons, workshops, and internships, with a completely separate Host/Organizer Workspace.

---

## 🎨 Design Philosophy & Palette

- **Background:** Pure Deep Black (`#080808` / `#000000`) — flat, distraction-free, inspired by modern Vercel/Next.js personal developer sites.
- **Surfaces & Cards:** Dark charcoal (`#0F0F12` / `#121216`) with subtle thin zinc borders (`border-zinc-800`).
- **Typography:** Crisp True White (`#FFFFFF`) for titles, soft muted gray (`#A1A1AA` / `zinc-400`) for descriptions.
- **Buttons & Highlights:** Vibrant Royal/Electric Blue (`#2563EB` / `#3B82F6`) for primary CTA buttons, active tabs, and match scores. Secondary buttons: Flat Black/White outline (`border-zinc-700 text-white hover:bg-zinc-900`).
- **Spacing:** Wide container (`max-w-6xl mx-auto`), generous breathing room (`py-12`, `px-6`, `gap-8`), smooth `rounded-xl` and `rounded-2xl` corners.

---

## 🚀 Key Features

### 1. Global Navigation Bar
- Fixed top navigation with brand logo ("TalentOrbit" in bold white).
- Text navigation links: **Explore Events**, **Internships**, **My Applications**.
- City selector dropdown pill ("📍 Bengaluru", "Delhi NCR", "Mumbai", "Remote").
- **Host Workspace** switcher button and student profile avatar.

### 2. Student Discovery & Matching
- Large clean white headline: *"Find Tech Hackathons & Internships"*.
- Padded search input with tech stack and city filtering tags (`All`, `Hackathons`, `Internships`, `Node.js`, `Python`, `React`, `Remote`).
- **Gemini AI Recommendation Banner:** High-visibility spacious card (`border-blue-500/30`, `p-8`) with sparkle badge, plain-English repository match rationale, and *"View Match (95%)"* button.
- Opportunity cards with host avatar, tech stack pills, rewards (e.g. *"₹50,000 Prize Pool"* or *"₹45,000/mo"*), participation badge, and *"View & Register"* button.

### 3. Event Registration & Host App Modal
- Centered dialog with 3 steps:
  1. **Mode Selection:** Selectable cards for *"Register as Individual"* or *"Create/Join a Team"*.
  2. **Team Details:** Create new team with automated 6-character invite code generation (e.g. `ORB92A`) or join existing team with code.
  3. **Host Companion App Notice:** Callout box when host requires their companion app: *"📌 Host Requirement: Download the [Host App Name] mobile app to complete mandatory tasks before check-in"* with Android APK & iOS download buttons and acknowledgment checkbox.

### 4. Student Profile & GitHub Integration
- Student bio, verified student badge, and city.
- Connected GitHub account syncing top 3 languages (`Node.js`, `TypeScript`, `Python`) and repository highlights.
- Skill Tag Cloud with interactive **+ Add Skill** and remove buttons.
- Real-time application tracker showing statuses (`Pending Review`, `Approved`, `Declined`).
- **Share Public Profile** button with one-click clipboard copy.

### 5. Host & Organizer Workspace (Separate View)
- Dedicated organizer views: **Create New Event**, **Review Applicants**, **My Events**.
- **AI Event Builder:** Powered by Google Gemini API (`@google/genai`). Type natural language ideas (e.g., *"Create a 2-day student hackathon in Bengaluru for backend engineers with prizes up to 1 Lakh and teams of 2-4"*) to auto-generate title, description, skills, and parameters.
- **Real-time Live Preview:** Side-by-side card previewing the opportunity exactly as students will see it.
- **Applicant Review Board:** Spacious table displaying student/team names, GitHub links, skills, host app completion status, and instant **Approve** / **Decline** actions.

---

## 🗄️ Database Schema (`prisma/schema.prisma`)

Configured for PostgreSQL with Prisma ORM:
- `User` (STUDENT or HOST, skills, GitHub, LinkedIn, city)
- `Event` (HACKATHON, INTERNSHIP, WORKSHOP, reward, participation mode, companion app requirement)
- `Team` & `TeamMember` (leader, members, unique 6-character invite codes)
- `Registration` (student/team application status, companion app download completion)

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/talentorbit?schema=public"
GEMINI_API_KEY="your-google-gemini-api-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="talent-orbit-ultra-clean-secret-key-2026"
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
