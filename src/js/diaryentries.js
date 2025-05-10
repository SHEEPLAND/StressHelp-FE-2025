import { fetchData } from "./fetch.js";
import { getEntries, diaryEntries, renderCalendar } from "./calender.js";

// Handles the diary form submission: creates or updates an entry
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

        const entryId = document.getElementById("entry_id").value;
        const method = entryId ? "PUT" : "POST";
        const url = entryId
            ? `https://stress-help.northeurope.cloudapp.azure.com/api/entries/${entryId}`
            : "https://stress-help.northeurope.cloudapp.azure.com/api/entries";

        const entryDate = document.getElementById("entry_date").value;
        const mood = document.getElementById("mood").value.toLowerCase();
        const energyLevel = document.getElementById("energy_level").value;
        const stressLevel = parseInt(document.getElementById("stress_level").value);
        const sleepHours = parseInt(document.getElementById("sleep_hours").value);
        const notes = document.getElementById("notes").value;
        const goals = document.getElementById("goals").value;

        if (!entryDate || isNaN(stressLevel) || isNaN(sleepHours)) {
            alert("Täytä kaikki vaaditut kentät.");
            submitBtn.disabled = false;
            return;
        }

// Determine stress category and message based on stress level
        let stressCategory = "";
        let stressMessage = "";

        if (stressLevel >= 8) {
            stressCategory = "Korkea stressi";
            const tips = ["Kokeile syvähengitystä.", "Kuuntele rauhoittavaa musiikkia.", "Mene ulos raikkaaseen ilmaan.", "Kirjoita ajatuksiasi ylös."];
            stressMessage = `Stressitasosi on korkea. ${tips[Math.floor(Math.random() * tips.length)]}`;
        } else if (stressLevel >= 4) {
            stressCategory = "Kohtalainen stressi";
            stressMessage = "Stressitasosi on kohtalainen. Pidä taukoja ja huolehdi itsestäsi.";
        } else {
            stressCategory = "Normaali stressi";
            stressMessage = "Hallitset stressiä hyvin!";
        }

 // Determine sleep message based on sleep hours
        let sleepMessage = "";
        if (sleepHours < 4) {
            sleepMessage = "Liian vähän unta! Paranna tapojasi.";
        } else if (sleepHours < 7) {
            sleepMessage = "Unesi voisi olla parempi. Pyri nukkumaan vähintään 7 tuntia.";
        } else {
            sleepMessage = "Hienoa! Unesi kesto on terveellistä.";
        }

        let moodMessage = "Kiitos, että jaoit mielialasi!";

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
            alert("Sinun täytyy olla kirjautuneena.");
            submitBtn.disabled = false;
            return;
        }

        const response = await fetchData(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entryData)
        });

        if (response.error) {
            console.error("Virhe päiväkirjamerkinnän tallentamisessa!", response.error);
            alert("Päiväkirjamerkintää ei voitu tallentaa.");
            submitBtn.disabled = false;
            return;
        }

        console.log("Päiväkirjamerkintä tallennettu onnistuneesti!");
        console.log("API-vastaus:", response);

        if (!entryId) {
            diaryEntries.push({
                entry_id: response.entry_id,
                entry_date: entryDate,
                mood,
                energy_level: energyLevel,
                stress_level: stressLevel,
                sleep_hours: sleepHours,
                notes,
                goals
            });
        }

        renderCalendar();
        submitBtn.disabled = false;

// Show the popup with the entry details
        diaryPopup.innerHTML = `
        <p><strong>Päivämäärä:</strong> ${new Date(entryDate).toLocaleDateString("fi-FI")}</p>
        <p><strong>Mieliala:</strong> ${mood}</p>
        <p><strong>Energia:</strong> ${energyLevel}/10</p>
        <p><strong>Stressi:</strong> ${stressLevel}/10 (${stressCategory})</p>
        <p><strong>Uni:</strong> ${sleepHours}h</p>
        ${notes ? `<p><strong>Muistiinpanot:</strong> ${notes}</p>` : ""}
        ${goals ? `<p><strong>Tavoitteet:</strong> ${goals}</p>` : ""}
      `;
      
// Show the analysis based on the stress level and sleep hours
      analysisText.innerHTML = `
      <h4 class="analysis-title">Mitä tämä tarkoittaa?</h4>
      <div class="analysis-body">
        <p>🧘🏻 <strong>Stressi:</strong> ${stressMessage}</p>
        <p>💤 <strong>Uni:</strong> ${sleepMessage}</p>
        <p>🤔 <strong>Mieliala:</strong> ${moodMessage}</p>
        <p class="encouragement">Jatka eteenpäin! Pienet askeleet vievät suuriin muutoksiin 🫶🏻</p>
      </div>
    `;
        popup.style.display = "block";

        await getEntries();
        renderCalendar();

        form.reset();
        document.getElementById("entry_id").value = "";
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });
});

