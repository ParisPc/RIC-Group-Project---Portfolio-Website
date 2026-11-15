const form = document.getElementById("editor-form");
const message = document.getElementById("editor-message");
const storageKey = "ric-portfolio-draft";

const fieldIds = [
    "full-name",
    "major",
    "graduation",
    "headline",
    "bio",
    "skills",
    "project-name",
    "project-description",
    "project-contribution",
    "project-tools",
    "project-link"
];

try {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        const draft = JSON.parse(saved);

        if (draft && typeof draft === "object") {
            fieldIds.forEach(function (id) {
                const field = document.getElementById(id);

                if (field && typeof draft[id] === "string") {
                    field.value = draft[id];
                }
            });

            message.textContent = "Your saved draft has been loaded.";
        }
    }
} catch (error) {
    message.textContent =
        "Could not load your draft: " + error.message;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const draft = {};

    fieldIds.forEach(function (id) {
        const field = document.getElementById(id);

        if (field) {
            draft[id] = field.value.trim();
        }
    });

    try {
        localStorage.setItem(storageKey, JSON.stringify(draft));

        message.textContent =
            "Saved! Refresh this page to check that your name and major remain.";

        message.scrollIntoView({ block: "nearest" });
    } catch (error) {
        message.textContent =
            "Could not save your draft: " + error.message;
    }
});

message.textContent = "Editor ready. Fill out your details and click Save Portfolio.";