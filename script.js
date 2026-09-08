(() => {
  "use strict";
  // Preferences are optional; the page also works when browser storage is blocked.
  const preference = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Keep the current view. */ } },
  };
  const root = document.documentElement;
  const langToggle = document.getElementById("langToggle");
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  let language = preference.get("portfolio-language") === "en" ? "en" : "ko";
  let theme = preference.get("portfolio-theme") === "dark" ? "dark" : "light";
  let filter = "all";

  function updateControlLabels() {
    const en = language === "en";
    const dark = theme === "dark";
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    langToggle.textContent = en ? "KO" : "EN";
    langToggle.setAttribute("aria-label", en ? "한국어로 전환" : "Switch to English");
    themeToggle.setAttribute("aria-label", en ? `Switch to ${dark ? "light" : "dark"} mode` : `${dark ? "라이트" : "다크"} 모드로 전환`);
    themeToggle.setAttribute("aria-pressed", String(dark));
    menuToggle.setAttribute("aria-label", en ? `${open ? "Close" : "Open"} menu` : `메뉴 ${open ? "닫기" : "열기"}`);
    nav.setAttribute("aria-label", en ? "Main navigation" : "주요 메뉴");
    document.querySelector(".project-filters").setAttribute("aria-label", en ? "Filter projects" : "프로젝트 필터");
    document.querySelector(".hero-art").setAttribute("aria-label", en ? "A connected practice across systems, AI, and applications" : "시스템, AI, 애플리케이션으로 이어지는 개발 경험");
    document.querySelector('.hero-bottom > a').setAttribute("aria-label", en ? "Explore more" : "더 알아보기");
  }
  function applyLanguage() {
    root.lang = language;
    document.querySelectorAll("[data-ko][data-en]").forEach(el => { el.textContent = el.dataset[language]; });
    updateControlLabels();
  }
  function applyTheme() {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#17251e" : "#f7f8f2";
    updateControlLabels();
  }
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    updateControlLabels();
  }
  function applyFilter(announce = true) {
    let count = 0;
    document.querySelectorAll(".project[data-category]").forEach(project => {
      const show = filter === "all" || project.dataset.category === filter;
      project.hidden = !show;
      if (show) count++;
    });
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
    if (announce) document.getElementById("filterStatus").textContent = language === "en" ? `${count} projects shown` : `${count}개 프로젝트 표시 중`;
  }
  langToggle.addEventListener("click", () => {
    language = language === "ko" ? "en" : "ko";
    preference.set("portfolio-language", language);
    applyLanguage();
    if (document.getElementById("filterStatus").textContent) applyFilter();
  });
  themeToggle.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    preference.set("portfolio-theme", theme);
    applyTheme();
  });
  menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header") && menuToggle.getAttribute("aria-expanded") === "true") setMenu(false);
  });
  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    filter = button.dataset.filter;
    applyFilter();
  }));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll("a").forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
  }
  document.getElementById("year").textContent = new Date().getFullYear();
  applyLanguage();
  applyTheme();
  applyFilter(false);
})();
