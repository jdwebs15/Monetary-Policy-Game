// ------------------------------
// NAME ENTRY + SETUP
// ------------------------------

const nameScreen = document.getElementById("nameScreen");
const questionScreen = document.getElementById("questionScreen");
const finalScreen = document.getElementById("finalScreen");

const studentNameInput = document.getElementById("studentName");
const startBtn = document.getElementById("startBtn");

const finalName = document.getElementById("finalName");
const finalDate = document.getElementById("finalDate");
const finalStart = document.getElementById("finalStart");
const finalEnd = document.getElementById("finalEnd");
const finalScore = document.getElementById("finalScore");
const finalPercent = document.getElementById("finalPercent");

let studentName = "";
let startTime;
let endTime;

// ------------------------------
// NAME HANDLING
// ------------------------------

startBtn.addEventListener("click", () => {
    if (studentNameInput.value.trim() === "") {
        alert("Please enter your name.");
        return;
    }

    studentName = studentNameInput.value.trim();
    startTime = new Date();

    nameScreen.classList.remove("active-screen");
    questionScreen.classList.add("active-screen");

    startSimulation();
});

// ------------------------------
// 30 UNIQUE SCENARIOS
// ------------------------------

let scenarios = [];

// 13 unique inflation scenarios
const inflationTexts = [
    "Inflation is rising rapidly as consumer demand outpaces supply.",
    "Prices are climbing faster than wages, and the dollar is losing purchasing power.",
    "Businesses are raising prices due to strong consumer spending.",
    "The economy is overheating with too much money chasing too few goods.",
    "Inflation is above the Federal Reserve’s target, indicating excessive economic activity.",
    "Rapid price increases are seen across food, housing, and energy sectors.",
    "Strong borrowing and spending are pushing inflation higher.",
    "Wages and prices are rising too quickly for long-term stability.",
    "Asset prices, including homes and stocks, are inflating rapidly.",
    "Cost-of-living increases indicate too much money in circulation.",
    "Producer prices are rising sharply as firms face strong demand.",
    "Consumer goods are becoming more expensive month over month.",
    "Inflation expectations are rising, encouraging businesses to increase prices."
];

// 13 unique recession scenarios
const recessionTexts = [
    "Business investment is slowing and unemployment is rising.",
    "Consumers are cutting spending, leading to declining sales.",
    "Economic growth has stalled and layoffs are increasing.",
    "Wage growth has flattened as businesses freeze hiring.",
    "Production levels are falling as companies reduce output.",
    "The housing market is weakening and fewer loans are being taken.",
    "Retailers report lower demand as households reduce purchases.",
    "Factories are producing less due to weaker orders.",
    "Job openings are declining nationwide.",
    "Companies are delaying expansion plans due to uncertainty.",
    "Unemployment claims are increasing as more people lose work.",
    "Banks are issuing fewer loans as demand falls.",
    "Consumers are saving more and spending less, slowing growth."
];

// 4 unique neutral scenarios
const neutralTexts = [
    "Economic indicators show stable growth with low inflation and steady employment.",
    "Consumer spending and business investment are balanced, with no major fluctuations.",
    "Inflation is on target, and unemployment is at healthy levels.",
    "The economy is functioning smoothly with no signs of overheating or slowdown."
];

// Build full scenario list
inflationTexts.forEach(text => {
    scenarios.push({
        text,
        correctPolicy: "contractionary",
        tools: ["raiseDiscount", "raiseReserve", "sellBonds"],
        teacherExplain: "High inflation requires contractionary monetary policy to reduce the money supply."
    });
});

recessionTexts.forEach(text => {
    scenarios.push({
        text,
        correctPolicy: "expansionary",
        tools: ["lowerDiscount", "lowerReserve", "buyBonds"],
        teacherExplain: "A slowing economy requires expansionary policy to increase borrowing and spending."
    });
});

neutralTexts.forEach(text => {
    scenarios.push({
        text,
        correctPolicy: "nochange",
        tools: [],
        teacherExplain: "Stable economic indicators require no change in monetary policy."
    });
});

// Shuffle helper
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

let questionOrder = [];
let currentIndex = 0;
let score = 0;

