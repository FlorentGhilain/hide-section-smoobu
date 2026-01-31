(() => {
  const SECTION_IDS = ["content-552001"];
  const DAYS_BEFORE = 15;
  const DATES_SELECTOR = ".booking-dates";

  function parseFRDate(ddmmyyyy) {
    // Attend "13/03/2026"
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ddmmyyyy.trim());
    if (!m) return null;
    const [, dd, mm, yyyy] = m;
    // On crée une date "locale" à midi pour éviter certains effets de bord DST
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), 12, 0, 0, 0);
  }

  function getStartDateFromBookingDates() {
    const el = document.querySelector(DATES_SELECTOR);
    if (!el) return null;

    // Ex: "13/03/2026 - 15/03/2026"
    const text = el.textContent || "";
    const parts = text.split("-").map(s => s.trim());
    if (!parts[0]) return null;

    return parseFRDate(parts[0]);
  }

  function hideById(id) {
    // - trouver les elements htmls dont l'id égale cet id, et rendre le parent invisible
    const byId = document.getElementById(id);
    if (byId && byId.parentElement) {
      byId.parentElement.style.display = "none";
      // ou: byId.parentElement.hidden = true;
    }
  }

  function hideByDataSectionId(id) {
    // - trouver les elements htmls dont l'attribut data-section-id égale cet id,
    //   et rendre le grand-parent invisible.
    const matches = document.querySelectorAll(`[data-section-id="${CSS.escape(id)}"]`);
    matches.forEach(el => {
      const grandParent = el.parentElement?.parentElement;
      if (grandParent) {
        grandParent.style.display = "none";
        // ou: grandParent.hidden = true;
      }
    });
  }

  function shouldHideSections() {
    const startDate = getStartDateFromBookingDates();
    if (!startDate) return false; // si on ne peut pas lire la date, on ne cache rien

    const threshold = new Date(startDate);
    threshold.setDate(threshold.getDate() - DAYS_BEFORE);

    const now = new Date();
    // Normaliser "now" à midi aussi (comparaison uniquement sur le jour)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);

    return today < threshold;
  }

  function run() {
    if (!SECTION_IDS.length) return;

    if (shouldHideSections()) {
      SECTION_IDS.forEach(id => {
        hideById(id);
        hideByDataSectionId(id);
      });
    }
  }

  // Lance après chargement du DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
