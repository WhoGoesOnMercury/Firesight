This is the official submission of the "Rocks" team (Rafael Enrico C. Hugo, Kyle Andrei U. Ty) for the NASA Space Apps Challenge under "Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data"

# Firesight
Fire safety is a practice that is intended to reduce the destruction caused by fire (Wikipedia, 2026). Fire is easily dealt with on Earth given how intensive are data on its behavior; do not pour water on an oil fire and do not place flammable objects like wood near flames are two examples. 

Previous attempts at space exploration brought both advancement and disaster for those who manned these machines. Combustible materials were needed to propel rockets and satellites. As such, this brought upon further experimentation and exploration of fire under off-Earth environments such as microgravity and little to zero air pressure. 

Firesight is a web application that makes use of configurable parameters to simulate fire and its properties. This application is intended for individuals who are interested in the behavior of fire, which is presented in a simple manner. Aside from summarizing existing data from NASA PSI, this application provides data such as flame size, intensity, color, spread rate, temperature, and fuel/material-surface temperature based on the parameters. 

---

## Data Gathering
Two key methods were used to gather data for the application:
1. **Manual Extraction**
   * This includes selecting specific data from previous reports. 
2. **SI/AI-assisted Report Interpretation**
   * Super-intelligence was utilized to quickly summarize results from NASA experiments. Spreadsheets were fed into Gemini to report trends in data which was subsequently utilized in the application. 

---

## Software Architecture
The web application was built using standard HTML5, CSS3, and JavaScript. It can be run on either a desktop, laptop, or mobile device provided that it has an available browser. Gemini AI assisted in coding and building this application. 

**Files:** 
1. **`index.html`**
   * Contains the frontend and interactable elements of the application
2. **`styles.css`**
   * Contains the design choices for the application
3. **`app.js`**
   * Contains the core application logic, including physics modeling, rendering, and state management. It follows an `Input -> Physics -> State -> Render/DOM` pipeline organized into 7 sections:
   * **3.1 Constants**
     * Stores empirical reference data and presets extracted from NASA microgravity combustion programs (PSI-159, ACME, and Saffire), including fuel properties (calorific values, adiabatic temperatures, soot factors, NTC strength) and spacecraft material Limiting Oxygen Indices (LOI).
   * **3.2 State Cache**
     * Maintains a centralized object of live simulation parameters alongside cached DOM references for rapid updates.
   * **3.3 Physics Engine**
     * Uses reduced-order empirical scaling laws rather than heavy fluid-dynamics equations to calculate combustion behavior in real time.
   * **3.4 Canvas Renderer**
     * Handles the visualization of the fire. This includes the molecular/Doom view and fire/plume view.
   * **3.5 Config Exporter**
     * Contains logic for exporting the saved configurations into a spreadsheet or CSV 
   * **3.6 UI Controller**
     * Synchronizes slider, dropdown, and toggle inputs with the simulation state, updates the telemetry HUD readouts, switches light/dark themes, and generates dynamic physics narratives explaining the active limiting factor.
   * **3.7 Main Loop**
     * Initializes event listeners and canvas sizing on page load

---

## Key Features
1. **Molecule View**
   * Here, we utilized the fire rendering logic as seen in the Doom franchise. Fire is usually never seen or interpreted as moving molecules. This introduces a gap to those who want to look deeper into fire behavior. 
2. **Configurability**
   * Simulations are inherently artificial. This application utilizes data from NASA itself. Aside from customizing fuel source and material, oxygen and CO2 are also introduced to allow for a more complete assessment of behavior.
3. **Exportable Data**
   * Configurations or runs can be saved as a preset. These presets can also be exported to a properly formatted spreadsheet for further use outside of the application. 
4. **Flight and Lab notes**
   * Other than the expected results of the flame, there are also informational details provided such as parameter requirements for certain fuel and material combination. 

---

## Design Considerations
A dashboard must contain and present data in a manner that is easy to read. This application is divided into three main parts (from left to right): **parameters**, **visualization**, and **summary data**.

The trade-off presents a gap in presenting more advanced data. These limitations made it so that the application must be presented in a simple manner whilst still providing complete data.