// ------------------------------
// MAIN SIM LOGIC
// ------------------------------

const scenarioText = document.getElementById("scenarioText");
const questionCounter = document.getElementById("questionCounter");

let selectedPolicy = null;
let selectedTool = null;

const policyBtns = document.querySelectorAll(".policy-btn");
const toolBtns = document.querySelectorAll(".tool-btn");

function clearHighlights() {
    policyBtns.forEach(btn => btn.classList.remove("selected", "correct", "incorrect"));
    toolBtns.forEach(btn => btn.classList.remove("selected", "correct", "incorrect"));
}

function startSimulation() {
    questionOrder = shuffle(scenarios.slice());
    currentIndex = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    clearHighlights();
    selectedPolicy = null;
    selectedTool = null;

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("feedback").textContent = "";

    const scenario = questionOrder[currentIndex];

    scenarioText.textContent = scenario.text;
    questionCounter.textContent = `Question ${currentIndex + 1} of 30`;

    // Disable tools if no-change
    toolBtns.forEach(btn => btn.disabled = scenario.correctPolicy === "nochange");
}

// ------------------------------
// BUTTON SELECTION
// ------------------------------

policyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        policyBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedPolicy = btn.dataset.policy;
    });
});

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        toolBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedTool = btn.dataset.tool;
    });
});

// ------------------------------
// SUBMIT LOGIC
// ------------------------------

document.getElementById("submitBtn").addEventListener("click", () => {
    const scenario = questionOrder[currentIndex];

    if (!selectedPolicy) {
        alert("Select a policy.");
        return;
    }

    if (scenario.correctPolicy !== "nochange" && !selectedTool) {
        alert("Select a tool.");
        return;
    }

    let correctPolicy = (selectedPolicy === scenario.correctPolicy);
    let correctTool = scenario.tools.includes(selectedTool);

    // Reset previous highlights
    clearHighlights();

    // Highlight selected policy
    policyBtns.forEach(btn => {
        if (btn.dataset.policy === selectedPolicy) {
            btn.classList.add(correctPolicy ? "correct" : "incorrect");
        }
    });

    // Highlight selected tool
    if (scenario.correctPolicy !== "nochange") {
        toolBtns.forEach(btn => {
            if (btn.dataset.tool === selectedTool) {
                btn.classList.add(correctTool ? "correct" : "incorrect");
            }
        });
    }

    // If incorrect, stop here
    if (!correctPolicy || (scenario.correctPolicy !== "nochange" && !correctTool)) {
        return;
    }

    // Correct answer
    score++;
    document.getElementById("feedback").textContent = "Correct!";
    document.getElementById("nextBtn").style.display = "block";
});

// ------------------------------
// NEXT QUESTION
// ------------------------------

document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= 30) {
        endSimulation();
    } else {
        loadQuestion();
    }
});

// ------------------------------
// TEACHER MODE
// ------------------------------

document.getElementById("teacherToggle").addEventListener("click", () => {
    const info = document.getElementById("teacherInfo");
    const teacherText = document.getElementById("teacherText");

    if (info.classList.contains("teacher-hidden")) {
        teacherText.textContent = questionOrder[currentIndex].teacherExplain;
        info.classList.remove("teacher-hidden");
        info.classList.add("teacher-visible");
    } else {
        info.classList.add("teacher-hidden");
        info.classList.remove("teacher-visible");
    }
});

// ------------------------------
// END SIMULATION
// ------------------------------

function endSimulation() {
    questionScreen.classList.remove("active-screen");
    finalScreen.classList.add("active-screen");

    endTime = new Date();

    finalName.textContent = studentName;
    finalDate.textContent = new Date().toLocaleDateString();
    finalStart.textContent = startTime.toLocaleTimeString();
    finalEnd.textContent = endTime.toLocaleTimeString();

    finalScore.textContent = score;
    finalPercent.textContent = ((score / 30) * 100).toFixed(1);
}

// Restart
document.getElementById("restartBtn").addEventListener("click", () => {
    finalScreen.classList.remove("active-screen");
    nameScreen.classList.add("active-screen");
});

