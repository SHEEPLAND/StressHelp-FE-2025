import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  //if (!token) {
  //  alert("Kirjaudu sisään nähdäksesi tietosi.");
  //  return;
  //}

  try {
    const url = "http://127.0.0.1:3000/api/entries";
    const response = await fetchData(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let entries = [];

    if (Array.isArray(response)) {
      entries = response;
    } else if (Array.isArray(response.entries)) {
      entries = response.entries;
    } else if (Array.isArray(response.data)) {
      entries = response.data;
    }

    if (entries.length === 0) return;

    entries.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
    const latest = entries[0];

    updateLatestTable(latest);
  } catch (error) {
    console.error("Virhe haettaessa merkintöjä:", error);
  }
});

function updateLatestTable(entry) {
  const latestDate = document.getElementById("latest-date");
  const latestHRV = document.getElementById("latest-hrv");
  const latestStress = document.getElementById("latest-stress");
  const latestNote = document.getElementById("latest-note");

  if (!entry || !latestDate || !latestHRV || !latestStress || !latestNote) return;

  latestDate.textContent = formatDate(entry.entry_date);
  latestHRV.textContent = entry.hrv_value ?? "-";
  latestStress.textContent = entry.stress_level ?? "-";
  latestNote.textContent = entry.notes || "-";

  
  latestStress.className = ""; // Reset
  if (entry.stress_level >= 8) {
    latestStress.classList.add("stress-high");
  } else if (entry.stress_level >= 4) {
    latestStress.classList.add("stress-medium");
  } else {
    latestStress.classList.add("stress-low");
  }

function formatDate(isoString) {
  const date = new Date(isoString);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
}
}

