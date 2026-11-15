// Only load your draft when opening the personal preview.
if (new URLSearchParams(window.location.search).get("preview") === "1") {
    const notice = document.querySelector(".sample-notice");

    try {
        const saved = localStorage.getItem("ric-portfolio-draft");
        const draft = saved ? JSON.parse(saved) : null;

        if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
            notice.textContent =
                "No saved draft found. Open the editor and save your portfolio first.";
        } else {
            showDraft(draft);
        }
    } catch (error) {
        notice.textContent =
            "Your draft could not be loaded. Return to the editor and try saving again.";
    }
}

function showDraft(draft) {
    function value(id) {
        return typeof draft[id] === "string" ? draft[id] : "";
    }

    function sectionFor(headingId) {
        return document.getElementById(headingId).closest("section");
    }

    function fillTags(list, text) {
        list.replaceChildren();

        text.split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(Boolean)
            .forEach(function (item) {
                const tag = document.createElement("li");
                tag.textContent = item;
                list.appendChild(tag);
            });
    }

    const name = value("full-name") || "Your name";

    document.title = name + " | Portfolio Preview";

    document.querySelector(".sample-notice").textContent =
        "Your draft preview · Saved in this browser · Not published";

    document.getElementById("student-name").textContent = name;

    document.querySelector(".profile-avatar").textContent =
        name.split(/\s+/)
            .slice(0, 2)
            .map(function (part) {
                return part.charAt(0);
            })
            .join("")
            .toUpperCase();

    let graduation = "";
    const month = value("graduation");

    if (/^\d{4}-\d{2}$/.test(month)) {
        const date = new Date(month + "-01T12:00:00");

        if (!Number.isNaN(date.getTime())) {
            graduation = date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
            });
        }
    }

    document.querySelector(".profile-subtitle").textContent =
        [value("major"), graduation ? "Graduating " + graduation : ""]
            .filter(Boolean)
            .join(" · ");

    document.querySelector(".profile-intro").textContent = value("headline");

    const about = sectionFor("about-title");
    about.querySelector("p").textContent = value("bio");
    about.hidden = !value("bio");

    const skills = sectionFor("skills-title");
    fillTags(skills.querySelector(".skill-list"), value("skills"));
    skills.hidden = !skills.querySelector("li");

    const projects = sectionFor("projects-title");
    const grid = projects.querySelector(".project-grid");
    grid.replaceChildren();

    if (value("project-name")) {
        const card = document.createElement("article");
        card.className = "project-card";

        const title = document.createElement("h3");
        title.textContent = value("project-name");
        card.appendChild(title);

        const description = document.createElement("p");
        description.textContent = value("project-description");
        card.appendChild(description);

        if (value("project-contribution")) {
            const contribution = document.createElement("p");
            contribution.className = "project-detail";
            contribution.textContent =
                "My contribution: " + value("project-contribution");
            card.appendChild(contribution);
        }

        const tools = document.createElement("ul");
        tools.className = "skill-list";
        fillTags(tools, value("project-tools"));
        card.appendChild(tools);

        try {
            const url = new URL(value("project-link"));

            if (url.protocol === "https:" || url.protocol === "http:") {
                const paragraph = document.createElement("p");
                const link = document.createElement("a");
                link.href = url.href;
                link.textContent = "View project";
                paragraph.appendChild(link);
                card.appendChild(paragraph);
            }
        } catch (error) {
            // Leave out missing or invalid project links.
        }

        grid.appendChild(card);
    }

    projects.hidden = !grid.children.length;

    const education = sectionFor("education-title");
    education.querySelector("p").textContent =
        [value("major"), graduation ? "Expected graduation: " + graduation : ""]
            .filter(Boolean)
            .join(" · ");
}