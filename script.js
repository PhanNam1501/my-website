const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const THEME_KEY = "vb-demo-theme";
const categoryLinks = document.querySelectorAll(".category-nav a[data-filter]");
const postItems = document.querySelectorAll(".post-list .post");
const searchInput = document.getElementById("post-search");
let activeFilter = "all";
let searchTerm = "";

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "theme-dark"
    : "theme-light";
}

function setTheme(theme) {
  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(theme);
  toggleButton.querySelector(".icon").textContent = theme === "theme-dark" ? "☀️" : "🌙";
  toggleButton.querySelector(".label").textContent = theme === "theme-dark" ? "Light Mode" : "Dark Mode";
  localStorage.setItem(THEME_KEY, theme);
}

function applyFilters() {
  postItems.forEach((post) => {
    const category = (post.dataset.category || "").toLowerCase();
    const title = (post.dataset.title || post.textContent || "").toLowerCase();
    const matchesCategory = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !searchTerm || title.includes(searchTerm);
    const shouldShow = matchesCategory && matchesSearch;
    post.classList.toggle("is-hidden", !shouldShow);
  });
}

function setActiveLink(link) {
  categoryLinks.forEach((navLink) => {
    const isActive = link && navLink === link;
    navLink.classList.toggle("is-active", isActive);
  });
}

toggleButton.addEventListener("click", () => {
  const nextTheme = body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
  setTheme(nextTheme);
});

window.addEventListener("DOMContentLoaded", () => {
  setTheme(getPreferredTheme());
  applyFilters();

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const filter = (link.dataset.filter || "").toLowerCase();
      const nextFilter = activeFilter === filter ? "all" : filter;
      activeFilter = nextFilter;

      setActiveLink(activeFilter === "all" ? null : link);
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
});

