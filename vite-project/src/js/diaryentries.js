import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("entry_date");

   
    if (dateInput) {
        dateInput.addEventListener("focus", function () {
            this.setAttribute("type", "date");
        });
    }

    getEntries(); // Fetch diary entries when the page loads

    // Form submission logic with popup
    const form = document.querySelector(".diaryForm");
    const popup = document.getElementById("popup");
    const diaryPopup = document.querySelector(".diary-popup");
    const categoryText = document.getElementById("category");
    const analysisText = document.getElementById("analysis");
    const closeBtn = document.getElementById("close-popup");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get values from form inputs
        let entryDate = document.getElementById("entry_date").value;
        let mood = document.getElementById("mood").value.toLowerCase();
        let energyLevel = document.getElementById("energy_level").value;
        let stressLevel = parseInt(document.getElementById("stress_level").value);
        let sleepHours = parseInt(document.getElementById("sleep_hours").value);
        let notes = document.getElementById("notes").value;
        let goals = document.getElementById("goals").value;

        // Check if required fields are filled
        if (!entryDate || isNaN(stressLevel) || isNaN(sleepHours)) {
            alert("Please fill out all required fields before saving.");
            return;
        }

        // Categorize stress levels
        let stressCategory = "";
        let stressMessage = "";


        if (stressLevel >= 8) {
            stressCategory = "High Stress";
            const highStressTips = [
                "Try deep breathing.",
                "Listen to calming music.",
                "Step outside for fresh air.",
                "Write down your thoughts.",
            ];
            const randomTip = highStressTips[Math.floor(Math.random() * highStressTips.length)];
            stressMessage = `Your stress level is high. ${randomTip}`;
        } else if (stressLevel >= 4) {
            stressCategory = "Moderate Stress";
            stressMessage = "Your stress level is moderate. Take breaks & practice self-care.";
        } else {
            stressCategory = "Normal Stress";
            stressMessage = "You're managing stress well!";
        }
    

        // Provide sleep recommendations
        let sleepMessage = "";
        if (sleepHours < 4) {
            sleepMessage = "Too little sleep! Improve your habits.";
        } else if (sleepHours < 7) {
            sleepMessage = "Your sleep could be better. Aim for at least 7 hours for better energy levels.";
        } else {
            sleepMessage = "Great job! Your sleep duration is healthy.";
        }

        
       // Assign messages based on mood
        let moodMessage = "";
        if (["happy", "joyful", "excited"].some(m => mood.includes(m))) {
            moodMessage = "It's great to see you feeling positive!";
        } else if (["calm", "relaxed", "content"].some(m => mood.includes(m))) {
            moodMessage = "You're feeling peaceful today, that's wonderful!";
        } else if (["motivated", "proud", "grateful", "hopeful"].some(m => mood.includes(m))) {
            moodMessage = "You're feeling empowered! Keep pushing forward and achieving great things!";
        } else if (["stressed", "anxious", "worried", "overwhelmed"].some(m => mood.includes(m))) {
            moodMessage = "Feeling stressed? Take deep breaths and give yourself a break.";
        } else if (["depressed", "sad", "lonely", "disappointed"].some(m => mood.includes(m))) {
            moodMessage = "It's okay to have bad days. You are not alone. Reach out to someone who cares.";
        } else if (["tired", "bored", "indifferent"].some(m => mood.includes(m))) {
            moodMessage = "Maybe today feels slow, but tomorrow is a new opportunity! Take care of yourself.";
        } else if (["angry", "frustrated"].some(m => mood.includes(m))) {
            moodMessage = "Feeling angry or frustrated? Try a deep breath or stepping away for a moment. You're stronger than this! 💪";
        } else if (["confused", "nostalgic", "shy"].some(m => mood.includes(m))) {
            moodMessage = "Feeling uncertain? It's okay. Take your time to reflect, and things will get clearer.";
        } else {
            moodMessage = "Thanks for sharing your mood! Remember, every feeling is valid. Keep taking care of yourself. 🌟";
        }

        // Display diary entry summary in the popup
        diaryPopup.innerHTML = `
            <h3>Diary Entry Summary</h3>
            <p><strong>Date:</strong> ${entryDate}</p>
            <p><strong>Mood:</strong> ${mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
            <p><strong>Energy Level:</strong> ${energyLevel ? energyLevel : "Not provided"}</p>
            <p><strong>Stress Level:</strong> ${stressLevel} (${stressCategory})</p>
            <p><strong>Sleep Hours:</strong> ${sleepHours}</p>
            <p><strong>Notes:</strong> ${notes ? notes : "No notes added."}</p>
            <p><strong>Goals:</strong> ${goals ? goals : "No goals added."}</p>
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

        // Show the popup
        popup.style.display = "block";

        // Store entry in backend
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to save entries.");
            return;
        }

        const url = "http://127.0.0.1:3000/api/entries"; // API endpoint
        const entryData = {
            entry_date: entryDate,
            mood: mood,
            energy_level: energyLevel,
            stress_level: stressLevel,
            sleep_hours: sleepHours,
            notes: notes,
            goals: goals,
        };

        const response = await fetchData(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entryData),
        });

        if (response.error) {
            console.error("Error saving diary entry!", response.error);
            alert("There was an error saving your diary entry.");
            return;
        }

        console.log("Diary entry saved successfully!");

        // Refresh diary entries
        getEntries();
    });

    // Close popup event
    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
        form.reset(); // Reset the form after closing the popup
    });
});

// Fetch existing diary entries
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
        alert("You must be logged in to access this page.");
        window.location.href = "login.html";
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
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <p><strong>Date:</strong> ${entry.entry_date}</p>
            <p><strong>Mood:</strong> ${entry.mood}</p>
            <p><strong>Energy Level:</strong> ${entry.energy_level}</p>
            <p><strong>Stress Level:</strong> ${entry.stress_level}</p>
            <p><strong>Sleep:</strong> ${entry.sleep_hours} hours</p>
            <p><strong>Notes:</strong> ${entry.notes}</p>
            <p><strong>Goals:</strong> ${entry.goals}</p>
        `;
        diaryContainer.appendChild(card);
    });
};

export { getEntries };
