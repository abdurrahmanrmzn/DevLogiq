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


export { saveProjects, loadProjects, saveTasks, loadTasks };