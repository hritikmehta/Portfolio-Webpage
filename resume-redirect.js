(function initResumeRedirect() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const routeKey = lastPart === "index.html" ? pathParts[pathParts.length - 2] : lastPart;
  const route = window.RESUME_LINKS?.routes?.[routeKey];

  const titleEl = document.getElementById("resumeRedirectTitle");
  const descriptionEl = document.getElementById("resumeRedirectDescription");
  const fallbackEl = document.getElementById("resumeRedirectFallback");

  if (!route || !route.targetUrl) {
    document.title = "Resume Link Unavailable";
    if (titleEl) titleEl.textContent = "Resume link unavailable";
    if (descriptionEl) {
      descriptionEl.textContent = "This route is not configured yet. Update resume-links.js and reload.";
    }
    if (fallbackEl) {
      fallbackEl.removeAttribute("href");
      fallbackEl.setAttribute("aria-disabled", "true");
      fallbackEl.textContent = "Update resume-links.js";
    }
    return;
  }

  document.title = `${route.label} | Hritik Mehta`;
  if (titleEl) titleEl.textContent = `Redirecting to ${route.label}`;
  if (descriptionEl) {
    descriptionEl.textContent = `Taking you to the latest hosted copy of the ${route.label.toLowerCase()}.`;
  }
  if (fallbackEl) {
    fallbackEl.href = route.targetUrl;
    fallbackEl.textContent = `Open ${route.label}`;
  }

  window.location.replace(route.targetUrl);
})();
