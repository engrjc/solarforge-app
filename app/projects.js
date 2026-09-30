// ============================================================
// SOLARFORGE
// Project Data Model
// ============================================================
//
// This file defines the structure of a SolarForge project.
//
// It is intentionally independent from the user interface.
// Other SolarForge modules will use this project structure for:
//
// - Customer information
// - Site information
// - Energy analysis
// - Appliance schedules
// - Preliminary calculations
// - Equipment selection
// - Engineering verification
// - Wiring design
// - BOM
// - Costing
// - Installation
// - Commissioning
// - Reports
//
// ============================================================

const SolarForgeProject = {

    // --------------------------------------------------------
    // Application information
    // --------------------------------------------------------

    schemaVersion: "1.0.0",

    // --------------------------------------------------------
    // Create a completely new project
    // --------------------------------------------------------

    createNewProject() {

        const now = new Date().toISOString();

        return {

            // =================================================
            // PROJECT INFORMATION
            // =================================================

            project: {

                id: this.generateProjectId(),

                projectNumber: "",

                name: "",

                status: "new",

                revision: 1,

                createdAt: now,

                updatedAt: now
            },


            // =================================================
            // CUSTOMER INFORMATION
            // =================================================

            customer: {

                name: "",

                company: "",

                contactNumber: "",

                email: "",

                address: "",

                notes: ""
            },


            // =================================================
            // SITE INFORMATION
            // =================================================

            site: {

                address: "",

                installationType: "",

                roofType: "",

                roofMaterial: "",

                mountingType: "",

                gridConnection: "",

                servicePhase: "",

                serviceVoltage: "",

                frequencyHz: 60,

                mainBreakerRatingA: null,

                existingElectricalPanel: "",

                backupLoadPanel: "",

                siteNotes: ""
            },


            // =================================================
            // ENERGY ANALYSIS
            // =================================================

            energy: {

                // Customer's reported electricity consumption
                monthlyConsumptionKwh: 0,

                // Optional information from the electricity bill
                monthlyBillPhp: 0,

                electricityRatePhpPerKwh: 0,

                // Appliance/load schedule
                appliances: [],

                // Calculated values will be stored here later
                calculated: {

                    dailyConsumptionKwh: 0,

                    daytimeEnergyKwh: 0,

                    nighttimeEnergyKwh: 0,

                    continuousEnergyKwh: 0,

                    essentialEnergyKwh: 0,

                    estimatedPeakLoadKw: 0,

                    estimatedNightPeakLoadKw: 0
                },

                // Comparison between utility consumption
                // and appliance-based estimation
                consumptionCrossCheck: {

                    applianceEstimatedMonthlyKwh: 0,

                    utilityReportedMonthlyKwh: 0,

                    differenceKwh: 0,

                    differencePercent: 0,

                    status: "not_checked"
                }
            },


            // =================================================
            // PRELIMINARY DESIGN
            // =================================================

            preliminary: {

                status: "not_started",

                assumptions: {

                    peakSunHoursPerDay: null,

                    pvSystemEfficiencyPercent: null,

                    inverterEfficiencyPercent: null,

                    batteryEfficiencyPercent: null,

                    batteryUsableDoDPercent: null,

                    designReservePercent: null,

                    backupHoursRequired: null
                },

                results: {

                    estimatedPvCapacityKw: null,

                    estimatedInverterCapacityKw: null,

                    estimatedBatteryUsableKwh: null,

                    estimatedBatteryNominalKwh: null,

                    estimatedBackupEnergyKwh: null,

                    estimatedPeakDemandKw: null
                },

                warnings: [],

                notes: ""
            },


            // =================================================
            // EQUIPMENT
            // =================================================
            //
            // These are the actual equipment selected for
            // the project.
            //
            // Each item can contain:
            //
            // - Category
            // - Brand
            // - Model
            // - Quantity
            // - Technical parameters
            // - Supplier
            // - Datasheet reference
            // - Cost information
            //
            // =================================================

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


            // =================================================
            // ENGINEERING VERIFICATION
            // =================================================

            engineering: {

                status: "not_started",

                checks: [],

                warnings: [],

                errors: [],

                assumptions: [],

                notes: ""
            },


            // =================================================
            // WIRING DESIGN
            // =================================================

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


            // =================================================
            // BILL OF MATERIALS
            // =================================================

            bom: {

                items: [],

                notes: ""
            },


            // =================================================
            // COSTING
            // =================================================

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


            // =================================================
            // QUOTATION
            // =================================================

            quotation: {

                quotationNumber: "",

                date: "",

                validityDays: 30,

                paymentTerms: "",

                warrantyTerms: "",

                inclusions: [],

                exclusions: [],

                notes: ""
            },


            // =================================================
            // INSTALLATION
            // =================================================

            installation: {

                status: "not_started",

                startDate: "",

                completionDate: "",

                installer: "",

                checklist: [],

                notes: ""
            },


            // =================================================
            // COMMISSIONING
            // =================================================

            commissioning: {

                status: "not_started",

                date: "",

                technician: "",

                tests: [],

                measuredValues: [],

                issues: [],

                notes: ""
            },


            // =================================================
            // PROJECT NOTES
            // =================================================

            notes: "",


            // =================================================
            // REPORT INFORMATION
            // =================================================

            reports: {

                generated: [],

                lastGeneratedAt: null
            }
        };
    },


    // --------------------------------------------------------
    // Generate a unique project ID
    // --------------------------------------------------------

    generateProjectId() {

        const timestamp = Date.now();

        const randomPart = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        return `SF-${timestamp}-${randomPart}`;
    },


    // --------------------------------------------------------
    // Update the project's updated timestamp
    // --------------------------------------------------------

    touch(project) {

        if (!project || !project.project) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        project.project.updatedAt =
            new Date().toISOString();

        return project;
    },


    // --------------------------------------------------------
    // Add an appliance
    // --------------------------------------------------------

    addAppliance(project, appliance = {}) {

        if (!project || !project.energy) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        const newAppliance = {

            id: this.generateItemId("APP"),

            name: appliance.name || "",

            quantity: this.toNumber(
                appliance.quantity,
                1
            ),

            ratedPowerW: this.toNumber(
                appliance.ratedPowerW,
                0
            ),

            totalHoursPerDay: this.toNumber(
                appliance.totalHoursPerDay,
                0
            ),

            daytimeHours: this.toNumber(
                appliance.daytimeHours,
                0
            ),

            nighttimeHours: this.toNumber(
                appliance.nighttimeHours,
                0
            ),

            continuous: Boolean(
                appliance.continuous
            ),

            priority: appliance.priority || "optional",

            startingSurgeW: this.toNumber(
                appliance.startingSurgeW,
                0
            ),

            dutyCyclePercent: this.toNumber(
                appliance.dutyCyclePercent,
                100
            ),

            simultaneousUse: Boolean(
                appliance.simultaneousUse
            ),

            notes: appliance.notes || ""
        };

        project.energy.appliances.push(
            newAppliance
        );

        this.touch(project);

        return newAppliance;
    },


    // --------------------------------------------------------
    // Remove an appliance
    // --------------------------------------------------------

    removeAppliance(project, applianceId) {

        if (!project || !project.energy) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        project.energy.appliances =
            project.energy.appliances.filter(
                appliance =>
                    appliance.id !== applianceId
            );

        this.touch(project);
    },


    // --------------------------------------------------------
    // Add equipment
    // --------------------------------------------------------

    addEquipment(
        project,
        category,
        equipment = {}
    ) {

        if (!project || !project.equipment) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        if (
            !Object.prototype.hasOwnProperty.call(
                project.equipment,
                category
            )
        ) {

            throw new Error(
                `Unknown equipment category: ${category}`
            );
        }

        const newEquipment = {

            id: this.generateItemId("EQP"),

            category:
                equipment.category || category,

            brand:
                equipment.brand || "",

            model:
                equipment.model || "",

            partNumber:
                equipment.partNumber || "",

            quantity:
                this.toNumber(
                    equipment.quantity,
                    1
                ),

            supplier:
                equipment.supplier || "",

            datasheetReference:
                equipment.datasheetReference || "",

            purchasePricePhp:
                this.toNumber(
                    equipment.purchasePricePhp,
                    0
                ),

            sellingPricePhp:
                this.toNumber(
                    equipment.sellingPricePhp,
                    0
                ),

            parameters:
                equipment.parameters || {},

            notes:
                equipment.notes || ""
        };

        project.equipment[category].push(
            newEquipment
        );

        this.touch(project);

        return newEquipment;
    },


    // --------------------------------------------------------
    // Remove equipment
    // --------------------------------------------------------

    removeEquipment(
        project,
        category,
        equipmentId
    ) {

        if (!project || !project.equipment) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        if (
            !Object.prototype.hasOwnProperty.call(
                project.equipment,
                category
            )
        ) {

            throw new Error(
                `Unknown equipment category: ${category}`
            );
        }

        project.equipment[category] =
            project.equipment[category].filter(
                item =>
                    item.id !== equipmentId
            );

        this.touch(project);
    },


    // --------------------------------------------------------
    // Add an engineering check
    // --------------------------------------------------------

    addEngineeringCheck(
        project,
        check = {}
    ) {

        if (!project || !project.engineering) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        const engineeringCheck = {

            id: this.generateItemId("CHK"),

            category:
                check.category || "",

            name:
                check.name || "",

            status:
                check.status || "review",

            value:
                check.value ?? null,

            expected:
                check.expected ?? null,

            unit:
                check.unit || "",

            message:
                check.message || "",

            notes:
                check.notes || ""
        };

        project.engineering.checks.push(
            engineeringCheck
        );

        this.touch(project);

        return engineeringCheck;
    },


    // --------------------------------------------------------
    // Add a BOM item
    // --------------------------------------------------------

    addBomItem(project, item = {}) {

        if (!project || !project.bom) {

            throw new Error(
                "Invalid SolarForge project."
            );
        }

        const bomItem = {

            id: this.generateItemId("BOM"),

            category:
                item.category || "",

            description:
                item.description || "",

            brand:
                item.brand || "",

            model:
                item.model || "",

            specification:
                item.specification || "",

            quantity:
                this.toNumber(
                    item.quantity,
                    1
                ),

            unit:
                item.unit || "pcs",

            supplier:
                item.supplier || "",

            unitCostPhp:
                this.toNumber(
                    item.unitCostPhp,
                    0
                ),

            totalCostPhp:
                this.toNumber(
                    item.totalCostPhp,
                    0
                ),

            notes:
                item.notes || ""
        };

        project.bom.items.push(
            bomItem
        );

        this.touch(project);

        return bomItem;
    },


    // --------------------------------------------------------
    // Generate a generic item ID
    // --------------------------------------------------------

    generateItemId(prefix) {

        const timestamp = Date.now();

        const randomPart = Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();

        return `${prefix}-${timestamp}-${randomPart}`;
    },


    // --------------------------------------------------------
    // Safely convert a value to a number
    // --------------------------------------------------------

    toNumber(value, fallback = 0) {

        const number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;
    },


    // --------------------------------------------------------
    // Clone a project
    // --------------------------------------------------------

    clone(project) {

        return JSON.parse(
            JSON.stringify(project)
        );
    },


    // --------------------------------------------------------
    // Validate the basic project structure
    // --------------------------------------------------------

    validate(project) {

        const errors = [];

        if (!project) {

            errors.push(
                "Project object is missing."
            );

            return {
                valid: false,
                errors
            };
        }

        if (!project.project) {

            errors.push(
                "Project information is missing."
            );
        }

        if (!project.customer) {

            errors.push(
                "Customer information is missing."
            );
        }

        if (!project.site) {

            errors.push(
                "Site information is missing."
            );
        }

        if (!project.energy) {

            errors.push(
                "Energy analysis section is missing."
            );
        }

        if (!project.preliminary) {

            errors.push(
                "Preliminary design section is missing."
            );
        }

        if (!project.equipment) {

            errors.push(
                "Equipment section is missing."
            );
        }

        if (!project.engineering) {

            errors.push(
                "Engineering section is missing."
            );
        }

        if (!project.wiring) {

            errors.push(
                "Wiring section is missing."
            );
        }

        if (!project.bom) {

            errors.push(
                "BOM section is missing."
            );
        }

        if (!project.costing) {

            errors.push(
                "Costing section is missing."
            );
        }

        if (!project.installation) {

            errors.push(
                "Installation section is missing."
            );
        }

        if (!project.commissioning) {

            errors.push(
                "Commissioning section is missing."
            );
        }

        return {

            valid:
                errors.length === 0,

            errors
        };
    }
};


// ============================================================
// Create a global reference
// ============================================================
//
// Other SolarForge modules can access the project model with:
//
// SolarForgeProject.createNewProject()
//
// ============================================================

window.SolarForgeProject = SolarForgeProject;
