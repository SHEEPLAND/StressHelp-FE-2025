// Function to calculate the stress level based on the survey responses
function calculateStress() {
    let score = 0;
    const survey = document.forms["stressSurvey"];
  
    if (!survey) {
      alert("Lomaketta ei löytynyt.");
      return;
    }
  
    let allAnswered = true;
  
    for (let i = 1; i <= 10; i++) {
      const question = survey["q" + i];
      if (!question) continue;
  
      let answered = false;
  
      Array.from(question).forEach((option) => {
        if (option.checked) {
          answered = true;
          score += parseInt(option.value);
        }
      });
  
      if (!answered) {
        allAnswered = false;
        break;
      }
    }
  
    if (!allAnswered) {
      alert("Ole hyvä ja vastaa kaikkiin kysymyksiin ennen laskemista.");
      return;
    }
  
   // loads the popup element and sets the message based on the score
    const popup = document.getElementById("popup");
    const stressMessage = document.getElementById("stressMessage");
  
    let message = "";
  
    if (score <= 16) {
      message = "<strong>Stressitasosi on matala.</strong>";
    } else if (score <= 26) {
      message = "<strong>Stressitasosi on kohtalainen.</strong>";
    } else {
      message = "<strong>Stressitasosi on korkea.</strong>";
    }
  
    message += `<br>Kokonaispisteet: <strong>${score}</strong>`;
  
    stressMessage.innerHTML = message; 
    popup.style.display = "block";
  }
  
  // Function to close the popup when the close button is clicked
  document.addEventListener("DOMContentLoaded", function () {
    const calculateBtn = document.getElementById("calculate-btn");
    const closeBtn = document.getElementById("close-popup");
  
    if (calculateBtn) {
      calculateBtn.addEventListener("click", calculateStress);
    }
  
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        document.getElementById("popup").style.display = "none";
      });
    }
  });
  