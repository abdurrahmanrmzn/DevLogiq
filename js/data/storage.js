const STORAGE_KEYS = Object.freeze({
    projects: "devlogiq_projects",
    tasks: "devlogiq_tasks",
    goals: "devlogiq_goals",
    notes: "devlogiq_notes",
    settings: "devlogiq_settings"
});

function loadArray(key) {
    const storedJSON = localStorage.getItem(key);

    if (!storedJSON) {
        return [];
    }

    try {
        const value = JSON.parse(storedJSON);
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
}

function loadProjects() {
    return loadArray(STORAGE_KEYS.projects);
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function loadTasks() {
    return loadArray(STORAGE_KEYS.tasks);
}

function saveGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
}

function loadGoals() {
    return loadArray(STORAGE_KEYS.goals);
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
}

function loadNotes() {
    return loadArray(STORAGE_KEYS.notes);
}

function loadSettings() {
    const settingsJSON = localStorage.getItem(STORAGE_KEYS.settings);

    if (!settingsJSON) {
        return { theme: "light" };
    }

    try {
        const settings = JSON.parse(settingsJSON);
        return {
            theme: settings && settings.theme === "dark" ? "dark" : "light"
        };
    } catch {
        return { theme: "light" };
    }
}

function saveSettings(settings) {
    const nextSettings = {
        theme: settings && settings.theme === "dark" ? "dark" : "light"
    };

    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(nextSettings));
    return nextSettings;
}

function clearAppData() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}


export { saveProjects, loadProjects, saveTasks, loadTasks, saveGoals, loadGoals, saveNotes, loadNotes, saveSettings, loadSettings, clearAppData };