import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log("Ei löytynyt voimassa olevaa tokenia.");
    return;
  }

  const url = "https://stress-help.northeurope.cloudapp.azure.com/api/entries";
  const options = {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  };

  const data = await fetchData(url, options);

  if (data.error) {
    console.log(data.error);
    return;
  }

  if (!data.length) {
    console.log("Ei päiväkirjamerkintöjä löytynyt.");
    return;
  }

  const latest = data.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))[0];

  // Päivitetään HTML-elementit
  document.getElementById("latest-date").textContent = formatDate(latest.entry_date);
  document.getElementById("latest-stress").textContent = latest.stress_level || "-";
  document.getElementById("latest-notes").textContent = latest.notes || "-";
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("fi-FI");
}