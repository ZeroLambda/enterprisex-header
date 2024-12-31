document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");

  // Fetch JSON content
  fetch("data/header-content.json")
    .then((response) => response.json())
    .then((data) => {
      injectHeaderContent(data);
      addInteractivity();
    })
    .catch((error) => console.error("Error loading header content:", error));

  function injectHeaderContent(data) {
    // Create header container
    const container = document.createElement("div");
    container.classList.add("header-container");

    // Logo Section
    const logoDiv = document.createElement("div");
    logoDiv.classList.add("logo");
    const logoImg = document.createElement("img");
    logoImg.src = data.logo.src;
    logoImg.alt = data.logo.alt;
    const logoName = document.createElement("span");
    logoName.classList.add("logo-name");
    logoName.textContent = data.brandName;
    logoDiv.appendChild(logoImg);
    logoDiv.appendChild(logoName);

    // Navigation Menu
    const nav = document.createElement("nav");
    const navList = document.createElement("ul");
    navList.classList.add("nav-menu");

    data.navigation.forEach((item) => {
      const navItem = document.createElement("li");
      navItem.classList.add("nav-item");

      const navLink = document.createElement("a");
      navLink.classList.add("nav-link");
      navLink.href = item.link;
      navLink.textContent = item.name;

      navItem.appendChild(navLink);

      if (item.dropdown) {
        const dropdown = document.createElement("ul");
        dropdown.classList.add("dropdown");

        item.dropdown.forEach((subItem) => {
          const dropdownItem = document.createElement("li");
          dropdownItem.classList.add("dropdown-item");
          const dropdownLink = document.createElement("a");
          dropdownLink.href = subItem.link;
          dropdownLink.textContent = subItem.name;
          dropdownItem.appendChild(dropdownLink);
          dropdown.appendChild(dropdownItem);
        });

        navItem.appendChild(dropdown);
      }

      navList.appendChild(navItem);
    });

    nav.appendChild(navList);

    // CTA Button
    const ctaButton = document.createElement("a");
    ctaButton.classList.add("cta-button");
    ctaButton.href = data.cta.link;
    ctaButton.textContent = data.cta.text;

    // Hamburger Menu
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';

    // Append elements to container
    container.appendChild(logoDiv);
    container.appendChild(nav);
    container.appendChild(ctaButton);
    container.appendChild(hamburger);

    // Sidebar Menu
    const sidebar = document.createElement("div");
    sidebar.classList.add("sidebar");
    sidebar.innerHTML = `
          <div class="close-btn"><i class="fas fa-times"></i></div>
          <ul class="nav-menu">
              ${data.navigation
                .map(
                  (item) => `
                  <li class="nav-item">
                      <a href="${item.link}" class="nav-link">${item.name}</a>
                      ${
                        item.dropdown
                          ? `<ul class="dropdown">
                          ${item.dropdown
                            .map(
                              (sub) =>
                                `<li class="dropdown-item"><a href="${sub.link}">${sub.name}</a></li>`
                            )
                            .join("")}
                      </ul>`
                          : ""
                      }
                  </li>
              `
                )
                .join("")}
          </ul>
          <a href="${data.cta.link}" class="cta-button">${data.cta.text}</a>
          <div class="social-media">
              ${data.socialMedia
                .map(
                  (social) => `
                  <a href="${social.link}" aria-label="${social.name}" target="_blank"><i class="fab ${social.icon}"></i></a>
              `
                )
                .join("")}
          </div>
      `;

    // Create Overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // Append sidebar and overlay to container
    container.appendChild(sidebar);
    container.appendChild(overlay);

    header.appendChild(container);
  }

  function addInteractivity() {
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector(".sidebar .close-btn");
    const overlay = document.querySelector(".overlay");
    const navItems = document.querySelectorAll(".nav-item");

    // Function to open sidebar
    const openSidebar = () => {
      gsap.to(sidebar, { duration: 0.5, right: 0, ease: "power2.out" });
      gsap.to(overlay, {
        duration: 0.5,
        opacity: 1,
        display: "block",
        ease: "power2.out",
      });
      sidebar.classList.add("active");
      overlay.classList.add("active");
    };

    // Function to close sidebar
    const closeSidebar = () => {
      gsap.to(sidebar, { duration: 0.5, right: "-100%", ease: "power2.in" });
      gsap.to(overlay, {
        duration: 0.5,
        opacity: 0,
        display: "none",
        ease: "power2.in",
      });
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    };

    // Toggle Sidebar
    hamburger.addEventListener("click", openSidebar);

    closeBtn.addEventListener("click", closeSidebar);

    // Close sidebar when clicking on overlay
    overlay.addEventListener("click", closeSidebar);

    // Dropdown Menus for Desktop and Mobile
    navItems.forEach((item) => {
      const dropdown = item.querySelector(".dropdown");
      const navLink = item.querySelector(".nav-link");

      if (dropdown) {
        // Toggle dropdown on click for mobile devices
        navLink.addEventListener("click", (e) => {
          // Check if the viewport is mobile
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const isActive = dropdown.classList.contains("active");
            if (isActive) {
              dropdown.classList.remove("active");
              gsap.to(dropdown, {
                duration: 0.3,
                opacity: 0,
                transform: "translateY(10px)",
                ease: "power2.in",
              });
            } else {
              dropdown.classList.add("active");
              gsap.to(dropdown, {
                duration: 0.3,
                opacity: 1,
                transform: "translateY(0)",
                ease: "power2.out",
              });
            }
          }
        });

        // Hover for desktop devices
        item.addEventListener("mouseenter", () => {
          if (window.innerWidth > 768) {
            dropdown.classList.add("active");
            gsap.to(dropdown, {
              duration: 0.3,
              opacity: 1,
              transform: "translateY(0)",
              ease: "power2.out",
            });
          }
        });

        item.addEventListener("mouseleave", () => {
          if (window.innerWidth > 768) {
            dropdown.classList.remove("active");
            gsap.to(dropdown, {
              duration: 0.3,
              opacity: 0,
              transform: "translateY(10px)",
              ease: "power2.in",
            });
          }
        });
      }
    });

    // Accessibility: Keyboard Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("focus", () => {
        const parent = link.parentElement;
        const dropdown = parent.querySelector(".dropdown");
        if (dropdown && window.innerWidth > 768) {
          dropdown.classList.add("active");
          gsap.to(dropdown, {
            duration: 0.3,
            opacity: 1,
            transform: "translateY(0)",
            ease: "power2.out",
          });
        }
      });

      link.addEventListener("blur", () => {
        const parent = link.parentElement;
        const dropdown = parent.querySelector(".dropdown");
        if (dropdown && window.innerWidth > 768) {
          dropdown.classList.remove("active");
          gsap.to(dropdown, {
            duration: 0.3,
            opacity: 0,
            transform: "translateY(10px)",
            ease: "power2.in",
          });
        }
      });
    });

    // Handle window resize without reloading
    window.addEventListener("resize", () => {
      // Close the sidebar and reset dropdowns on resize to prevent inconsistencies
      if (window.innerWidth > 768 && sidebar.classList.contains("active")) {
        closeSidebar();
      }
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
        gsap.set(dropdown, { opacity: 0, transform: "translateY(10px)" });
      });
    });
  }
});
