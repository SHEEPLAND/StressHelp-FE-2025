import { fetchData } from "./fetch.js";
import { getEntries, diaryEntries, renderCalendar } from "./calender.js";


document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("entry_date");
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

        const entryDate = document.getElementById("entry_date").value;
        const mood = document.getElementById("mood").value.toLowerCase();
        const energyLevel = document.getElementById("energy_level").value;
        const stressLevel = parseInt(document.getElementById("stress_level").value);
        const sleepHours = parseInt(document.getElementById("sleep_hours").value);
        const notes = document.getElementById("notes").value;
        const goals = document.getElementById("goals").value;

        if (!entryDate || isNaN(stressLevel) || isNaN(sleepHours)) {
            alert("Please fill out all required fields.");
            submitBtn.disabled = false;
            return;
        }

        // Mood, Stress, and Sleep Analysis
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
            sleepMessage = "Your sleep could be better. Aim for at least 7 hours.";
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
                    empowered: "You're feeling empowered! Keep pushing forward!",
                    stressed: "Feeling stressed? Take deep breaths and give yourself a break.",
                    down: "It's okay to have bad days. You're not alone. Reach out to someone who cares.",
                    meh: "Maybe today feels slow, but tomorrow is a new opportunity!",
                    angry: "Feeling angry or frustrated? Try breathing or take a walk.",
                    confused: "Feeling uncertain? It's okay. Things will become clearer."
                }[key];
                break;
            }
        }

        if (!moodMessage) {
            moodMessage = "Thanks for sharing your mood! Every feeling is valid.";
        }

        
        const entryData = {
            entry_date: entryDate,
            mood,
            energy_level: energyLevel,
            stress_level: stressLevel,
            sleep_hours: sleepHours,
            notes,
            goals
        };

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in.");
            submitBtn.disabled = false;
            return;
        }

        const url = "http://127.0.0.1:3000/api/entries";
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

        
        diaryEntries.push({
            entry_date: entryDate,
            mood,
            energy_level: energyLevel,
            stress_level: stressLevel,
            sleep_hours: sleepHours,
            notes,
            goals
        });
        renderCalendar();

        submitBtn.disabled = false;

        // Popup summary 
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

        categoryText.textContent = `Stress Category: ${stressCategory}`;
        analysisText.innerHTML = `
            <h4>🧘 Stress Insights:</h4>
            <p>${stressMessage}</p>
            <h4>💤 Sleep Insights:</h4>
            <p>${sleepMessage}</p>
            <h4>🤔 Mood Reflection:</h4>
            <p>${moodMessage}</p>
            <p><strong>✨ Keep going! Small steps lead to big changes.</strong></p>
        `;

        popup.style.display = "block";

        form.reset();
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });
});
