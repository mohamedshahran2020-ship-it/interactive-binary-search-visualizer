"use strict";

// Get HTML elements
const arrayInput = document.getElementById("arrayInput");
const targetInput = document.getElementById("targetInput");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

const arrayContainer = document.getElementById("arrayContainer");
const status = document.getElementById("status");

const lowValue = document.getElementById("lowValue");
const midValue = document.getElementById("midValue");
const highValue = document.getElementById("highValue");

// Search variables
let numbers = [];
let target = 0;
let low = 0;
let high = -1;
let mid = -1;
let stepCount = 0;

let searchStarted = false;
let searchFinished = false;
let foundIndex = -1;

// Display a status message
function showStatus(message, type = "") {
    status.textContent = message;
    status.className = type;
}

// Update LOW, MID and HIGH labels
function updatePointers() {
    lowValue.textContent =
        low <= high && low >= 0 ? low : "-";

    midValue.textContent =
        mid >= 0 && mid < numbers.length ? mid : "-";

    highValue.textContent =
        low <= high && high >= 0 ? high : "-";
}

// Display the array
function renderArray() {
    arrayContainer.innerHTML = "";

    numbers.forEach((number, index) => {
        const box = document.createElement("div");

        box.classList.add("array-box");
        box.textContent = number;

        // Highlight the current search range
        if (
            searchStarted &&
            !searchFinished &&
            index >= low &&
            index <= high
        ) {
            box.classList.add("active");
        }

        // Highlight the middle element
        if (
            searchStarted &&
            !searchFinished &&
            index === mid
        ) {
            box.classList.add("mid");
        }

        // Highlight the found element
        if (searchFinished && index === foundIndex) {
            box.classList.add("found");
        }

        arrayContainer.appendChild(box);
    });
}

// Start a new binary search
function startSearch() {
    const inputText = arrayInput.value.trim();
    const targetText = targetInput.value.trim();

    if (inputText === "" || targetText === "") {
        showStatus(
            "Please enter both the array and the target number.",
            "error"
        );
        return;
    }

    // Validate array input
    const parts = inputText.split(/[,\s]+/).filter(Boolean);

    const parsedNumbers = parts.map(Number);

    if (
        parsedNumbers.some(number => !Number.isFinite(number))
    ) {
        showStatus(
            "Invalid array. Enter numbers separated by commas or spaces.",
            "error"
        );
        return;
    }

    if (parsedNumbers.length === 0) {
        showStatus("Please enter at least one number.", "error");
        return;
    }

    // Validate target
    const parsedTarget = Number(targetText);

    if (!Number.isFinite(parsedTarget)) {
        showStatus("Please enter a valid target number.", "error");
        return;
    }

    // Sort numbers because binary search requires sorted data
    numbers = [...parsedNumbers].sort((a, b) => a - b);

    target = parsedTarget;

    // Reset search state
    low = 0;
    high = numbers.length - 1;
    mid = -1;
    stepCount = 0;

    searchStarted = true;
    searchFinished = false;
    foundIndex = -1;

    // Update interface
    startBtn.disabled = true;
    nextBtn.disabled = false;

    showStatus(
        `Array sorted. Ready to search for ${target}. Click Next Step.`,
        "info"
    );

    updatePointers();
    renderArray();
}

// Perform one binary-search comparison
function nextStep() {
    if (!searchStarted || searchFinished) {
        return;
    }

    // Target is not present
    if (low > high) {
        finishSearch(false);
        return;
    }

    // Calculate middle index
    mid = Math.floor((low + high) / 2);
    stepCount++;

    const middleNumber = numbers[mid];

    updatePointers();
    renderArray();

    // Target found
    if (middleNumber === target) {
        foundIndex = mid;
        searchFinished = true;

        renderArray();
        updatePointers();

        showStatus(
            `Target ${target} found at index ${foundIndex} after ${stepCount} comparison(s).`,
            "success"
        );

        nextBtn.disabled = true;
        startBtn.disabled = false;
        return;
    }

    // Target is greater than the middle element
    if (target > middleNumber) {
        low = mid + 1;

        updatePointers();
        renderArray();

        // No search range remains
        if (low > high) {
            finishSearch(false);
        } else {
            showStatus(
                `${target} > ${middleNumber}. Search the right half. Click Next Step.`,
                "info"
            );
        }

        return;
    }

    // Target is smaller than the middle element
    high = mid - 1;

    updatePointers();
    renderArray();

    // No search range remains
    if (low > high) {
        finishSearch(false);
    } else {
        showStatus(
            `${target} < ${middleNumber}. Search the left half. Click Next Step.`,
            "info"
        );
    }
}

// Finish the search
function finishSearch(found) {
    searchFinished = true;

    nextBtn.disabled = true;
    startBtn.disabled = false;

    if (found) {
        showStatus(
            `Target ${target} found at index ${foundIndex} after ${stepCount} comparison(s).`,
            "success"
        );
    } else {
        foundIndex = -1;

        showStatus(
            `Target ${target} was not found after ${stepCount} comparison(s).`,
            "error"
        );
    }

    updatePointers();
    renderArray();
}

// Reset everything, including both input fields
function resetSearch() {
    numbers = [];
    target = 0;

    low = 0;
    high = -1;
    mid = -1;

    stepCount = 0;
    searchStarted = false;
    searchFinished = false;
    foundIndex = -1;

    arrayInput.value = "";
    targetInput.value = "";

    arrayContainer.innerHTML = "";

    lowValue.textContent = "-";
    midValue.textContent = "-";
    highValue.textContent = "-";

    showStatus(
        "Enter numbers and a target, then click Start Search.",
        ""
    );

    startBtn.disabled = false;
    nextBtn.disabled = true;

    arrayInput.focus();
}

// Connect buttons
startBtn.addEventListener("click", startSearch);
nextBtn.addEventListener("click", nextStep);
resetBtn.addEventListener("click", resetSearch);

// Initial page state
resetSearch();