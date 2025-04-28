document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("entry_date");
    const monthYear = document.getElementById("month-year");
    const calendarDates = document.getElementById("calendar-dates");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");
  
    if (dateInput && !dateInput.value) {
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0];
      dateInput.value = formattedToday;
    }
  
    let date = new Date();
  
    function renderCalendar() {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();
      const prevLastDate = new Date(year, month, 0).getDate();
      const today = new Date();
  
      // Adjust starting day for Monday 
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
  
        calendarDates.innerHTML += `
          <div class="calendar-date ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
               data-date="${fullDate}">
            ${i}
          </div>`;
      }
  
      const todayEl = document.querySelector(".calendar-date.today");
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  
    // Handles calendar date selection
    calendarDates.addEventListener("click", (e) => {
      if (e.target.classList.contains("calendar-date")) {
        const selectedDate = e.target.getAttribute("data-date");
  
        // Update the date input value
        if (dateInput) {
          dateInput.value = selectedDate;
        }
  
        // Highlights the selected date
        document.querySelectorAll(".calendar-date").forEach(el => el.classList.remove("selected"));
        e.target.classList.add("selected");
      }
    });
  
    prevBtn.addEventListener("click", () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
    });
  
    nextBtn.addEventListener("click", () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
    });
  
    renderCalendar();
  });

  