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
// 30 UNIQUE NATURAL LANGUAGE SCENARIOS
// ------------------------------

let scenarios = [];

const inflationScenarios = [
    "Inflation is rising rapidly as consumer demand overwhelms available supply.",
    "Prices are climbing as businesses struggle to keep up with strong spending.",
    "Consumers are buying more goods than producers can supply, pushing prices upward.",
    "The economy is overheating, and too much money is circulating.",
    "Rising wages and strong consumer confidence are contributing to higher inflation.",
    "Housing, food, and fuel prices are increasing month after month.",
    "The dollar is losing purchasing power due to broad price increases.",
    "Borrowing is high, and banks report heavy loan demand fueling price growth.",
    "Strong job markets and rising wages are driving up overall prices.",
    "Businesses are raising prices because their input costs are increasing.",
    "Consumer spending is outpacing economic output.",
    "Asset prices like homes and stocks are rising quickly, signaling overheating.",
    "Inflation expectations are increasing, leading firms to adjust prices upward."
];

const recessionScenarios = [
    "Businesses are cutting back production as consumers reduce spending.",
    "Unemployment is rising as companies lay off workers.",
    "Economic growth has slowed, and demand for goods is weakening.",
    "Retailers report declining sales as households tighten budgets.",
    "Banks are issuing fewer loans due to falling demand.",
    "Housing demand is dropping as buyers hold back.",
    "Factories are receiving fewer orders and reducing shifts.",
    "Job openings are decreasing nationwide.",
    "Businesses are freezing hiring due to economic uncertainty.",
    "Consumers are saving more and spending less.",
    "More workers are filing for unemployment benefits.",
    "Companies are delaying expansions due to weak demand.",
    "Production levels are decreasing across major industries."
];

const neutralScenarios = [
    "Economic indicators show stable growth, low inflation, and steady employment.",
    "Consumers and businesses are spending at balanced levels with no major shifts.",
    "Inflation is stable and unemployment is healthy, indicating a balanced economy.",
    "The economy is functioning smoothly with steady, predictable growth."
];

// Build scenario objects
inflationScenarios.forEach(text => {
    scenarios.push({
        text,
        correctPolicy: "contractionary",
        tools: ["raiseDiscount", "raiseReserve", "sellBonds"],
        teacherExplain: "High inflation requires contractionary monetary policy to slow the economy."
    });
});

recessionScenarios.forEach(text => {
    scenarios.push({
        text,
        correctPolicy: "expansionary",
        tools: ["lowerDiscount", "lowerReserve", "buyBonds"],
        teacherExplain: "A slowing economy requires expansionary policy to encourage borrowing and spending."
    });
});

neutralScenarios.forEach(text => {
    scenarios.push({
        text,
        correctPolicy: "nochange",
        tools: [],
        teacherExplain: "Stable economic indicators require no change in monetary policy."
    });
});

// Shuffle
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

let questionOrder = [];
let currentIndex = 0;
let score = 0;

// ------------------------------
// MAIN SIM ENGINE
// ------------------------------

const scenarioText = document.getElementById("scenarioText");
const questionCounter = document.getElementById("questionCounter");

let selectedPolicy = null;
let selectedTool = null;

const policyBtns = document.querySelectorAll(".policy-btn");
const toolBtns = document.querySelectorAll(".tool-btn");

// Clear highlight states
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

    toolBtns.forEach(btn => btn.disabled = (scenario.correctPolicy === "nochange"));
}

// ------------------------------
// BUTTON SELECTION HANDLING
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
// SUBMIT RESPONSE
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

    clearHighlights();

    policyBtns.forEach(btn => {
        if (btn.dataset.policy === selectedPolicy) {
            btn.classList.add(correctPolicy ? "correct" : "incorrect");
        }
    });

    if (scenario.correctPolicy !== "nochange") {
        toolBtns.forEach(btn => {
            if (btn.dataset.tool === selectedTool) {
                btn.classList.add(correctTool ? "correct" : "incorrect");
            }
        });
    }

    if (!correctPolicy || (scenario.correctPolicy !== "nochange" && !correctTool)) {
        return;
    }

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
// END OF SIMULATION
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

