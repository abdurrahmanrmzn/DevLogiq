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



export { saveProjects, loadProjects };