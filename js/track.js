async function trackIssue() {

    const enteredId = document
        .getElementById("civicFixId")
        .value
        .trim()
        .toUpperCase();

    const result = document.getElementById("trackResult");

    if (enteredId === "") {
        result.innerHTML = `
            <div class="track-message error">
                Please enter your Civic Fix ID.
            </div>
        `;
        return;
    }

    result.innerHTML = `
        <div class="track-message">
            Searching for your report...
        </div>
    `;

    try {

        const response = await fetch(
            `/api/reports/${encodeURIComponent(enteredId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error || "Report not found."
            );
        }

        const report = data.report;

        result.innerHTML = `
            <div class="track-result-card">

                <h3>Report Found</h3>

                <div class="track-id">
                    ${report.civicFixId}
                </div>

                <div class="track-details">

                    <p>
                        <strong>Category:</strong>
                        ${report.category}
                    </p>

                    <p>
                        <strong>Problem:</strong>
                        ${report.problem}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${report.location || "Not provided"}
                    </p>

                    <p>
                        <strong>Severity:</strong>
                        ${report.severity}
                    </p>

                    <p>
                        <strong>Submitted:</strong>
                        ${formatDate(report.submittedAt)}
                    </p>

                </div>

                <div class="status-container">

                    <h4>Report Status</h4>

                    <div class="status-timeline">

                        <div class="status-step active">
                            <span>1</span>
                            <p>Submitted</p>
                        </div>

                        <div class="status-line"></div>

                        <div class="status-step">
                            <span>2</span>
                            <p>Under Review</p>
                        </div>

                        <div class="status-line"></div>

                        <div class="status-step">
                            <span>3</span>
                            <p>Assigned</p>
                        </div>

                        <div class="status-line"></div>

                        <div class="status-step">
                            <span>4</span>
                            <p>In Progress</p>
                        </div>

                        <div class="status-line"></div>

                        <div class="status-step">
                            <span>5</span>
                            <p>Resolved</p>
                        </div>

                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Track issue failed:", error);

        result.innerHTML = `
            <div class="track-message error">
                No report found with this Civic Fix ID.
            </div>
        `;
    }
}


function formatDate(dateString) {
    const date = new Date(dateString + "Z");

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}