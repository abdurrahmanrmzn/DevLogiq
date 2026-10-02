import { saveProjects, loadProjects, saveTasks, loadTasks, saveGoals, loadGoals, saveNotes, loadNotes } from "./data/storage.js";

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
const projectDetailsModal = document.querySelector("#project-details-modal");
const projectDetailsTitle = document.querySelector("#project-details-title");
const projectDetailsDescription = document.querySelector("#project-details-description");
const projectDetailsStatus = document.querySelector("#project-details-status");
const projectDetailsPriority = document.querySelector("#project-details-priority");
const projectDetailsDeadline = document.querySelector("#project-details-deadline");
const projectDetailsTechnologies = document.querySelector("#project-details-technologies");
const projectDetailsProgress = document.querySelector("#project-details-progress");
const editProjectDetailsButton = document.querySelector("#edit-project-details");
const deleteProjectDetailsButton = document.querySelector("#delete-project-details");
const closeProjectDetailsButton = document.querySelector("#close-project-details");
const newTaskButton = document.querySelector("#new-task-button");
const taskForm = document.querySelector("#task-form");
const taskFormTitle = document.querySelector("#task-form-title");
const taskProjectSelect = document.querySelector("#task-project");
const cancelTaskButton = document.querySelector("#cancel-task-button");
const saveTaskButton = document.querySelector("#save-task-button");
const taskSearchInput = document.querySelector("#task-search");
const taskStatusFilter = document.querySelector("#task-status-filter");
const taskPriorityFilter = document.querySelector("#task-priority-filter");
const taskProjectFilter = document.querySelector("#task-project-filter");
const taskSortSelect = document.querySelector("#task-sort");
const tasksContainer = document.querySelector("#tasks-container");
const newGoalButton = document.querySelector("#new-goal-button");
const goalForm = document.querySelector("#goal-form");
const goalFormTitle = document.querySelector("#goal-form-title");
const goalTitleInput = document.querySelector("#goal-title");
const goalProgressInput = document.querySelector("#goal-progress");
const goalProgressValue = document.querySelector("#goal-progress-value");
const goalStatusSelect = document.querySelector("#goal-status");
const cancelGoalButton = document.querySelector("#cancel-goal-button");
const saveGoalButton = document.querySelector("#save-goal-button");
const goalSearchInput = document.querySelector("#goal-search");
const goalStatusFilter = document.querySelector("#goal-status-filter");
const goalCategoryFilter = document.querySelector("#goal-category-filter");
const goalSortSelect = document.querySelector("#goal-sort");
const goalsContainer = document.querySelector("#goals-container");
const newNoteButton = document.querySelector("#new-note-button");
const noteForm = document.querySelector("#note-form");
const noteFormTitle = document.querySelector("#note-form-title");
const noteTitleInput = document.querySelector("#note-title");
const noteContentInput = document.querySelector("#note-content");
const noteProjectSelect = document.querySelector("#note-project");
const cancelNoteButton = document.querySelector("#cancel-note-button");
const saveNoteButton = document.querySelector("#save-note-button");
const noteSearchInput = document.querySelector("#note-search");
const notesContainer = document.querySelector("#notes-container");

let projects = loadProjects();
let editingProjectID = null;
let tasks = loadTasks();
let editingTaskId = null;
const storedGoals = loadGoals();
let goals = storedGoals.filter((goal) => goal && typeof goal === "object").map((goal) => ({
	...goal,
	id: typeof goal.id === "string" ? goal.id : "",
	title: typeof goal.title === "string" ? goal.title : "",
	category: typeof goal.category === "string" ? goal.category : "",
	progress: Math.min(100, Math.max(0, Number.isFinite(Number(goal.progress)) ? Number(goal.progress) : 0)),
	targetDate: typeof goal.targetDate === "string" ? goal.targetDate : "",
	status: ["Not Started", "In Progress", "Completed"].includes(goal.status) ? goal.status : "Not Started",
	createdAt: typeof goal.createdAt === "string" ? goal.createdAt : ""
})).filter((goal) => goal.id.length > 0).map((goal) => ({
	...goal,
	status: goal.progress === 100 ? "Completed" : goal.status
}));
let editingGoalId = null;

