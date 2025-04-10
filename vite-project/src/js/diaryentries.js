import { fetchData } from "./fetch.js";

  

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("entry_date");

    if (dateInput) {
        dateInput.addEventListener("focus", function () {
            this.setAttribute("type", "date");
        });
    }

    getEntries(); // Fetch diary entries on load

    const form = document.querySelector(".diaryForm");
    const popup = document.getElementById("popup");
    const diaryPopup = document.querySelector(".diary-popup");
    const categoryText = document.getElementById("category");
    const analysisText = document.getElementById("analysis");
    const closeBtn = document.getElementById("close-popup");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('input[type="submit"]');
        submitBtn.disabled = true;

        let entryDate = document.getElementById("entry_date").value;
        let mood = document.getElementById("mood").value.toLowerCase();
        let energyLevel = document.getElementById("energy_level").value;
        let stressLevel = parseInt(document.getElementById("stress_level").value);
        let sleepHours = parseInt(document.getElementById("sleep_hours").value);
        let notes = document.getElementById("notes").value;
        let goals = document.getElementById("goals").value;

        if (!entryDate || isNaN(stressLevel) || isNaN(sleepHours)) {
            alert("Please fill out all required fields before saving.");
            submitBtn.disabled = false;
            return;
        }

        let stressCategory = "";
        let stressMessage = "";

        if (stressLevel >= 8) {
            stressCategory = "High Stress";
            const tips = ["Try deep breathing.", "Listen to calming music.", "Step outside for fresh air.", "Write down your thoughts."];
            stressMessage = `Your stress level is high. ${tips[Math.floor(Math.random() * tips.length)]}`;
        } else if (stressLevel >= 4) {
            stressCategory = "Moderate Stress";
            stressMessage = "Your stress level is moderate. Take breaks & practice self-care.";
        } else {
            stressCategory = "Normal Stress";
            stressMessage = "You're managing stress well!";
        }

        let sleepMessage = "";
        if (sleepHours < 4) {
            sleepMessage = "Too little sleep! Improve your habits.";
        } else if (sleepHours < 7) {
            sleepMessage = "Your sleep could be better. Aim for at least 7 hours for better energy levels.";
        } else {
            sleepMessage = "Great job! Your sleep duration is healthy.";
        }

        let moodMessage = "";
        const moodMap = {
            positive: ["happy", "joyful", "excited"],
            calm: ["calm", "relaxed", "content"],
            empowered: ["motivated", "proud", "grateful", "hopeful"],
            stressed: ["stressed", "anxious", "worried", "overwhelmed"],
            down: ["depressed", "sad", "lonely", "disappointed"],
            meh: ["tired", "bored", "indifferent"],
            angry: ["angry", "frustrated"],
            confused: ["confused", "nostalgic", "shy"]
        };

        for (let [key, list] of Object.entries(moodMap)) {
            if (list.some(m => mood.includes(m))) {
                moodMessage = {
                    positive: "It's great to see you feeling positive!",
                    calm: "You're feeling peaceful today, that's wonderful!",
                    empowered: "You're feeling empowered! Keep pushing forward and achieving great things!",
                    stressed: "Feeling stressed? Take deep breaths and give yourself a break.",
                    down: "It's okay to have bad days. You're not alone. Reach out to someone who cares.",
                    meh: "Maybe today feels slow, but tomorrow is a new opportunity! Take care of yourself.",
                    angry: "Feeling angry or frustrated? Try deep breathing or take a walk. You've got this 💪",
                    confused: "Feeling uncertain? It's okay. Take time to reflect — things will become clearer."
                }[key];
                break;
            }
        }

        if (!moodMessage) {
            moodMessage = "Thanks for sharing your mood! Every feeling is valid. 🌟";
        }

        diaryPopup.innerHTML = `
            <h3>Diary Entry Summary</h3>
            <p><strong>Date:</strong> ${entryDate}</p>
            <p><strong>Mood:</strong> ${mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
            <p><strong>Energy Level:</strong> ${energyLevel || "Not provided"}</p>
            <p><strong>Stress Level:</strong> ${stressLevel} (${stressCategory})</p>
            <p><strong>Sleep Hours:</strong> ${sleepHours}</p>
            <p><strong>Notes:</strong> ${notes || "No notes added."}</p>
            <p><strong>Goals:</strong> ${goals || "No goals added."}</p>
        `;

        categoryText.textContent = `Stress Level: ${stressCategory}`;
        analysisText.innerHTML = `
            <h4>🧘🏻 Stress Level Insights:</h4>
            <p>${stressMessage}</p>

            <h4>💤 Sleep Analysis:</h4>
            <p>${sleepMessage}</p>

            <h4>🤔 Mood Reflection:</h4>
            <p>${moodMessage}</p>

            <p><strong>✨ Keep going! Every small step matters for your well-being.</strong></p>
        `;

        popup.style.display = "block";

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to save entries.");
            submitBtn.disabled = false;
            return;
        }

        const url = "http://127.0.0.1:3000/api/entries";
        const entryData = {
            entry_date: entryDate,
            mood,
            energy_level: energyLevel,
            stress_level: stressLevel,
            sleep_hours: sleepHours,
            notes,
            goals
        };

        const response = await fetchData(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entryData)
        });

        if (response.error) {
            console.error("Error saving diary entry!", response.error);
            alert("There was an error saving your diary entry.");
            submitBtn.disabled = false;
            return;
        }

        console.log("Diary entry saved successfully!");
        getEntries();
        submitBtn.disabled = false;
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
        form.reset();
    });
});

const getEntries = async () => {
    console.log("Fetching diary entries...");
    const diaryContainer = document.getElementById("diary");

    if (!diaryContainer) {
        console.error("Diary container not found!");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found! Redirecting to login...");
        //alert("You must be logged in to access this page.");
        //window.location.href = "";
        return;
    }

    const url = "http://127.0.0.1:3000/api/entries";
    const response = await fetchData(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.error) {
        console.error("Error fetching diary data!", response.error);
        return;
    }

    

    diaryContainer.innerHTML = "";

    response.forEach((entry) => {
        const formattedDate = new Date(entry.entry_date).toLocaleDateString("fi-FI");
        
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Mood:</strong> ${entry.mood}</p>
        <p><strong>Energy Level:</strong> ${entry.energy_level}</p>
        <p><strong>Stress Level:</strong> ${entry.stress_level}</p>
        <p><strong>Sleep:</strong> ${entry.sleep_hours} hours</p>
        <p><strong>Notes:</strong> ${entry.notes}</p>
        <p><strong>Goals:</strong> ${entry.goals}</p>
        <button class="delete-btn" data-id="${entry._id}"> Delete</button>
        `;
        diaryContainer.appendChild(card);
    });
};

export { getEntries };
