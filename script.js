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

function addAiTraining() {
  const timeline = document.querySelector("#experience .timeline");
  if (!timeline || document.getElementById("aiTrainingItem")) return;

  const article = document.createElement("article");
  article.id = "aiTrainingItem";
  article.innerHTML = `
    <div class="time">2024.03 — 2024.09</div>
    <div class="timeline-body">
      <h3 data-ko="AI 기반 챗봇 및 OCR 개발 전문가 과정 · 코리아IT아카데미" data-en="AI Chatbot & OCR Development Professional Program · Korea IT Academy">AI 기반 챗봇 및 OCR 개발 전문가 과정 · 코리아IT아카데미</h3>
      <p data-ko="Python 기반 AI·컴퓨터 비전·백엔드·웹 개발을 집중적으로 학습했습니다. 과정에서 MotorShot, 의료 상담 AI 챗봇, PLAN UP, Mind Glow 프로젝트를 수행하며 YOLO, LLM, OCR, FastAPI, MongoDB, React, Android를 실제 애플리케이션에 적용했습니다." data-en="Completed intensive training in Python-based AI, computer vision, backend, and web development. Built MotorShot, a medical consultation AI chatbot, PLAN UP, and Mind Glow while applying YOLO, LLM, OCR, FastAPI, MongoDB, React, and Android in practical applications.">Python 기반 AI·컴퓨터 비전·백엔드·웹 개발을 집중적으로 학습했습니다. 과정에서 MotorShot, 의료 상담 AI 챗봇, PLAN UP, Mind Glow 프로젝트를 수행하며 YOLO, LLM, OCR, FastAPI, MongoDB, React, Android를 실제 애플리케이션에 적용했습니다.</p>
    </div>
  `;

  const firstItem = timeline.querySelector("article");
  if (firstItem?.nextSibling) {
    timeline.insertBefore(article, firstItem.nextSibling);
  } else {
    timeline.appendChild(article);
  }
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

addAiTraining();

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
