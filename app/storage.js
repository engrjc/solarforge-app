/* =========================================================
   SOLARFORGE OFFLINE STORAGE
   IndexedDB Project Database
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DATABASE SETTINGS
    ====================================================== */

    const DB_NAME =
        "SolarForgeDB";

    const DB_VERSION =
        1;

    const STORE_NAME =
        "projects";


    /* =====================================================
       STORAGE OBJECT
    ====================================================== */

    const SolarForgeStorage = {


        db: null,

        initialized: false,


        /* =================================================
           INITIALIZE
        ================================================== */

        init: function () {

            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    if (
                        self.initialized &&
                        self.db
                    ) {

                        resolve(
                            self.db
                        );

                        return;

                    }


                    if (
                        !window.indexedDB
                    ) {

                        reject(
                            new Error(
                                "IndexedDB is not supported by this browser."
                            )
                        );

                        return;

                    }


                    const request =
                        indexedDB.open(
                            DB_NAME,
                            DB_VERSION
                        );


                    request.onupgradeneeded =
                        function (event) {

                            const db =
                                event.target.result;


                            let store;


                            if (
                                !db.objectStoreNames.contains(
                                    STORE_NAME
                                )
                            ) {

                                store =
                                    db.createObjectStore(
                                        STORE_NAME,
                                        {
                                            keyPath:
                                                "project.id"
                                        }
                                    );

                            } else {

                                store =
                                    event.target.transaction.objectStore(
                                        STORE_NAME
                                    );

                            }


                            if (
                                !store.indexNames.contains(
                                    "projectName"
                                )
                            ) {

                                store.createIndex(
                                    "projectName",
                                    "project.name",
                                    {
                                        unique: false
                                    }
                                );

                            }


                            if (
                                !store.indexNames.contains(
                                    "projectStatus"
                                )
                            ) {

                                store.createIndex(
                                    "projectStatus",
                                    "project.status",
                                    {
                                        unique: false
                                    }
                                );

                            }


                            if (
                                !store.indexNames.contains(
                                    "projectUpdatedAt"
                                )
                            ) {

                                store.createIndex(
                                    "projectUpdatedAt",
                                    "project.updatedAt",
                                    {
                                        unique: false
                                    }
                                );

                            }

                        };


                    request.onsuccess =
                        function (event) {

                            self.db =
                                event.target.result;


                            self.initialized =
                                true;


                            self.db.onversionchange =
                                function () {

                                    self.db.close();

                                    self.db =
                                        null;

                                    self.initialized =
                                        false;

                                };


                            console.log(
                                "SolarForge IndexedDB initialized."
                            );


                            resolve(
                                self.db
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to open SolarForge local database."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           ENSURE DATABASE
        ================================================== */

        ensureInitialized: async function () {

            if (
                !this.initialized ||
                !this.db
            ) {

                await this.init();

            }


            return this.db;

        },


        /* =================================================
           SAVE PROJECT
        ================================================== */

        saveProject: async function (
            project
        ) {

            await this.ensureInitialized();


            if (
                !window.SolarForgeProject
            ) {

                throw new Error(
                    "SolarForgeProject is not available."
                );

            }


            const validation =
                window.SolarForgeProject.validate(
                    project
                );


            if (!validation.valid) {

                throw new Error(
                    validation.errors.join(" ")
                );

            }


            window.SolarForgeProject.touch(
                project
            );


            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    const transaction =
                        self.db.transaction(
                            [STORE_NAME],
                            "readwrite"
                        );


                    const store =
                        transaction.objectStore(
                            STORE_NAME
                        );


                    const request =
                        store.put(
                            project
                        );


                    request.onsuccess =
                        function () {

                            resolve(
                                project
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to save project."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           LOAD PROJECT
        ================================================== */

        loadProject: async function (
            projectId
        ) {

            await this.ensureInitialized();


            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    const transaction =
                        self.db.transaction(
                            [STORE_NAME],
                            "readonly"
                        );


                    const store =
                        transaction.objectStore(
                            STORE_NAME
                        );


                    const request =
                        store.get(
                            projectId
                        );


                    request.onsuccess =
                        function () {

                            resolve(
                                request.result ||
                                null
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to load project."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           GET ALL PROJECTS
        ================================================== */

        getAllProjects: async function () {

            await this.ensureInitialized();


            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    const transaction =
                        self.db.transaction(
                            [STORE_NAME],
                            "readonly"
                        );


                    const store =
                        transaction.objectStore(
                            STORE_NAME
                        );


                    const request =
                        store.getAll();


                    request.onsuccess =
                        function () {

                            const projects =
                                request.result ||
                                [];


                            projects.sort(
                                function (
                                    a,
                                    b
                                ) {

                                    const dateA =
                                        new Date(
                                            a?.project?.updatedAt ||
                                            0
                                        ).getTime();


                                    const dateB =
                                        new Date(
                                            b?.project?.updatedAt ||
                                            0
                                        ).getTime();


                                    return dateB - dateA;

                                }
                            );


                            resolve(
                                projects
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to retrieve projects."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           DELETE PROJECT
        ================================================== */

        deleteProject: async function (
            projectId
        ) {

            await this.ensureInitialized();


            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    const transaction =
                        self.db.transaction(
                            [STORE_NAME],
                            "readwrite"
                        );


                    const store =
                        transaction.objectStore(
                            STORE_NAME
                        );


                    const request =
                        store.delete(
                            projectId
                        );


                    request.onsuccess =
                        function () {

                            resolve(
                                true
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to delete project."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           PROJECT EXISTS
        ================================================== */

        projectExists: async function (
            projectId
        ) {

            const project =
                await this.loadProject(
                    projectId
                );


            return Boolean(
                project
            );

        },


        /* =================================================
           COUNT PROJECTS
        ================================================== */

        countProjects: async function () {

            await this.ensureInitialized();


            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    const transaction =
                        self.db.transaction(
                            [STORE_NAME],
                            "readonly"
                        );


                    const store =
                        transaction.objectStore(
                            STORE_NAME
                        );


                    const request =
                        store.count();


                    request.onsuccess =
                        function () {

                            resolve(
                                request.result
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to count projects."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           CLEAR ALL
        ================================================== */

        clearAllProjects: async function () {

            await this.ensureInitialized();


            const self = this;


            return new Promise(
                function (
                    resolve,
                    reject
                ) {

                    const transaction =
                        self.db.transaction(
                            [STORE_NAME],
                            "readwrite"
                        );


                    const store =
                        transaction.objectStore(
                            STORE_NAME
                        );


                    const request =
                        store.clear();


                    request.onsuccess =
                        function () {

                            resolve(
                                true
                            );

                        };


                    request.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Unable to clear projects."
                                )
                            );

                        };

                }
            );

        },


        /* =================================================
           EXPORT PROJECT
        ================================================== */

        exportProject: function (
            project
        ) {

            if (!project) {

                throw new Error(
                    "No project available for export."
                );

            }


            return JSON.stringify(
                project,
                null,
                2
            );

        },


        /* =================================================
           IMPORT PROJECT
        ================================================== */

        importProject: function (
            jsonText
        ) {

            if (
                typeof jsonText !==
                "string"
            ) {

                throw new Error(
                    "Invalid project file."
                );

            }


            let parsed;


            try {

                parsed =
                    JSON.parse(
                        jsonText
                    );

            } catch (error) {

                throw new Error(
                    "The project file is not valid JSON."
                );

            }


            if (
                !window.SolarForgeProject
            ) {

                throw new Error(
                    "SolarForgeProject is not available."
                );

            }


            const project =
                window.SolarForgeProject.normalize(
                    parsed
                );


            const validation =
                window.SolarForgeProject.validate(
                    project
                );


            if (!validation.valid) {

                throw new Error(
                    validation.errors.join(" ")
                );

            }


            return project;

        },


        /* =================================================
           CREATE PROJECT
        ================================================== */

        createProject: async function () {

            if (
                !window.SolarForgeProject
            ) {

                throw new Error(
                    "SolarForgeProject is not available."
                );

            }


            const project =
                window.SolarForgeProject.createNewProject();


            await this.saveProject(
                project
            );


            return project;

        },


        /* =================================================
           GET LATEST PROJECT
        ================================================== */

        getLatestProject: async function () {

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


    /* =====================================================
       EXPOSE GLOBAL
    ====================================================== */

    window.SolarForgeStorage =
        SolarForgeStorage;


    window.SolarForgeStorageReady =
        true;


    console.log(
        "SolarForgeStorage loaded successfully."
    );


})();