if (goals.length !== storedGoals.length) {
	saveGoals(goals);
}
let notes = loadNotes().filter((note) => note && typeof note === "object");
let editingNoteId = null;

function resetProjectForm() {
	projectForm.reset();
	editingProjectID = null;
	saveProjectButton.textContent = "Save Project";
}

function resetTaskForm() {
	taskForm.reset();
	editingTaskId = null;
	taskFormTitle.textContent = "Create a task";
	saveTaskButton.textContent = "Save Task";
}

function resetGoalForm() {
	goalForm.reset();
	goalProgressValue.value = "0%";
	goalProgressValue.textContent = "0%";
	editingGoalId = null;
	goalFormTitle.textContent = "Create a goal";
	saveGoalButton.textContent = "Save Goal";
}

function resetNoteForm() {
	noteForm.reset();
	editingNoteId = null;
	noteFormTitle.textContent = "Create a note";
	saveNoteButton.textContent = "Save Note";
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

function openProjectDetailsModal() {
	if (typeof projectDetailsModal.showModal === "function") {
		projectDetailsModal.showModal();
	} else {
		projectDetailsModal.setAttribute("open", "");
	}
}

function closeProjectDetailsModal() {
	if (typeof projectDetailsModal.close === "function") {
		projectDetailsModal.close();
	} else {
		projectDetailsModal.removeAttribute("open");
	}
}

navigationLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		showView(link.dataset.view);
		setSidebarOpen(false);

		if (link.dataset.view === "tasks") {
			populateTaskProjectOptions();
			filterTasks();
		}

		if (link.dataset.view === "goals") {
			filterGoals();
		}

		if (link.dataset.view === "notes") {
			populateNoteProjectOptions();
			filterNotes();
		}
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
	const viewButton = document.createElement("button");
	viewButton.type = "button";
	viewButton.classList.add("project-card-view");
	viewButton.dataset.projectId = project.id;
	viewButton.textContent = "View Details";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("project-card-delete");
	deleteButton.dataset.id = project.id;
	deleteButton.textContent = "Delete";
	const projectActions = document.createElement("div");
	projectActions.classList.add("project-card-actions");
	projectActions.append(viewButton, editButton, deleteButton);

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

function viewProject(projectID) {
	const project = projects.find((project) => project.id === projectID);

	if (!project) {
		return;
	}

	projectDetailsTitle.textContent = project.name;
	projectDetailsDescription.textContent = project.description || "No description";
	projectDetailsStatus.textContent = project.status;
	projectDetailsPriority.textContent = project.priority;
	projectDetailsDeadline.textContent = project.deadline || "No deadline";
	projectDetailsTechnologies.textContent = Array.isArray(project.technologies)
		? project.technologies.join(", ")
		: project.technologies || "None";
	projectDetailsProgress.textContent = `${calculateProjectProgress(project.id)}%`;
	editProjectDetailsButton.dataset.projectId = project.id;
	deleteProjectDetailsButton.dataset.projectId = project.id;
	openProjectDetailsModal();
}

function calculateProjectProgress(projectId) {
	const projectTasks = tasks.filter((task) => task.projectId === projectId);
	if (projectTasks.length === 0) {
		return 0;
	}

	const completedTasks = projectTasks.filter((task) => task.status === "Done").length;
	return Math.round((completedTasks / projectTasks.length) * 100);
}

function populateTaskProjectOptions() {
	const selectedProjectId = taskProjectSelect.value;
	const selectedFilterProjectId = taskProjectFilter.value;
	taskProjectSelect.replaceChildren();
	taskProjectFilter.replaceChildren();

	const unassignedOption = document.createElement("option");
	unassignedOption.value = "";
	unassignedOption.textContent = projects.length ? "No project" : "No projects available";
	taskProjectSelect.append(unassignedOption);

	const allProjectsOption = document.createElement("option");
	allProjectsOption.value = "";
	allProjectsOption.textContent = "All projects";
	taskProjectFilter.append(allProjectsOption);

	projects.forEach((project) => {
		const formOption = document.createElement("option");
		formOption.value = project.id;
		formOption.textContent = project.name;
		taskProjectSelect.append(formOption);

		const filterOption = document.createElement("option");
		filterOption.value = project.id;
		filterOption.textContent = project.name;
		taskProjectFilter.append(filterOption);
	});

	if (projects.some((project) => project.id === selectedProjectId)) {
		taskProjectSelect.value = selectedProjectId;
	}

	if (projects.some((project) => project.id === selectedFilterProjectId)) {
		taskProjectFilter.value = selectedFilterProjectId;
	}
}

function createTask(task) {
	return {
		id: crypto.randomUUID(),
		projectId: task.projectId,
		title: task.title,
		description: task.description,
		status: task.status,
		priority: task.priority,
		dueDate: task.dueDate,
		createdAt: new Date().toISOString()
	};
}

function createTaskCard(task) {
	const project = projects.find((project) => project.id === task.projectId);
	const taskCard = document.createElement("article");
	taskCard.classList.add("task-card");

	const taskTitle = document.createElement("h3");
	taskTitle.textContent = task.title;
	const taskDescription = document.createElement("p");
	taskDescription.classList.add("task-card-description");
	taskDescription.textContent = task.description || "No description";
	const taskProjectName = document.createElement("p");
	taskProjectName.classList.add("task-card-project");
	taskProjectName.textContent = `Project: ${project?.name ?? "Unknown Project"}`;
	const taskStatus = document.createElement("p");
	taskStatus.classList.add("task-card-status");
	taskStatus.textContent = `Status: ${task.status}`;
	const taskPriority = document.createElement("p");
	taskPriority.classList.add("task-card-priority");
	taskPriority.textContent = `Priority: ${task.priority}`;
	const taskDueDate = document.createElement("p");
	taskDueDate.classList.add("task-card-due-date");
	taskDueDate.textContent = `Due: ${task.dueDate || "No due date"}`;

	const taskMetadata = document.createElement("div");
	taskMetadata.classList.add("task-card-metadata");
	taskMetadata.append(taskStatus, taskPriority, taskDueDate);

	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("task-card-edit");
	editButton.dataset.taskId = task.id;
	editButton.textContent = "Edit";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("task-card-delete");
	deleteButton.dataset.taskId = task.id;
	deleteButton.textContent = "Delete";
	const taskActions = document.createElement("div");
	taskActions.classList.add("task-card-actions");
	taskActions.append(editButton, deleteButton);

	taskCard.append(taskTitle, taskDescription, taskProjectName, taskMetadata, taskActions);
	return taskCard;
}

function renderTasks(tasksToRender) {
	tasksContainer.innerHTML = "";

	if (tasksToRender.length === 0) {
		tasksContainer.innerHTML = `
			<div class="tasks-empty-state">
				<div class="empty-icon" aria-hidden="true">✓</div>
				<h2>No tasks found</h2>
				<p>Create a task or adjust your search and filters.</p>
			</div>`;
		return;
	}

	tasksToRender.forEach((task) => {
		tasksContainer.appendChild(createTaskCard(task));
	});
}

function compareTaskDueDates(leftTask, rightTask, direction) {
	if (!leftTask.dueDate) {
		return rightTask.dueDate ? 1 : 0;
	}

	if (!rightTask.dueDate) {
		return -1;
	}

	return leftTask.dueDate.localeCompare(rightTask.dueDate) * direction;
}

function filterTasks() {
	const searchTerm = taskSearchInput.value.toLowerCase();
	let filteredTasks = tasks.filter((task) =>
		`${task.title} ${task.description}`.toLowerCase().includes(searchTerm)
	);

	if (taskStatusFilter.value) {
		filteredTasks = filteredTasks.filter((task) => task.status === taskStatusFilter.value);
	}

	if (taskPriorityFilter.value) {
		filteredTasks = filteredTasks.filter((task) => task.priority === taskPriorityFilter.value);
	}

	if (taskProjectFilter.value) {
		filteredTasks = filteredTasks.filter((task) => task.projectId === taskProjectFilter.value);
	}

	const sortedTasks = [...filteredTasks];
	const sortOrder = taskSortSelect.value;

	if (sortOrder === "title-asc") {
		sortedTasks.sort((leftTask, rightTask) => leftTask.title.localeCompare(rightTask.title));
	} else if (sortOrder === "title-desc") {
		sortedTasks.sort((leftTask, rightTask) => rightTask.title.localeCompare(leftTask.title));
	} else if (sortOrder === "dueDate-asc") {
		sortedTasks.sort((leftTask, rightTask) => compareTaskDueDates(leftTask, rightTask, 1));
	} else if (sortOrder === "dueDate-desc") {
		sortedTasks.sort((leftTask, rightTask) => compareTaskDueDates(leftTask, rightTask, -1));
	} else if (sortOrder === "priority") {
		const priorityOrder = { High: 0, Medium: 1, Low: 2 };
		sortedTasks.sort((leftTask, rightTask) =>
			(priorityOrder[leftTask.priority] ?? 3) - (priorityOrder[rightTask.priority] ?? 3)
		);
	}

	renderTasks(sortedTasks);
}

function createGoal(goal) {
	const progress = Math.min(100, Math.max(0, Number(goal.progress) || 0));
	return {
		id: crypto.randomUUID(),
		title: String(goal.title || "").trim(),
		category: String(goal.category || "").trim(),
		progress,
		targetDate: goal.targetDate || "",
		status: progress === 100 ? "Completed" : goal.status,
		createdAt: new Date().toISOString()
	};
}

function createGoalCard(goal) {
	const goalCard = document.createElement("article");
	goalCard.classList.add("goal-card");

	const title = document.createElement("h3");
	title.textContent = goal.title || "Untitled goal";
	const category = document.createElement("p");
	category.classList.add("goal-card-category");
	category.textContent = `Category: ${goal.category || "Uncategorized"}`;

	const progress = Math.min(100, Math.max(0, Number(goal.progress) || 0));
	const progressLabel = document.createElement("div");
	progressLabel.classList.add("goal-card-progress-label");
	const progressText = document.createElement("span");
	progressText.textContent = "Progress";
	const progressPercent = document.createElement("span");
	progressPercent.textContent = `${progress}%`;
	progressLabel.append(progressText, progressPercent);
	const progressTrack = document.createElement("div");
	progressTrack.classList.add("goal-card-progress-track");
	progressTrack.setAttribute("role", "progressbar");
	progressTrack.setAttribute("aria-label", `Progress for ${goal.title || "goal"}`);
	progressTrack.setAttribute("aria-valuemin", "0");
	progressTrack.setAttribute("aria-valuemax", "100");
	progressTrack.setAttribute("aria-valuenow", String(progress));
	const progressBar = document.createElement("span");
	progressBar.style.width = `${progress}%`;
	progressTrack.append(progressBar);
	const progressSection = document.createElement("div");
	progressSection.classList.add("goal-card-progress");
	progressSection.append(progressLabel, progressTrack);

	const metadata = document.createElement("div");
	metadata.classList.add("goal-card-metadata");
	const status = document.createElement("p");
	status.classList.add("goal-card-status");
	status.textContent = goal.status || "Not Started";
	const targetDate = document.createElement("p");
	targetDate.classList.add("goal-card-target-date");
	targetDate.textContent = goal.targetDate ? `Target: ${goal.targetDate}` : "No target date";
	metadata.append(status, targetDate);

	const actions = document.createElement("div");
	actions.classList.add("goal-card-actions");
	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("goal-card-edit");
	editButton.dataset.goalId = goal.id;
	editButton.textContent = "Edit";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("goal-card-delete");
	deleteButton.dataset.goalId = goal.id;
	deleteButton.textContent = "Delete";
	actions.append(editButton, deleteButton);

	goalCard.append(title, category, progressSection, metadata, actions);
	return goalCard;
}

function renderGoals(goalsToRender) {
	goalsContainer.replaceChildren();

	if (goalsToRender.length === 0) {
		const emptyState = document.createElement("div");
		emptyState.classList.add("goals-empty-state");
		const icon = document.createElement("div");
		icon.classList.add("empty-icon");
		icon.setAttribute("aria-hidden", "true");
		icon.textContent = "◎";
		const heading = document.createElement("h2");
		const description = document.createElement("p");
		if (goals.length === 0) {
			heading.textContent = "No learning goals yet";
			description.textContent = "Add a goal to start tracking your learning progress.";
		} else {
			heading.textContent = "No goals found";
			description.textContent = "Try changing your search or filters.";
		}
		emptyState.append(icon, heading, description);
		goalsContainer.append(emptyState);
		return;
	}

	goalsToRender.forEach((goal) => goalsContainer.append(createGoalCard(goal)));
}

function compareGoalTargetDates(leftGoal, rightGoal, direction) {
	const leftDate = Date.parse(leftGoal.targetDate || "");
	const rightDate = Date.parse(rightGoal.targetDate || "");
	const leftHasDate = Number.isFinite(leftDate);
	const rightHasDate = Number.isFinite(rightDate);

	if (!leftHasDate) {
		return rightHasDate ? 1 : 0;
	}

	if (!rightHasDate) {
		return -1;
	}

	return (leftDate - rightDate) * direction;
}

function updateGoalCategoryOptions() {
	const selectedCategory = goalCategoryFilter.value;
	const categories = [...new Set(goals.map((goal) => goal.category.trim()).filter(Boolean))]
		.sort((leftCategory, rightCategory) => leftCategory.localeCompare(rightCategory));
	goalCategoryFilter.replaceChildren();
	const allOption = document.createElement("option");
	allOption.value = "";
	allOption.textContent = "All categories";
	goalCategoryFilter.append(allOption);

	categories.forEach((category) => {
		const option = document.createElement("option");
		option.value = category;
		option.textContent = category;
		goalCategoryFilter.append(option);
	});

	if (categories.includes(selectedCategory)) {
		goalCategoryFilter.value = selectedCategory;
	}
}

function filterGoals() {
	updateGoalCategoryOptions();
	const searchTerm = goalSearchInput.value.trim().toLowerCase();
	const selectedStatus = goalStatusFilter.value;
	const selectedCategory = goalCategoryFilter.value;
	let filteredGoals = goals.filter((goal) =>
		`${goal.title} ${goal.category}`.toLowerCase().includes(searchTerm)
	);

	if (selectedStatus) {
		filteredGoals = filteredGoals.filter((goal) => goal.status === selectedStatus);
	}

	if (selectedCategory) {
		filteredGoals = filteredGoals.filter((goal) => goal.category === selectedCategory);
	}

	const sortedGoals = [...filteredGoals];
	const sortOrder = goalSortSelect.value;
	if (sortOrder === "title-asc") {
		sortedGoals.sort((leftGoal, rightGoal) => leftGoal.title.localeCompare(rightGoal.title));
	} else if (sortOrder === "title-desc") {
		sortedGoals.sort((leftGoal, rightGoal) => rightGoal.title.localeCompare(leftGoal.title));
	} else if (sortOrder === "progress-asc") {
		sortedGoals.sort((leftGoal, rightGoal) => leftGoal.progress - rightGoal.progress);
	} else if (sortOrder === "progress-desc") {
		sortedGoals.sort((leftGoal, rightGoal) => rightGoal.progress - leftGoal.progress);
	} else if (sortOrder === "targetDate-asc") {
		sortedGoals.sort((leftGoal, rightGoal) => compareGoalTargetDates(leftGoal, rightGoal, 1));
	} else if (sortOrder === "targetDate-desc") {
		sortedGoals.sort((leftGoal, rightGoal) => compareGoalTargetDates(leftGoal, rightGoal, -1));
	}

	renderGoals(sortedGoals);
}

function createNote(note) {
	const timestamp = new Date().toISOString();
	return {
		id: crypto.randomUUID(),
		title: String(note.title || "").trim(),
		content: String(note.content || "").trim(),
		projectId: note.projectId || null,
		createdAt: timestamp,
		updatedAt: timestamp
	};
}

function formatNoteDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

function createNoteCard(note) {
	const noteCard = document.createElement("article");
	noteCard.classList.add("note-card");

	const title = document.createElement("h3");
	title.textContent = note.title || "Untitled note";
	const content = document.createElement("p");
	content.classList.add("note-card-content");
	const noteContent = String(note.content || "No content");
	content.textContent = noteContent.length > 240
		? `${noteContent.slice(0, 237)}...`
		: noteContent;

	const relatedProject = document.createElement("p");
	relatedProject.classList.add("note-card-project");
	if (!note.projectId) {
		relatedProject.textContent = "No related project";
	} else {
		const project = projects.find((item) => item.id === note.projectId);
		relatedProject.textContent = `Project: ${project?.name ?? "Unknown Project"}`;
	}

	const timestamps = document.createElement("div");
	timestamps.classList.add("note-card-timestamps");
	const createdAt = document.createElement("p");
	createdAt.textContent = `Created: ${formatNoteDate(note.createdAt)}`;
	const updatedAt = document.createElement("p");
	updatedAt.textContent = `Updated: ${formatNoteDate(note.updatedAt)}`;
	timestamps.append(createdAt, updatedAt);

	const actions = document.createElement("div");
	actions.classList.add("note-card-actions");
	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("note-card-edit");
	editButton.dataset.noteId = note.id || "";
	editButton.textContent = "Edit";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("note-card-delete");
	deleteButton.dataset.noteId = note.id || "";
	deleteButton.textContent = "Delete";
	actions.append(editButton, deleteButton);

	noteCard.append(title, content, relatedProject, timestamps, actions);
	return noteCard;
}

function renderNotes(notesToRender) {
	notesContainer.replaceChildren();

	if (notesToRender.length === 0) {
		const emptyState = document.createElement("div");
		emptyState.classList.add("notes-empty-state");
		const icon = document.createElement("div");
		icon.classList.add("empty-icon");
		icon.setAttribute("aria-hidden", "true");
		icon.textContent = "▤";
		const heading = document.createElement("h2");
		const description = document.createElement("p");
		if (notes.length === 0) {
			heading.textContent = "No notes yet";
			description.textContent = "Create a note to keep useful information close at hand.";
		} else {
			heading.textContent = "No notes found";
			description.textContent = "Try a different search term.";
		}
		emptyState.append(icon, heading, description);
		notesContainer.append(emptyState);
		return;
	}

	notesToRender.forEach((note) => notesContainer.append(createNoteCard(note)));
}

function filterNotes() {
	const searchTerm = noteSearchInput.value.trim().toLowerCase();
	const filteredNotes = notes.filter((note) =>
		`${note.title || ""} ${note.content || ""}`.toLowerCase().includes(searchTerm)
	);
	renderNotes(filteredNotes);
}

function populateNoteProjectOptions(selectedProjectId = noteProjectSelect.value) {
	noteProjectSelect.replaceChildren();
	const noProjectOption = document.createElement("option");
	noProjectOption.value = "";
	noProjectOption.textContent = "No project";
	noteProjectSelect.append(noProjectOption);

	projects.forEach((project) => {
		const option = document.createElement("option");
		option.value = project.id;
		option.textContent = project.name;
		noteProjectSelect.append(option);
	});

	if (selectedProjectId && !projects.some((project) => project.id === selectedProjectId)) {
		const unknownProjectOption = document.createElement("option");
		unknownProjectOption.value = selectedProjectId;
		unknownProjectOption.textContent = "Unknown Project";
		noteProjectSelect.append(unknownProjectOption);
	}

	noteProjectSelect.value = selectedProjectId || "";
}

function editNote(noteId) {
	const note = notes.find((item) => item.id === noteId);
	if (!note) {
		return;
	}

	populateNoteProjectOptions(note.projectId);
	noteTitleInput.value = note.title || "";
	noteContentInput.value = note.content || "";
	noteProjectSelect.value = note.projectId || "";
	editingNoteId = note.id;
	noteFormTitle.textContent = "Edit note";
	saveNoteButton.textContent = "Update Note";
	noteForm.hidden = false;
	noteTitleInput.focus();
}

function deleteNote(noteId) {
	if (!notes.some((note) => note.id === noteId)) {
		return;
	}

	notes = notes.filter((note) => note.id !== noteId);
	saveNotes(notes);
	filterNotes();
}

function deleteGoal(goalId) {
	if (!goals.some((goal) => goal.id === goalId)) {
		return;
	}

	goals = goals.filter((goal) => goal.id !== goalId);
	saveGoals(goals);
	filterGoals();
}

function editGoal(goalId) {
	const goal = goals.find((item) => item.id === goalId);
	if (!goal) {
		return;
	}

	goalForm.elements.namedItem("title").value = goal.title;
	goalForm.elements.namedItem("category").value = goal.category;
	goalProgressInput.value = String(goal.progress);
	goalProgressValue.value = `${goal.progress}%`;
	goalProgressValue.textContent = `${goal.progress}%`;
	goalForm.elements.namedItem("targetDate").value = goal.targetDate;
	goalStatusSelect.value = goal.status;
	editingGoalId = goal.id;
	goalFormTitle.textContent = "Edit goal";
	saveGoalButton.textContent = "Update Goal";
	goalForm.hidden = false;
	goalTitleInput.focus();
}

function deleteTask(taskId) {
	const taskExists = tasks.some((task) => task.id === taskId);

	if (!taskExists) {
		return;
	}

	tasks = tasks.filter((task) => task.id !== taskId);
	saveTasks(tasks);
	filterTasks();
}

function editTask(taskId) {
	const task = tasks.find((task) => task.id === taskId);

	if (!task) {
		return;
	}

	populateTaskProjectOptions();
	taskForm.elements.namedItem("title").value = task.title;
	taskForm.elements.namedItem("description").value = task.description;
	taskProjectSelect.value = task.projectId;
	taskForm.elements.namedItem("status").value = task.status;
	taskForm.elements.namedItem("priority").value = task.priority;
	taskForm.elements.namedItem("dueDate").value = task.dueDate;
	editingTaskId = task.id;
	taskFormTitle.textContent = "Edit task";
	saveTaskButton.textContent = "Update Task";
	taskForm.hidden = false;
	taskForm.elements.namedItem("title").focus();
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

closeProjectDetailsButton.addEventListener("click", () => {
	closeProjectDetailsModal();
});

editProjectDetailsButton.addEventListener("click", () => {
	const projectID = editProjectDetailsButton.dataset.projectId;
	closeProjectDetailsModal();
	editProject(projectID);
});

deleteProjectDetailsButton.addEventListener("click", () => {
	const projectID = deleteProjectDetailsButton.dataset.projectId;
	closeProjectDetailsModal();
	deleteProject(projectID);
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

newTaskButton.addEventListener("click", () => {
	resetTaskForm();
	populateTaskProjectOptions();
	taskForm.hidden = false;
	taskForm.elements.namedItem("title").focus();
});

cancelTaskButton.addEventListener("click", () => {
	resetTaskForm();
	taskForm.hidden = true;
});

taskForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const formProps = Object.fromEntries(new FormData(taskForm));

	if (editingTaskId) {
		const taskIndex = tasks.findIndex((task) => task.id === editingTaskId);

		if (taskIndex === -1) {
			resetTaskForm();
			return;
		}

		tasks[taskIndex] = { ...tasks[taskIndex], ...formProps };
	} else {
		tasks.push(createTask(formProps));
	}

	saveTasks(tasks);
	filterTasks();
	resetTaskForm();
});

newGoalButton.addEventListener("click", () => {
	resetGoalForm();
	goalForm.hidden = false;
	goalTitleInput.focus();
});

cancelGoalButton.addEventListener("click", () => {
	resetGoalForm();
	goalForm.hidden = true;
});

goalProgressInput.addEventListener("input", () => {
	const progress = Math.min(100, Math.max(0, Number(goalProgressInput.value) || 0));
	goalProgressValue.value = `${progress}%`;
	goalProgressValue.textContent = `${progress}%`;
	if (progress === 100) {
		goalStatusSelect.value = "Completed";
	}
});

goalForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const formProps = Object.fromEntries(new FormData(goalForm));
	formProps.title = String(formProps.title || "").trim();
	formProps.category = String(formProps.category || "").trim();
	formProps.progress = Math.min(100, Math.max(0, Number(formProps.progress) || 0));
	if (!formProps.title || !formProps.category) {
		return;
	}
	if (formProps.progress === 100) {
		formProps.status = "Completed";
	}

	if (editingGoalId) {
		const goalIndex = goals.findIndex((goal) => goal.id === editingGoalId);
		if (goalIndex === -1) {
			resetGoalForm();
			goalForm.hidden = true;
			return;
		}
		goals[goalIndex] = { ...goals[goalIndex], ...formProps };
	} else {
		goals.push(createGoal(formProps));
	}

	saveGoals(goals);
	filterGoals();
	resetGoalForm();
	goalForm.hidden = true;
});

