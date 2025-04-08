document.addEventListener("DOMContentLoaded", () => {
  // Grab all required elements from the DOM
  const startBtn = document.getElementById('start-measurement');
  const popup = document.getElementById('measurementPopup');
  const popupMeasurement = document.getElementById('popup-measurement');
  const progressCircle = document.querySelector('.progress-ring-progress');
  const label = document.getElementById('label');
  const bpmDisplay = document.getElementById('bpm');
  const countdown = document.getElementById('countdown');
  const cancelBtn = document.getElementById('cancelBtn');
  const doneText = document.getElementById('doneText');
  const resultBtn = document.getElementById('show-results');

  // Progress ring setup
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  let timer, elapsed = 0, duration = 0;
  let chart = null;

  // Format time as mm:ss
  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Update the progress circle visually
  function updateProgress(elapsed, total) {
    const offset = circumference - (elapsed / total) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  // Simulate getting a random BPM
  function getRandomBPM() {
    return Math.floor(Math.random() * 40 + 50); // Range: 50-89
  }

  // Starts either "relax" or "measure" countdown
  function startCountdown(totalSeconds, mode) {
    clearInterval(timer);
    duration = totalSeconds;
    elapsed = 0;

    label.textContent = mode === "relax" ? "Rentoutumisjakso" : "Mittaus käynnissä";
    bpmDisplay.textContent = mode === "relax" ? "00" : getRandomBPM();
    countdown.textContent = formatTime(totalSeconds);
    doneText.style.display = "none";
    resultBtn.style.display = "none";
    updateProgress(0, totalSeconds);

    // Start timer
    timer = setInterval(() => {
      elapsed++;
      countdown.textContent = formatTime(duration - elapsed);
      updateProgress(elapsed, duration);

      if (mode === "measure") {
        bpmDisplay.textContent = getRandomBPM();
      }

      // Countdown finished
      if (elapsed >= duration) {
        clearInterval(timer);

        if (mode === "relax") {
          // Start measurement after relaxing
          startCountdown(5, "measure");
        } else {
          // End of measurement
          bpmDisplay.textContent = "--";
          label.textContent = "";
          countdown.textContent = "00:00";
          doneText.style.display = "block";
          resultBtn.style.display = "inline-block";
        }
      }
    }, 1000);
  }

  // Fill in stat cards with random results
  function updateStatCards(data) {
    document.getElementById("readiness-value").textContent = `${data.readiness}%`;
    document.getElementById("stress-value").textContent = data.stress;
    document.getElementById("pns-value").textContent = data.pns;
    document.getElementById("bpm-value").textContent = `${data.bpm} bpm`;
  }

  // Draw or update the result chart
  function updateChart(data) {
    const ctx = document.getElementById("resultsChart").getContext("2d");
    const chartData = [data.readiness, data.stress, data.pns, data.bpm];
    const labels = ["Readiness %", "Stress Index", "PNS Index", "Average BPM"];

    // Get CSS variables for chart colors
    const styles = getComputedStyle(document.documentElement);
    const chartColors = [
      styles.getPropertyValue('--chart-readiness').trim(),
      styles.getPropertyValue('--chart-stress').trim(),
      styles.getPropertyValue('--chart-pns').trim(),
      styles.getPropertyValue('--chart-bpm').trim()
    ];

    if (chart) {
      chart.data.datasets[0].data = chartData;
      chart.update();
    } else {
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Latest Measurement',
            data: chartData,
            backgroundColor: chartColors,
            borderRadius: 10,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  // Start button event
  startBtn.addEventListener('click', () => {
    popup.style.display = "flex";
    popupMeasurement.style.display = "block";
    startCountdown(30, "relax"); // Start with relaxation phase
  });

  // Cancel button event
  cancelBtn.addEventListener('click', () => {
    clearInterval(timer);
    popup.style.display = "none";
    bpmDisplay.textContent = "00";
    label.textContent = "Peruutettu";
    countdown.textContent = "00:00";
    updateProgress(0, 1);
  });

  // Show results button event
  resultBtn.addEventListener('click', () => {
    popup.style.display = "none";

    // Generate mock data for results
    const resultData = {
      readiness: Math.floor(Math.random() * 40 + 60), // 60–99%
      stress: Math.floor(Math.random() * 50 + 25),    // 25–74
      pns: Math.floor(Math.random() * 50 + 50),       // 50–99
      bpm: Math.floor(Math.random() * 15 + 60)        // 60–74 bpm
    };

    updateStatCards(resultData);
    updateChart(resultData);

    // Scroll to the stats section smoothly
    document.getElementById('statistics').scrollIntoView({ behavior: 'smooth' });
  });
});
