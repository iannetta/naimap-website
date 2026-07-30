/*
  Naimap — shared site behaviour. Vanilla JS, no dependencies.
  Every feature here is progressive enhancement: with JS disabled, the
  .no-js fallback in style.css keeps content visible and the mobile nav
  degrades to a plain in-page anchor (see markup in each page).
*/
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* ---------------------------------------------------------------- */
  /* Theme toggle                                                      */
  /* ---------------------------------------------------------------- */
  var THEME_KEY = "naimap-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function currentEffectiveTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  try {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) applyTheme(stored);
  } catch (e) { /* localStorage unavailable (private mode) — silently fall back to OS theme */ }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentEffectiveTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      btn.setAttribute("aria-pressed", String(next === "dark"));
    });
    btn.setAttribute("aria-pressed", String(currentEffectiveTheme() === "dark"));
  });

  /* ---------------------------------------------------------------- */
  /* Mobile navigation                                                 */
  /* ---------------------------------------------------------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMobile = document.querySelector("[data-nav-mobile]");
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMobile.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navMobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Reveal-on-scroll                                                   */
  /* ---------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealTargets.forEach(function (el) { io.observe(el); });
    } else {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Accordion (FAQ)                                                    */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-accordion-trigger]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".accordion-item");
      var wasOpen = item.classList.contains("is-open");
      var singleOpen = trigger.closest("[data-accordion-single]");
      if (singleOpen) {
        singleOpen.querySelectorAll(".accordion-item.is-open").forEach(function (openItem) {
          openItem.classList.remove("is-open");
          openItem.querySelector("[data-accordion-trigger]").setAttribute("aria-expanded", "false");
        });
      }
      item.classList.toggle("is-open", !wasOpen);
      trigger.setAttribute("aria-expanded", String(!wasOpen));
    });
  });

  /* ---------------------------------------------------------------- */
  /* Screenshot gallery: platform tabs + lightbox                      */
  /* ---------------------------------------------------------------- */
  var tabs = document.querySelectorAll("[data-gallery-tab]");
  var tracks = document.querySelectorAll("[data-gallery-track]");
  if (tabs.length && tracks.length) {
    var tabList = Array.prototype.slice.call(tabs);
    function selectTab(tab) {
      var target = tab.getAttribute("data-gallery-tab");
      tabList.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
      tracks.forEach(function (track) {
        var match = track.getAttribute("data-gallery-track") === target;
        track.hidden = !match;
      });
    }
    tabList.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(tab); });
      tab.addEventListener("keydown", function (e) {
        var nextIndex = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = (i + 1) % tabList.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = (i - 1 + tabList.length) % tabList.length;
        else if (e.key === "Home") nextIndex = 0;
        else if (e.key === "End") nextIndex = tabList.length - 1;
        if (nextIndex !== null) {
          e.preventDefault();
          tabList[nextIndex].focus();
          selectTab(tabList[nextIndex]);
        }
      });
    });
  }

  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var galleryButtons = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-track]:not([hidden]) [data-lightbox-open], [data-gallery-track] [data-lightbox-open]"));
    var activeGroup = [];
    var activeIndex = 0;
    var lastFocused = null;

    function openLightbox(track, index) {
      var buttons = Array.prototype.slice.call(track.querySelectorAll("[data-lightbox-open]"));
      activeGroup = buttons;
      activeIndex = index;
      show();
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      lightbox.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    }

    function show() {
      var btn = activeGroup[activeIndex];
      if (!btn) return;
      var full = btn.getAttribute("data-full") || btn.querySelector("img").src;
      var alt = btn.querySelector("img").alt;
      lightboxImg.src = full;
      lightboxImg.alt = alt;
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("hidden", "");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll("[data-gallery-track]").forEach(function (track) {
      track.querySelectorAll("[data-lightbox-open]").forEach(function (btn, index) {
        btn.addEventListener("click", function () { openLightbox(track, index); });
      });
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    var prevBtn = lightbox.querySelector(".lightbox-nav--prev");
    var nextBtn = lightbox.querySelector(".lightbox-nav--next");
    if (prevBtn) prevBtn.addEventListener("click", function () {
      activeIndex = (activeIndex - 1 + activeGroup.length) % activeGroup.length;
      show();
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      activeIndex = (activeIndex + 1) % activeGroup.length;
      show();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") { closeLightbox(); return; }
      if (e.key === "ArrowLeft" && prevBtn) prevBtn.click();
      if (e.key === "ArrowRight" && nextBtn) nextBtn.click();
      if (e.key === "Tab") {
        var focusable = Array.prototype.slice.call(lightbox.querySelectorAll("button"));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Back to top                                                        */
  /* ---------------------------------------------------------------- */
  var backToTop = document.querySelector("[data-back-to-top]");
  if (backToTop) {
    var onScroll = function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Footer year                                                        */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
