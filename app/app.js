/* =========================================================
   SOLARFORGE APPLICATION CONTROLLER
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       APPLICATION
    ====================================================== */

    const SolarForgeApp = {


        name:
            "SolarForge",

        version:
            "1.0.0",

        currentProject:
            null,

        initialized:
            false,


        /* =================================================
           INITIALIZE APPLICATION
        ================================================== */

        init: async function () {

            console.log(
                "Starting SolarForge..."
            );


            /*
             * project.js must already be available.
             */

            if (
                !window.SolarForgeProject
            ) {

                throw new Error(
                    "SolarForgeProject is not available. " +
                    "Make sure app/project.js is loaded before app.js."
                );

            }


            /*
             * storage.js must already be available.
             */

            if (
                !window.SolarForgeStorage
            ) {

                throw new Error(
                    "SolarForgeStorage is not available. " +
                    "Make sure app/storage.js is loaded before app.js."
                );

            }


            /*
             * Initialize IndexedDB.
             */

            await window.SolarForgeStorage.init();


            /*
             * Try to restore the latest project.
             */

            try {

                const latest =
                    await window.SolarForgeStorage.getLatestProject();


                if (latest) {

                    this.currentProject =
                        latest;

                    console.log(
                        "Latest project restored:",
                        latest.project?.name
                    );

                }

            } catch (error) {

                console.warn(
                    "No previous project could be restored.",
                    error
                );

            }


            this.initialized =
                true;


            console.log(
                "SolarForge initialized successfully."
            );


            return true;

        },


        /* =================================================
           ENSURE INITIALIZED
        ================================================== */

        ensureInitialized: function () {

            if (!this.initialized) {

                throw new Error(
                    "SolarForge has not been initialized."
                );

            }

        },


        /* =================================================
           CREATE NEW PROJECT
        ================================================== */

        createNewProject: async function () {

            this.ensureInitialized();


            const project =
                await window.SolarForgeStorage.createProject();


            this.currentProject =
                project;


            return project;

        },


        /* =================================================
           LOAD PROJECT
        ================================================== */

        loadProject: async function (
            projectId
        ) {

            this.ensureInitialized();


            if (!projectId) {

                throw new Error(
                    "Project ID is required."
                );

            }


            const project =
                await window.SolarForgeStorage.loadProject(
                    projectId
                );


            if (!project) {

                throw new Error(
                    "Project could not be found."
                );

            }


            this.currentProject =
                project;


            return project;

        },


        /* =================================================
           SAVE CURRENT PROJECT
        ================================================== */

        saveCurrentProject: async function () {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "There is no active project."
                );

            }


            await window.SolarForgeStorage.saveProject(
                this.currentProject
            );


            return this.currentProject;

        },


        /* =================================================
           SAVE SPECIFIC PROJECT
        ================================================== */

        saveProject: async function (
            project
        ) {

            this.ensureInitialized();


            const saved =
                await window.SolarForgeStorage.saveProject(
                    project
                );


            if (
                this.currentProject &&
                this.currentProject.project &&
                project &&
                project.project &&
                this.currentProject.project.id ===
                project.project.id
            ) {

                this.currentProject =
                    saved;

            }


            return saved;

        },


        /* =================================================
           DELETE CURRENT PROJECT
        ================================================== */

        deleteCurrentProject: async function () {

            this.ensureInitialized();


            if (!this.currentProject) {

                return false;

            }


            const projectId =
                this.currentProject.project.id;


            await window.SolarForgeStorage.deleteProject(
                projectId
            );


            this.currentProject =
                null;


            return true;

        },


        /* =================================================
           DELETE PROJECT
        ================================================== */

        deleteProject: async function (
            projectId
        ) {

            this.ensureInitialized();


            await window.SolarForgeStorage.deleteProject(
                projectId
            );


            if (
                this.currentProject &&
                this.currentProject.project &&
                this.currentProject.project.id ===
                projectId
            ) {

                this.currentProject =
                    null;

            }


            return true;

        },


        /* =================================================
           GET PROJECTS
        ================================================== */

        getProjects: async function () {

            this.ensureInitialized();


            return (
                await window.SolarForgeStorage.getAllProjects()
            );

        },


        /* =================================================
           GET PROJECT COUNT
        ================================================== */

        getProjectCount: async function () {

            this.ensureInitialized();


            return (
                await window.SolarForgeStorage.countProjects()
            );

        },


        /* =================================================
           GET CURRENT PROJECT
        ================================================== */

        getCurrentProject: function () {

            return this.currentProject;

        },


        /* =================================================
           HAS CURRENT PROJECT
        ================================================== */

        hasCurrentProject: function () {

            return Boolean(
                this.currentProject
            );

        },


        /* =================================================
           SET CURRENT PROJECT
        ================================================== */

        setCurrentProject: function (
            project
        ) {

            this.currentProject =
                project ||
                null;


            return this.currentProject;

        },


        /* =================================================
           CLOSE CURRENT PROJECT
        ================================================== */

        closeCurrentProject: function () {

            this.currentProject =
                null;


            return true;

        },


        /* =================================================
           ADD APPLIANCE
        ================================================== */

        addAppliance: async function (
            applianceData
        ) {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            const appliance =
                window.SolarForgeProject.addAppliance(
                    this.currentProject,
                    applianceData
                );


            await this.saveCurrentProject();


            return appliance;

        },


        /* =================================================
           REMOVE APPLIANCE
        ================================================== */

        removeAppliance: async function (
            applianceId
        ) {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            const removed =
                window.SolarForgeProject.removeAppliance(
                    this.currentProject,
                    applianceId
                );


            if (removed) {

                await this.saveCurrentProject();

            }


            return removed;

        },


        /* =================================================
           ADD EQUIPMENT
        ================================================== */

        addEquipment: async function (
            category,
            equipmentData
        ) {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            const equipment =
                window.SolarForgeProject.addEquipment(
                    this.currentProject,
                    category,
                    equipmentData
                );


            await this.saveCurrentProject();


            return equipment;

        },


        /* =================================================
           REMOVE EQUIPMENT
        ================================================== */

        removeEquipment: async function (
            category,
            equipmentId
        ) {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            const removed =
                window.SolarForgeProject.removeEquipment(
                    this.currentProject,
                    category,
                    equipmentId
                );


            if (removed) {

                await this.saveCurrentProject();

            }


            return removed;

        },


        /* =================================================
           ENGINEERING CHECK
        ================================================== */

        addEngineeringCheck: async function (
            checkData
        ) {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            const check =
                window.SolarForgeProject.addEngineeringCheck(
                    this.currentProject,
                    checkData
                );


            await this.saveCurrentProject();


            return check;

        },


        /* =================================================
           BOM ITEM
        ================================================== */

        addBomItem: async function (
            itemData
        ) {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            const item =
                window.SolarForgeProject.addBomItem(
                    this.currentProject,
                    itemData
                );


            await this.saveCurrentProject();


            return item;

        },


        /* =================================================
           EXPORT CURRENT PROJECT
        ================================================== */

        exportCurrentProject: function () {

            this.ensureInitialized();


            if (!this.currentProject) {

                throw new Error(
                    "No active project."
                );

            }


            return window.SolarForgeStorage.exportProject(
                this.currentProject
            );

        },


        /* =================================================
           IMPORT PROJECT
        ================================================== */

        importProject: function (
            jsonText
        ) {

            this.ensureInitialized();


            return window.SolarForgeStorage.importProject(
                jsonText
            );

        },


        /* =================================================
           IMPORT AND SAVE
        ================================================== */

        importAndSaveProject: async function (
            jsonText
        ) {

            this.ensureInitialized();


            const project =
                this.importProject(
                    jsonText
                );


            await this.saveProject(
                project
            );


            this.currentProject =
                project;


            return project;

        },


        /* =================================================
           CREATE BACKUP
        ================================================== */

        createProjectBackup: function () {

            return this.exportCurrentProject();

        },


        /* =================================================
           VALIDATE CURRENT PROJECT
        ================================================== */

        validateCurrentProject: function () {

            if (!this.currentProject) {

                return {

                    valid: false,

                    errors: [
                        "No active project."
                    ]

                };

            }


            return window.SolarForgeProject.validate(
                this.currentProject
            );

        },


        /* =================================================
           STATUS
        ================================================== */

        getStatus: function () {

            if (!this.currentProject) {

                return "no_project";

            }


            return (
                this.currentProject.project?.status ||
                "unknown"
            );

        },


        /* =================================================
           REQUIRE CURRENT PROJECT
        ================================================== */

        requireCurrentProject: function () {

            if (!this.currentProject) {

                throw new Error(
                    "No active SolarForge project."
                );

            }


            return this.currentProject;

        }

    };


    /* =====================================================
       EXPOSE GLOBAL
    ====================================================== */

    window.SolarForgeApp =
        SolarForgeApp;


    window.SolarForgeAppReady =
        true;


    console.log(
        "SolarForgeApp loaded successfully."
    );


})();
