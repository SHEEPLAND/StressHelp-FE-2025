import { fetchData } from "./fetch.js";

const dateInput = document.getElementById("entry_date");
const monthYear = document.getElementById("month-year");
const calendarDates = document.getElementById("calendar-dates");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

const historyPopup = document.getElementById("history-popup");
const historyContent = document.getElementById("history-popup-content");
const popupDate = document.getElementById("popup-date");
const closeHistoryPopup = document.getElementById("close-history-popup");

let diaryEntries = [];
let date = new Date();
getEntries();

function formatDateOnly(dateString) {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function hasEntryForDate(dateStr) {
    return diaryEntries.some(entry => formatDateOnly(entry.entry_date) === dateStr);
}

async function getEntries() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Kirjaudu sisään.");
        window.location.href = "login.html";
        return;
    }

    const url = "http://4.231.239.48/api/entries";
    const response = await fetchData(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.error) {
        console.error("Virhe haettaessa tietoja!", response.error);
        return;
    }

    diaryEntries = Array.isArray(response) ? response :
                   Array.isArray(response.entries) ? response.entries :
                   Array.isArray(response.data) ? response.data : [];

    diaryEntries.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
    renderCalendar();
}

function renderCalendar() {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const today = new Date();
    const offset = (firstDay + 6) % 7;

    calendarDates.innerHTML = "";

    const monthNames = [
        "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
        "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
    ];
    monthYear.innerText = `${monthNames[month]} ${year}`;

    for (let i = offset; i > 0; i--) {
        calendarDates.innerHTML += `<div style="opacity: 0.4">${prevLastDate - i + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const isToday =
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
        const isSelected = dateInput && dateInput.value === fullDate;

        function getDotHTML(dateStr) {
            const entries = diaryEntries.filter(entry => formatDateOnly(entry.entry_date) === dateStr);
            if (entries.length === 0) return "";

            const highestStress = Math.max(...entries.map(e => e.stress_level ?? 0));
            const moods = entries.map(e => e.mood?.toLowerCase());

            if (highestStress >= 8) return '<div class="dot red"></div>';
            if (highestStress >= 4) return '<div class="dot yellow"></div>';
            else return '<div class="dot green"></div>';
        }

        calendarDates.innerHTML += `
            <div class="calendar-date ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${fullDate}">
                ${i}
                ${getDotHTML(fullDate)}
            </div>`;
    }

    const todayEl = document.querySelector(".calendar-date.today");
    if (todayEl) todayEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

calendarDates.addEventListener("click", (e) => {
    const dateElement = e.target.closest('.calendar-date');
    if (!dateElement) return;

    const selectedDate = dateElement.getAttribute("data-date");

    if (dateInput) dateInput.value = selectedDate;

    document.querySelectorAll(".calendar-date").forEach(el => el.classList.remove("selected"));
    dateElement.classList.add("selected");

    const formattedPopupDate = new Date(selectedDate).toLocaleDateString("fi-FI");
    popupDate.textContent = formattedPopupDate;

    historyContent.innerHTML = "";

    const entriesForDate = diaryEntries.filter(entry => formatDateOnly(entry.entry_date) === selectedDate);

    if (entriesForDate.length === 0) {
        historyContent.innerHTML = "<p>Ei merkintöjä tälle päivälle.</p>";
    } else {
        entriesForDate.forEach(entry => {
            const card = document.createElement("div");
            card.className = "popup-entry-card";

            card.innerHTML = `
                <div class="popup-entry">
                    <h4>Mieliala: ${entry.mood || "Ei ilmoitettu"}</h4>
                    <p><strong>Energiataso:</strong> ${entry.energy_level ?? "Ei tietoa"}</p>
                    <p><strong>Stressitaso:</strong> ${entry.stress_level ?? "Ei tietoa"}</p>
                    <p><strong>Uni (tunnit):</strong> ${entry.sleep_hours ?? "Ei tietoa"}</p>
                    <p><strong>Muistiinpanot:</strong> ${entry.notes || "Ei muistiinpanoja."}</p>
                    <p><strong>Tavoitteet:</strong> ${entry.goals || "Ei tavoitteita."}</p>
                    <div class="popup-buttons">
                        <button class="modify-entry" data-id="${entry.entry_id}">✏️ Muokkaa</button>
                        <button class="delete-entry" data-id="${entry.entry_id}">🗑️ Poista</button>
                    </div>
                </div>
            `;

            const deleteBtn = card.querySelector(".delete-entry");
            deleteBtn.addEventListener("click", async (e) => {
                const entryId = e.currentTarget.dataset.id;
                const token = localStorage.getItem("token");

                if (!token) return alert("Kirjaudu sisään.");
                if (!confirm("Poistetaanko merkintä?")) return;

                const res = await fetch(`http://4.231.239.48/api/entries/${entryId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    alert("Poistettu.");
                    await getEntries();
                    renderCalendar();

                    // Päivitä historia-popup uudelleen
                    dateElement.dispatchEvent(new Event("click"));
                } else {
                    alert("Poistaminen epäonnistui.");
                }
            });

            const editBtn = card.querySelector(".modify-entry");
            editBtn.addEventListener("click", async () => {
                document.getElementById("entry_id").value = entry.entry_id;
                document.getElementById("entry_date").value = formatDateOnly(entry.entry_date);
                document.getElementById("mood").value = entry.mood || "";
                document.getElementById("energy_level").value = entry.energy_level ?? "";
                document.getElementById("stress_level").value = entry.stress_level ?? "";
                document.getElementById("sleep_hours").value = entry.sleep_hours ?? "";
                document.getElementById("notes").value = entry.notes || "";
                document.getElementById("goals").value = entry.goals || "";

                historyPopup.style.display = "none";
                window.scrollTo({ top: 0, behavior: "smooth" });

                
                await getEntries();
                renderCalendar();
            });

            historyContent.appendChild(card);
        });
    }

    historyPopup.style.display = "block";
});

closeHistoryPopup.addEventListener("click", () => {
    historyPopup.style.display = "none";
});

prevBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

export { getEntries, diaryEntries, renderCalendar };
