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


export { saveProjects, loadProjects, saveTasks, loadTasks, saveGoals, loadGoals, saveNotes, loadNotes };