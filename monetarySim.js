// -----------------------------
// SCENARIOS (A version: Inflation or Recession)
// -----------------------------

const scenarios = [
    {
        text: "The economy is overheating. Prices are rising too quickly and inflation is above target.",
        correctPolicy: "contractionary",
        tools: ["raiseDiscount", "raiseReserve", "sellBonds"],
        teacherExplain: "High inflation → use contractionary monetary policy → raise interest rates (raise discount rate), raise reserve requirement, or sell bonds to reduce the money supply."
    },
    {
        text: "The economy is slowing. Businesses are cutting back production and unemployment is rising.",
        correctPolicy: "expansionary",
        tools: ["lowerDiscount", "lowerReserve", "buyBonds"],
        teacherExplain: "A slowing economy → use expansionary monetary policy → lower interest rates, lower reserve requirement, or buy bonds to increase the money supply."
    }
];

let currentScenario = null;
let selectedPolicy = null;
let selectedTool = null;

// -----------------------------
// DOM ELEMENTS
// -----------------------------

const scenarioText = document.getElementById("scenarioText");
const feedback = document.getElementById("feedback");
const teacherText = document.getElementById("teacherText");
const teacherInfo = document.getElementById("teacherInfo");

// Policy buttons
document.querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedPolicy = btn.dataset.policy;
    });
});

// Tool buttons
document.querySelectorAll(".tool").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedTool = btn.dataset.tool;
    });
});

// -----------------------------
// NEW SCENARIO
// -----------------------------

function loadScenario() {
    const rand = Math.floor(Math.random() * scenarios.length);
    currentScenario = scenarios[rand];

    scenarioText.textContent = currentScenario.text;
    feedback.textContent = "";
    selectedPolicy = null;
    selectedTool = null;

    teacherInfo.classList.remove("teacher-visible");
    teacherInfo.classList.add("teacher-hidden");
}

document.getElementById("resetBtn").addEventListener("click", loadScenario);

// -----------------------------
// SUBMIT ANSWER
// -----------------------------

document.getElementById("submitBtn").addEventListener("click", () => {

    if (!selectedPolicy || !selectedTool) {
        feedback.textContent = "Please choose both a policy and a tool.";
        return;
    }

    let correctPolicy = (selectedPolicy === currentScenario.correctPolicy);
    let correctTool = currentScenario.tools.includes(selectedTool);

    if (selectedPolicy === "nochange" && currentScenario.correctPolicy !== "nochange") {
        feedback.textContent = "Incorrect — action is required in this scenario.";
        return;
    }

    if (correctPolicy && correctTool) {
        feedback.textContent = "Correct!";
    } else {
        feedback.textContent = "Incorrect. Review the policy and tools.";
    }
});

// -----------------------------
// TEACHER MODE
// -----------------------------

document.getElementById("teacherToggle").addEventListener("click", () => {
    if (teacherInfo.classList.contains("teacher-hidden")) {
        teacherText.textContent = currentScenario.teacherExplain;
        teacherInfo.classList.remove("teacher-hidden");
        teacherInfo.classList.add("teacher-visible");
    } else {
        teacherInfo.classList.add("teacher-hidden");
        teacherInfo.classList.remove("teacher-visible");
    }
});

// -----------------------------
// INITIAL LOAD
// -----------------------------
loadScenario();
