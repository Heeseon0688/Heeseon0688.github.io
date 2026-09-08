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
  const viewer = document.getElementById("imageViewer");
  let activeGallery = null;
  let activeSlide = 0;

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
    document.querySelectorAll("[data-alt-ko][data-alt-en]").forEach(el => { el.alt = el.dataset[language === "ko" ? "altKo" : "altEn"]; });
    document.querySelectorAll("[data-label-ko][data-label-en]").forEach(el => { el.setAttribute("aria-label", el.dataset[language === "ko" ? "labelKo" : "labelEn"]); });
    if (viewer.open) updateViewer();
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
  function slideInfo(gallery, index) {
    const choices = [...gallery.querySelectorAll(".gallery-choice")];
    const choice = choices[index];
    const title = gallery.dataset[language === "ko" ? "titleKo" : "titleEn"];
    const caption = choice.dataset[language === "ko" ? "captionKo" : "captionEn"];
    return { choices, choice, title: `${title} — ${caption}` };
  }
  function selectSlide(gallery, index) {
    const { choices, choice, title } = slideInfo(gallery, index);
    const mainImage = gallery.querySelector(".gallery-image");
    mainImage.src = choice.dataset.src;
    mainImage.alt = title;
    mainImage.dataset.altKo = `${gallery.dataset.titleKo} — ${choice.dataset.captionKo}`;
    mainImage.dataset.altEn = `${gallery.dataset.titleEn} — ${choice.dataset.captionEn}`;
    gallery.querySelector(".gallery-stage").href = choice.dataset.src;
    choices.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
  }
  function updateViewer() {
    if (!activeGallery) return;
    const { choices, choice, title } = slideInfo(activeGallery, activeSlide);
    document.getElementById("viewerImage").src = choice.dataset.src;
    document.getElementById("viewerImage").alt = title;
    document.getElementById("viewerTitle").textContent = title;
    document.getElementById("viewerCounter").textContent = `${activeSlide + 1} / ${choices.length}`;
    document.getElementById("viewerSource").href = activeGallery.closest(".project").querySelector(".repo-card").href + "#readme";
    selectSlide(activeGallery, activeSlide);
  }
  function moveSlide(direction) {
    if (!activeGallery) return;
    const total = activeGallery.querySelectorAll(".gallery-choice").length;
    activeSlide = (activeSlide + direction + total) % total;
    updateViewer();
  }
  document.querySelectorAll(".project-gallery").forEach(gallery => {
    gallery.querySelectorAll(".gallery-choice").forEach((button, index) => {
      button.addEventListener("click", () => selectSlide(gallery, index));
    });
    gallery.querySelector(".gallery-stage").addEventListener("click", event => {
      if (typeof viewer.showModal !== "function" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activeGallery = gallery;
      activeSlide = [...gallery.querySelectorAll(".gallery-choice")].findIndex(button => button.getAttribute("aria-pressed") === "true");
      updateViewer();
      viewer.showModal();
    });
  });
  document.getElementById("viewerPrev").addEventListener("click", () => moveSlide(-1));
  document.getElementById("viewerNext").addEventListener("click", () => moveSlide(1));
  viewer.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveSlide(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  viewer.addEventListener("click", event => {
    const rect = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) viewer.close();
  });
  viewer.addEventListener("close", () => { activeGallery = null; });
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
