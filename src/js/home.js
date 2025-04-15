const menuButton = document.getElementById("menu-button");
const navigationLinks = document.getElementById("navigation-links");
const menuBtnIcon = menuButton.querySelector("i");

menuButton.addEventListener("click", () => {
  navigationLinks.classList.toggle("open");
  const isOpen = navigationLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navigationLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navigationLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
  }
});

const currentPath = window.location.pathname.split('/').pop();

document.querySelectorAll('.navigation-link a').forEach(link => {
  const linkHref = link.getAttribute('href');
  if (linkHref === currentPath) {
    link.classList.add('active');
  }
});

// ScrollReveal
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

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

  ScrollReveal().reveal(".Info-card", {
    ...scrollRevealOption,
    interval: 500,
  });
  ScrollReveal().reveal(".cta-buttons", {
    ...scrollRevealOption,
    delay: 300,
  });

  // ✅ Optional: Stagger each CTA button
  ScrollReveal().reveal(".cta-btn", {
    ...scrollRevealOption,
    interval: 200,
  });
  
} else {
  console.warn("ScrollReveal not found");
}

// Swiper (only if you’re using it)
const swiper = new Swiper(".swiper", {
  loop: true,
  pagination: {
    el: ".swiper-pagination",
  },
});

const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion) => {
  const panel = accordion.nextElementSibling;
  const icon = accordion.querySelector(".accordion-icon");

  // Open by default if .active
  if (accordion.classList.contains("active")) {
    panel.style.maxHeight = panel.scrollHeight + "px";
    if (icon) icon.textContent = "−";
  }

  accordion.addEventListener("click", function () {
    this.classList.toggle("active");
    const isActive = this.classList.contains("active");

    panel.style.maxHeight = isActive ? panel.scrollHeight + "px" : null;
    if (icon) icon.textContent = isActive ? "−" : "+";
  });
});
