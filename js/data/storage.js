function saveProjects(projects) {
    localStorage.setItem(
        "devlogiq_projects",
        JSON.stringify(projects)
    );
}

function loadProjects() {
    const projectsJSON = localStorage.getItem("devlogiq_projects");

    return projectsJSON ? JSON.parse(projectsJSON) : [];
}

function saveTasks(tasks) {
    localStorage.setItem(
        "devlogiq_tasks",
        JSON.stringify(tasks)
    );
}

function loadTasks() {
    const tasksJSON = localStorage.getItem("devlogiq_tasks");

    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveGoals(goals) {
    localStorage.setItem(
        "devlogiq_goals",
        JSON.stringify(goals)
    );
}

function loadGoals() {
    const goalsJSON = localStorage.getItem("devlogiq_goals");

    if (!goalsJSON) {
        return [];
    }

    try {
        const goals = JSON.parse(goalsJSON);
        return Array.isArray(goals) ? goals : [];
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    localStorage.setItem(
        "devlogiq_notes",
        JSON.stringify(notes)
    );
}

function loadNotes() {
    const notesJSON = localStorage.getItem("devlogiq_notes");

    if (!notesJSON) {
        return [];
    }

    try {
        const notes = JSON.parse(notesJSON);
        return Array.isArray(notes) ? notes : [];
    } catch {
        return [];
    }
}

function loadSettings() {
    const settingsJSON = localStorage.getItem("devlogiq_settings");

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

    localStorage.setItem("devlogiq_settings", JSON.stringify(nextSettings));
    return nextSettings;
}

function clearAppData() {
    [
        "devlogiq_projects",
        "devlogiq_tasks",
        "devlogiq_goals",
        "devlogiq_notes",
        "devlogiq_settings"
    ].forEach((key) => localStorage.removeItem(key));
}


export { saveProjects, loadProjects, saveTasks, loadTasks, saveGoals, loadGoals, saveNotes, loadNotes, saveSettings, loadSettings, clearAppData };