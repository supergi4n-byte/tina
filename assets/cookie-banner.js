(function () {
  const storageKey = "orchestrator_cookie_consent";
  const banner = document.getElementById("cookie-banner");

  if (!banner) {
    return;
  }

  function hideBanner() {
    banner.setAttribute("hidden", "");
    banner.setAttribute("aria-hidden", "true");
    banner.style.display = "none";
  }

  function showBanner() {
    banner.removeAttribute("hidden");
    banner.removeAttribute("aria-hidden");
    banner.style.removeProperty("display");
  }

  function applyConsent(choice) {
    if (choice !== "accepted" && choice !== "rejected") {
      return;
    }

    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      // Ignore storage errors and still apply the UI state.
    }

    document.documentElement.dataset.cookieConsent = choice;
    hideBanner();
  }

  let savedConsent = null;
  try {
    savedConsent = localStorage.getItem(storageKey);
  } catch {
    savedConsent = null;
  }

  if (savedConsent === "accepted" || savedConsent === "rejected") {
    document.documentElement.dataset.cookieConsent = savedConsent;
    hideBanner();
    return;
  }

  showBanner();

  function handleBannerClick(event) {
    const target = event.target.closest("[data-cookie-choice]");
    if (!target || !banner.contains(target)) {
      return;
    }

    event.preventDefault();
    applyConsent(target.dataset.cookieChoice);
  }

  banner.addEventListener("click", handleBannerClick);
  globalThis.__setOrchestratorCookieConsent = applyConsent;
})();
