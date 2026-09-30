/* =========================================================
   SOLARFORGE PROJECT DATA MODEL
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONSTANTS
    ====================================================== */

    const SCHEMA_VERSION = "1.0.0";


    /* =====================================================
       PROJECT MODEL
    ====================================================== */

    const SolarForgeProject = {


        /* =================================================
           CREATE NEW PROJECT
        ================================================= */

        createNewProject: function () {

            const now = new Date().toISOString();

            const projectId =
                this.generateProjectId();


            const projectNumber =
                this.generateProjectNumber();


            return {

                schemaVersion: SCHEMA_VERSION,


                project: {

                    id: projectId,

                    projectNumber: projectNumber,

                    name: "New Solar Project",

                    status: "new",

                    revision: 1,

                    createdAt: now,

                    updatedAt: now

                },


                /* =========================================
                   CUSTOMER
                ========================================== */

                customer: {

                    name: "",

                    company: "",

                    contactNumber: "",

                    email: "",

                    address: "",

                    notes: ""

                },


                /* =========================================
                   SITE
                ========================================== */

                site: {

                    address: "",

                    installationType: "residential",

                    roofType: "",

                    roofMaterial: "",

                    mountingType: "",

                    gridConnection: "grid-connected",

                    servicePhase: "single-phase",

                    serviceVoltage: 230,

                    frequencyHz: 60,

                    mainBreakerRatingA: "",

                    existingElectricalPanel: "",

                    backupLoadPanel: "",

                    siteNotes: ""

                },


                /* =========================================
                   ENERGY
                ========================================== */

                energy: {

                    monthlyConsumptionKwh: 0,

                    monthlyBillPhp: 0,

                    electricityRatePhpPerKwh: 0,


                    appliances: [],


                    calculated: {

                        dailyConsumptionKwh: 0,

                        daytimeEnergyKwh: 0,

                        nighttimeEnergyKwh: 0,

                        continuousEnergyKwh: 0,

                        essentialEnergyKwh: 0,

                        estimatedPeakLoadKw: 0,

                        estimatedNightPeakLoadKw: 0

                    },


                    consumptionCrossCheck: {

                        calculatedMonthlyKwh: 0,

                        enteredMonthlyKwh: 0,

                        differenceKwh: 0,

                        differencePercent: 0,

                        status: "not_checked"

                    }

                },


                /* =========================================
                   PRELIMINARY DESIGN
                ========================================== */

                preliminary: {

                    status: "not_started",


                    assumptions: {

                        peakSunHoursPerDay: 4.5,

                        pvSystemEfficiencyPercent: 80,

                        inverterEfficiencyPercent: 95,

                        batteryEfficiencyPercent: 90,

                        batteryUsableDoDPercent: 80,

                        designReservePercent: 20,

                        backupHoursRequired: 4

                    },


                    results: {

                        estimatedPvCapacityKw: 0,

                        estimatedInverterCapacityKw: 0,

                        estimatedBatteryUsableKwh: 0,

                        estimatedBatteryNominalKwh: 0,

                        estimatedBackupEnergyKwh: 0,

                        estimatedPeakDemandKw: 0

                    },


                    warnings: [],

                    notes: ""

                },


                /* =========================================
                   EQUIPMENT
                ========================================== */

                equipment: {

                    solarPanels: [],

                    hybridInverters: [],

                    batteries: [],

                    protectionDevices: [],

                    cables: [],

                    dcCombiners: [],

                    acPanels: [],

                    busbars: [],

                    connectors: [],

                    monitoring: [],

                    other: []

                },


                /* =========================================
                   ENGINEERING
                ========================================== */

                engineering: {

                    status: "not_started",

                    checks: [],

                    warnings: [],

                    errors: [],

                    assumptions: [],

                    notes: ""

                },


                /* =========================================
                   WIRING
                ========================================== */

                wiring: {

                    components: [],

                    connections: [],

                    canvas: {

                        zoom: 1,

                        panX: 0,

                        panY: 0

                    },

                    notes: ""

                },


                /* =========================================
                   BILL OF MATERIALS
                ========================================== */

                bom: {

                    items: [],

                    notes: ""

                },


                /* =========================================
                   COSTING
                ========================================== */

                costing: {

                    materialCost: 0,

                    laborCost: 0,

                    transportCost: 0,

                    overheadCost: 0,

                    otherCost: 0,

                    totalProjectCost: 0,

                    marginPercent: 0,

                    marginAmount: 0,

                    sellingPrice: 0,

                    notes: ""

                },


                /* =========================================
                   QUOTATION
                ========================================== */

                quotation: {

                    quotationNumber: "",

                    date: "",

                    validityDays: 30,

                    paymentTerms: "",

                    warrantyTerms: "",

                    inclusions: "",

                    exclusions: "",

                    notes: ""

                },


                /* =========================================
                   INSTALLATION
                ========================================== */

                installation: {

                    status: "not_started",

                    startDate: "",

                    completionDate: "",

                    installer: "",

                    checklist: [],

                    notes: ""

                },


                /* =========================================
                   COMMISSIONING
                ========================================== */

                commissioning: {

                    status: "not_started",

                    date: "",

                    technician: "",

                    tests: [],

                    measuredValues: {},

                    issues: [],

                    notes: ""

                },


                /* =========================================
                   GENERAL NOTES
                ========================================== */

                notes: "",


                /* =========================================
                   REPORTS
                ========================================== */

                reports: []

            };

        },


        /* =================================================
           ID GENERATION
        ================================================== */

        generateProjectId: function () {

            return (
                "SF-" +
                Date.now().toString(36).toUpperCase() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase()
            );

        },


        generateProjectNumber: function () {

            const date =
                new Date();

            const year =
                date.getFullYear();


            const random =
                Math.floor(
                    1000 +
                    Math.random() * 9000
                );


            return (
                "SF-" +
                year +
                "-" +
                random
            );

        },


        generateItemId: function () {

            return (
                "ITEM-" +
                Date.now().toString(36) +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 7)
            );

        },


        /* =================================================
           TOUCH PROJECT
        ================================================== */

        touch: function (project) {

            if (!project) {
                return project;
            }


            if (!project.project) {

                project.project = {};

            }


            project.project.updatedAt =
                new Date().toISOString();


            return project;

        },


        /* =================================================
           ADD APPLIANCE
        ================================================== */

        addAppliance: function (
            project,
            applianceData
        ) {

            if (!project) {
                throw new Error(
                    "Project is required."
                );
            }


            if (!project.energy) {

                project.energy = {
                    appliances: []
                };

            }


            if (!Array.isArray(
                project.energy.appliances
            )) {

                project.energy.appliances = [];

            }


            const appliance = {

                id: this.generateItemId(),

                name:
                    applianceData?.name ||
                    "New Appliance",

                category:
                    applianceData?.category ||
                    "General",

                quantity:
                    this.toNumber(
                        applianceData?.quantity,
                        1
                    ),

                ratedPowerW:
                    this.toNumber(
                        applianceData?.ratedPowerW,
                        0
                    ),

                totalHoursPerDay:
                    this.toNumber(
                        applianceData?.totalHoursPerDay,
                        0
                    ),

                daytimeHours:
                    this.toNumber(
                        applianceData?.daytimeHours,
                        0
                    ),

                nighttimeHours:
                    this.toNumber(
                        applianceData?.nighttimeHours,
                        0
                    ),

                continuous:
                    Boolean(
                        applianceData?.continuous
                    ),

                priority:
                    applianceData?.priority ||
                    "important",

                startingSurgeW:
                    this.toNumber(
                        applianceData?.startingSurgeW,
                        0
                    ),

                dutyCyclePercent:
                    this.toNumber(
                        applianceData?.dutyCyclePercent,
                        100
                    ),

                simultaneousUse:
                    Boolean(
                        applianceData?.simultaneousUse
                    ),

                notes:
                    applianceData?.notes ||
                    ""

            };


            project.energy.appliances.push(
                appliance
            );


            this.touch(project);


            return appliance;

        },


        /* =================================================
           REMOVE APPLIANCE
        ================================================== */

        removeAppliance: function (
            project,
            applianceId
        ) {

            if (
                !project ||
                !project.energy ||
                !Array.isArray(
                    project.energy.appliances
                )
            ) {

                return false;

            }


            const originalLength =
                project.energy.appliances.length;


            project.energy.appliances =
                project.energy.appliances.filter(
                    function (item) {
                        return item.id !== applianceId;
                    }
                );


            const removed =
                project.energy.appliances.length !==
                originalLength;


            if (removed) {

                this.touch(project);

            }


            return removed;

        },


        /* =================================================
           ADD EQUIPMENT
        ================================================== */

        addEquipment: function (
            project,
            category,
            equipmentData
        ) {

            if (!project) {

                throw new Error(
                    "Project is required."
                );

            }


            if (
                !project.equipment[category]
            ) {

                project.equipment[category] = [];

            }


            const equipment = {

                id: this.generateItemId(),

                category: category,

                brand:
                    equipmentData?.brand ||
                    "",

                model:
                    equipmentData?.model ||
                    "",

                partNumber:
                    equipmentData?.partNumber ||
                    "",

                quantity:
                    this.toNumber(
                        equipmentData?.quantity,
                        1
                    ),

                specifications:
                    equipmentData?.specifications ||
                    {},

                supplier:
                    equipmentData?.supplier ||
                    "",

                datasheet:
                    equipmentData?.datasheet ||
                    "",

                purchasePrice:
                    this.toNumber(
                        equipmentData?.purchasePrice,
                        0
                    ),

                sellingPrice:
                    this.toNumber(
                        equipmentData?.sellingPrice,
                        0
                    ),

                serialNumber:
                    equipmentData?.serialNumber ||
                    "",

                notes:
                    equipmentData?.notes ||
                    ""

            };


            project.equipment[category].push(
                equipment
            );


            this.touch(project);


            return equipment;

        },


        /* =================================================
           REMOVE EQUIPMENT
        ================================================== */

        removeEquipment: function (
            project,
            category,
            equipmentId
        ) {

            if (
                !project ||
                !project.equipment ||
                !Array.isArray(
                    project.equipment[category]
                )
            ) {

                return false;

            }


            const originalLength =
                project.equipment[category].length;


            project.equipment[category] =
                project.equipment[category].filter(
                    function (item) {

                        return item.id !== equipmentId;

                    }
                );


            const removed =
                project.equipment[category].length !==
                originalLength;


            if (removed) {

                this.touch(project);

            }


            return removed;

        },


        /* =================================================
           ADD ENGINEERING CHECK
        ================================================== */

        addEngineeringCheck: function (
            project,
            checkData
        ) {

            if (!project) {

                throw new Error(
                    "Project is required."
                );

            }


            if (
                !project.engineering
            ) {

                project.engineering = {};

            }


            if (
                !Array.isArray(
                    project.engineering.checks
                )
            ) {

                project.engineering.checks = [];

            }


            const check = {

                id: this.generateItemId(),

                name:
                    checkData?.name ||
                    "Engineering Check",

                category:
                    checkData?.category ||
                    "General",

                status:
                    checkData?.status ||
                    "review",

                requirement:
                    checkData?.requirement ||
                    "",

                actual:
                    checkData?.actual ||
                    "",

                result:
                    checkData?.result ||
                    "",

                notes:
                    checkData?.notes ||
                    ""

            };


            project.engineering.checks.push(
                check
            );


            this.touch(project);


            return check;

        },


        /* =================================================
           ADD BOM ITEM
        ================================================== */

        addBomItem: function (
            project,
            itemData
        ) {

            if (!project) {

                throw new Error(
                    "Project is required."
                );

            }


            if (!project.bom) {

                project.bom = {};

            }


            if (!Array.isArray(
                project.bom.items
            )) {

                project.bom.items = [];

            }


            const item = {

                id: this.generateItemId(),

                category:
                    itemData?.category ||
                    "General",

                description:
                    itemData?.description ||
                    "",

                brand:
                    itemData?.brand ||
                    "",

                model:
                    itemData?.model ||
                    "",

                quantity:
                    this.toNumber(
                        itemData?.quantity,
                        1
                    ),

                unit:
                    itemData?.unit ||
                    "pcs",

                unitCost:
                    this.toNumber(
                        itemData?.unitCost,
                        0
                    ),

                totalCost:
                    this.toNumber(
                        itemData?.totalCost,
                        0
                    ),

                supplier:
                    itemData?.supplier ||
                    "",

                notes:
                    itemData?.notes ||
                    ""

            };


            if (
                item.totalCost === 0 &&
                item.unitCost > 0
            ) {

                item.totalCost =
                    item.unitCost *
                    item.quantity;

            }


            project.bom.items.push(
                item
            );


            this.touch(project);


            return item;

        },


        /* =================================================
           NUMBER HELPER
        ================================================== */

        toNumber: function (
            value,
            fallback
        ) {

            const number =
                Number(value);


            if (
                Number.isFinite(number)
            ) {

                return number;

            }


            return (
                fallback === undefined
                    ? 0
                    : fallback
            );

        },


        /* =================================================
           CLONE
        ================================================== */

        clone: function (
            project
        ) {

            if (!project) {
                return null;
            }


            return JSON.parse(
                JSON.stringify(project)
            );

        },


        /* =================================================
           VALIDATE
        ================================================== */

        validate: function (
            project
        ) {

            const errors = [];


            if (!project) {

                errors.push(
                    "Project data is missing."
                );

                return {

                    valid: false,

                    errors: errors

                };

            }


            if (!project.project) {

                errors.push(
                    "Project information is missing."
                );

            }


            if (
                !project.project ||
                !project.project.id
            ) {

                errors.push(
                    "Project ID is missing."
                );

            }


            if (
                !project.project ||
                !project.project.name
            ) {

                errors.push(
                    "Project name is missing."
                );

            }


            return {

                valid:
                    errors.length === 0,

                errors: errors

            };

        },


        /* =================================================
           NORMALIZE IMPORTED PROJECT
        ================================================== */

        normalize: function (
            imported
        ) {

            const base =
                this.createNewProject();


            if (
                !imported ||
                typeof imported !== "object"
            ) {

                return base;

            }


            const merge =
                function (
                    target,
                    source
                ) {

                    Object.keys(source)
                        .forEach(
                            function (key) {

                                if (
                                    source[key] &&
                                    typeof source[key] ===
                                    "object" &&
                                    !Array.isArray(
                                        source[key]
                                    )
                                ) {

                                    if (
                                        !target[key] ||
                                        typeof target[key] !==
                                        "object"
                                    ) {

                                        target[key] = {};

                                    }


                                    merge(
                                        target[key],
                                        source[key]
                                    );

                                } else {

                                    target[key] =
                                        source[key];

                                }

                            }
                        );

                };


            merge(
                base,
                imported
            );


            return base;

        }

    };


    /* =====================================================
       EXPOSE GLOBAL
    ====================================================== */

    window.SolarForgeProject =
        SolarForgeProject;


    /*
     * Explicit initialization marker.
     */

    window.SolarForgeProjectReady =
        true;


    console.log(
        "SolarForgeProject loaded successfully."
    );


})();
