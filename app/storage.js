// ============================================================
// SOLARFORGE
// Offline Project Storage
// ============================================================
//
// This module provides local offline storage for SolarForge.
//
// Storage technology:
// - IndexedDB
//
// This allows SolarForge to store complete projects locally
// on the device without requiring an internet connection.
//
// ============================================================

const SolarForgeStorage = {

    // --------------------------------------------------------
    // Database configuration
    // --------------------------------------------------------

    databaseName: "SolarForgeDB",

    databaseVersion: 1,

    projectStoreName: "projects",

    database: null,


    // --------------------------------------------------------
    // Initialize the database
    // --------------------------------------------------------

    async init() {

        if (this.database) {

            return this.database;
        }

        if (!window.indexedDB) {

            throw new Error(
                "IndexedDB is not supported by this browser."
            );
        }

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(
                this.databaseName,
                this.databaseVersion
            );


            // ------------------------------------------------
            // Database creation / upgrade
            // ------------------------------------------------

            request.onupgradeneeded = (event) => {

                const database = event.target.result;


                // --------------------------------------------
                // Create project store
                // --------------------------------------------

                if (
                    !database.objectStoreNames.contains(
                        this.projectStoreName
                    )
                ) {

                    const projectStore =
                        database.createObjectStore(
                            this.projectStoreName,
                            {
                                keyPath: "project.id"
                            }
                        );


                    // ----------------------------------------
                    // Indexes
                    // ----------------------------------------

                    projectStore.createIndex(
                        "projectName",
                        "project.name",
                        {
                            unique: false
                        }
                    );

                    projectStore.createIndex(
                        "status",
                        "project.status",
                        {
                            unique: false
                        }
                    );

                    projectStore.createIndex(
                        "updatedAt",
                        "project.updatedAt",
                        {
                            unique: false
                        }
                    );
                }
            };


            // ------------------------------------------------
            // Database successfully opened
            // ------------------------------------------------

            request.onsuccess = (event) => {

                this.database =
                    event.target.result;

                this.database.onversionchange = () => {

                    this.database.close();

                    this.database = null;
                };

                resolve(this.database);
            };


            // ------------------------------------------------
            // Database error
            // ------------------------------------------------

            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to open SolarForge offline database."
                    )
                );
            };


            // ------------------------------------------------
            // Database blocked
            // ------------------------------------------------

            request.onblocked = () => {

                reject(
                    new Error(
                        "SolarForge database upgrade is blocked. " +
                        "Please close other SolarForge tabs and try again."
                    )
                );
            };

        });
    },


    // --------------------------------------------------------
    // Save a project
    // --------------------------------------------------------

    async saveProject(project) {

        if (!project) {

            throw new Error(
                "Cannot save an empty SolarForge project."
            );
        }


        // --------------------------------------------
        // Validate using Project Data Model
        // --------------------------------------------

        if (
            window.SolarForgeProject &&
            typeof SolarForgeProject.validate === "function"
        ) {

            const validation =
                SolarForgeProject.validate(project);

            if (!validation.valid) {

                throw new Error(
                    "Invalid SolarForge project: " +
                    validation.errors.join(" ")
                );
            }
        }


        // --------------------------------------------
        // Update timestamp
        // --------------------------------------------

        if (
            window.SolarForgeProject &&
            typeof SolarForgeProject.touch === "function"
        ) {

            SolarForgeProject.touch(project);

        } else if (
            project.project
        ) {

            project.project.updatedAt =
                new Date().toISOString();
        }


        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.put(project);


            request.onsuccess = () => {

                resolve(project);
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to save SolarForge project."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Load a project by ID
    // --------------------------------------------------------

    async loadProject(projectId) {

        if (!projectId) {

            throw new Error(
                "Project ID is required."
            );
        }


        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.get(projectId);


            request.onsuccess = () => {

                resolve(
                    request.result || null
                );
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to load SolarForge project."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Get all saved projects
    // --------------------------------------------------------

    async getAllProjects() {

        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.getAll();


            request.onsuccess = () => {

                const projects =
                    request.result || [];


                // ----------------------------------------
                // Sort newest updated project first
                // ----------------------------------------

                projects.sort((a, b) => {

                    const dateA =
                        new Date(
                            a?.project?.updatedAt || 0
                        ).getTime();

                    const dateB =
                        new Date(
                            b?.project?.updatedAt || 0
                        ).getTime();

                    return dateB - dateA;
                });


                resolve(projects);
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to retrieve SolarForge projects."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Delete a project
    // --------------------------------------------------------

    async deleteProject(projectId) {

        if (!projectId) {

            throw new Error(
                "Project ID is required."
            );
        }


        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.delete(projectId);


            request.onsuccess = () => {

                resolve(true);
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to delete SolarForge project."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Check if a project exists
    // --------------------------------------------------------

    async projectExists(projectId) {

        if (!projectId) {

            return false;
        }


        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.getKey(projectId);


            request.onsuccess = () => {

                resolve(
                    request.result !== undefined
                );
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to check SolarForge project."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Count saved projects
    // --------------------------------------------------------

    async countProjects() {

        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.count();


            request.onsuccess = () => {

                resolve(
                    request.result
                );
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to count SolarForge projects."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Delete every saved project
    // --------------------------------------------------------
    //
    // This is intended for future Settings / maintenance
    // functionality.
    //
    // The UI should ask for confirmation before calling it.
    //
    // --------------------------------------------------------

    async clearAllProjects() {

        const database =
            await this.init();


        return new Promise((resolve, reject) => {

            const transaction =
                database.transaction(
                    [this.projectStoreName],
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    this.projectStoreName
                );

            const request =
                store.clear();


            request.onsuccess = () => {

                resolve(true);
            };


            request.onerror = () => {

                reject(
                    new Error(
                        "Unable to clear SolarForge projects."
                    )
                );
            };
        });
    },


    // --------------------------------------------------------
    // Export a project as JSON
    // --------------------------------------------------------
    //
    // This prepares a project for the future:
    //
    // Export Project
    //       ↓
    // SolarForge Project File
    //       ↓
    // Files app / backup
    //
    // --------------------------------------------------------

    exportProject(project) {

        if (!project) {

            throw new Error(
                "Cannot export an empty project."
            );
        }


        return JSON.stringify(
            project,
            null,
            2
        );
    },


    // --------------------------------------------------------
    // Import a project from JSON
    // --------------------------------------------------------

    importProject(jsonText) {

        if (!jsonText) {

            throw new Error(
                "No project data was provided."
            );
        }


        let project;


        try {

            project =
                JSON.parse(jsonText);

        } catch (error) {

            throw new Error(
                "The selected file is not valid JSON."
            );
        }


        // --------------------------------------------
        // Validate imported project
        // --------------------------------------------

        if (
            window.SolarForgeProject &&
            typeof SolarForgeProject.validate === "function"
        ) {

            const validation =
                SolarForgeProject.validate(project);

            if (!validation.valid) {

                throw new Error(
                    "Invalid SolarForge project file: " +
                    validation.errors.join(" ")
                );
            }
        }


        return project;
    },


    // --------------------------------------------------------
    // Create and save a new project
    // --------------------------------------------------------

    async createProject() {

        if (
            !window.SolarForgeProject ||
            typeof SolarForgeProject.createNewProject !==
                "function"
        ) {

            throw new Error(
                "SolarForgeProject is not available. " +
                "Make sure app/project.js is loaded first."
            );
        }


        const project =
            SolarForgeProject.createNewProject();


        await this.saveProject(project);


        return project;
    },


    // --------------------------------------------------------
    // Get the most recently updated project
    // --------------------------------------------------------

    async getLatestProject() {

        const projects =
            await this.getAllProjects();


        if (
            !projects ||
            projects.length === 0
        ) {

            return null;
        }


        return projects[0];
    }
};


// ============================================================
// Global reference
// ============================================================

window.SolarForgeStorage =
    SolarForgeStorage;
