/* =========================
   Civic Fix - Report Flow
   ========================= */

// Store report information
let selectedCategory = "";
let selectedProblem = "";
let problemDescription = "";
let selectedSeverity = "";
let selectedLocation = "";
let selectedCoordinates = null;

let userName = "";
let userMobile = "";
let userAddress = "";

let uploadedPhotos = [];
let uploadedVideo = null;


/* =========================
   Problem Categories
   ========================= */

const problems = {

    "Road & Transportation": [
        "Pothole",
        "Damaged road",
        "Footpath damage",
        "Traffic signal issue",
        "Missing road sign",
        "Illegal parking",
        "Blocked road",
        "Other"
    ],

    "Water & Sanitation": [
        "Water leakage",
        "Water shortage",
        "Contaminated water",
        "Pipeline damage",
        "Sewage overflow",
        "Open drainage",
        "Public toilet issue",
        "Other"
    ],

    "Waste Management": [
        "Garbage accumulation",
        "Uncollected garbage",
        "Illegal dumping",
        "Overflowing waste bin",
        "Plastic waste",
        "Other"
    ],

    "Electricity & Utilities": [
        "Streetlight failure",
        "Fallen electric pole",
        "Exposed electrical wires",
        "Transformer issue",
        "Power supply issue",
        "Other"
    ],

    "Public Infrastructure": [
        "Damaged bus stop",
        "Park maintenance issue",
        "Damaged public building",
        "Damaged public property",
        "Other"
    ],

    "Environment": [
        "Tree damage",
        "Illegal tree cutting",
        "Air pollution",
        "Water pollution",
        "Open burning",
        "Other"
    ],

    "Public Safety": [
        "Dangerous manhole",
        "Broken safety barrier",
        "Unsafe construction",
        "Accident-prone location",
        "Fallen structure",
        "Other"
    ],

    "Public Health": [
        "Mosquito breeding",
        "Unhygienic area",
        "Medical waste",
        "Food hygiene issue",
        "Other"
    ]
};


/* =========================
   Category Selection
   ========================= */

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", function () {

        selectedCategory = this.querySelector("strong").textContent;

        showProblems();

    });

});


/* =========================
   Show Problems
   ========================= */

function showProblems() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>Select the specific problem</h3>

        <p class="form-description">
            Choose the problem that best describes the issue.
        </p>

        <div class="problem-grid">

            ${problems[selectedCategory].map(problem => `
                <button class="problem-card" onclick="selectProblem('${problem.replace(/'/g, "\\'")}')">
                    ${problem}
                </button>
            `).join("")}

        </div>

        <button class="back-button" onclick="location.reload()">
            Back
        </button>
    `;
}


/* =========================
   Problem Selection
   ========================= */

function selectProblem(problem) {

    selectedProblem = problem;

    if (problem === "Other") {
        showOtherProblem();
    } else {
        showProblemDetails();
    }

}


/* =========================
   Other Problem
   ========================= */

function showOtherProblem() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>Describe the problem</h3>

        <p class="form-description">
            Please describe the civic issue in your own words.
        </p>

        <textarea
            id="otherProblem"
            class="problem-textarea"
            rows="6"
            placeholder="Describe the problem..."
        ></textarea>

        <br>

        <button class="continue-button" onclick="saveOtherProblem()">
            Continue
        </button>

        <button class="back-button" onclick="showProblems()">
            Back
        </button>
    `;

}


/* =========================
   Save Other Problem
   ========================= */

function saveOtherProblem() {

    const description = document
        .getElementById("otherProblem")
        .value
        .trim();

    if (description === "") {
        alert("Please describe the problem.");
        return;
    }

    problemDescription = description;

    showEvidence();

}


/* =========================
   Normal Problem Details
   ========================= */

