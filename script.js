(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var form = document.getElementById("contact-form");
  var formStatus = document.querySelector(".form-status");
  var yearEl = document.getElementById("year");

  function closeMenu() {
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", function (event) {
    if (header.classList.contains("nav-open") && !header.contains(event.target)) {
      closeMenu();
    }
  });

  function updateHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 12);

    var probe = window.scrollY + window.innerHeight * 0.25;
    var currentId = sections.length ? sections[0].id : null;

    sections.forEach(function (section) {
      if (section.offsetTop <= probe) currentId = section.id;
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
  updateHeaderState();

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (element) {
      var steps = parseInt(element.dataset.delay || "0", 10);
      if (steps) element.style.transitionDelay = steps * 90 + "ms";
      observer.observe(element);
    });
  } else {
    revealEls.forEach(function (element) {
      element.classList.add("in-view");
    });
  }

  if (form && formStatus) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      formStatus.textContent =
        "Thanks for reaching out! Your message has been sent and I will reply soon.";
      form.reset();
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
