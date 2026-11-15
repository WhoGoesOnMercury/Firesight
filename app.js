(function () {
    'use strict';

    /* -----------------------------------------------------------------
       1. DATA & REFERENCE CONSTANTS (NASA PSI-159, ACME, Saffire)
       ----------------------------------------------------------------- */
    const DataStore = {
        FUELS: {
            n_butane: {
                shortName: 'n-Butane',
                calorificMJ: 49.5,
                adiabaticTempC: 1970,
                sootFactor: 0.55,
                ntcStrength: 1.0,
                baseSpreadCmS: 3.3,
                minOxygenPct: 11.2,
                burnerTempC: 345,
                baseColor: { r: 96, g: 165, b: 250, hex: '#60A5FA', label: 'Blue-Amber', spectrum: 'Alkane NTC / CH* core (PSI-159)' }
            },
            propane: {
                shortName: 'Propane',
                calorificMJ: 50.3,
                adiabaticTempC: 1980,
                sootFactor: 0.45,
                ntcStrength: 0.72,
                baseSpreadCmS: 3.1,
                minOxygenPct: 11.5,
                burnerTempC: 350,
                baseColor: { r: 96, g: 165, b: 250, hex: '#60A5FA', label: 'Blue-Amber', spectrum: 'Hydrocarbon core (PSI-159)' }
            },
            methane: {
                shortName: 'Methane',
                calorificMJ: 55.5,
                adiabaticTempC: 1950,
                sootFactor: 0.25,
                ntcStrength: 0.0,
                baseSpreadCmS: 2.8,
                minOxygenPct: 12.1,
                burnerTempC: 340,
                baseColor: { r: 56, g: 152, b: 255, hex: '#3898FF', label: 'Cyan-Blue', spectrum: 'CH* radical emission (s-Flame)' }
            },
            ethylene: {
                shortName: 'Ethylene',
                calorificMJ: 47.2,
                adiabaticTempC: 2080,
                sootFactor: 0.88,
                ntcStrength: 0.15,
                baseSpreadCmS: 4.5,
                minOxygenPct: 10.5,
                burnerTempC: 375,
                baseColor: { r: 251, g: 146, b: 60, hex: '#FB923C', label: 'Luminous Amber', spectrum: 'High-soot C₂H₄ (Flame Design)' }
            },
            gasoline: {
                shortName: 'Gasoline',
                calorificMJ: 46.4,
                adiabaticTempC: 2030,
                sootFactor: 0.85,
                ntcStrength: 0.65,
                baseSpreadCmS: 4.2,
                minOxygenPct: 11.6,
                burnerTempC: 280,
                baseColor: { r: 249, g: 115, b: 22, hex: '#F97316', label: 'Amber-Orange', spectrum: 'Incandescent soot + blue base' }
            },
            ethanol: {
                shortName: 'Ethanol',
                calorificMJ: 29.7,
                adiabaticTempC: 1920,
                sootFactor: 0.12,
                ntcStrength: 0.20,
                baseSpreadCmS: 2.4,
                minOxygenPct: 11.1,
                burnerTempC: 210,
                baseColor: { r: 99, g: 179, b: 237, hex: '#63B3ED', label: 'Pale Blue', spectrum: 'Low-soot alcohol flame' }
            },
            hydrogen: {
                shortName: 'Hydrogen',
                calorificMJ: 141.8,
                adiabaticTempC: 2210,
                sootFactor: 0.02,
                ntcStrength: 0.0,
                baseSpreadCmS: 8.5,
                minOxygenPct: 5.0,
                burnerTempC: 410,
                baseColor: { r: 147, g: 197, b: 253, hex: '#93C5FD', label: 'Pale Blue-UV', spectrum: 'H₂O vapor continuum' }
            },
            kerosene: {
                shortName: 'Kerosene',
                calorificMJ: 43.2,
                adiabaticTempC: 2090,
                sootFactor: 0.95,
                ntcStrength: 0.70,
                baseSpreadCmS: 3.5,
                minOxygenPct: 12.0,
                burnerTempC: 310,
                baseColor: { r: 234, g: 88, b: 12, hex: '#EA580C', label: 'Deep Orange', spectrum: 'Dense carbon blackbody' }
            }
        },

        MATERIALS: {
            none: {
                shortName: 'Gas Burner',
                isPureFuel: true,
                ignitionTempC: null,
                pyrolysisTempC: 340,
                burnRateMult: 1.0,
                spreadMult: 1.0,
                minOxygenPct: 11.5,
                nasaNote: 'Porous spherical burner feeding gaseous fuel directly (ACME CFI-G / s-Flame).'
            },
            sibal_fabric: {
                shortName: 'SIBAL Fabric',
                ignitionTempC: 285,
                pyrolysisTempC: 350,
                burnRateMult: 1.18,
                spreadMult: 1.45,
                minOxygenPct: 15.5,
                nasaNote: 'SIBAL (Solid Inflammability Boundary at Low-Speed) 75% cotton / 25% fiberglass blend flown on NASA Saffire I–III to benchmark microgravity flame spread.'
            },
            pmma_acrylic: {
                shortName: 'Cast PMMA',
                ignitionTempC: 304,
                pyrolysisTempC: 375,
                burnRateMult: 1.24,
                spreadMult: 1.12,
                minOxygenPct: 17.3,
                nasaNote: 'Cast Polymethyl Methacrylate (PMMA), used for spacecraft viewports and tested in NASA BRE & Saffire IV–V (LOI ~17.3%, melts and bubbles in 0g).'
            },
            nomex: {
                shortName: 'Nomex® HT90-40',
                ignitionTempC: 500,
                pyrolysisTempC: 440,
                burnRateMult: 0.68,
                spreadMult: 0.52,
                minOxygenPct: 28.5,
                nasaNote: 'Meta-aramid Nomex® HT90-40 fabric used in ISS cargo transfer bags and crew suits; self-extinguishes in 21% O₂ air (LOI ~28.5%) but burns in O₂-enriched exploration atmospheres.'
            },
            kapton: {
                shortName: 'Kapton® Film',
                ignitionTempC: 530,
                pyrolysisTempC: 520,
                burnRateMult: 0.58,
                spreadMult: 0.44,
                minOxygenPct: 37.0,
                nasaNote: 'DuPont Kapton® polyimide film used in spacecraft Multi-Layer Insulation (MLI) blankets and flexible circuits; high charring threshold (LOI ~37% O₂).'
            },
            ultem: {
                shortName: 'Ultem® 1000 PEI',
                ignitionTempC: 520,
                pyrolysisTempC: 495,
                burnRateMult: 0.62,
                spreadMult: 0.48,
                minOxygenPct: 47.0,
                nasaNote: 'Polyetherimide (Ultem® 1000) high-performance thermoplastic used for 3D-printed ISS hardware and cabin interiors (LOI ~47% O₂, strong char formation).'
            },
            etfe_wire: {
                shortName: 'ETFE Wire Insul.',
                ignitionTempC: 460,
                pyrolysisTempC: 450,
                burnRateMult: 0.74,
                spreadMult: 0.64,
                minOxygenPct: 30.0,
                nasaNote: 'Ethylene-tetrafluoroethylene (Tefzel® / ETFE) spacecraft avionics wire insulation (LOI ~30% O₂; studied by NASA for molten dripping and arc-tracking in microgravity).'
            }
        },

        PRESETS: {
            earth: { fuel: 'n_butane', mat: 'none', flow: 'normal', g: 100, o2: 21, co2: 0, p: 100, o3: 0 },
            psi_normal_cool: { fuel: 'n_butane', mat: 'none', flow: 'normal', g: 0, o2: 16.5, co2: 22, p: 60, o3: 800 },
            psi_dual_flame: { fuel: 'n_butane', mat: 'none', flow: 'normal', g: 0, o2: 20.5, co2: 21, p: 75, o3: 400 },
            artemis_cabin: { fuel: 'methane', mat: 'nomex', flow: 'normal', g: 0, o2: 34.0, co2: 0.5, p: 55, o3: 0 },
            saffire_sibal: { fuel: 'methane', mat: 'sibal_fabric', flow: 'normal', g: 0, o2: 21.0, co2: 0.04, p: 100, o3: 0 }
        }
    };

    /* -----------------------------------------------------------------
       2. CENTRALIZED STATE & DOM ELEMENT CACHE
       ----------------------------------------------------------------- */
    const DOM = {
        fuelSelect: document.getElementById('fuelSelect'),
        materialSelect: document.getElementById('materialSelect'),
        flowNormalBtn: document.getElementById('flowNormalBtn'),
        flowInverseBtn: document.getElementById('flowInverseBtn'),
        burnerModeTag: document.getElementById('burnerModeTag'),
        gravitySlider: document.getElementById('gravitySlider'),
        oxygenSlider: document.getElementById('oxygenSlider'),
        co2Slider: document.getElementById('co2Slider'),
        pressureSlider: document.getElementById('pressureSlider'),
        ozoneSlider: document.getElementById('ozoneSlider'),
        resetPresetsBtn: document.getElementById('resetPresetsBtn'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeToggleLabel: document.getElementById('themeToggleLabel'),
        themeIconSun: document.getElementById('themeIconSun'),
        themeIconMoon: document.getElementById('themeIconMoon'),
        presetButtons: document.querySelectorAll('.preset-btn'),

        saveConfigBtn: document.getElementById('saveConfigBtn'),
        exportCsvBtn: document.getElementById('exportCsvBtn'),
        savedConfigsList: document.getElementById('savedConfigsList'),
        savedCountLabel: document.getElementById('savedCountLabel'),
        emptySavedMsg: document.getElementById('emptySavedMsg'),

        fuelCalorificTag: document.getElementById('fuelCalorificTag'),
        materialFlashTag: document.getElementById('materialFlashTag'),
        gravityReadout: document.getElementById('gravityReadout'),
        oxygenReadout: document.getElementById('oxygenReadout'),
        co2Readout: document.getElementById('co2Readout'),
        pressureReadout: document.getElementById('pressureReadout'),
        ozoneReadout: document.getElementById('ozoneReadout'),

        chamberContainer: document.getElementById('chamberContainer'),
        chamberCanvas: document.getElementById('chamberCanvas'),
        renderModeDoomBtn: document.getElementById('renderModeDoomBtn'),
        renderModeSmoothBtn: document.getElementById('renderModeSmoothBtn'),
        regimeTag: document.getElementById('regimeTag'),
        hudPressure: document.getElementById('hudPressure'),
        hudRatio: document.getElementById('hudRatio'),
        hudBurnerConfig: document.getElementById('hudBurnerConfig'),
        extinguishedBanner: document.getElementById('extinguishedBanner'),
        extinguishReason: document.getElementById('extinguishReason'),
        chamberMaterialLabel: document.getElementById('chamberMaterialLabel'),
        chamberFuelLabel: document.getElementById('chamberFuelLabel'),
        combustionStatusBadge: document.getElementById('combustionStatusBadge'),

        sumFlameSize: document.getElementById('sumFlameSize'),
        sumFlameGeometry: document.getElementById('sumFlameGeometry'),
        sumIntensity: document.getElementById('sumIntensity'),
        sumHeatRelease: document.getElementById('sumHeatRelease'),
        sumIntensityBar: document.getElementById('sumIntensityBar'),
        sumColorHex: document.getElementById('sumColorHex'),
        sumColorSwatch: document.getElementById('sumColorSwatch'),
        sumColorName: document.getElementById('sumColorName'),
        sumColorSpectrum: document.getElementById('sumColorSpectrum'),
        sumSpreadRate: document.getElementById('sumSpreadRate'),
        sumSpreadDesc: document.getElementById('sumSpreadDesc'),
        sumFlameTemp: document.getElementById('sumFlameTemp'),
        sumFlameTempKelvin: document.getElementById('sumFlameTempKelvin'),
        sumFuelTemp: document.getElementById('sumFuelTemp'),
        sumFuelTempKelvin: document.getElementById('sumFuelTempKelvin'),
        limitingFactorTag: document.getElementById('limitingFactorTag'),
        physicsNarrative: document.getElementById('physicsNarrative')
    };

    const State = {
        fuelKey: 'n_butane',
        materialKey: 'none',
        burnerConfig: 'normal',
        gravity: 1.0,
        oxygenPct: 20.9,
        co2Pct: 0.04,
        pressureAtm: 1.0,
        ozonePpm: 0,
        flameStage: 'hot',
        isBurning: true,
        intensityPct: 74,
        flameHeightCm: 48.5,
        flameWidthCm: 16.0,
        heatReleaseKw: 18.4,
        spreadRateCmS: 3.42,
        flameTempC: 1420,
        fuelTempC: 385,
        colorRGB: { r: 96, g: 165, b: 250 },
        coreRGB: { r: 240, g: 249, b: 255 },
        blueBaseStrength: 0.85,
        renderMode: 'doom'
    };

    /* -----------------------------------------------------------------
       3. PHYSICS ENGINE (Reduced-Order Empirical Scaling)
       ----------------------------------------------------------------- */
    const PhysicsEngine = {
        recalculate() {
            const fuel = DataStore.FUELS[State.fuelKey];
            const mat = DataStore.MATERIALS[State.materialKey];
            const isPureFuel = Boolean(mat.isPureFuel);
            const isInverse = State.burnerConfig === 'inverse';

            const baseMinO2 = isPureFuel ? fuel.minOxygenPct : mat.minOxygenPct;
            const isMicroG = State.gravity < 0.18;
            const microGStabilityBonus = isMicroG ? 2.2 : 0;
            const inversePenalty = isInverse ? 1.8 : 0;
            const pressurePenalty = (1.0 - State.pressureAtm) * 3.2;
            const ozoneBonus = (State.ozonePpm / 2000) * 3.4 * Math.max(0.25, fuel.ntcStrength);

            const hotMinO2 = Math.max(4.5, baseMinO2 + State.co2Pct * 0.44 + inversePenalty + pressurePenalty - microGStabilityBonus);
            const canSustainCoolFlame = isPureFuel && isMicroG && fuel.ntcStrength >= 0.5 && (State.co2Pct >= 14 || State.ozonePpm >= 300 || State.pressureAtm <= 0.75);
            const coolMinO2 = canSustainCoolFlame ? Math.max(7.5, hotMinO2 - (3.8 * fuel.ntcStrength + ozoneBonus)) : hotMinO2;
            const thermalQuench = State.co2Pct >= (46 + microGStabilityBonus * 2 + (State.ozonePpm / 500)) && State.fuelKey !== 'hydrogen';

            if (State.oxygenPct < coolMinO2 || thermalQuench) {
                State.flameStage = 'extinguished';
                State.isBurning = false;
                State.intensityPct = 0;
                State.flameHeightCm = 0;
                State.flameWidthCm = 0;
                State.heatReleaseKw = 0;
                State.spreadRateCmS = 0;
                State.flameTempC = 24;
                State.fuelTempC = Math.round(24 + State.oxygenPct * 1.2);
                return { fuel, mat, coolMinO2, thermalQuench };
            }

            if (canSustainCoolFlame && State.oxygenPct < hotMinO2) {
                State.flameStage = 'cool';
            } else if (canSustainCoolFlame && State.oxygenPct < hotMinO2 + 3.2) {
                State.flameStage = 'dual';
            } else {
                State.flameStage = 'hot';
            }
            State.isBurning = true;

            const o2Factor = Math.pow(State.oxygenPct / 20.9, 0.85);
            const co2Damping = Math.max(0.12, 1 - (State.co2Pct / 55) * 0.88);
            const pressureFactor = 0.62 + 0.38 * State.pressureAtm;
            const inverseHeatLoss = isInverse ? 0.82 : 1.0;
            const gravEntrainment = 0.42 + 0.58 * Math.pow(Math.max(0.02, State.gravity), 0.45);
            const stagePowerMult = State.flameStage === 'cool' ? 0.28 : (State.flameStage === 'dual' ? 0.68 : 1.0);

            const rawIntensity = 52 * o2Factor * co2Damping * pressureFactor * inverseHeatLoss * gravEntrainment * mat.burnRateMult * (fuel.calorificMJ / 46.4) * stagePowerMult;
            State.intensityPct = Math.max(4, Math.min(100, Math.round(rawIntensity)));
            State.heatReleaseKw = +(0.2 + (State.intensityPct / 100) * 38.5 * (fuel.calorificMJ / 46.4)).toFixed(1);

            const standoffMult = isInverse ? 0.78 : (State.flameStage === 'cool' ? 1.24 : 1.0);
            const sootExpansion = (isMicroG && fuel.sootFactor >= 0.6 && State.flameStage === 'hot') ? 1.28 : 1.0;
            const buoyancyStretch = (0.45 + Math.pow(State.gravity, 0.52) * 0.85) * sootExpansion * standoffMult;
            const lateralSphere = isMicroG ? (1.48 - State.gravity * 2.2) * sootExpansion * standoffMult : 1.0;

            State.flameHeightCm = +(Math.max(4.5, (14 + State.intensityPct * 0.62) * buoyancyStretch)).toFixed(1);
            State.flameWidthCm = +(Math.max(5.0, (9 + State.intensityPct * 0.16) * lateralSphere)).toFixed(1);

            const o2TempBoost = Math.min(1.22, 0.68 + (State.oxygenPct / 20.9) * 0.34);
            const microGCooling = isMicroG ? (0.86 - fuel.sootFactor * 0.08) : 1.0;

            if (State.flameStage === 'cool') {
                const coolTemp = 260 + State.oxygenPct * 9.5 + (State.ozonePpm / 2000) * 45 + State.pressureAtm * 35;
                State.flameTempC = Math.round(Math.min(525, Math.max(245, coolTemp)));
            } else if (State.flameStage === 'dual') {
                State.flameTempC = Math.round(920 + State.oxygenPct * 14 * pressureFactor);
            } else {
                const peakTemp = fuel.adiabaticTempC * o2TempBoost * (0.55 + 0.45 * co2Damping) * (0.88 + 0.12 * pressureFactor) * (0.85 + 0.15 * gravEntrainment) * microGCooling * (isInverse ? 0.94 : 1.0);
                State.flameTempC = Math.round(Math.max(680, peakTemp));
            }

            const baseFeedTemp = isPureFuel ? fuel.burnerTempC : mat.pyrolysisTempC;
            const fuelSurfaceTemp = baseFeedTemp * (0.72 + 0.35 * (State.intensityPct / 100)) + (State.flameTempC - 900) * 0.08;
            State.fuelTempC = Math.round(Math.max(95, fuelSurfaceTemp));

            const spread = fuel.baseSpreadCmS * mat.spreadMult * Math.pow(o2Factor, 1.15) * co2Damping * pressureFactor * (0.35 + 0.65 * Math.pow(State.gravity, 0.4));
            State.spreadRateCmS = +Math.max(0.06, spread).toFixed(2);

            const colorProfile = this.resolveSpectrum(fuel);
            return { fuel, mat, colorProfile };
        },

        resolveSpectrum(fuel) {
            let colorName = fuel.baseColor.label;
            let spectrum = fuel.baseColor.spectrum;
            let hex = fuel.baseColor.hex;
            let r = fuel.baseColor.r;
            let g = fuel.baseColor.g;
            let b = fuel.baseColor.b;
            let core = { r: 255, g: 245, b: 205 };

            const isMicroG = State.gravity < 0.15;

            if (State.flameStage === 'cool') {
                colorName = 'Faint Indigo-Blue';
                spectrum = 'PSI-159 CFI-G cool flame (CH₂O*)';
                hex = '#6366F1';
                r = 99; g = 102; b = 241;
                core = { r: 165, g: 180, b: 252 };
                State.blueBaseStrength = 1.0;
            } else if (State.flameStage === 'dual') {
                colorName = 'Indigo + Cyan Dual';
                spectrum = 'PSI-159 dual-shell (Hot + Cool)';
                hex = '#38BDF8';
                r = 56; g = 189; b = 248;
                core = { r: 224, g: 242, b: 254 };
                State.blueBaseStrength = 1.0;
            } else if (isMicroG && fuel.sootFactor >= 0.75) {
                colorName = 'Soot-Rich Orange';
                spectrum = 'ACME 0g 5–8× soot radiation';
                hex = '#F97316';
                r = 249; g = 115; b = 22;
                core = { r: 253, g: 224, b: 71 };
                State.blueBaseStrength = 0.25;
            } else if (State.oxygenPct >= 45 && fuel.sootFactor < 0.9) {
                colorName = 'Cyan-White';
                spectrum = 'Complete O₂ oxidation';
                hex = '#7DD3FC';
                r = 125; g = 211; b = 252;
                core = { r: 240, g: 249, b: 255 };
                State.blueBaseStrength = 0.85;
            } else if (isMicroG && fuel.sootFactor < 0.6) {
                colorName = 'Spherical Blue';
                spectrum = 'ACME s-Flame soot-free CH*';
                hex = '#3B82F6';
                r = 59; g = 130; b = 246;
                core = { r: 191, g: 219, b: 254 };
                State.blueBaseStrength = 0.95;
            } else if (State.co2Pct > 18 || State.oxygenPct < 17) {
                colorName = 'Crimson-Orange';
                spectrum = 'Incomplete carbon radiation';
                hex = '#EA580C';
                r = 234; g = 88; b = 12;
                core = { r: 253, g: 186, b: 116 };
                State.blueBaseStrength = 0.1;
            } else if (State.flameTempC > 1850 && fuel.sootFactor >= 0.45) {
                colorName = 'White-Gold';
                spectrum = 'High-temp blackbody core';
                hex = '#FACC15';
                r = 250; g = 204; b = 21;
                core = { r: 255, g: 253, b: 230 };
                State.blueBaseStrength = 0.45;
            } else {
                State.blueBaseStrength = fuel.sootFactor < 0.6 ? 0.85 : 0.35;
            }

            State.colorRGB = { r, g, b };
            State.coreRGB = core;
            return { colorName, spectrum, hex };
        }
    };

    /* -----------------------------------------------------------------
       4. CANVAS RENDERERS (Doom Cellular Grid & Smooth Plume)
       ----------------------------------------------------------------- */
    const ChamberRenderer = {
        ctx: DOM.chamberCanvas.getContext('2d'),
        DOOM_PIXEL_SIZE: 4,
        doomW: 0,
        doomH: 0,
        doomFire: null,
        doomNext: null,
        doomOffscreen: null,
        doomOffCtx: null,
        doomImgData: null,
        doomBuf32: null,
        doomPalette32: new Uint32Array(256),
        particles: [],
        time: 0,

        resize() {
            const rect = DOM.chamberContainer.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const logicalW = Math.max(200, Math.floor(rect.width));
            const logicalH = Math.max(200, Math.floor(rect.height));

            DOM.chamberCanvas.width = Math.floor(logicalW * dpr);
            DOM.chamberCanvas.height = Math.floor(logicalH * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            this.doomW = Math.max(40, Math.ceil(logicalW / this.DOOM_PIXEL_SIZE));
            this.doomH = Math.max(40, Math.ceil(logicalH / this.DOOM_PIXEL_SIZE));
            this.doomFire = new Uint8Array(this.doomW * this.doomH);
            this.doomNext = new Uint8Array(this.doomW * this.doomH);

            if (!this.doomOffscreen) {
                this.doomOffscreen = document.createElement('canvas');
                this.doomOffCtx = this.doomOffscreen.getContext('2d');
            }
            this.doomOffscreen.width = this.doomW;
            this.doomOffscreen.height = this.doomH;
            this.doomImgData = this.doomOffCtx.createImageData(this.doomW, this.doomH);
            this.doomBuf32 = new Uint32Array(this.doomImgData.data.buffer);
            this.rebuildDoomPalette();
        },

        rebuildDoomPalette() {
            const { r, g, b } = State.colorRGB;
            const { r: cr, g: cg, b: cb } = State.coreRGB;
            const blueBias = State.blueBaseStrength;

            for (let i = 0; i < 256; i++) {
                if (i < 12) {
                    this.doomPalette32[i] = 0;
                    continue;
                }

                const t = (i - 12) / 243;
                let pr = 0, pg = 0, pb = 0, pa = 255;

                if (State.flameStage === 'dual') {
                    if (t < 0.34) {
                        const lt = t / 0.34;
                        pr = Math.round(79 * lt + 20);
                        pg = Math.round(70 * lt + 18);
                        pb = Math.round(229 * lt + 45);
                        pa = Math.round(85 + 135 * lt);
                    } else if (t < 0.65) {
                        const lt = (t - 0.34) / 0.31;
                        pr = Math.round(99 + (r - 99) * lt);
                        pg = Math.round(102 + (g - 102) * lt);
                        pb = Math.round(241 + (b - 241) * lt);
                    } else {
                        const lt = (t - 0.65) / 0.35;
                        pr = Math.round(r + (cr - r) * lt);
                        pg = Math.round(g + (cg - g) * lt);
                        pb = Math.round(b + (cb - b) * lt);
                    }
                } else if (t < 0.22) {
                    const lt = t / 0.22;
                    pr = Math.round(r * 0.48 * lt + 45 * lt);
                    pg = Math.round(g * 0.22 * lt);
                    pb = Math.round(b * 0.22 * lt);
                    pa = Math.round(95 + 160 * lt);
                } else if (t < 0.58) {
                    const lt = (t - 0.22) / 0.36;
                    pr = Math.round((r * 0.52 + 35) + (r - (r * 0.52 + 35)) * lt);
                    pg = Math.round((g * 0.24) + (g - g * 0.24) * lt);
                    pb = Math.round((b * 0.24) + (b - b * 0.24) * lt);
                } else if (t < 0.86) {
                    const lt = (t - 0.58) / 0.28;
                    pr = Math.round(r + (cr - r) * lt);
                    pg = Math.round(g + (cg - g) * lt);
                    pb = Math.round(b + (cb - b) * lt);
                } else {
                    const lt = (t - 0.86) / 0.14;
                    const baseR = blueBias > 0.5 ? 110 : cr;
                    const baseG = blueBias > 0.5 ? 190 : cg;
                    const baseB = blueBias > 0.5 ? 255 : cb;
                    pr = Math.round(cr + (baseR - cr) * lt * 0.75);
                    pg = Math.round(cg + (baseG - cg) * lt * 0.75);
                    pb = Math.round(cb + (baseB - cb) * lt * 0.75);
                }

                this.doomPalette32[i] = (pa << 24) | (Math.min(255, pb) << 16) | (Math.min(255, pg) << 8) | Math.min(255, pr);
            }
        },

        renderFrame(dt) {
            this.time += dt;
            const w = DOM.chamberContainer.clientWidth || 360;
            const h = DOM.chamberContainer.clientHeight || 360;
            const ctx = this.ctx;

            ctx.clearRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            const gridStep = 32;
            for (let gx = gridStep; gx < w; gx += gridStep) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, h);
                ctx.stroke();
            }
            for (let gy = gridStep; gy < h; gy += gridStep) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(w, gy);
                ctx.stroke();
            }

            const baseX = w * 0.5;
            const baseY = h * 0.78;

            ctx.fillStyle = '#27272a';
            ctx.fillRect(baseX - 48, baseY + 11, 96, 8);
            ctx.fillStyle = '#3f3f46';
            ctx.fillRect(baseX - 10, baseY + 19, 20, h - (baseY + 19));

            if (State.renderMode === 'doom') {
                this.renderDoomMode(w, h, baseX, baseY);
            } else {
                this.renderSmoothMode(w, h, baseX, baseY, dt);
            }
        },

        renderDoomMode(w, h, baseX, baseY) {
            if (!this.doomFire || this.doomW <= 0 || this.doomH <= 0) return;

            const ps = this.DOOM_PIXEL_SIZE;
            const gxCenter = Math.round(baseX / ps);
            const gyBase = Math.min(this.doomH - 3, Math.round((baseY - 2) / ps));
            const spreadBoost = Math.min(1.45, 0.85 + State.spreadRateCmS * 0.09);
            const halfSpanPx = Math.min(w * 0.44, Math.max(14, State.flameWidthCm * 1.45 * spreadBoost));
            const halfSpanCells = Math.max(3, Math.round(halfSpanPx / ps));
            const isMicroG = State.gravity < 0.18;
            const intensityNorm = State.intensityPct / 100;

            if (State.isBurning) {
                const maxSeedHeat = Math.min(255, Math.round(165 + intensityNorm * 90));
                for (let dx = -halfSpanCells; dx <= halfSpanCells; dx++) {
                    const sx = gxCenter + dx;
                    if (sx < 1 || sx >= this.doomW - 1) continue;

                    const edgeNorm = Math.abs(dx) / Math.max(1, halfSpanCells);
                    const profile = Math.cos(edgeNorm * Math.PI * 0.46);
                    const flicker = (Math.random() - 0.35) * 34;
                    const heat = Math.max(0, Math.min(255, Math.round(maxSeedHeat * (0.58 + 0.42 * profile) + flicker)));

                    this.doomFire[gyBase * this.doomW + sx] = heat;
                    if (gyBase + 1 < this.doomH) {
                        this.doomFire[(gyBase + 1) * this.doomW + sx] = Math.max(0, heat - 18);
                    }
                }
            }

            this.doomNext.fill(0);
            const targetCellsH = Math.min(this.doomH - 8, Math.max(8, (State.flameHeightCm * 2.55) / ps));
            const baseCooling = State.isBurning
                ? Math.max(1.2, (235 / targetCellsH) * (1.15 - intensityNorm * 0.25))
                : 14.0;

            for (let y = 1; y < this.doomH; y++) {
                for (let x = 1; x < this.doomW - 1; x++) {
                    const heat = this.doomFire[y * this.doomW + x];
                    if (heat === 0) continue;

                    const rand = Math.random();
                    const newHeat = heat - (rand * baseCooling + baseCooling * 0.38);
                    if (newHeat <= 0) continue;

                    let dstX = x;
                    let dstY = y - 1;

                    if (isMicroG) {
                        const relX = x - gxCenter;
                        const radialPush = relX === 0 ? (rand < 0.5 ? -1 : 1) : Math.sign(relX);
                        dstX = x + (rand < 0.48 ? radialPush : (rand < 0.74 ? -radialPush : 0));
                        dstY = rand < 0.68 ? y - 1 : y;
                    } else {
                        const heightRatio = Math.max(0, (gyBase - y) / Math.max(1, targetCellsH));
                        const taperPull = (gxCenter - x) * (0.045 + heightRatio * 0.06) * Math.min(1.6, State.gravity);
                        dstX = x + Math.round((rand - 0.5) * 2.4 + taperPull);
                        dstY = (State.gravity > 1.35 && rand < 0.35 && y > 2) ? y - 2 : y - 1;
                    }

                    if (dstX >= 1 && dstX < this.doomW - 1 && dstY >= 1 && dstY < this.doomH) {
                        const dstIdx = dstY * this.doomW + dstX;
                        const clamped = newHeat > 255 ? 255 : Math.round(newHeat);
                        if (clamped > this.doomNext[dstIdx]) {
                            this.doomNext[dstIdx] = clamped;
                        }
                    }
                }
            }

            const tmp = this.doomFire;
            this.doomFire = this.doomNext;
            this.doomNext = tmp;

            const total = this.doomW * this.doomH;
            for (let i = 0; i < total; i++) {
                this.doomBuf32[i] = this.doomPalette32[this.doomFire[i]];
            }
            this.doomOffCtx.putImageData(this.doomImgData, 0, 0);

            const ctx = this.ctx;
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.doomOffscreen, 0, 0, this.doomW * ps, this.doomH * ps);
            ctx.restore();

            const barWidth = Math.max(76, halfSpanCells * ps * 2 + 12);
            this.drawEmitterBar(baseX, baseY, barWidth);
        },

        renderSmoothMode(w, h, baseX, baseY, dt) {
            const ctx = this.ctx;
            this.drawEmitterBar(baseX, baseY, State.materialKey === 'none' ? 60 : 76);

            if (!State.isBurning) return;

            const visualHeight = Math.min(h * 0.66, Math.max(32, State.flameHeightCm * 2.5));
            const visualWidth = Math.min(w * 0.62, Math.max(26, State.flameWidthCm * 2.3));
            const isMicroG = State.gravity < 0.18;
            const { r, g, b } = State.colorRGB;
            const { r: cr, g: cg, b: cb } = State.coreRGB;

            const spawnCount = Math.ceil(2 + (State.intensityPct / 100) * 5);
            for (let i = 0; i < spawnCount; i++) {
                const spreadX = (Math.random() - 0.5) * visualWidth * 0.65;
                const upSpeed = isMicroG
                    ? (0.25 + Math.random() * 0.45)
                    : (1.6 + Math.random() * 2.4) * (0.55 + Math.pow(State.gravity, 0.45) * 0.65) * (0.6 + State.intensityPct / 140);
                const radialOut = isMicroG ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.45;

                this.particles.push({
                    x: baseX + spreadX,
                    y: baseY - 2,
                    vx: radialOut,
                    vy: -upSpeed,
                    radius: (visualWidth * 0.28) * (0.65 + Math.random() * 0.55),
                    life: 1.0,
                    decay: isMicroG ? (0.018 + Math.random() * 0.014) : (0.016 + (0.022 * (140 / Math.max(40, visualHeight))))
                });
            }

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                const turbulence = isMicroG ? 0.15 : (0.6 + State.gravity * 0.45);
                p.vx += Math.sin(this.time * 9 + p.y * 0.06) * 0.05 * turbulence;
                if (!isMicroG) p.vx += (baseX - p.x) * 0.012;
                p.x += p.vx * (dt * 60);
                p.y += p.vy * (dt * 60);
                p.life -= p.decay * (dt * 60);

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                const curR = Math.max(2, p.radius * (isMicroG ? (0.5 + p.life * 0.65) : Math.pow(p.life, 0.72)));
                const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curR);

                if (p.life > 0.62) {
                    pGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${0.34 * p.life})`);
                    pGrad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${0.22 * p.life})`);
                    pGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                } else {
                    pGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.28 * p.life})`);
                    pGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                }

                ctx.fillStyle = pGrad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
                ctx.fill();
            }

            if (State.blueBaseStrength > 0.05) {
                const blueW = visualWidth * 0.56;
                const blueH = isMicroG ? blueW * 0.85 : Math.min(28, visualHeight * 0.24);
                const blueGrad = ctx.createRadialGradient(baseX, baseY - 2, 2, baseX, baseY - blueH * 0.35, blueW);
                blueGrad.addColorStop(0, `rgba(96, 165, 250, ${0.46 * State.blueBaseStrength})`);
                blueGrad.addColorStop(0.6, `rgba(37, 99, 235, ${0.22 * State.blueBaseStrength})`);
                blueGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
                ctx.fillStyle = blueGrad;
                ctx.beginPath();
                ctx.arc(baseX, baseY - 3, blueW, Math.PI, 0);
                ctx.fill();
            }

            if (State.flameStage === 'dual') {
                const outerR = visualWidth * 0.92;
                const haloGrad = ctx.createRadialGradient(baseX, baseY - visualHeight * 0.28, outerR * 0.35, baseX, baseY - visualHeight * 0.28, outerR);
                haloGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
                haloGrad.addColorStop(0.65, 'rgba(99, 102, 241, 0.26)');
                haloGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
                ctx.fillStyle = haloGrad;
                ctx.beginPath();
                ctx.arc(baseX, baseY - visualHeight * 0.28, outerR, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        },

        drawEmitterBar(baseX, baseY, barWidth) {
            const ctx = this.ctx;
            if (State.materialKey === 'none') {
                ctx.fillStyle = '#52525b';
                ctx.beginPath();
                ctx.roundRect(baseX - barWidth * 0.42, baseY + 1, barWidth * 0.84, 10, 2);
                ctx.fill();
                const portColor = !State.isBurning
                    ? '#71717a'
                    : (State.burnerConfig === 'inverse' ? '#fb923c' : '#38bdf8');
                ctx.fillStyle = portColor;
                ctx.fillRect(baseX - barWidth * 0.36, baseY, barWidth * 0.72, 2);
            } else {
                ctx.fillStyle = State.isBurning ? '#7c2d12' : '#3f3f46';
                ctx.beginPath();
                ctx.roundRect(baseX - barWidth * 0.5, baseY - 1, barWidth, 12, 2);
                ctx.fill();

                if (!State.isBurning) {
                    const emberAlpha = 0.14 + 0.06 * Math.sin(this.time * 3);
                    ctx.fillStyle = `rgba(234, 88, 12, ${emberAlpha})`;
                    ctx.fillRect(baseX - barWidth * 0.42, baseY, barWidth * 0.84, 3);
                }
            }
        }
    };

    /* -----------------------------------------------------------------
       5. SAVED RUNS & CSV SPREADSHEET EXPORTER
       ----------------------------------------------------------------- */
    const RunExporter = {
        savedConfigs: [],
        runSequence: 1,

        escapeCsvField(val) {
            const str = String(val ?? '');
            return (str.includes(',') || str.includes('"') || str.includes('\n'))
                ? `"${str.replace(/"/g, '""')}"`
                : str;
        },

        saveCurrent() {
            const fuel = DataStore.FUELS[State.fuelKey];
            const mat = DataStore.MATERIALS[State.materialKey];
            const runId = `RUN-${String(this.runSequence++).padStart(2, '0')}`;

            this.savedConfigs.unshift({
                runId,
                timestamp: new Date().toISOString(),
                fuelKey: State.fuelKey,
                fuelName: fuel.shortName,
                calorificMJ: fuel.calorificMJ,
                materialKey: State.materialKey,
                materialName: mat.shortName,
                burnerConfig: State.burnerConfig,
                gravityG: State.gravity,
                oxygenPct: State.oxygenPct,
                co2Pct: State.co2Pct,
                pressureAtm: State.pressureAtm,
                ozonePpm: State.ozonePpm,
                flameStage: State.flameStage,
                flameHeightCm: State.flameHeightCm,
                flameWidthCm: State.flameWidthCm,
                intensityPct: State.intensityPct,
                heatReleaseKw: State.heatReleaseKw,
                flameColorName: DOM.sumColorName.textContent,
                flameColorHex: DOM.sumColorHex.textContent,
                spreadRateCmS: State.spreadRateCmS,
                flameTempC: State.flameTempC,
                flameTempK: State.flameTempC + 273,
                fuelSurfaceTempC: State.fuelTempC
            });

            this.renderList();

            const origText = DOM.saveConfigBtn.textContent;
            DOM.saveConfigBtn.textContent = 'Saved';
            setTimeout(() => { DOM.saveConfigBtn.textContent = origText; }, 900);
        },

        renderList() {
            DOM.savedCountLabel.textContent = String(this.savedConfigs.length);
            DOM.exportCsvBtn.disabled = this.savedConfigs.length === 0;

            if (this.savedConfigs.length === 0) {
                DOM.savedConfigsList.innerHTML = '';
                DOM.savedConfigsList.appendChild(DOM.emptySavedMsg);
                return;
            }

            DOM.savedConfigsList.innerHTML = this.savedConfigs.map((entry, idx) => `
                <div class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
                    <button type="button" data-load-idx="${idx}" class="text-left flex-1 min-w-0 truncate hover:underline text-zinc-800 dark:text-zinc-200 cursor-pointer" title="Click to load this configuration">
                        <span class="font-mono-tabular font-semibold">${entry.runId}</span> · ${entry.fuelName} (${entry.gravityG.toFixed(2)}g, ${entry.oxygenPct.toFixed(1)}% O₂)
                    </button>
                    <span class="text-[10px] font-mono-tabular text-zinc-400 dark:text-zinc-500 shrink-0">${entry.flameStage.toUpperCase()}</span>
                    <button type="button" data-del-idx="${idx}" aria-label="Remove saved config" class="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 px-1 cursor-pointer">
                        &times;
                    </button>
                </div>
            `).join('');

            DOM.savedConfigsList.querySelectorAll('[data-load-idx]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const item = this.savedConfigs[parseInt(btn.dataset.loadIdx, 10)];
                    if (!item) return;
                    UIController.applyConfigValues({
                        fuel: item.fuelKey,
                        mat: item.materialKey,
                        flow: item.burnerConfig,
                        g: Math.round(item.gravityG * 100),
                        o2: item.oxygenPct,
                        co2: item.co2Pct <= 0.04 ? 0 : item.co2Pct,
                        p: Math.round(item.pressureAtm * 100),
                        o3: item.ozonePpm
                    });
                });
            });

            DOM.savedConfigsList.querySelectorAll('[data-del-idx]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.savedConfigs.splice(parseInt(btn.dataset.delIdx, 10), 1);
                    this.renderList();
                });
            });
        },

        exportCsv() {
            if (this.savedConfigs.length === 0) return;

            const headers = [
                'Run ID', 'Timestamp (UTC)', 'Fuel', 'Calorific Value (MJ/kg)',
                'Spacecraft Material', 'Burner Flow', 'Gravity (g)', 'O2 Concentration (%)',
                'CO2 Dilution (%)', 'Chamber Pressure (atm)', 'Ozone O3 (ppm)',
                'Combustion Regime', 'Flame Height (cm)', 'Flame Diameter (cm)',
                'Intensity (%)', 'Heat Release Rate (kW)', 'Flame Color', 'Color Hex',
                'Spread Rate (cm/s)', 'Flame Temp (C)', 'Flame Temp (K)', 'Fuel / Surface Temp (C)'
            ];

            const rows = this.savedConfigs.slice().reverse().map((r) => [
                r.runId, r.timestamp, r.fuelName, r.calorificMJ,
                r.materialName, r.burnerConfig, r.gravityG.toFixed(2), r.oxygenPct.toFixed(1),
                r.co2Pct.toFixed(2), r.pressureAtm.toFixed(2), r.ozonePpm,
                r.flameStage, r.flameHeightCm.toFixed(1), r.flameWidthCm.toFixed(1),
                r.intensityPct, r.heatReleaseKw.toFixed(1), r.flameColorName, r.flameColorHex,
                r.spreadRateCmS.toFixed(2), r.flameTempC, r.flameTempK, r.fuelSurfaceTempC
            ].map((v) => this.escapeCsvField(v)).join(','));

            const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `combustion_configs_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    /* -----------------------------------------------------------------
       6. UI CONTROLLER & INITIALIZATION
       ----------------------------------------------------------------- */
    const UIController = {
        syncFromInputs() {
            State.fuelKey = DOM.fuelSelect.value;
            State.materialKey = DOM.materialSelect.value;
            State.gravity = parseInt(DOM.gravitySlider.value, 10) / 100;
            State.oxygenPct = parseFloat(DOM.oxygenSlider.value);
            const rawCo2 = parseFloat(DOM.co2Slider.value);
            State.co2Pct = rawCo2 === 0 ? 0.04 : rawCo2;
            State.pressureAtm = parseInt(DOM.pressureSlider.value, 10) / 100;
            State.ozonePpm = parseInt(DOM.ozoneSlider.value, 10);

            const result = PhysicsEngine.recalculate();
            ChamberRenderer.rebuildDoomPalette();
            this.renderTelemetry(result);
        },

        renderTelemetry(result) {
            const { fuel, mat } = result;
            const isPureFuel = Boolean(mat.isPureFuel);
            const isInverse = State.burnerConfig === 'inverse';

            DOM.fuelCalorificTag.textContent = `${fuel.calorificMJ.toFixed(1)} MJ/kg`;
            DOM.materialFlashTag.textContent = isPureFuel ? (isInverse ? 'O₂ Core' : 'Fuel Core') : `LOI ${mat.minOxygenPct}%`;
            DOM.burnerModeTag.textContent = isInverse ? 'O₂ In / Fuel Out' : 'Fuel In / O₂ Out';
            DOM.gravityReadout.textContent = `${State.gravity.toFixed(2)} g`;
            DOM.oxygenReadout.textContent = `${State.oxygenPct.toFixed(1)}%`;
            DOM.co2Readout.textContent = `${State.co2Pct < 1 ? State.co2Pct.toFixed(2) : State.co2Pct.toFixed(1)}%`;
            DOM.pressureReadout.textContent = `${State.pressureAtm.toFixed(2)} atm`;
            DOM.ozoneReadout.textContent = `${State.ozonePpm.toLocaleString()} ppm`;

            DOM.chamberMaterialLabel.textContent = isPureFuel ? (isInverse ? 'Inverse Burner' : 'Normal Burner') : mat.shortName;
            DOM.chamberFuelLabel.textContent = fuel.shortName;

            const ratioVal = State.oxygenPct / Math.max(0.04, State.co2Pct);
            DOM.hudPressure.textContent = `${State.pressureAtm.toFixed(2)} atm`;
            DOM.hudRatio.textContent = ratioVal >= 100 ? `${Math.round(ratioVal)}:1` : `${ratioVal.toFixed(1)}:1`;
            DOM.hudBurnerConfig.textContent = isInverse ? 'INVERSE' : 'NORMAL';

            if (!State.isBurning) {
                this.renderExtinguishedState(fuel, mat, result.coolMinO2, result.thermalQuench);
                return;
            }

            DOM.extinguishedBanner.classList.add('hidden');
            if (State.flameStage === 'cool') {
                DOM.combustionStatusBadge.className = 'inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400';
                DOM.combustionStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>Quasi-Steady Cool Flame';
            } else if (State.flameStage === 'dual') {
                DOM.combustionStatusBadge.className = 'inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400';
                DOM.combustionStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>Dual Flame (Hot + Cool)';
            } else {
                DOM.combustionStatusBadge.className = 'inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400';
                DOM.combustionStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>Sustained Hot Combustion';
            }

            const { colorName, spectrum, hex } = result.colorProfile;
            DOM.sumColorName.textContent = colorName;
            DOM.sumColorSpectrum.textContent = spectrum;
            DOM.sumColorHex.textContent = hex;
            DOM.sumColorSwatch.style.backgroundColor = hex;

            DOM.sumFlameSize.textContent = `${State.flameHeightCm.toFixed(1)} cm`;
            if (State.gravity < 0.15) {
                const geomPrefix = isInverse ? 'Inverse sphere' : 'Normal sphere';
                DOM.sumFlameGeometry.textContent = `${geomPrefix} (Ø ${State.flameWidthCm.toFixed(1)} cm)`;
                DOM.regimeTag.textContent = State.flameStage === 'cool' ? 'COOL FLAME' : (State.flameStage === 'dual' ? 'DUAL FLAME' : 'SPHERICAL 0G');
            } else if (State.gravity > 1.5) {
                DOM.sumFlameGeometry.textContent = `Compressed jet (Ø ${State.flameWidthCm.toFixed(1)} cm)`;
                DOM.regimeTag.textContent = 'HIGH-G';
            } else {
                DOM.sumFlameGeometry.textContent = `Buoyant plume (Ø ${State.flameWidthCm.toFixed(1)} cm)`;
                DOM.regimeTag.textContent = 'HOT FLAME';
            }

            DOM.sumIntensity.textContent = `${State.intensityPct}%`;
            DOM.sumHeatRelease.textContent = `${State.heatReleaseKw.toFixed(1)} kW`;
            DOM.sumIntensityBar.style.width = `${State.intensityPct}%`;

            DOM.sumSpreadRate.textContent = `${State.spreadRateCmS.toFixed(2)} cm/s`;
            DOM.sumSpreadDesc.textContent = State.spreadRateCmS > 6.0
                ? 'Rapid flame front propagation'
                : (State.spreadRateCmS < 1.0 ? 'Slow diffusion-limited creep' : 'Steady convective advance');

            const flameK = State.flameTempC + 273;
            const flameF = Math.round(State.flameTempC * 1.8 + 32);
            DOM.sumFlameTemp.textContent = `${State.flameTempC.toLocaleString()} °C`;
            DOM.sumFlameTempKelvin.textContent = `${flameK.toLocaleString()} K / ${flameF.toLocaleString()} °F`;

            const fuelK = State.fuelTempC + 273;
            const fuelF = Math.round(State.fuelTempC * 1.8 + 32);
            DOM.sumFuelTemp.textContent = `${State.fuelTempC.toLocaleString()} °C`;
            DOM.sumFuelTempKelvin.textContent = `${fuelK.toLocaleString()} K / ${fuelF.toLocaleString()} °F`;

            let limiting = 'BALANCED';
            let narrative = '';
            const isMicroG = State.gravity < 0.15;
            const flowLabel = isInverse ? 'inverse (oxidizer-inner)' : 'normal (fuel-inner)';

            if (!mat.isPureFuel) {
                limiting = `NASA LOI ${mat.minOxygenPct}%`;
                narrative = `${mat.nasaNote} At ${State.oxygenPct.toFixed(1)}% O₂ and ${State.gravity.toFixed(2)} g, flame spread is ${State.spreadRateCmS.toFixed(2)} cm/s at ${State.flameTempC.toLocaleString()} °C.`;
            } else if (State.flameStage === 'cool') {
                limiting = 'PSI-159 COOL FLAME';
                const o3Note = State.ozonePpm > 0 ? ` sensitized by ${State.ozonePpm} ppm O₃` : '';
                const standoffNote = isInverse
                    ? 'stabilizes tightly around the inner oxidizer sphere with elevated burner heat loss'
                    : 'stabilizes at an expanded outer standoff radius';
                narrative = `Per NASA PSI-159 CFI-G data, ${fuel.shortName} in a ${flowLabel} microgravity setup at ${State.pressureAtm.toFixed(2)} atm${o3Note} sustains a quasi-steady cool flame (${State.flameTempC} °C / ${flameK} K) via NTC peroxide branching and ${standoffNote}.`;
            } else if (State.flameStage === 'dual') {
                limiting = 'PSI-159 DUAL FLAME';
                narrative = `Transitional PSI-159 regime: an inner high-temperature CH* reaction zone coexists simultaneously with a faint outer cool-flame shell (${State.flameTempC} °C / ${flameK} K) at ${State.oxygenPct.toFixed(1)}% O₂ and ${State.pressureAtm.toFixed(2)} atm.`;
            } else if (isMicroG && flameK <= 1180) {
                limiting = 'NEAR RADIATIVE EXTINCTION';
                narrative = `Per NASA ACME Flame Design findings, spherical microgravity flames extinguish near 1,130 K (857 °C) due to radiative heat loss. Current temperature is ${flameK.toLocaleString()} K (${State.flameTempC} °C).`;
            } else if (isMicroG) {
                limiting = fuel.sootFactor >= 0.7 ? 'ACME 0G HIGH-SOOT' : 'PSI-159 SPHERICAL 0G';
                narrative = fuel.sootFactor >= 0.7
                    ? `At ${State.gravity.toFixed(2)} g, ACME data shows sooty fuels like ${fuel.shortName.toLowerCase()} produce 5–8× higher soot volume due to long residence times, creating a wider, cooler (${State.flameTempC.toLocaleString()} °C) radiative plume.`
                    : `In ${flowLabel} microgravity (${State.gravity.toFixed(2)} g, ${State.pressureAtm.toFixed(2)} atm), buoyancy vanishes and molecular diffusion sustains a spherical ${fuel.shortName.toLowerCase()} hot flame at ${State.flameTempC.toLocaleString()} °C (${flameK.toLocaleString()} K).`;
            } else if (State.co2Pct >= 15) {
                limiting = 'CO₂ DILUTION';
                narrative = `Elevated CO₂ (${State.co2Pct.toFixed(1)}%) acts as a high-heat-capacity thermal sink and displaces oxidizer, lowering flame temperature to ${State.flameTempC.toLocaleString()} °C and slowing spread to ${State.spreadRateCmS.toFixed(2)} cm/s.`;
            } else {
                narrative = `Under ${State.gravity.toFixed(2)} g gravity, ${State.pressureAtm.toFixed(2)} atm, and ${State.oxygenPct.toFixed(1)}% O₂, buoyant convection feeds oxidizer into the ${fuel.shortName.toLowerCase()} flame, sustaining a ${State.flameHeightCm.toFixed(1)} cm plume at ${State.flameTempC.toLocaleString()} °C.`;
            }

            DOM.limitingFactorTag.textContent = limiting;
            DOM.physicsNarrative.textContent = narrative;
        },

        renderExtinguishedState(fuel, mat, minO2, thermalQuench) {
            DOM.extinguishedBanner.classList.remove('hidden');
            DOM.regimeTag.textContent = 'EXTINGUISHED';
            DOM.combustionStatusBadge.className = 'inline-flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400';
            DOM.combustionStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"></span>Extinguished';

            const subjectLabel = mat.isPureFuel ? fuel.shortName : mat.shortName;
            const ntcHint = (mat.isPureFuel && State.gravity < 0.15 && fuel.ntcStrength === 0)
                ? ` (${fuel.shortName} lacks NTC peroxide branching for cool-flame survival)`
                : '';
            const reason = thermalQuench
                ? `CO₂ (${State.co2Pct.toFixed(1)}%) exceeded the thermal quenching threshold for ${subjectLabel}.`
                : `${subjectLabel} requires at least ${minO2.toFixed(1)}% O₂ at ${State.pressureAtm.toFixed(2)} atm${ntcHint}.`;
            DOM.extinguishReason.textContent = reason;

            DOM.sumFlameSize.textContent = '0.0 cm';
            DOM.sumFlameGeometry.textContent = 'No active reaction zone';
            DOM.sumIntensity.textContent = '0%';
            DOM.sumHeatRelease.textContent = '0.0 kW';
            DOM.sumIntensityBar.style.width = '0%';
            DOM.sumColorName.textContent = 'None';
            DOM.sumColorSpectrum.textContent = 'Residual glowing char only';
            DOM.sumColorHex.textContent = '#27272A';
            DOM.sumColorSwatch.style.backgroundColor = '#27272A';
            DOM.sumSpreadRate.textContent = '0.00 cm/s';
            DOM.sumSpreadDesc.textContent = 'Propagation halted';
            DOM.sumFlameTemp.textContent = '24 °C';
            DOM.sumFlameTempKelvin.textContent = '297 K / 75 °F';
            DOM.sumFuelTemp.textContent = `${State.fuelTempC} °C`;
            DOM.sumFuelTempKelvin.textContent = `${State.fuelTempC + 273} K / ${Math.round(State.fuelTempC * 1.8 + 32)} °F`;

            DOM.limitingFactorTag.textContent = mat.isPureFuel ? 'EXTINCTION LIMIT' : `NASA LOI ${mat.minOxygenPct}%`;
            DOM.physicsNarrative.textContent = !mat.isPureFuel
                ? `${reason} ${mat.nasaNote}`
                : `${reason} Increase oxygen, pressure, or ozone sensitization to re-establish combustion.`;
        },

        setToggleGroup(activeBtn, inactiveBtn) {
            const activeClasses = ['bg-white', 'dark:bg-zinc-800', 'text-zinc-900', 'dark:text-zinc-100', 'shadow-xs'];
            const inactiveClasses = ['text-zinc-500', 'dark:text-zinc-400', 'hover:text-zinc-900', 'dark:hover:text-zinc-200'];
            activeBtn.classList.add(...activeClasses);
            activeBtn.classList.remove(...inactiveClasses);
            inactiveBtn.classList.remove(...activeClasses);
            inactiveBtn.classList.add(...inactiveClasses);
        },

        setBurnerConfig(config) {
            State.burnerConfig = config;
            if (config === 'normal') {
                this.setToggleGroup(DOM.flowNormalBtn, DOM.flowInverseBtn);
            } else {
                this.setToggleGroup(DOM.flowInverseBtn, DOM.flowNormalBtn);
            }
            this.syncFromInputs();
        },

        setRenderMode(mode) {
            State.renderMode = mode;
            if (mode === 'doom') {
                this.setToggleGroup(DOM.renderModeDoomBtn, DOM.renderModeSmoothBtn);
            } else {
                this.setToggleGroup(DOM.renderModeSmoothBtn, DOM.renderModeDoomBtn);
            }
        },

        setDarkMode(isDark) {
            document.documentElement.classList.toggle('dark', isDark);
            DOM.themeToggleLabel.textContent = isDark ? 'Light' : 'Dark';
            DOM.themeIconSun.classList.toggle('hidden', !isDark);
            DOM.themeIconMoon.classList.toggle('hidden', isDark);
        },

        applyConfigValues(cfg) {
            DOM.fuelSelect.value = cfg.fuel;
            DOM.materialSelect.value = cfg.mat;
            DOM.gravitySlider.value = cfg.g;
            DOM.oxygenSlider.value = cfg.o2;
            DOM.co2Slider.value = cfg.co2;
            DOM.pressureSlider.value = cfg.p;
            DOM.ozoneSlider.value = cfg.o3;
            this.setBurnerConfig(cfg.flow);
        },

        bindEvents() {
            DOM.flowNormalBtn.addEventListener('click', () => this.setBurnerConfig('normal'));
            DOM.flowInverseBtn.addEventListener('click', () => this.setBurnerConfig('inverse'));
            DOM.renderModeDoomBtn.addEventListener('click', () => this.setRenderMode('doom'));
            DOM.renderModeSmoothBtn.addEventListener('click', () => this.setRenderMode('smooth'));

            [DOM.fuelSelect, DOM.materialSelect].forEach((el) => el.addEventListener('change', () => this.syncFromInputs()));
            [DOM.gravitySlider, DOM.oxygenSlider, DOM.co2Slider, DOM.pressureSlider, DOM.ozoneSlider].forEach((el) => {
                el.addEventListener('input', () => this.syncFromInputs());
            });

            DOM.resetPresetsBtn.addEventListener('click', () => this.applyConfigValues(DataStore.PRESETS.earth));
            DOM.presetButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const preset = DataStore.PRESETS[btn.dataset.preset];
                    if (preset) this.applyConfigValues(preset);
                });
            });

            DOM.themeToggleBtn.addEventListener('click', () => {
                this.setDarkMode(!document.documentElement.classList.contains('dark'));
            });

            DOM.saveConfigBtn.addEventListener('click', () => RunExporter.saveCurrent());
            DOM.exportCsvBtn.addEventListener('click', () => RunExporter.exportCsv());
            window.addEventListener('resize', () => ChamberRenderer.resize());
        }
    };

    /* -----------------------------------------------------------------
       7. APPLICATION BOOTSTRAP & ANIMATION LOOP
       ----------------------------------------------------------------- */
    let lastTs = 0;
    function animate(ts) {
        const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
        lastTs = ts;
        ChamberRenderer.renderFrame(dt);
        requestAnimationFrame(animate);
    }

    window.onload = function () {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            UIController.setDarkMode(true);
        }
        UIController.bindEvents();
        ChamberRenderer.resize();
        UIController.syncFromInputs();
        requestAnimationFrame(animate);
    };
})();