function showProblemDetails() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>Describe the problem</h3>

        <p class="form-description">
            Provide some details about the issue.
        </p>

        <textarea
            id="problemDescription"
            class="problem-textarea"
            rows="6"
            placeholder="Describe what happened, where it happened, and any other useful details..."
        >${problemDescription}</textarea>

        <br>

        <button class="continue-button" onclick="saveProblemDescription()">
            Continue
        </button>

        <button class="back-button" onclick="showProblems()">
            Back
        </button>
    `;

}


/* =========================
   Save Description
   ========================= */

function saveProblemDescription() {

    const description = document
        .getElementById("problemDescription")
        .value
        .trim();

    if (description === "") {
        alert("Please describe the problem.");
        return;
    }

    problemDescription = description;

    showEvidence();

}


/* =========================
   Evidence
   ========================= */

function showEvidence() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>Add Evidence</h3>

        <p class="form-description">
            Upload photos or a video of the civic issue.
            Evidence helps authorities understand the problem better.
        </p>

        <div class="upload-section">

            <label class="upload-label">
                Photos
            </label>

            <p class="upload-help">
                You can upload up to 5 photos.
            </p>

            <input
                type="file"
                id="photoInput"
                accept="image/*"
                multiple
            >

            <div id="imagePreview" class="image-preview"></div>


            <label class="upload-label">
                Video
            </label>

            <p class="upload-help">
                You can upload one video.
            </p>

            <input
                type="file"
                id="videoInput"
                accept="video/*"
            >

        </div>


        <button class="continue-button" onclick="saveEvidence()">
            Continue
        </button>

        <button class="skip-button" onclick="showLocation()">
            Skip
        </button>

        <button class="back-button" onclick="showProblemDetails()">
            Back
        </button>
    `;


    const photoInput = document.getElementById("photoInput");

    photoInput.addEventListener("change", function () {

        const files = Array.from(this.files);

        if (files.length > 5) {

            alert("You can upload a maximum of 5 photos.");

            this.value = "";

            return;
        }

        uploadedPhotos = files;

        const preview = document.getElementById("imagePreview");

        preview.innerHTML = "";

        uploadedPhotos.forEach(file => {

            const reader = new FileReader();

            reader.onload = function (event) {

                const img = document.createElement("img");

                img.src = event.target.result;

                img.className = "preview-image";

                preview.appendChild(img);

            };

            reader.readAsDataURL(file);

        });

    });


    const videoInput = document.getElementById("videoInput");

    videoInput.addEventListener("change", function () {

        if (this.files.length > 0) {

            uploadedVideo = this.files[0];

        }

    });

}


/* =========================
   Save Evidence
   ========================= */

function saveEvidence() {

    showLocation();

}


/* =========================
   Location
   ========================= */

function showLocation() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>Location of the Issue</h3>

        <p class="form-description">
            Tell us where the civic issue is located.
        </p>

        <button
            class="location-button"
            onclick="getCurrentLocation()"
        >
            Use My Current Location
        </button>

        <div class="location-divider">
            OR
        </div>

        <label class="upload-label">
            Enter Location Manually
        </label>

        <input
            type="text"
            id="manualLocation"
            class="location-input"
            placeholder="Enter area, street, landmark..."
            value="${selectedLocation}"
        >

        <div
            id="locationStatus"
            class="location-status"
        ></div>


        <button
            class="continue-button"
            onclick="saveLocation()"
        >
            Continue
        </button>

        <button
            class="back-button"
            onclick="showEvidence()"
        >
            Back
        </button>
    `;

}


/* =========================
   Get Current Location
   ========================= */

function getCurrentLocation() {

    const status = document.getElementById("locationStatus");

    if (!navigator.geolocation) {

        status.textContent =
            "Location services are not supported by this browser.";

        return;
    }


    status.textContent =
        "Getting your current location...";


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            selectedCoordinates = {
                latitude: latitude,
                longitude: longitude
            };

            selectedLocation =
                `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;

            status.textContent =
                `Current location detected: ${selectedLocation}`;

            document.getElementById("manualLocation").value =
                selectedLocation;

        },

        function (error) {

            status.textContent =
                "Unable to get your location. Please enter it manually.";

        }

    );

}


/* =========================
   Save Location
   ========================= */

function saveLocation() {

    const locationInput =
        document.getElementById("manualLocation").value.trim();


    if (locationInput === "") {

        alert("Please provide the location of the issue.");

        return;
    }


    selectedLocation = locationInput;

    showSeverity();

}


/* =========================
   Severity
   ========================= */

