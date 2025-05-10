import { fetchData } from "./fetch.js";

// Get elements from the DOM
const dateInput = document.getElementById("entry_date");
const monthYear = document.getElementById("month-year");
const calendarDates = document.getElementById("calendar-dates");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

const historyPopup = document.getElementById("history-popup");
const historyContent = document.getElementById("history-popup-content");
const popupDate = document.getElementById("popup-date");
const closeHistoryPopup = document.getElementById("close-history-popup");
const jumpToTodayBtn = document.getElementById("jump-to-today");


const selectedMonthEl = document.getElementById("selected-month");
const selectedYearEl = document.getElementById("selected-year");

let diaryEntries = [];
let date = new Date();

getEntries();

const monthNames = [
  "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
  "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
];

// Function to open year selector
function openMonthSelector() {
  const month = prompt("Valitse kuukausi (1–12):");
  const num = parseInt(month);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    date.setMonth(num - 1);
    renderCalendar();
  }
}

function openYearSelector() {
  const year = prompt("Valitse vuosi (esim. 2025):");
  const num = parseInt(year);
  if (!isNaN(num)) {
    date.setFullYear(num);
    renderCalendar();
  }
}

if (selectedMonthEl) selectedMonthEl.addEventListener("click", openMonthSelector);
if (selectedYearEl) selectedYearEl.addEventListener("click", openYearSelector);

// Function to format date string to YYYY-MM-DD
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

// Fetches diary entries
async function getEntries() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Kirjaudu sisään.");
    window.location.href = "login.html";
    return;
  }

  const url = "https://stress-help.northeurope.cloudapp.azure.com/api/entries";
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

// Renders the calendar
function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
  const today = new Date();
  const offset = (firstDay + 6) % 7;

  calendarDates.innerHTML = "";

  if (selectedMonthEl) selectedMonthEl.textContent = monthNames[month];
  if (selectedYearEl) selectedYearEl.textContent = year;

  for (let i = offset; i > 0; i--) {
    calendarDates.innerHTML += `<div class="calendar-date" style="opacity: 0.4">${prevLastDate - i + 1}</div>`;

  }

  for (let i = 1; i <= lastDate; i++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const isToday =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const isSelected = dateInput && dateInput.value === fullDate;


    // Function to get dot HTML based on stress level
    function getDotHTML(dateStr) {
      const entries = diaryEntries.filter(entry => formatDateOnly(entry.entry_date) === dateStr);
      if (entries.length === 0) return "";

      const highestStress = Math.max(...entries.map(e => e.stress_level ?? 0));
      if (highestStress >= 8) return '<div class="dot red"></div>';
      if (highestStress >= 4) return '<div class="dot yellow"></div>';
      return '<div class="dot green"></div>';
    }

    let liveTimeHTML = isToday
      ? '<div id="live-time" style="font-size: 0.6rem; font-weight: bold; margin-top: 4px;"></div>'
      : '';

      calendarDates.innerHTML += `
      <div class="calendar-date ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${fullDate}">
        <div class="date-number">${i}</div>
        ${getDotHTML(fullDate)}
        ${liveTimeHTML}
      </div>`;
    
  }

  const todayEl = document.querySelector(".calendar-date.today");
  if (todayEl) todayEl.scrollIntoView({ behavior: "smooth", block: "center" });
}


// Event listener to each date in the calendar
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

      let stressCategory = "Ei tietoa";
      if (typeof entry.stress_level === "number") {
        if (entry.stress_level >= 8) {
          stressCategory = "Korkea stressi";
        } else if (entry.stress_level >= 4) {
          stressCategory = "Kohtalainen stressi";
        } else {
          stressCategory = "Normaali stressi";
        }
      }

      card.innerHTML = `
        <div class="popup-entry">
          <h4>Mieliala: ${entry.mood || "Ei ilmoitettu"}</h4>
          <p><strong>Energiataso:</strong> ${entry.energy_level ?? "Ei tietoa"}</p>
          <p><strong>Stressitaso:</strong> ${stressCategory}</p>
          <p><strong>Uni (tunnit):</strong> ${entry.sleep_hours ?? "Ei tietoa"}</p>
          <p><strong>Muistiinpanot:</strong> ${entry.notes || "Ei muistiinpanoja."}</p>
          <p><strong>Tavoitteet:</strong> ${entry.goals || "Ei tavoitteita."}</p>

          <div class="popup-buttons">
            <button class="modify-entry" data-id="${entry.entry_id}">✏️ Muokkaa</button>
            <button class="delete-entry" data-id="${entry.entry_id}">🗑️ Poista</button>
          </div>
        </div>`;

      card.querySelector(".delete-entry").addEventListener("click", async (e) => {
        const entryId = e.currentTarget.dataset.id;
        const token = localStorage.getItem("token");

        if (!token) return alert("Kirjaudu sisään.");
        if (!confirm("Poistetaanko merkintä?")) return;

        const res = await fetch(`https://stress-help.northeurope.cloudapp.azure.com/api/entries/${entryId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          alert("Poistettu.");
          await getEntries();
          renderCalendar();
          dateElement.dispatchEvent(new Event("click"));
        } else {
          alert("Poistaminen epäonnistui.");
        }
      });

      card.querySelector(".modify-entry").addEventListener("click", async () => {
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

function updateLiveTime() {
  const timeEl = document.getElementById("calendar-clock");
  if (timeEl) {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
}

// Updates the date in the today section
function updateTodaySection() {
  const timeEl = document.getElementById("today-clock");
  const dateEl = document.getElementById("today-date");
  if (timeEl && dateEl) {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    dateEl.textContent = now.toLocaleDateString("fi-FI", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
}

setInterval(() => {
  updateLiveTime();
  updateTodaySection();
}, 1000);

updateLiveTime();
updateTodaySection();

if (jumpToTodayBtn) {
  jumpToTodayBtn.addEventListener("click", () => {
    date = new Date();


    if (dateInput) dateInput.value = "";

    document.querySelectorAll(".calendar-date.selected").forEach(el => {
      el.classList.remove("selected");
    });

    renderCalendar(); 
  });
}

  

export { getEntries, diaryEntries, renderCalendar };


