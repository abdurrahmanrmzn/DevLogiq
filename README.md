# DevLogiq

> A personal developer workspace for managing coding projects, tasks, learning goals, and technical notes.

## Overview

DevLogiq is a lightweight developer workspace built with Vanilla JavaScript.

It provides a centralized place to organize software development work, track project progress, manage tasks and learning goals, and keep technical notes.

The application runs entirely in the browser and uses `localStorage` for client-side data persistence.

## Features

### 📁 Project Management
- Create, edit, and delete projects
- Define project status and priority
- Add project technologies
- Set project deadlines
- View project details
- Track project progress based on completed tasks
- Search, filter, and sort projects

### ✅ Task Management
- Create, edit, and delete tasks
- Associate tasks with projects
- Set task status and priority
- Add due dates
- Search, filter, and sort tasks
- Automatically contribute to project progress

### 🎯 Learning Goals
- Create, edit, and delete learning goals
- Track progress from 0–100%
- Assign categories
- Set target dates
- Mark goals as completed
- Search, filter, and sort goals

### 📝 Technical Notes
- Create, edit, and delete notes
- Associate notes with projects
- Search notes
- Track creation and update timestamps

### 📊 Dashboard
- Total and active projects
- Total and completed tasks
- Task completion percentage
- Total and completed learning goals
- Project progress tracking
- Upcoming deadlines
- Recent activity

### ⚙️ Settings & Data Management
- Light and dark themes
- Export application data as JSON
- Import DevLogiq backups
- Validation of imported data
- Clear all application data
- Persistent settings

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Browser LocalStorage API

No backend or external database is required.

## Project Structure

```text
DevLogiq/
├── index.html
├── css/
│   ├── style.css
│   └── layout.css
├── js/
│   ├── app.js
│   └── data/
│       └── storage.js
├── assets/
├── .gitignore
└── README.md
```

## Application State

The application state is managed in `app.js`, while browser persistence is handled through the dedicated `storage.js` module.

## Data Storage

DevLogiq uses the browser's `localStorage` API for client-side data persistence.

The application stores:

- Projects
- Tasks
- Learning goals
- Notes
- Settings

Users can export their application data as a JSON backup and restore it later through the **Settings** page.

## Project Status

**Version:** `1.0`

DevLogiq v1 provides a complete personal developer workspace with:

- Project management
- Task tracking
- Learning goals
- Technical notes
- Dashboard analytics
- Theme customization
- Data backup and restoration

The current version focuses on client-side functionality and local data persistence.

## Future Improvements

Potential future improvements include:

- Backend integration
- User authentication
- Cloud data synchronization
- Database persistence
- Collaboration features
- Advanced analytics
- GitHub integration
- Notifications
- AI-assisted developer workflows

## Author

**Abdur Rahman Ramzan**  
*Software Engineering Undergraduate*

- **GitHub:** [Abd-rahman-dev](https://github.com/Abd-rahman-dev)
- **LinkedIn:** [Abdur Rahman Ramzan](https://www.linkedin.com/in/abdurrahman-ramzan)