function showSeverity() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>How serious is the issue?</h3>

        <p class="form-description">
            Select the severity level that best describes the problem.
        </p>


        <div class="severity-grid">

            <button
                class="severity-card"
                onclick="selectSeverity('Low')"
            >
                <strong>Low</strong>

                <span>
                    Minor issue with limited impact.
                </span>
            </button>


            <button
                class="severity-card"
                onclick="selectSeverity('Medium')"
            >
                <strong>Medium</strong>

                <span>
                    Issue affecting some people or an area.
                </span>
            </button>


            <button
                class="severity-card"
                onclick="selectSeverity('High')"
            >
                <strong>High</strong>

                <span>
                    Serious issue affecting many people.
                </span>
            </button>


            <button
                class="severity-card"
                onclick="selectSeverity('Critical')"
            >
                <strong>Critical</strong>

                <span>
                    Immediate danger or major public safety risk.
                </span>
            </button>

        </div>


        <button
            class="back-button"
            onclick="showLocation()"
        >
            Back
        </button>
    `;

}


/* =========================
   Select Severity
   ========================= */

function selectSeverity(severity) {

    selectedSeverity = severity;

    showContactDetails();

}


/* =========================
   Personal Details
   ========================= */

function showContactDetails() {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `
        <h3>Your Contact Details</h3>

        <p class="form-description">
            Provide your details so the concerned authority can contact you if necessary.
        </p>


        <label class="upload-label">
            Name
        </label>

        <input
            type="text"
            id="userName"
            class="location-input"
            placeholder="Enter your full name"
            value="${userName}"
        >


        <label class="upload-label">
            Mobile Number
        </label>

        <input
            type="tel"
            id="userMobile"
            class="location-input"
            placeholder="Enter your 10-digit mobile number"
            maxlength="10"
            value="${userMobile}"
        >


        <label class="upload-label">
            Address
        </label>

        <textarea
            id="userAddress"
            class="problem-textarea"
            rows="4"
            placeholder="Enter your address"
        >${userAddress}</textarea>


        <button
            class="continue-button"
            onclick="saveContactDetails()"
        >
            Continue
        </button>


        <button
            class="back-button"
            onclick="showSeverity()"
        >
            Back
        </button>
    `;

}


/* =========================
   Save Personal Details
   ========================= */

function saveContactDetails() {

    userName =
        document.getElementById("userName").value.trim();

    userMobile =
        document.getElementById("userMobile").value.trim();

    userAddress =
        document.getElementById("userAddress").value.trim();


    if (userName === "") {

        alert("Please enter your name.");

        return;
    }


    if (!/^[0-9]{10}$/.test(userMobile)) {

        alert("Please enter a valid 10-digit mobile number.");

        return;
    }


    if (userAddress === "") {

        alert("Please enter your address.");

        return;
    }


    showReview();

}


/* =========================
   Review
   ========================= */

function showReview() {

    const formCard = document.querySelector(".form-card");


    formCard.innerHTML = `

        <h3>Review Your Report</h3>

        <p class="form-description">
            Please review the information before submitting your report.
        </p>


        <div class="review-section">

            <p>
                <strong>Category:</strong>
                ${selectedCategory}
            </p>

            <p>
                <strong>Problem:</strong>
                ${selectedProblem}
            </p>

            <p>
                <strong>Description:</strong>
                ${problemDescription}
            </p>

            <p>
                <strong>Location:</strong>
                ${selectedLocation}
            </p>

            <p>
                <strong>Severity:</strong>
                ${selectedSeverity}
            </p>

            <p>
                <strong>Name:</strong>
                ${userName}
            </p>

            <p>
                <strong>Mobile Number:</strong>
                ${userMobile}
            </p>

            <p>
                <strong>Address:</strong>
                ${userAddress}
            </p>

            <p>
                <strong>Photos:</strong>
                ${uploadedPhotos.length}
            </p>

            <p>
                <strong>Video:</strong>
                ${uploadedVideo ? "Uploaded" : "Not uploaded"}
            </p>

        </div>


        <div style="margin-top: 25px;">

            <button
                class="back-button"
                onclick="showContactDetails()"
            >
                Back / Edit Report
            </button>


            <button
                class="continue-button"
                onclick="submitReport()"
            >
                Submit Report
            </button>

        </div>

    `;

}


/* =========================
   Submit Report
   ========================= */

async function submitReport() {

    const submitButton = document.querySelector(
        '.continue-button[onclick="submitReport()"]'
    );

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
    }

    const reportData = {
        category: selectedCategory,
        problem: selectedProblem,
        description: problemDescription,
        location: selectedLocation,
        latitude: selectedCoordinates
            ? selectedCoordinates.latitude
            : null,
        longitude: selectedCoordinates
            ? selectedCoordinates.longitude
            : null,
        severity: selectedSeverity,
        name: userName,
        mobile: userMobile,
        address: userAddress
    };

    try {

        const response = await fetch(
            "/api/reports",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reportData)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.error || "Unable to submit the report."
            );
        }

        const civicFixId = result.civicFixId;

        const report = {
            civicFixId: civicFixId,
            category: selectedCategory,
            problem: selectedProblem,
            description: problemDescription,
            location: selectedLocation,
            coordinates: selectedCoordinates,
            severity: selectedSeverity,
            name: userName,
            mobile: userMobile,
            address: userAddress,
            photos: uploadedPhotos.length,
            video: uploadedVideo ? true : false,
            status: "Submitted",
            submittedAt: new Date().toISOString()
        };

        localStorage.setItem(
            "civicFixReport",
            JSON.stringify(report)
        );

        showSubmissionSuccess(civicFixId);

    } catch (error) {

        console.error("Report submission failed:", error);

        alert(
            "Unable to submit the report. Please make sure the Civic Fix backend is running and try again."
        );

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Report";
        }
    }
}


/* =========================
   Submission Success
   ========================= */

function showSubmissionSuccess(civicFixId) {

    const formCard = document.querySelector(".form-card");

    formCard.innerHTML = `

        <div class="submission-success">

            <h3>Report Submitted Successfully</h3>

            <p>
                Your civic issue has been successfully registered
                with Civic Fix.
            </p>


            <div class="civic-id-box">

                <span>Your Civic Fix ID</span>

                <strong>${civicFixId}</strong>

            </div>


            <p>
                Please keep this ID safe. You can use it to
                track the status of your report.
            </p>


            <div class="submission-actions">

                <a
                    href="track.html"
                    class="continue-button"
                >
                    Track My Report
                </a>


                <a
                    href="report.html"
                    class="skip-button"
                >
                    Report Another Issue
                </a>

            </div>

        </div>

    `;

}