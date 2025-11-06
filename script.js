const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const postViewer = document.getElementById("post-viewer");
const postContent = document.getElementById("post-content");
const closePost = document.getElementById("close-post");

const THEME_KEY = "vb-demo-theme";

const posts = {};

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

function renderPost(postId) {
  const post = posts[postId];
  if (!post || !postContent || !postViewer) return;

  const paragraphs = post.body
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");

  postContent.innerHTML = `
    <time datetime="${post.datetime}" class="post-detail-date">${post.date}</time>
    <h2>${post.title}</h2>
    <p>${post.summary}</p>
    ${paragraphs}
  `;

  postViewer.hidden = false;
  postViewer.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hidePost() {
  if (postViewer) {
    postViewer.hidden = true;
    postContent.innerHTML = "";
  }
}

toggleButton.addEventListener("click", () => {
  const nextTheme = body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
  setTheme(nextTheme);
});

window.addEventListener("DOMContentLoaded", () => {
  setTheme(getPreferredTheme());

  document.querySelectorAll(".post a[data-post-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const { postId } = event.currentTarget.dataset;
      renderPost(postId);
    });
  });

  if (closePost) {
    closePost.addEventListener("click", hidePost);
  }
});

