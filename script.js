(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var yearEl = document.getElementById("year");

  function closeMenu() {
    if (!header.classList.contains("nav-open")) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) closeMenu();
    });
  }

  function updateHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 12);

    var probe = window.scrollY + window.innerHeight * 0.25;
    var currentId = null;

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (element) {
      var steps = parseInt(element.dataset.delay || "0", 10);
      if (steps) element.style.transitionDelay = steps * 70 + "ms";
      observer.observe(element);
    });
  } else {
    revealEls.forEach(function (element) {
      element.classList.add("in-view");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".case-toggle"), function (button) {
    button.addEventListener("click", function () {
      var card = button.closest(".work-card");
      var panel = document.getElementById(button.getAttribute("aria-controls"));
      var isOpen = card.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      panel.setAttribute("aria-hidden", String(!isOpen));
      button.childNodes[0].nodeValue = isOpen ? "Close case study" : "Case study";
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".arch-layer"), function (layer) {
    var chips = layer.querySelectorAll(".arch-chips li");
    Array.prototype.forEach.call(chips, function (chip) {
      ["mouseenter", "focus"].forEach(function (evt) {
        chip.addEventListener(evt, function () {
          layer.classList.add("lit");
        });
      });
      ["mouseleave", "blur"].forEach(function (evt) {
        chip.addEventListener(evt, function () {
          layer.classList.remove("lit");
        });
      });
    });
  });

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
