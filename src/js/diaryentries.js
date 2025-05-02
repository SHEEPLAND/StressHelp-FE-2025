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
            alert("Täytä kaikki vaaditut kentät.");
            submitBtn.disabled = false;
            return;
        }

        // Mieliala, Stressi ja Unianalyysi
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

        let sleepMessage = "";
        if (sleepHours < 4) {
            sleepMessage = "Liian vähän unta! Paranna tapojasi.";
        } else if (sleepHours < 7) {
            sleepMessage = "Unesi voisi olla parempi. Pyri nukkumaan vähintään 7 tuntia.";
        } else {
            sleepMessage = "Hienoa! Unesi kesto on terveellistä.";
        }

        let moodMessage = "";
        const moodMap = {
            positiivinen: ["onnellinen", "iloinen", "innoissaan"],
            rauhallinen: ["rauhallinen", "rentoutunut", "tyytyväinen"],
            voimaantunut: ["motivoitunut", "ylpeä", "kiitollinen", "toiveikas"],
            stressaantunut: ["stressaantunut", "ahdistunut", "huolestunut", "ylikuormittunut"],
            alakuloinen: ["masentunut", "surullinen", "yksinäinen", "pettynyt"],
            tylsä: ["väsynyt", "tylsistynyt", "välinpitämätön"],
            vihainen: ["vihaiset", "turhautunut"],
            hämmentynyt: ["hämmentynyt", "nostalginen", "ujo"]
        };

        for (let [key, list] of Object.entries(moodMap)) {
            if (list.some(m => mood.includes(m))) {
                moodMessage = {
                    positiivinen: "On hienoa nähdä, että tunnet itsesi positiiviseksi!",
                    rauhallinen: "Tänään tunnet olosi rauhalliseksi, se on upeaa!",
                    voimaantunut: "Tunnet itsesi voimaantuneeksi! Jatka samaan malliin!",
                    stressaantunut: "Tunnetko stressiä? Hengitä syvään ja pidä tauko.",
                    alakuloinen: "On ok, että joskus on huonoja päiviä. Et ole yksin, ota yhteyttä johonkin, joka välittää.",
                    tylsä: "Ehkä tänään on hitaampaa, mutta huominen tuo uuden mahdollisuuden!",
                    vihainen: "Tunnetko itsesi vihaiseksi tai turhautuneeksi? Kokeile hengittää syvään tai lähde kävelylle.",
                    hämmentynyt: "Tunnetko epävarmuutta? Se on ok, ajan kanssa asiat selkeytyvät."
                }[key];
                break;
            }
        }


        if (!moodMessage) {
            moodMessage = "Kiitos, että jaoit mielialasi! Kaikki tunteet ovat tärkeitä.";
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
            alert("Sinun täytyy olla kirjautuneena.");
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
            console.error("Virhe päiväkirjamerkinnän tallentamisessa!", response.error);
            alert("Päiväkirjamerkintää ei voitu tallentaa.");
            submitBtn.disabled = false;
            return;
        }

        console.log("Päiväkirjamerkintä tallennettu onnistuneesti!");

        // Tarkistetaan, että API palauttaa entry_id ja lisätään se diaryEntries-taulukkoon
        console.log("API-vastaus:", response);
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

        renderCalendar();
        submitBtn.disabled = false;

        // Popupin yhteenveto
        diaryPopup.innerHTML = `
        <h3>Päiväkirjamerkinnän yhteenveto</h3>
        <p><strong>Päivämäärä:</strong> ${new Date(entryDate).toLocaleDateString("fi-FI")}</p>
        <p><strong>Mieliala:</strong> ${mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
        <p><strong>Energiataso:</strong> ${energyLevel || "Ei annettu"}</p>
        <p><strong>Stressitaso:</strong> ${stressLevel} (${stressCategory})</p>
        <p><strong>Uni:</strong> ${sleepHours} tuntia</p>
        <p><strong>Muistiinpanoja:</strong> ${notes || "Ei merkintöjä lisätty."}</p>
        <p><strong>Tavoitteet:</strong> ${goals || "Ei tavoitteita lisätty."}</p>
        `;

        categoryText.textContent = `${stressCategory}`;
        analysisText.innerHTML = `
            <h4>🧘 Stressi-analyysi:</h4>
            <p>${stressMessage}</p>
            <h4>💤 Unianalyysi:</h4>
            <p>${sleepMessage}</p>
            <h4>🤔 Mielialan pohdinta:</h4>
            <p>${moodMessage}</p>
            <p><strong>✨ Jatka eteenpäin! Pienet askeleet vievät suuriin muutoksiin.</strong></p>
        `;

        popup.style.display = "block";
        form.reset();
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });
});