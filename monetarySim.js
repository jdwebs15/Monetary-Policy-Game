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
// SCENARIOS
// ------------------------------

let scenarios = [];

// 13 Inflation
for (let i = 0; i < 13; i++) {
    scenarios.push({
        type: "inflation",
        text: "Prices are rising too quickly and inflation is above target. The economy is overheating.",
        correctPolicy: "contractionary",
        tools: ["raiseDiscount", "raiseReserve", "sellBonds"],
        teacherExplain: "High inflation requires contractionary monetary policy: raise interest rates, raise reserve requirement, or sell bonds."
    });
}

// 13 Recession
for (let i = 0; i < 13; i++) {
    scenarios.push({
        type: "recession",
        text: "Economic growth is slowing and unemployment is increasing as businesses cut back production.",
        correctPolicy: "expansionary",
        tools: ["lowerDiscount", "lowerReserve", "buyBonds"],
        teacherExplain: "A slowing economy requires expansionary policy: lower discount rate, lower reserve requirement, or buy bonds."
    });
}

// 4 No-Change
for (let i = 0; i < 4; i++) {
    scenarios.push({
        type: "neutral",
        text: "The economy is stable with moderate growth, low inflation, and steady employment levels.",
        correctPolicy: "nochange",
        tools: [],
        teacherExplain: "When economic indicators are stable, no change in monetary policy is appropriate."
    });
}

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

function resetButtonStates() {
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
    resetButtonStates();
    selectedPolicy = null;
    selectedTool = null;

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("feedback").textContent = "";

    const scenario = questionOrder[currentIndex];

    scenarioText.textContent = scenario.text;
    questionCounter.textContent = `Question ${currentIndex + 1} of 30`;

    // Disable tools for no-change scenarios
    toolBtns.forEach(btn => btn.disabled = (scenario.correctPolicy === "nochange"));
}

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

    // Clear old colors
    policyBtns.forEach(btn => btn.classList.remove("correct", "incorrect"));
    toolBtns.forEach(btn => btn.classList.remove("correct", "incorrect"));

    if (!correctPolicy) {
        policyBtns.forEach(btn => {
            if (btn.dataset.policy === selectedPolicy) btn.classList.add("incorrect");
        });
        return;
    }

    if (scenario.correctPolicy !== "nochange" && !correctTool) {
        toolBtns.forEach(btn => {
            if (btn.dataset.tool === selectedTool) btn.classList.add("incorrect");
        });
        return;
    }

    // CORRECT ANSWER:
    score++;

    policyBtns.forEach(btn => {
        if (btn.dataset.policy === selectedPolicy) btn.classList.add("correct");
    });

    if (scenario.correctPolicy !== "nochange") {
        toolBtns.forEach(btn => {
            if (btn.dataset.tool === selectedTool) btn.classList.add("correct");
        });
    }

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

// ------------------------------
// RESTART
// ------------------------------

document.getElementById("restartBtn").addEventListener("click", () => {
    finalScreen.classList.remove("active-screen");
    nameScreen.classList.add("active-screen");
});

