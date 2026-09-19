(function () {
  var slugs = {
    "come-scegliere-smartwatch": "how-to-choose-smartwatch",
    "come-scegliere-abbonamento-digitale": "how-to-choose-digital-subscription",
    "regali-tech-sotto-50": "tech-gifts-under-50"
  };

  function norm(path) {
    if (!path || path === "") return "/";
    if (path.length > 1 && path.slice(-1) !== "/") path += "/";
    return path;
  }

  function pair(pathname) {
    var path = norm(pathname);
    if (path.indexOf("/gift-finder/") === 0) {
      return { it: "/gift-finder/", en: "/gift-finder/?lang=en" };
    }
    var it = path;
    var en = path;
    if (path.indexOf("/en/") === 0) {
      it = path.slice(3) || "/";
      Object.keys(slugs).forEach(function (itSlug) {
        it = it.replace("/" + slugs[itSlug] + "/", "/" + itSlug + "/");
      });
      en = path;
    } else {
      en = path === "/" ? "/en/" : "/en" + path;
      Object.keys(slugs).forEach(function (itSlug) {
        en = en.replace("/" + itSlug + "/", "/" + slugs[itSlug] + "/");
      });
      it = path;
    }
    return { it: it, en: en };
  }

  if (document.querySelector(".lang-switch")) return;

  var urls = pair(location.pathname);
  var isEn = location.pathname.indexOf("/en/") === 0 || /[?&]lang=en/.test(location.search);

  var style = document.createElement("style");
  style.textContent =
    ".lang-switch{display:inline-flex;flex-shrink:0;border:1px solid rgba(20,17,14,.16);border-radius:999px;padding:3px;background:rgba(255,255,255,.7);margin-left:12px}" +
    ".lang-switch a{text-decoration:none;border-radius:999px;padding:6px 10px;font-size:11px;letter-spacing:.08em;font-weight:800;opacity:.55}" +
    ".lang-switch a.active{background:#14110e;color:#f7f2ea;opacity:1}" +
    "header.top,header.topbar{display:flex;align-items:center;justify-content:space-between;gap:12px}";
  document.head.appendChild(style);

  var box = document.createElement("nav");
  box.className = "lang-switch";
  box.setAttribute("aria-label", "Language");
  box.innerHTML =
    '<a class="lang' + (isEn ? "" : " active") + '" href="' + urls.it + '">IT</a>' +
    '<a class="lang' + (isEn ? " active" : "") + '" href="' + urls.en + '">EN</a>';

  var header = document.querySelector("header.top, header.topbar, header");
  if (!header) return;
  var nav = header.querySelector("nav.nav, .top-actions");
  if (nav) nav.appendChild(box);
  else header.appendChild(box);
})();
