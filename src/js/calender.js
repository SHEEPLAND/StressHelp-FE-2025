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

function formatDateOnly(dateString) {
    const d = new Date(dateString);
    return d.toISOString().split('T')[0];
}

function hasEntryForDate(dateStr) {
    return diaryEntries.some(entry => formatDateOnly(entry.entry_date) === dateStr);
}

async function getEntries() {
    console.log("Fetching diary entries...");

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to access diary.");
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

    if (Array.isArray(response)) {
        diaryEntries = response;
    } else if (Array.isArray(response.entries)) {
        diaryEntries = response.entries;
    } else if (Array.isArray(response.data)) {
        diaryEntries = response.data;
    } else {
        console.error("Unexpected diary data format", response);
    }

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
        const hasEntry = hasEntryForDate(fullDate);

        function getDotHTML(dateStr) {
          const entries = diaryEntries.filter(entry => formatDateOnly(entry.entry_date) === dateStr);
      
          if (entries.length === 0) return "";
      
          
          const highestStress = Math.max(...entries.map(e => e.stress_level ?? 0));
          const moods = entries.map(e => e.mood.toLowerCase());
      
          if (highestStress >= 8) {
              return '<div class="dot red"></div>';
          } else if (highestStress >= 4) {
              return '<div class="dot yellow"></div>';
          } else if (moods.some(m => ["happy", "joyful", "relaxed", "content"].includes(m))) {
              return '<div class="dot green"></div>';
          }

          
      }
      

        calendarDates.innerHTML += `
            <div class="calendar-date ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${fullDate}">
                ${i}
                ${getDotHTML(fullDate)}
            </div>`;
    }

    const todayEl = document.querySelector(".calendar-date.today");
    if (todayEl) {
        todayEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

calendarDates.addEventListener("click", (e) => {
    if (e.target.classList.contains("calendar-date") || e.target.closest('.calendar-date')) {
        const dateElement = e.target.closest('.calendar-date');
        const selectedDate = dateElement.getAttribute("data-date");

        if (dateInput) {
            dateInput.value = selectedDate;
        }

        document.querySelectorAll(".calendar-date").forEach(el => el.classList.remove("selected"));
        dateElement.classList.add("selected");

        popupDate.textContent = selectedDate;
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
                  <button class="modify-entry" data-id="${entry.id}">✏️ Muokkaa</button>
                  <button class="delete-entry" data-id="${entry.id}">🗑️ Poista</button>
                </div>
              </div>
            `;
          
            historyContent.appendChild(card);
          });
          
        }

        historyPopup.style.display = "block";
    }
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

getEntries(); 

export { getEntries, diaryEntries, renderCalendar };

