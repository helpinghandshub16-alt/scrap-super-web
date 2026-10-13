// Har page par: header, menu, bhasha button, cart, footer, WhatsApp, install
(function () {
  const B = window.BUSINESS || {};
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const money = n => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
  const fmtDate = d => d ? new Date(d + (String(d).length === 10 ? "T00:00" : "")).toLocaleDateString(LANG === "en" ? "en-IN" : "hi-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  window.U = { esc, $, iso, money, fmtDate };

  // ---------------- Cart ----------------
  const CK = "ss_cart";
  const read = () => { try { return JSON.parse(localStorage.getItem(CK)) || {}; } catch (e) { return {}; } };
  const write = c => { try { localStorage.setItem(CK, JSON.stringify(c)); } catch (e) {} updateBadge(); document.dispatchEvent(new Event("cart")); };
  window.Cart = {
    all: read,
    qty: id => read()[id] || 0,
    set(id, q) { const c = read(); q = Math.max(0, Math.round(Number(q) * 10) / 10 || 0); if (q) c[id] = q; else delete c[id]; write(c); },
    add(id, unit) { const c = read(); if (!c[id]) c[id] = unit === "pc" ? 1 : 10; write(c); },
    clear() { write({}); },
    count: () => Object.keys(read()).length,
    // rates list ke saath line items + total
    lines(rates) {
      const c = read();
      return rates.filter(r => c[r.id]).map(r => ({ ...r, qty: c[r.id], amount: c[r.id] * r.price }));
    }
  };
  function updateBadge() { document.querySelectorAll(".cart-count").forEach(b => { const n = Cart.count(); b.textContent = n; b.hidden = !n; }); }

  // ---------------- Layout ----------------
  const NAV = [
    ["index.html", "nav_home"], ["rates.html", "nav_rates"], ["cart.html", "nav_cart"], ["track.html", "nav_track"],
    ["news.html", "nav_news"], ["gallery.html", "nav_gallery"], ["locator.html", "nav_locator"],
    ["careers.html", "nav_careers"], ["about.html", "nav_about"], ["contact.html", "nav_contact"], ["faq.html", "nav_faq"]
  ];
  const here = (location.pathname.split("/").pop() || "index.html");

  window.renderLayout = function () {
    const demo = !Store.isLive ? `<div class="banner">${esc(t("demo_banner"))}</div>` : "";
    document.body.insertAdjacentHTML("afterbegin", `${demo}
    <header class="top">
      <div class="wrap bar">
        <a class="logo" href="index.html"><img src="icons/icon-192.png" alt="" width="34" height="34"><span>Scrap Super</span></a>
        <nav class="mainnav" aria-label="Main">
          ${NAV.slice(0, 7).map(([h, k]) => `<a href="${h}" ${h === here ? 'aria-current="page"' : ""}>${esc(t(k))}</a>`).join("")}
        </nav>
        <div class="tools">
          <div class="lang" role="group" aria-label="Language">
            <button type="button" data-lang="hi" aria-pressed="${LANG === "hi"}">हिं</button>
            <button type="button" data-lang="en" aria-pressed="${LANG === "en"}">EN</button>
          </div>
          <a class="iconbtn" href="cart.html" aria-label="${esc(t("cart"))}">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>
            <b class="cart-count" hidden>0</b>
          </a>
          <button class="iconbtn" type="button" id="menuBtn" aria-label="${esc(t("menu"))}" aria-expanded="false" aria-controls="drawer">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
    </header>
    <div class="drawer" id="drawer" hidden>
      <div class="drawer-in">
        <div class="drawer-hd"><b>Scrap Super</b><button type="button" class="iconbtn" id="menuClose" aria-label="${esc(t("close"))}">✕</button></div>
        ${NAV.map(([h, k]) => `<a href="${h}" ${h === here ? 'aria-current="page"' : ""}>${esc(t(k))}</a>`).join("")}
        <a href="tel:+91${esc(B.phone)}" class="btn sun" style="margin-top:12px">📞 ${esc(B.phone)}</a>
      </div>
    </div>`);

    document.body.insertAdjacentHTML("beforeend", `
    <footer class="foot">
      <div class="wrap fgrid">
        <div>
          <a class="logo" href="index.html"><img src="icons/icon-192.png" alt="" width="34" height="34"><span>Scrap Super</span></a>
          <p>${esc(t("footer_tag"))}</p>
          <p>📞 <span class="sel">${esc(B.phone)}</span><br>✉️ <span class="sel">${esc(B.email)}</span><br>📍 ${esc(B.address)}</p>
        </div>
        <div class="flinks">${NAV.map(([h, k]) => `<a href="${h}">${esc(t(k))}</a>`).join("")}<a href="admin.html">${esc(t("nav_admin"))}</a></div>
      </div>
      <div class="wrap fbase">© ${new Date().getFullYear()} Scrap Super · ${esc(B.city)} · ${esc(t("rights"))}</div>
    </footer>
    <a class="wa-float" href="https://wa.me/91${esc(B.phone)}" target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="#fff" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.5 6.5 0 0 0 1.4 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.2-.3-.3-.6-.5z"/></svg>
    </a>
    <div id="installBar" hidden>
      <p id="installText">${esc(t("install_txt"))}</p>
      <button class="btn sun small" id="installBtn" type="button">${esc(t("install"))}</button>
      <button class="btn small ghost" id="installClose" type="button" aria-label="${esc(t("close"))}">✕</button>
    </div>`);

    // events
    document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
    const drawer = $("#drawer"), mb = $("#menuBtn");
    const openD = o => { drawer.hidden = !o; mb.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : ""; };
    mb.addEventListener("click", () => openD(true));
    $("#menuClose").addEventListener("click", () => openD(false));
    drawer.addEventListener("click", e => { if (e.target === drawer) openD(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") openD(false); });
    updateBadge();
    setupInstall();
    applyI18n();
  };

  function setupInstall() {
    let deferred = null; const bar = $("#installBar");
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    let closed = false; try { closed = !!localStorage.getItem("ss_install_closed"); } catch (e) {}
    window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; if (!closed) bar.hidden = false; });
    if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone && !closed) {
      $("#installText").textContent = t("install_ios"); $("#installBtn").hidden = true; bar.hidden = false;
    }
    $("#installBtn").addEventListener("click", async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; bar.hidden = true; });
    $("#installClose").addEventListener("click", () => { bar.hidden = true; try { localStorage.setItem("ss_install_closed", "1"); } catch (e) {} });
  }

  // Rates cache (ek page par ek baar)
  let ratesP = null;
  window.getRates = () => ratesP || (ratesP = Store.list("rates", "order", false).catch(() => window.DEFAULT_RATES));
})();
