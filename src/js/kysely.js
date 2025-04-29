function calculateStress() {
    let score = 0;
    const survey = document.forms['stressSurvey'];

    // Tarkistetaan että lomake löytyi
    if (!survey) {
        alert("Lomaketta ei löytynyt.");
        return;
    }

    let allAnswered = true;

    for (let i = 1; i <= 10; i++) {
        const question = survey[`q${i}`];
        if (!question) continue;

        let answered = false;

        Array.from(question).forEach(option => {
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

    // Haetaan popup-elementit
    const popup = document.getElementById("popup");
    const stressMessage = document.getElementById("stressMessage");
    const lowStressOptions = document.getElementById("lowStressOptions");
    const moderateStressOptions = document.getElementById("moderateStressOptions");
    const highStressOptions = document.getElementById("highStressOptions");

    let message = "";

    // Näytetään oikea viesti ja piilotetaan/avataan oikeat osiot
    if (score <= 16) {
        message = "Stressitasosi on matala.";
        lowStressOptions.style.display = "block";
        moderateStressOptions.style.display = "none";
        highStressOptions.style.display = "none";
    } else if (score <= 26) {
        message = "Stressitasosi on kohtalainen.";
        moderateStressOptions.style.display = "block";
        lowStressOptions.style.display = "none";
        highStressOptions.style.display = "none";
    } else {
        message = "Stressitasosi on korkea.";
        highStressOptions.style.display = "block";
        lowStressOptions.style.display = "none";
        moderateStressOptions.style.display = "none";
    }

    // Lisätään pisteet näkyviin (valinnainen, voi poistaa)
    message += ` Kokonaispisteet: ${score}`;

    stressMessage.innerText = message;
    popup.style.display = "block";
}

// Sulje-painike: piilota popup ja valinnaiset osiot
document.getElementById("close-popup").addEventListener("click", function () {
    const popup = document.getElementById("popup");
    popup.style.display = "none";

    document.getElementById("lowStressOptions").style.display = "none";
    document.getElementById("moderateStressOptions").style.display = "none";
    document.getElementById("highStressOptions").style.display = "none";
});


