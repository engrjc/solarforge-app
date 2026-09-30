// ============================================================
// SOLARFORGE
// Main Application Controller
// ============================================================
//
// This module connects the major SolarForge foundations:
//
// - Project Data Model
// - Offline Storage
//
// It manages the currently active project and provides a
// simple application-level API for future SolarForge screens.
//
// Future modules will use this controller for:
//
// - Home
// - New Project
// - Load Project
// - Energy Analysis
// - Preliminary Calculation
// - Equipment
// - Engineering Checks
// - Wiring Designer
// - BOM
// - Costing
// - Quotation
// - Installation
// - Commissioning
// - Reports
//
// ============================================================


const SolarForgeApp = {

    // --------------------------------------------------------
    // Application information
    // --------------------------------------------------------

    name: "SolarForge",

    version: "1.0.0",

    currentProject: null,

    initialized: false,


    // --------------------------------------------------------
    // Initialize SolarForge
    // --------------------------------------------------------

    async init() {

        if (this.initialized) {

            return this;
        }


        // --------------------------------------------
        // Check required modules
        // --------------------------------------------

        if (
            !window.SolarForgeProject
        ) {

            throw new Error(
                "SolarForgeProject is not available. " +
                "Make sure app/project.js is loaded first."
            );
        }


        if (
            !window.SolarForgeStorage
        ) {

            throw new Error(
                "SolarForgeStorage is not available. " +
                "Make sure app/storage.js is loaded first."
            );
        }


        // --------------------------------------------
        // Initialize offline database
        // --------------------------------------------

        await SolarForgeStorage.init();


        // --------------------------------------------
        // Try to restore the most recently used project
        // --------------------------------------------

        const latestProject =
            await SolarForgeStorage.getLatestProject();


        if (latestProject) {

            this.currentProject =
                latestProject;
        }


        this.initialized = true;


        return this;
    },


    // --------------------------------------------------------
    // Create a new SolarForge project
    // --------------------------------------------------------

    async createNewProject() {

        await this.ensureInitialized();


        const project =
            SolarForgeProject.createNewProject();


        await SolarForgeStorage.saveProject(
            project
        );


        this.currentProject =
            project;


        return project;
    },


    // --------------------------------------------------------
    // Load a project
    // --------------------------------------------------------

    async loadProject(projectId) {

        await this.ensureInitialized();


        if (!projectId) {

            throw new Error(
                "Project ID is required."
            );
        }


        const project =
            await SolarForgeStorage.loadProject(
                projectId
            );


        if (!project) {

            throw new Error(
                "SolarForge project was not found."
            );
        }


        this.currentProject =
            project;


        return project;
    },


    // --------------------------------------------------------
    // Save the current project
    // --------------------------------------------------------

    async saveCurrentProject() {

        await this.ensureInitialized();


        if (!this.currentProject) {

            throw new Error(
                "There is no active SolarForge project."
            );
        }


        SolarForgeProject.touch(
            this.currentProject
        );


        await SolarForgeStorage.saveProject(
            this.currentProject
        );


        return this.currentProject;
    },


    // --------------------------------------------------------
    // Save a specific project
    // --------------------------------------------------------

    async saveProject(project) {

        await this.ensureInitialized();


        if (!project) {

            throw new Error(
                "Cannot save an empty SolarForge project."
            );
        }


        await SolarForgeStorage.saveProject(
            project
        );


        this.currentProject =
            project;


        return project;
    },


    // --------------------------------------------------------
    // Delete the current project
    // --------------------------------------------------------

    async deleteCurrentProject() {

        await this.ensureInitialized();


        if (!this.currentProject) {

            throw new Error(
                "There is no active SolarForge project."
            );
        }


        const projectId =
            this.currentProject.project.id;


        await SolarForgeStorage.deleteProject(
            projectId
        );


        this.currentProject =
            null;


        return true;
    },


    // --------------------------------------------------------
    // Delete a project by ID
    // --------------------------------------------------------

    async deleteProject(projectId) {

        await this.ensureInitialized();


        if (!projectId) {

            throw new Error(
                "Project ID is required."
            );
        }


        await SolarForgeStorage.deleteProject(
            projectId
        );


        if (
            this.currentProject &&
            this.currentProject.project &&
            this.currentProject.project.id === projectId
        ) {

            this.currentProject =
                null;
        }


        return true;
    },


    // --------------------------------------------------------
    // Get all projects
    // --------------------------------------------------------

    async getProjects() {

        await this.ensureInitialized();


        return SolarForgeStorage.getAllProjects();
    },


    // --------------------------------------------------------
    // Get project count
    // --------------------------------------------------------

    async getProjectCount() {

        await this.ensureInitialized();


        return SolarForgeStorage.countProjects();
    },


    // --------------------------------------------------------
    // Get the current project
    // --------------------------------------------------------

    getCurrentProject() {

        return this.currentProject;
    },


    // --------------------------------------------------------
    // Check whether a project is currently open
    // --------------------------------------------------------

    hasCurrentProject() {

        return Boolean(
            this.currentProject
        );
    },


    // --------------------------------------------------------
    // Replace the current project
    // --------------------------------------------------------

    setCurrentProject(project) {

        if (!project) {

            throw new Error(
                "Cannot set an empty SolarForge project."
            );
        }


        const validation =
            SolarForgeProject.validate(
                project
            );


        if (!validation.valid) {

            throw new Error(
                "Invalid SolarForge project: " +
                validation.errors.join(" ")
            );
        }


        this.currentProject =
            project;


        return this.currentProject;
    },


    // --------------------------------------------------------
    // Close the current project
    // --------------------------------------------------------
    //
    // This does NOT delete the project.
    //
    // It only removes it from the active application state.
    //
    // --------------------------------------------------------

    closeCurrentProject() {

        this.currentProject =
            null;

        return true;
    },


    // --------------------------------------------------------
    // Add an appliance to the current project
    // --------------------------------------------------------

    addAppliance(appliance = {}) {

        this.requireCurrentProject();


        const newAppliance =
            SolarForgeProject.addAppliance(
                this.currentProject,
                appliance
            );


        return newAppliance;
    },


    // --------------------------------------------------------
    // Remove an appliance
    // --------------------------------------------------------

    removeAppliance(applianceId) {

        this.requireCurrentProject();


        SolarForgeProject.removeAppliance(
            this.currentProject,
            applianceId
        );
    },


    // --------------------------------------------------------
    // Add equipment
    // --------------------------------------------------------

    addEquipment(
        category,
        equipment = {}
    ) {

        this.requireCurrentProject();


        return SolarForgeProject.addEquipment(
            this.currentProject,
            category,
            equipment
        );
    },


    // --------------------------------------------------------
    // Remove equipment
    // --------------------------------------------------------

    removeEquipment(
        category,
        equipmentId
    ) {

        this.requireCurrentProject();


        SolarForgeProject.removeEquipment(
            this.currentProject,
            category,
            equipmentId
        );
    },


    // --------------------------------------------------------
    // Add engineering check
    // --------------------------------------------------------

    addEngineeringCheck(check = {}) {

        this.requireCurrentProject();


        return SolarForgeProject.addEngineeringCheck(
            this.currentProject,
            check
        );
    },


    // --------------------------------------------------------
    // Add BOM item
    // --------------------------------------------------------

    addBomItem(item = {}) {

        this.requireCurrentProject();


        return SolarForgeProject.addBomItem(
            this.currentProject,
            item
        );
    },


    // --------------------------------------------------------
    // Export the current project
    // --------------------------------------------------------

    exportCurrentProject() {

        this.requireCurrentProject();


        return SolarForgeStorage.exportProject(
            this.currentProject
        );
    },


    // --------------------------------------------------------
    // Import a project
    // --------------------------------------------------------

    importProject(jsonText) {

        const project =
            SolarForgeStorage.importProject(
                jsonText
            );


        this.currentProject =
            project;


        return project;
    },


    // --------------------------------------------------------
    // Import and save a project
    // --------------------------------------------------------

    async importAndSaveProject(jsonText) {

        await this.ensureInitialized();


        const project =
            SolarForgeStorage.importProject(
                jsonText
            );


        await SolarForgeStorage.saveProject(
            project
        );


        this.currentProject =
            project;


        return project;
    },


    // --------------------------------------------------------
    // Create a backup copy of the current project
    // --------------------------------------------------------

    createProjectBackup() {

        this.requireCurrentProject();


        const clonedProject =
            SolarForgeProject.clone(
                this.currentProject
            );


        return clonedProject;
    },


    // --------------------------------------------------------
    // Validate the current project
    // --------------------------------------------------------

    validateCurrentProject() {

        this.requireCurrentProject();


        return SolarForgeProject.validate(
            this.currentProject
        );
    },


    // --------------------------------------------------------
    // Get application status
    // --------------------------------------------------------

    async getStatus() {

        await this.ensureInitialized();


        const projectCount =
            await SolarForgeStorage.countProjects();


        return {

            name: this.name,

            version: this.version,

            initialized:
                this.initialized,

            offlineStorage:
                Boolean(
                    SolarForgeStorage.database
                ),

            projectOpen:
                this.hasCurrentProject(),

            currentProjectId:
                this.currentProject?.project?.id ||
                null,

            projectCount:
                projectCount
        };
    },


    // --------------------------------------------------------
    // Ensure application is initialized
    // --------------------------------------------------------

    async ensureInitialized() {

        if (!this.initialized) {

            await this.init();
        }
    },


    // --------------------------------------------------------
    // Require an active project
    // --------------------------------------------------------

    requireCurrentProject() {

        if (!this.currentProject) {

            throw new Error(
                "No SolarForge project is currently open."
            );
        }


        return this.currentProject;
    }
};


// ============================================================
// Global reference
// ============================================================

window.SolarForgeApp =
    SolarForgeApp;