newNoteButton.addEventListener("click", () => {
	resetNoteForm();
	populateNoteProjectOptions();
	noteForm.hidden = false;
	noteTitleInput.focus();
});

cancelNoteButton.addEventListener("click", () => {
	resetNoteForm();
	noteForm.hidden = true;
});

noteForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const formProps = Object.fromEntries(new FormData(noteForm));
	formProps.title = String(formProps.title || "").trim();
	formProps.content = String(formProps.content || "").trim();
	formProps.projectId = formProps.projectId || null;
	if (!formProps.title || !formProps.content) {
		return;
	}

	if (editingNoteId) {
		const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
		if (noteIndex === -1) {
			resetNoteForm();
			noteForm.hidden = true;
			return;
		}
		notes[noteIndex] = {
			...notes[noteIndex],
			...formProps,
			updatedAt: new Date().toISOString()
		};
	} else {
		notes.push(createNote(formProps));
	}

	saveNotes(notes);
	filterNotes();
	resetNoteForm();
	noteForm.hidden = true;
});

searchInput.addEventListener("input", filterProjects);
statusFilter.addEventListener("change", filterProjects);
priorityFilter.addEventListener("change", filterProjects);
sortSelect.addEventListener("change", filterProjects);

taskSearchInput.addEventListener("input", filterTasks);
taskStatusFilter.addEventListener("change", filterTasks);
taskPriorityFilter.addEventListener("change", filterTasks);
taskProjectFilter.addEventListener("change", filterTasks);
taskSortSelect.addEventListener("change", filterTasks);

