const PROFILE = {
  // GitHub는 반영 완료. 이메일을 공개하고 싶을 때만 아래 email에 입력하세요.
  github: "https://github.com/Heeseon0688",
  email: "",
};

const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
let language = localStorage.getItem("portfolio-language") || "ko";

function applyProfile() {
  ["githubLink", "githubLink2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = PROFILE.github;
  });
  ["emailLink", "emailLink2"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (PROFILE.email) {
      el.href = `mailto:${PROFILE.email}`;
      if (id === "emailLink2") el.textContent = `${PROFILE.email} ↗`;
    } else {
      el.style.display = "none";
    }
  });
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-ko][data-en]").forEach((el) => {
    el.textContent = el.dataset[language];
  });
  langToggle.textContent = language === "ko" ? "EN" : "KO";
  localStorage.setItem("portfolio-language", language);
}

langToggle.addEventListener("click", () => {
  language = language === "ko" ? "en" : "ko";
  applyLanguage();
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "" : "dark";
  localStorage.setItem("portfolio-theme", isDark ? "light" : "dark");
});

document.getElementById("year").textContent = new Date().getFullYear();

const targets = document.querySelectorAll(".project, .principle-grid article, .research-list article, .timeline article, .skill-grid article");
targets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

targets.forEach((el) => observer.observe(el));

applyProfile();
applyLanguage();
