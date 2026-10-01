import { saveProjects , loadProjects} from "./data/storage.js";

const navigationLinks = document.querySelectorAll("[data-view]");
const viewSections = document.querySelectorAll(".view-section");
const newProjectButton = document.querySelector("#new-project-button");
const cancelProjectButton = document.querySelector("#cancel-project-button");
const projectForm = document.querySelector("#project-form");
const saveProjectButton = document.querySelector("#save-project-button");
const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector("#menu-toggle");
const sidebarClose = document.querySelector("#sidebar-close");
const sidebarBackdrop = document.querySelector("#sidebar-backdrop");
const projectsContainer = document.querySelector("#projects-container");
const searchInput = document.querySelector('.project-filters input[type="search"]');
const statusFilter = document.querySelector('[aria-label="Filter projects by status"]');
const priorityFilter = document.querySelector('[aria-label="Filter projects by priority"]');
const sortSelect = document.querySelector("#project-sort");

let projects = loadProjects();
let editingProjectID = null;

function resetProjectForm() {
	projectForm.reset();
	editingProjectID = null;
	saveProjectButton.textContent = "Save Project";
}

function showView(viewName) {
	viewSections.forEach((section) => {
		section.hidden = section.id !== viewName;
	});

	navigationLinks.forEach((link) => {
		const isActive = link.dataset.view === viewName;
		link.classList.toggle("active", isActive);

		if (isActive) {
			link.setAttribute("aria-current", "page");
		} else {
			link.removeAttribute("aria-current");
		}
	});
}

function setSidebarOpen(isOpen) {
	sidebar.classList.toggle("is-open", isOpen);
	sidebarBackdrop.hidden = !isOpen;
	menuToggle.setAttribute("aria-expanded", String(isOpen));
}

navigationLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		showView(link.dataset.view);
		setSidebarOpen(false);
	});
});

function createProject(project) {
	const {
		name,
		description,
		status,
		priority,
		deadline,
		technologies
	} = project;

	const technologiesArray = technologies.split(/,\s*/);

	const newProject = {
		id: crypto.randomUUID(),
		name:name,
		description :description,
		status:status ,
		priority:priority,
		deadline:deadline,
		technologies:technologiesArray,
		createdAt: new Date().toISOString()
	};
	return newProject;
}

function createProjectCard(project) {
	const projectCard = document.createElement("article");
	projectCard.classList.add("project-card");

	const projectName = document.createElement("h3");
	projectName.textContent = project.name;
	const projectDescription = document.createElement("p");
	projectDescription.classList.add("project-card-description");
	projectDescription.textContent = project.description;
	const projectStatus = document.createElement("p");
	projectStatus.classList.add("project-card-status");
	projectStatus.textContent = `Status: ${project.status}`;
	const projectPriority = document.createElement("p");
	projectPriority.classList.add("project-card-priority");
	projectPriority.textContent = `Priority: ${project.priority}`;
	const projectDeadline = document.createElement("p");
	projectDeadline.classList.add("project-card-deadline");
	projectDeadline.textContent = `Deadline: ${project.deadline}`;
	const projectTechnologies = document.createElement("p");
	projectTechnologies.classList.add("project-card-technologies");
	const technologies = Array.isArray(project.technologies)
		? project.technologies.join(", ")
		: project.technologies;
	projectTechnologies.textContent = `Technologies: ${technologies}`;
	const projectMetadata = document.createElement("div");
	projectMetadata.classList.add("project-card-metadata");
	projectMetadata.append(projectStatus, projectPriority, projectDeadline);

	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("project-card-edit");
	editButton.dataset.id = project.id;
	editButton.textContent = "Edit";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("project-card-delete");
	deleteButton.dataset.id = project.id;
	deleteButton.textContent = "Delete";
	const projectActions = document.createElement("div");
	projectActions.classList.add("project-card-actions");
	projectActions.append(editButton, deleteButton);

	projectCard.append(
		projectName,
		projectDescription,
		projectMetadata,
		projectTechnologies,
		projectActions
	);

	return projectCard;
}

function renderProjects(projectsToRender){

	projectsContainer.innerHTML = "";

	if(projectsToRender.length === 0){
		projectsContainer.innerHTML = `
		<div class="projects-empty-state">            
		<div class="empty-icon" aria-hidden="true">▦</div>             
		<h2>No projects yet</h2>           
		<p>Your projects will appear here when you add them to your workspace.</p>
        </div>`
		return;
	};

	projectsToRender.forEach((project) => {
		projectsContainer.appendChild(createProjectCard(project));
	});
}

function compareDeadlines(leftProject, rightProject, direction) {
	if (!leftProject.deadline) {
		return rightProject.deadline ? 1 : 0;
	}

	if (!rightProject.deadline) {
		return -1;
	}

	return leftProject.deadline.localeCompare(rightProject.deadline) * direction;
}

