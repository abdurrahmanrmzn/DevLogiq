import { saveProjects , loadProjects} from "./data/storage.js";

const navigationLinks = document.querySelectorAll("[data-view]");
const viewSections = document.querySelectorAll(".view-section");
const newProjectButton = document.querySelector("#new-project-button");
const cancelProjectButton = document.querySelector("#cancel-project-button");
const projectForm = document.querySelector("#project-form");
const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector("#menu-toggle");
const sidebarClose = document.querySelector("#sidebar-close");
const sidebarBackdrop = document.querySelector("#sidebar-backdrop");
const projectsContainer = document.querySelector("#projects-container");

let projects = loadProjects();

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
	editButton.textContent = "Edit";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("project-card-delete");
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
	projectForm.hidden = false;
	projectForm.querySelector("input").focus();
});

cancelProjectButton.addEventListener("click", () => {
	projectForm.hidden = true;
});

projectForm.addEventListener("submit",(event)=>{
    event.preventDefault();

	
    const formData = new FormData(projectForm);

    const formProps = Object.fromEntries(formData);
	

	const newProject = createProject(formProps);

	projects.push(newProject);

	

	saveProjects(projects);

	renderProjects(projects);
	
	projectForm.reset();
});

renderProjects(projects);
