const menuButton = document.getElementById("menu-button");
const navigationLinks = document.getElementById("navigation-links");

menuButton.addEventListener("click", () => {
  navigationLinks.classList.toggle("open");

  const isOpen = navigationLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navigationLinks.addEventListener("click", () => {
  navigationLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// Ensure ScrollReveal
if (typeof ScrollReveal !== "undefined") {
  ScrollReveal().reveal(".header-container h1", {
    ...scrollRevealOption,
  });

  ScrollReveal().reveal(".header-container .button", {
    ...scrollRevealOption,
    delay: 500,
  });

  ScrollReveal().reveal(".about-item", {
    ...scrollRevealOption,
    interval: 500,
  });

  ScrollReveal().reveal(".statistics-image img", {
    ...scrollRevealOption,
    origin: "right",
    interval: 500,
  });

  ScrollReveal().reveal(".statistics-card", {
    interval: 500,
    duration: 500,
    delay: 1000,
  });

  ScrollReveal().reveal(".accordion-card", {
    ...scrollRevealOption,
    interval: 500,
  });
} else {
  console.warn("ScrollReveal library is not loaded.");
}

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    
    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabContents.forEach(content => content.classList.remove("active"));

 
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});