function filterProjects() {
	const searchTerm = searchInput.value.toLowerCase();
	const selectedStatus = statusFilter.value;
	const selectedPriority = priorityFilter.value;

	const filteredProjects = projects.filter((project) => {
		const matchesSearch = `${project.name} ${project.description}`
			.toLowerCase()
			.includes(searchTerm);
		const matchesStatus = !selectedStatus || project.status === selectedStatus;
		const matchesPriority = !selectedPriority || project.priority === selectedPriority;

		return matchesSearch && matchesStatus && matchesPriority;
	});

	const sortedProjects = [...filteredProjects];
	const sortOrder = sortSelect.value;

	if (sortOrder === "name-asc") {
		sortedProjects.sort((leftProject, rightProject) =>
			leftProject.name.localeCompare(rightProject.name)
		);
	} else if (sortOrder === "name-desc") {
		sortedProjects.sort((leftProject, rightProject) =>
			rightProject.name.localeCompare(leftProject.name)
		);
	} else if (sortOrder === "deadline-asc") {
		sortedProjects.sort((leftProject, rightProject) =>
			compareDeadlines(leftProject, rightProject, 1)
		);
	} else if (sortOrder === "deadline-desc") {
		sortedProjects.sort((leftProject, rightProject) =>
			compareDeadlines(leftProject, rightProject, -1)
		);
	} else if (sortOrder === "priority") {
		const priorityOrder = { High: 0, Medium: 1, Low: 2 };
		sortedProjects.sort((leftProject, rightProject) =>
			(priorityOrder[leftProject.priority] ?? 3) - (priorityOrder[rightProject.priority] ?? 3)
		);
	}

	renderProjects(sortedProjects);
}

function deleteProject(projectID) {
	const projectIndex = projects.findIndex((project) => project.id === projectID);

	if (projectIndex === -1) {
		return;
	}

	projects.splice(projectIndex, 1);
	saveProjects(projects);
	filterProjects();
}

function editProject(projectID) {
	const project = projects.find((project) => project.id === projectID);

	if (!project) {
		return;
	}

	projectForm.elements.namedItem("name").value = project.name;
	projectForm.elements.namedItem("description").value = project.description;
	projectForm.elements.namedItem("status").value = project.status;
	projectForm.elements.namedItem("priority").value = project.priority;
	projectForm.elements.namedItem("deadline").value = project.deadline;
	projectForm.elements.namedItem("technologies").value = Array.isArray(project.technologies)
		? project.technologies.join(", ")
		: project.technologies;
	editingProjectID = project.id;
	saveProjectButton.textContent = "Update Project";

	projectForm.hidden = false;
	projectForm.elements.namedItem("name").focus();
}

menuToggle.addEventListener("click", () => {
	setSidebarOpen(!sidebar.classList.contains("is-open"));
});

sidebarClose.addEventListener("click", () => {
	setSidebarOpen(false);
});

sidebarBackdrop.addEventListener("click", () => {
	setSidebarOpen(false);
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		setSidebarOpen(false);
	}
});
newProjectButton.addEventListener("click", () => {
	resetProjectForm();
	projectForm.hidden = false;
	projectForm.querySelector("input").focus();
});

cancelProjectButton.addEventListener("click", () => {
	resetProjectForm();
	projectForm.hidden = true;
});

projectForm.addEventListener("submit",(event)=>{
    event.preventDefault();

	
    const formData = new FormData(projectForm);

    const formProps = Object.fromEntries(formData);
	

	if (editingProjectID) {
		const projectIndex = projects.findIndex((project) => project.id === editingProjectID);

		if (projectIndex === -1) {
			resetProjectForm();
			return;
		}

		projects[projectIndex] = {
			...projects[projectIndex],
			...formProps,
			technologies: formProps.technologies.split(/,\s*/)
		};
	} else {
		projects.push(createProject(formProps));
	}

	saveProjects(projects);

	filterProjects();
	
	resetProjectForm();
});

searchInput.addEventListener("input", filterProjects);
statusFilter.addEventListener("change", filterProjects);
priorityFilter.addEventListener("change", filterProjects);
sortSelect.addEventListener("change", filterProjects);

projectsContainer.addEventListener("click",(event)=>{
	const clickedButton = event.target.closest("button");

    if (!clickedButton) {
        return;
    }

	const projectID = clickedButton.dataset.id;

    if (clickedButton.classList.contains("project-card-delete")) {
        deleteProject(projectID);
    }

     if (clickedButton.classList.contains("project-card-edit")) {
        editProject(projectID);
    }
})

filterProjects();