goalSearchInput.addEventListener("input", filterGoals);
goalStatusFilter.addEventListener("change", filterGoals);
goalCategoryFilter.addEventListener("change", filterGoals);
goalSortSelect.addEventListener("change", filterGoals);

noteSearchInput.addEventListener("input", filterNotes);

tasksContainer.addEventListener("click", (event) => {
	const clickedButton = event.target.closest("button");

	if (!clickedButton) {
		return;
	}

	const taskId = clickedButton.dataset.taskId;

	if (clickedButton.classList.contains("task-card-edit")) {
		editTask(taskId);
	}

	if (clickedButton.classList.contains("task-card-delete")) {
		deleteTask(taskId);
	}
});

projectsContainer.addEventListener("click",(event)=>{
	const clickedButton = event.target.closest("button");

    if (!clickedButton) {
        return;
    }

	const projectID = clickedButton.dataset.id;

	if (clickedButton.classList.contains("project-card-view")) {
		viewProject(clickedButton.dataset.projectId);
	}

    if (clickedButton.classList.contains("project-card-delete")) {
        deleteProject(projectID);
    }

     if (clickedButton.classList.contains("project-card-edit")) {
        editProject(projectID);
    }
})

goalsContainer.addEventListener("click", (event) => {
	const clickedButton = event.target.closest("button");
	if (!clickedButton || !goalsContainer.contains(clickedButton)) {
		return;
	}

	const goalId = clickedButton.dataset.goalId;
	if (clickedButton.classList.contains("goal-card-edit")) {
		editGoal(goalId);
	}

	if (clickedButton.classList.contains("goal-card-delete")) {
		deleteGoal(goalId);
	}
});

notesContainer.addEventListener("click", (event) => {
	const clickedButton = event.target.closest("button");
	if (!clickedButton || !notesContainer.contains(clickedButton)) {
		return;
	}

	const noteId = clickedButton.dataset.noteId;
	if (clickedButton.classList.contains("note-card-edit")) {
		editNote(noteId);
	}

	if (clickedButton.classList.contains("note-card-delete")) {
		deleteNote(noteId);
	}
});

populateTaskProjectOptions();
filterTasks();
filterProjects();
filterGoals();
populateNoteProjectOptions();
filterNotes();
