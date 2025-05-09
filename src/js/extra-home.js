// Front page button and text
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const kubiosButton = document.querySelector(".cta-btn.secondary");
    const infoCardParagraphs = document.querySelectorAll(".Info-card p");
    const infoCardLink = document.querySelectorAll(".info-link-wrapper")[1]; 
    const infoCardParagraph = infoCardParagraphs[1];
  
    if (token) {
      if (kubiosButton) {
        kubiosButton.innerHTML = '📊 Siirry stressidataan<span class="arrow">&raquo;</span>';
        kubiosButton.href = "data.html";
        kubiosButton.classList.add("logged-in");
      }
  
      if (infoCardParagraph) {
        infoCardParagraph.textContent = "Hyödynnä mittausdataa ymmärtääksesi stressitasojasi ja seuraa hyvinvointisi kehitystä.";
      }
  
      if (infoCardLink) {
        infoCardLink.href = "data.html";
      }
    }
  });
  