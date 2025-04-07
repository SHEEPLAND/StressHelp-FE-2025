document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById('start-measurement');
  const popup = document.getElementById('measurementPopup');
  const progressCircle = document.querySelector('.progress-ring-progress');
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const label = document.getElementById('label');
  const bpmDisplay = document.getElementById('bpm');
  const countdown = document.getElementById('countdown');
  const cancelBtn = document.getElementById('cancelBtn');
  const doneText = document.getElementById('doneText');
  const resultBtn = document.getElementById('show-results');

  const popupMeasurement = document.getElementById('popup-measurement');
  const popupResults = document.getElementById('popup-results');
  const closePopup = document.getElementById('close-popup');

  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  let timer, duration, elapsed = 0;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function updateProgress(elapsed, total) {
    const offset = circumference - (elapsed / total) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function getRandomBPM() {
    return Math.floor(Math.random() * 40 + 50);
  }

  function startCountdown(totalSeconds, mode) {
    duration = totalSeconds;
    elapsed = 0;
    clearInterval(timer);

    label.textContent = mode === "relax" ? "Rentoutumisjakso" : "Mittaus käynnissä";
    countdown.textContent = formatTime(totalSeconds);
    bpmDisplay.textContent = mode === "relax" ? "00" : getRandomBPM();
    doneText.style.display = "none";
    resultBtn.style.display = "none";
    updateProgress(0, totalSeconds);

    timer = setInterval(() => {
      elapsed++;
      countdown.textContent = formatTime(duration - elapsed);
      updateProgress(elapsed, duration);
      if (mode === "measure") bpmDisplay.textContent = getRandomBPM();

      if (elapsed >= duration) {
        clearInterval(timer);

        if (mode === "relax") {
          startCountdown(120, "measure");
        } else {
          bpmDisplay.textContent = "--";
          label.textContent = "";
          countdown.textContent = "00:00";
          doneText.style.display = "block";
          resultBtn.style.display = "inline-block";
        }
      }
    }, 1000);
  }

  startBtn.addEventListener('click', () => {
    popup.style.display = "flex";
    popupMeasurement.style.display = "block";
    popupResults.style.display = "none";
    startCountdown(30, "relax");
  });

  cancelBtn.addEventListener('click', () => {
    clearInterval(timer);
    popup.style.display = "none";
    bpmDisplay.textContent = "00";
    label.textContent = "Peruutettu";
    countdown.textContent = "00:00";
    updateProgress(0, 1);
  });

  resultBtn.addEventListener('click', () => {
    // Simuloi tulokset
    const readiness = Math.floor(Math.random() * 40 + 60);
    const stress = Math.floor(Math.random() * 50 + 25);
    const pns = Math.floor(Math.random() * 50 + 50);
    const avgBpm = Math.floor(Math.random() * 15 + 60);

    document.getElementById('result-readiness').textContent = readiness + " %";
    document.getElementById('result-stress').textContent = stress;
    document.getElementById('result-pns').textContent = pns;
    document.getElementById('result-bpm').textContent = avgBpm + " bpm";

    // Näytä tulosnäkymä popupissa
    popupMeasurement.style.display = "none";
    popupResults.style.display = "block";
  });

  closePopup.addEventListener('click', () => {
    popup.style.display = "none";
  });
});
