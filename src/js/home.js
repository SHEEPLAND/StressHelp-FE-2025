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

window.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".navigation-link a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      setTimeout(() => {
        link.classList.add("active"); 
      }, 10); 
    }
  });
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
    interval: 450,
    duration: 600,
    delay: 400,
  });

  ScrollReveal().reveal(".Info-card", {
    ...scrollRevealOption,
    interval: 500,
  });
  ScrollReveal().reveal(".cta-buttons", {
    ...scrollRevealOption,
    delay: 300,
  });

  ScrollReveal().reveal(".cta-btn", {
    ...scrollRevealOption,
    interval: 200,
  });
  
} else {
  console.warn("ScrollReveal not found");
}


const profileButton = document.querySelector('.profile-button');
const dropdownBox = document.querySelector('.profile-dropdown-box');


// Accordion
profileButton.addEventListener('click', function(event) {
  event.stopPropagation();
 
  dropdownBox.style.display = (dropdownBox.style.display === 'block') ? 'none' : 'block';
});


document.addEventListener('click', function(event) {
  if (!profileButton.contains(event.target) && !dropdownBox.contains(event.target)) {
    dropdownBox.style.display = 'none';
  }
});

window.addEventListener("load", () => {
  document.querySelectorAll(".accordion").forEach((accordion) => {
    const panel = accordion.nextElementSibling;
    const icon = accordion.querySelector(".accordion-icon");

    const setPanelHeight = () => {
      requestAnimationFrame(() => {
        panel.style.maxHeight = panel.scrollHeight + "px";

        setTimeout(() => {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }, 300);
      });
    };

    const waitForImages = (container, callback) => {
      const images = container.querySelectorAll("img");
      if (images.length === 0) return callback();

      let loaded = 0;
      const check = () => {
        loaded++;
        if (loaded === images.length) callback();
      };

      images.forEach((img) => {
        if (img.complete) {
          check();
        } else {
          img.addEventListener("load", check);
          img.addEventListener("error", check);
        }
      });
    };

    // Handle default open
    if (accordion.classList.contains("active")) {
      waitForImages(panel, () => {
        setPanelHeight();
        if (icon) icon.textContent = "−";
      });
    } else {
      if (icon) icon.textContent = "+";
    }

    accordion.addEventListener("click", function () {
      this.classList.toggle("active");
      const isActive = this.classList.contains("active");

      if (isActive) {
        waitForImages(panel, () => {
          setPanelHeight();
          if (typeof ScrollReveal !== "undefined") {
            ScrollReveal().sync?.();
          }
        });
        if (icon) icon.textContent = "−";
      } else {
        panel.style.maxHeight = null;
        if (icon) icon.textContent = "+";
      }
    });
  });
});

window.addEventListener("resize", () => {
  document.querySelectorAll(".accordion.active").forEach((accordion) => {
    const panel = accordion.nextElementSibling;

    requestAnimationFrame(() => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });

    setTimeout(() => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }, 300);
  });
});


