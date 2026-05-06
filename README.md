# Code Snippet Manager

Personal code snippet manager with a minimalist dark console aesthetic inspired by the "Virtual" design system.

## Features

- 📝 **Create & Manage Snippets** - Save code snippets with title, description, language, and tags
- 🔍 **Search & Filter** - Find snippets by keyword, language, or tags
- 🎨 **Syntax Highlighting** - Beautiful code preview with Prism.js
- 💾 **Local Storage** - All snippets saved locally in browser (Zustand + localStorage)
- 🖤 **Dark Console UI** - Minimalist Virtual theme with high contrast
- 📋 **Copy to Clipboard** - One-click code copying
- 🏷️ **Tag System** - Organize snippets with custom tags

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 with custom Virtual theme
- **State Management:** Zustand with localStorage persistence
- **Code Highlighting:** react-syntax-highlighter + Prism.js
- **Language:** TypeScript

## Design System — Virtual

Stark, high-contrast digital console interface:
- **Colors:** Midnight Void (#000000), Ghost White (#ffffff), Muted Ash (#666666), Accent Orange (#ff5c00)
- **Typography:** Staatliches (headlines), Helvetica Neue (body), JetBrains Mono (code)
- **Density:** Spacious layout with generous whitespace
- **Components:** Outlined buttons, card-based design, minimal decorative elements

## Project Structure

```
code-snippet-manager/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Virtual theme + Tailwind
│   └── api/                 # API routes (future)
│
├── features/
│   └── snippets/
│       ├── components/
│       │   ├── snippets-page.tsx      # Main page layout
│       │   ├── snippet-card.tsx       # Snippet preview card
│       │   ├── snippet-editor.tsx     # Create/edit modal
│       │   ├── snippet-detail.tsx     # Full snippet view
│       │   ├── search-bar.tsx         # Search input
│       │   └── filter-bar.tsx         # Language & tag filters
│       └── index.tsx                  # Barrel export
│
├── lib/
│   ├── types/index.ts       # TypeScript types & constants
│   └── store/
│       └── snippet-store.ts # Zustand store with persistence
│
└── _shared/                 # Shared utilities (future)
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/adityahimaone/code-snippet-manager.git
cd code-snippet-manager
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Usage

### Create a Snippet
1. Click **+ New Snippet** button
2. Fill in title, description, code, language, and tags
3. Click **Save Snippet**

### Search & Filter
- Use the search bar to find snippets by keyword
- Filter by language using the language buttons
- Click tags to filter by specific tags
- Click **Reset Filters** to clear all filters

### View Snippet
- Click any snippet card to view full code with line numbers
- Click **Copy** to copy code to clipboard
- Click **Delete** to remove snippet

### Edit Snippet
- Click a snippet card to open detail view
- (Future: Add edit button to modify existing snippets)

## Supported Languages

JavaScript, TypeScript, TSX, JSX, Python, Rust, Go, Java, CSS, HTML, Bash, SQL, JSON, YAML, Markdown, PHP, Shell, Dockerfile, GraphQL, Plain Text

## Data Persistence

All snippets are stored in browser's localStorage via Zustand. Data persists across sessions.

**Storage Key:** `snippet-storage`

To clear all snippets:
```javascript
localStorage.removeItem('snippet-storage');
```

## Future Enhancements

- [ ] Export snippets to JSON/CSV
- [ ] Import snippets from file
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Sharing snippets via URL
- [ ] Code execution/preview
- [ ] Syntax theme customization
- [ ] Keyboard shortcuts
- [ ] Dark/Light mode toggle
- [ ] Mobile app (React Native)

## Design Inspiration

- **Aerolab** — Stark dark theme with minimal accent color
- **Bruno** — High-contrast dark mode with custom typography
- **Locomotive** — Black backgrounds with strong grid structure
- **Akufen** — Dark UI with deliberate sparse color usage

## License

MIT

## Author

Aditya Himawan (@adityahimaone)
