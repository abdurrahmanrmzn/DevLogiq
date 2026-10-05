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