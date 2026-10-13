// Har page ka content. <body data-page="..."> se sahi page banta hai.
(function () {
  const { esc, $, iso, money, fmtDate } = U;
  const B = window.BUSINESS || {};
  const app = () => $("#app");
  const unitLbl = u => t(u === "pc" ? "per_pc" : "per_kg");
  const unitShort = u => t(u === "pc" ? "pc" : "kg");
  const head = (k, sub) => `<div class="phead"><h1>${esc(t(k))}</h1>${sub ? `<p>${esc(t(sub))}</p>` : ""}</div>`;
  const myBookings = { get() { try { return JSON.parse(localStorage.getItem("ss_my")) || []; } catch (e) { return []; } },
    add(id) { try { const l = this.get(); l.unshift(id); localStorage.setItem("ss_my", JSON.stringify(l.slice(0, 10))); } catch (e) {} } };

  // ---------- Rate card (rates + home) ----------
  function rateCard(r) {
    const inCart = Cart.qty(r.id);
    return `<article class="rate" data-id="${esc(r.id)}">
      <div class="ph"><img src="${esc(r.img)}" alt="" loading="lazy"></div>
      <div class="info">
        <div class="nm">${esc(L(r))}</div>
        <div class="pr">${money(r.price)} <small>${esc(unitLbl(r.unit))}</small></div>
        <button type="button" class="btn small ${inCart ? "ghost" : ""}" data-add="${esc(r.id)}" data-unit="${esc(r.unit)}">${esc(t(inCart ? "added" : "add"))}</button>
      </div>
    </article>`;
  }
  function bindAdd(root) {
    root.addEventListener("click", e => {
      const b = e.target.closest("[data-add]"); if (!b) return;
      if (Cart.qty(b.dataset.add)) { location.href = "cart.html"; return; }
      Cart.add(b.dataset.add, b.dataset.unit);
      b.textContent = t("added"); b.classList.add("ghost");
    });
  }

  const pages = {};

  // ================= HOME =================
  pages.home = async () => {
    const rates = await getRates();
    const top = ["newspaper", "cardboard", "iron", "aluminium", "copper", "fridge"].map(id => rates.find(r => r.id === id)).filter(Boolean);
    const news = (await Store.list("news", "date", true).catch(() => DEFAULT_NEWS)).slice(0, 2);
    app().innerHTML = `
    <section class="hero">
      <div class="hero-txt">
        <h1>${esc(t("hero_t1"))} <em>${esc(t("hero_t2"))}</em></h1>
        <p>${esc(t("hero_p"))}</p>
        <div class="cta"><a class="btn sun" href="rates.html">${esc(t("hero_cta"))}</a><a class="btn ghost" href="rates.html">${esc(t("hero_cta2"))}</a></div>
      </div>
      <div class="hero-scale" aria-hidden="true">
        <div class="lcd"><span>Kg</span><b id="lcd">00.0</b></div>
        <div class="pan"></div>
      </div>
    </section>

    <section>
      <div class="sec-head"><h2>${esc(t("how_title"))}</h2></div>
      <ol class="how">
        <li><b>1</b><h3>${esc(t("how1_t"))}</h3><p>${esc(t("how1_p"))}</p></li>
        <li><b>2</b><h3>${esc(t("how2_t"))}</h3><p>${esc(t("how2_p"))}</p></li>
        <li><b>3</b><h3>${esc(t("how3_t"))}</h3><p>${esc(t("how3_p"))}</p></li>
      </ol>
    </section>

    <section>
      <div class="sec-head"><h2>${esc(t("popular"))}</h2><a href="rates.html">${esc(t("see_all"))}</a></div>
      <div class="rates" id="topRates">${top.map(rateCard).join("")}</div>
    </section>

    <section class="why">
      <h2>${esc(t("why_title"))}</h2>
      <ul>${["why1", "why2", "why3", "why4"].map(k => `<li>${esc(t(k))}</li>`).join("")}</ul>
    </section>

    <section>
      <div class="sec-head"><h2>${esc(t("latest_news"))}</h2><a href="news.html">${esc(t("see_all"))}</a></div>
      <div class="news">${news.map(newsCard).join("")}</div>
    </section>`;
    bindAdd($("#topRates"));
    // kaanta animation
    const lcd = $("#lcd"); const target = 48.6;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) lcd.textContent = target.toFixed(1);
    else { let v = 0; const tm = setInterval(() => { v += target / 30; if (v >= target) { v = target; clearInterval(tm); } lcd.textContent = v.toFixed(1).padStart(4, "0"); }, 35); }
  };

  // ================= RATES =================
  pages.rates = async () => {
    const rates = await getRates();
    app().innerHTML = `${head("rates_title", "rates_sub")}
      <div class="filters">
        <input type="search" id="rq" data-i18n-ph="search_ph" aria-label="Search">
        <div class="chips" id="cats" role="tablist">
          <button type="button" data-cat="" aria-pressed="true">${esc(t("all"))}</button>
          ${CATEGORIES.map(c => `<button type="button" data-cat="${c.id}" aria-pressed="false">${esc(L(c))}</button>`).join("")}
        </div>
      </div>
      <p class="muted">${esc(t("updated"))} ${esc(fmtDate(iso(new Date())))}</p>
      <div id="rateGroups"></div>
      <p class="note">${esc(t("rates_note"))}</p>
      <a class="btn cartbar" href="cart.html" id="goCart" hidden></a>`;
    applyI18n(app());
    let cat = "", q = "";
    const draw = () => {
      const groups = CATEGORIES.filter(c => !cat || c.id === cat).map(c => {
        const items = rates.filter(r => r.cat === c.id && (!q || (r.hi + " " + r.en).toLowerCase().includes(q)));
        return items.length ? `<h2 class="grp">${esc(L(c))}</h2><div class="rates">${items.map(rateCard).join("")}</div>` : "";
      }).join("");
      $("#rateGroups").innerHTML = groups || `<div class="empty">—</div>`;
    };
    const bar = () => { const n = Cart.count(); const g = $("#goCart"); g.hidden = !n; g.textContent = `${t("cart")} (${n}) →`; };
    draw(); bar();
    document.addEventListener("cart", bar);
    $("#rq").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); draw(); });
    $("#cats").addEventListener("click", e => {
      const b = e.target.closest("[data-cat]"); if (!b) return;
      cat = b.dataset.cat; $("#cats").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw();
    });
    bindAdd($("#rateGroups"));
  };

  // ================= CART + CHECKOUT =================
  pages.cart = async () => {
    const rates = await getRates();
    const today = new Date(), tm = new Date(); tm.setDate(today.getDate() + 1);
    app().innerHTML = `${head("cart_title")}
    <div class="checkout">
      <div class="col">
        <div class="panel" id="cartBox"></div>
        <div class="panel">
          <h3 class="mini">${esc(t("quick_add"))}</h3>
          <div class="chips" id="quick"></div>
        </div>
      </div>
      <div class="col">
        <form class="panel" id="bookForm" novalidate>
          <h3 class="mini">${esc(t("step_details"))}</h3>
          <div class="row2">
            <label for="f_name">${esc(t("f_name"))}<input id="f_name" autocomplete="name" required></label>
            <label for="f_phone">${esc(t("f_phone"))}<input id="f_phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel" required></label>
          </div>
          <label for="f_addr">${esc(t("f_addr"))}<textarea id="f_addr" autocomplete="street-address" data-i18n-ph="f_addr_ph" required></textarea></label>
          <div class="row2">
            <label for="f_pin">${esc(t("f_pin"))}<input id="f_pin" inputmode="numeric" maxlength="6" autocomplete="postal-code"><small class="warn" id="pinWarn" hidden>${esc(t("err_pin"))}</small></label>
            <label for="f_date">${esc(t("f_date"))}<input id="f_date" type="date" min="${iso(today)}" value="${iso(tm)}" required></label>
          </div>
          <div class="row2">
            <label for="f_slot">${esc(t("f_slot"))}<select id="f_slot"><option value="slot1">${esc(t("slot1"))}</option><option value="slot2">${esc(t("slot2"))}</option><option value="slot3">${esc(t("slot3"))}</option></select></label>
            <label for="f_note">${esc(t("f_note"))}<input id="f_note" data-i18n-ph="f_note_ph"></label>
          </div>

          <h3 class="mini">${esc(t("pay_title"))}</h3>
          <div class="pay" role="radiogroup">
            ${[["cash", "pay_cash", "pay_cash_d", "💵"], ["upi", "pay_upi", "pay_upi_d", "📲"], ["donate", "pay_donate", "pay_donate_d", "🤝"]].map(([v, k, d, ic], i) =>
              `<label class="payopt"><input type="radio" name="pay" id="pay_${v}" value="${v}" ${i === 0 ? "checked" : ""}><span class="pi">${ic}</span><span><b>${esc(t(k))}</b><small>${esc(t(d))}</small></span></label>`).join("")}
          </div>
          <label for="f_upi" id="upiWrap" hidden>${esc(t("f_upi"))}<input id="f_upi" data-i18n-ph="f_upi_ph" autocomplete="off"></label>

          <p class="err" id="formErr" hidden></p>
          <button class="btn big" id="submitBtn" type="submit">${esc(t("confirm"))}</button>
        </form>
        <div class="panel done" id="doneBox" hidden>
          <div class="tick">✓</div><h3>${esc(t("done_t"))}</h3>
          <p>${esc(t("done_id"))}</p><code id="doneId"></code>
          <p class="muted">${esc(t("done_p"))}</p>
          <div class="cta"><a class="btn" id="trackLink" href="track.html">${esc(t("track_it"))}</a><a class="btn ghost" href="rates.html">${esc(t("book_again"))}</a></div>
        </div>
      </div>
    </div>`;
    applyI18n(app());

    function drawCart() {
      const lines = Cart.lines(rates);
      const total = lines.reduce((s, l) => s + l.amount, 0);
      const kg = lines.filter(l => l.unit === "kg").reduce((s, l) => s + l.qty, 0);
      $("#cartBox").innerHTML = !lines.length ? `<div class="empty">${esc(t("cart_empty"))}<br><br><a class="btn small" href="rates.html">${esc(t("nav_rates"))}</a></div>` : `
        <div class="lines">${lines.map(l => `
          <div class="line" data-id="${esc(l.id)}">
            <img src="${esc(l.img)}" alt="">
            <div class="lmeta"><b>${esc(L(l))}</b><small>${money(l.price)} ${esc(unitLbl(l.unit))}</small></div>
            <div class="stepper">
              <button type="button" data-step="-1" aria-label="−">−</button>
              <input type="number" inputmode="decimal" min="0" step="${l.unit === "pc" ? 1 : 0.5}" value="${l.qty}" aria-label="${esc(t("qty"))}">
              <span>${esc(unitShort(l.unit))}</span>
              <button type="button" data-step="1" aria-label="+">+</button>
            </div>
            <div class="lamt">${money(l.amount)}</div>
            <button type="button" class="x" data-rm aria-label="${esc(t("remove"))}">✕</button>
          </div>`).join("")}
        </div>
        <div class="total"><span>${esc(t("est_total"))}</span><b>${money(total)}</b></div>
        <p class="muted small">${esc(t("est_note"))} ${esc(t("min_note", { n: B.minPickupKg || 10 }))}${kg && kg < (B.minPickupKg || 10) && lines.every(l => l.unit === "kg") ? " ⚠️" : ""}</p>`;
      const inCart = Cart.all();
      $("#quick").innerHTML = rates.filter(r => !inCart[r.id]).map(r => `<button type="button" data-add="${esc(r.id)}" data-unit="${esc(r.unit)}">+ ${esc(L(r))}</button>`).join("");
    }
    drawCart();
    document.addEventListener("cart", drawCart);
    $("#quick").addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) Cart.add(b.dataset.add, b.dataset.unit); });
    $("#cartBox").addEventListener("click", e => {
      const line = e.target.closest(".line"); if (!line) return;
      const id = line.dataset.id, r = rates.find(x => x.id === id);
      if (e.target.closest("[data-rm]")) return Cart.set(id, 0);
      const s = e.target.closest("[data-step]");
      if (s) { const step = r.unit === "pc" ? 1 : (Cart.qty(id) >= 20 ? 5 : 1); Cart.set(id, Math.max(r.unit === "pc" ? 1 : 0.5, Cart.qty(id) + step * Number(s.dataset.step))); }
    });
    $("#cartBox").addEventListener("change", e => { if (e.target.matches("input")) Cart.set(e.target.closest(".line").dataset.id, e.target.value); });

    // payment
    $("#bookForm").addEventListener("change", e => { if (e.target.name === "pay") $("#upiWrap").hidden = e.target.value !== "upi"; });
    $("#f_pin").addEventListener("blur", e => { const p = e.target.value.trim(); $("#pinWarn").hidden = !p || !(B.pincodes || []).length || (B.pincodes || []).includes(p); });

    // prefill returning customer
    try { const me = JSON.parse(localStorage.getItem("ss_me")) || {}; ["name", "phone", "addr", "pin"].forEach(k => { if (me[k]) $("#f_" + k).value = me[k]; }); } catch (e) {}

    $("#bookForm").addEventListener("submit", async e => {
      e.preventDefault();
      const err = $("#formErr"), btn = $("#submitBtn"); err.hidden = true;
      const v = id => $("#" + id).value.trim();
      const pay = (document.querySelector("input[name=pay]:checked") || {}).value || "cash";
      const lines = Cart.lines(rates);
      const d = { name: v("f_name"), phone: v("f_phone").replace(/\D/g, ""), address: v("f_addr"), pincode: v("f_pin"),
        date: v("f_date"), slot: t($("#f_slot").value), note: v("f_note"), payMethod: pay, upi: pay === "upi" ? v("f_upi") : "" };
      const problem = !d.name ? "err_name" : !/^[6-9]\d{9}$/.test(d.phone) ? "err_phone" : d.address.length < 8 ? "err_addr"
        : !lines.length ? "err_cart" : !d.date ? "err_date" : (pay === "upi" && d.upi.length < 5) ? "err_upi" : "";
      if (problem) { err.textContent = t(problem); err.hidden = false; err.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
      d.items = lines.map(l => ({ id: l.id, name: l.hi + " / " + l.en, unit: l.unit, price: l.price, qty: l.qty }));
      d.estimate = Math.round(lines.reduce((s, l) => s + l.amount, 0));
      d.status = "Naya"; d.lang = LANG;
      btn.disabled = true; btn.textContent = t("saving");
      try {
        const id = await Store.create("orders", d, "SS");
        myBookings.add(id);
        try { localStorage.setItem("ss_me", JSON.stringify({ name: d.name, phone: d.phone, addr: d.address, pin: d.pincode })); } catch (e2) {}
        Cart.clear();
        $("#doneId").textContent = id; $("#trackLink").href = "track.html#" + id;
        $("#bookForm").hidden = true; $("#doneBox").hidden = false; $("#doneBox").scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (e2) {
        console.error(e2); err.textContent = t("err_save"); err.hidden = false;
      } finally { btn.disabled = false; btn.textContent = t("confirm"); }
    });
  };

  // ================= TRACK =================
  pages.track = async () => {
    app().innerHTML = `${head("track_title")}
      <form class="panel inline" id="trForm"><input id="trId" data-i18n-ph="track_ph" autocapitalize="characters" required><button class="btn" type="submit">${esc(t("track_btn"))}</button></form>
      <div id="trOut"></div>
      <div id="trMine"></div>`;
    applyI18n(app());
    const STEPS = ["Naya", "Confirmed", "Picked", "Paid"];
    async function show(id) {
      id = id.trim().toUpperCase(); if (!id) return;
      $("#trId").value = id;
      $("#trOut").innerHTML = `<div class="panel muted">…</div>`;
      let o = null; try { o = await Store.get("orders", id); } catch (e) {}
      if (!o) { $("#trOut").innerHTML = `<div class="panel empty">${esc(t("track_none"))}</div>`; return; }
      const cur = o.status === "Cancel" ? -1 : STEPS.indexOf(o.status);
      $("#trOut").innerHTML = `<div class="panel">
        <div class="sec-head"><h2>#${esc(id)}</h2><span class="pill ${esc(o.status)}">${esc(t("st_" + o.status))}</span></div>
        ${o.status === "Cancel" ? "" : `<ol class="timeline">${STEPS.map((s, i) => `<li class="${i <= cur ? "on" : ""}">${esc(t("st_" + s))}</li>`).join("")}</ol>`}
        <dl class="kv">
          <dt>${esc(t("f_date"))}</dt><dd>${esc(fmtDate(o.date))} · ${esc(o.slot || "")}</dd>
          <dt>${esc(t("cart"))}</dt><dd>${esc((o.items || []).map(i => i.name.split(" / ")[LANG === "en" ? 1 : 0] + " " + i.qty + " " + unitShort(i.unit)).join(", "))}</dd>
          <dt>${esc(t("est_total"))}</dt><dd>${money(o.estimate)}</dd>
          ${o.finalAmount ? `<dt>${esc(t("final_amt"))}</dt><dd><b>${money(o.finalAmount)}</b></dd>` : ""}
        </dl></div>`;
    }
    $("#trForm").addEventListener("submit", e => { e.preventDefault(); show($("#trId").value); history.replaceState(null, "", "#" + $("#trId").value.trim().toUpperCase()); });
    const mine = myBookings.get();
    if (mine.length) $("#trMine").innerHTML = `<h3 class="mini">${esc(t("recent"))}</h3><div class="chips">${mine.map(id => `<button type="button" data-tr="${esc(id)}">#${esc(id)}</button>`).join("")}</div>`;
    $("#trMine").addEventListener("click", e => { const b = e.target.closest("[data-tr]"); if (b) show(b.dataset.tr); });
    const h = location.hash.slice(1); if (h) show(h); else if (mine[0]) show(mine[0]);
  };

  // ================= NEWS =================
  function newsCard(n) {
    return `<article class="newscard"><time>${esc(fmtDate(n.date))}</time><h3>${esc(L(n.title))}</h3><p>${esc(L(n.body))}</p></article>`;
  }
  pages.news = async () => {
    const news = await Store.list("news", "date", true).catch(() => DEFAULT_NEWS);
    app().innerHTML = `${head("news_title", "news_sub")}<div class="news">${news.map(newsCard).join("") || `<div class="empty">—</div>`}</div>`;
  };

  // ================= GALLERY =================
  pages.gallery = async () => {
    app().innerHTML = `${head("gallery_title", "gallery_sub")}
      <div class="gallery">${GALLERY.map((g, i) => `<button type="button" class="gitem" data-i="${i}"><img src="${esc(g.img)}" alt="${esc(L(g))}" loading="lazy"><span>${esc(L(g))}</span></button>`).join("")}</div>
      <div class="lightbox" id="lb" hidden><button type="button" class="iconbtn" id="lbClose" aria-label="${esc(t("close"))}">✕</button><figure><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure></div>`;
    const lb = $("#lb");
    $(".gallery").addEventListener("click", e => { const b = e.target.closest(".gitem"); if (!b) return; const g = GALLERY[b.dataset.i]; $("#lbImg").src = g.img; $("#lbCap").textContent = L(g); lb.hidden = false; $("#lbClose").focus(); });
    lb.addEventListener("click", e => { if (e.target === lb || e.target.closest("#lbClose")) lb.hidden = true; });
    document.addEventListener("keydown", e => { if (e.key === "Escape") lb.hidden = true; });
  };

  // ================= LOCATOR =================
  pages.locator = async () => {
    const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(B.address || "");
    app().innerHTML = `${head("loc_title", "loc_sub")}
      <form class="panel inline" id="pinForm"><input id="pin" inputmode="numeric" maxlength="6" data-i18n-ph="loc_pin_ph" required><button class="btn" type="submit">${esc(t("loc_check"))}</button></form>
      <div id="pinOut"></div>
      <div class="cards2">
        <div class="panel"><h3 class="mini">${esc(t("loc_shop"))}</h3><p>📍 ${esc(B.address)}</p><a class="btn" href="${esc(maps)}" target="_blank" rel="noopener">${esc(t("loc_dir"))}</a></div>
        <div class="panel"><h3 class="mini">${esc(t("loc_hours"))}</h3><p>🕘 ${esc(L(B.hours))}</p><h3 class="mini">${esc(t("loc_areas"))}</h3><div class="chips static">${(B.pincodes || []).map(p => `<span>${esc(p)}</span>`).join("")}</div></div>
      </div>`;
    applyI18n(app());
    $("#pinForm").addEventListener("submit", e => {
      e.preventDefault(); const p = $("#pin").value.trim();
      const ok = (B.pincodes || []).includes(p);
      $("#pinOut").innerHTML = `<div class="panel result ${ok ? "ok" : "no"}"><b>${ok ? "✓" : "!"}</b> ${esc(t(ok ? "loc_yes" : "loc_no"))} ${ok ? `<a class="btn small" href="rates.html">${esc(t("hero_cta"))}</a>` : `<span class="sel">📞 ${esc(B.phone)}</span>`}</div>`;
    });
  };

  // ================= CAREERS =================
  pages.careers = async () => {
    app().innerHTML = `${head("car_title", "car_sub")}
      <div class="jobs">${JOBS.map(j => `<article class="panel job"><div><h3>${esc(L(j.title))}</h3><span class="pill Confirmed">${esc(L(j.type))}</span></div><p>${esc(L(j.desc))}</p><button type="button" class="btn small" data-job="${esc(j.id)}">${esc(t("apply"))}</button></article>`).join("")}</div>
      <form class="panel" id="appForm" novalidate>
        <h3 class="mini">${esc(t("apply"))}</h3>
        <label for="a_job">${esc(t("apply_for"))}<select id="a_job">${JOBS.map(j => `<option value="${esc(j.id)}">${esc(L(j.title))}</option>`).join("")}</select></label>
        <div class="row2">
          <label for="a_name">${esc(t("f_name"))}<input id="a_name" autocomplete="name"></label>
          <label for="a_phone">${esc(t("f_phone"))}<input id="a_phone" type="tel" inputmode="numeric" maxlength="10"></label>
        </div>
        <label for="a_exp">${esc(t("f_exp"))}<input id="a_exp" data-i18n-ph="f_exp_ph"></label>
        <p class="err" id="aErr" hidden></p>
        <button class="btn" type="submit">${esc(t("send"))}</button>
      </form>
      <div class="panel done" id="aDone" hidden><div class="tick">✓</div><p>${esc(t("apply_done"))}</p></div>`;
    applyI18n(app());
    $(".jobs").addEventListener("click", e => { const b = e.target.closest("[data-job]"); if (!b) return; $("#a_job").value = b.dataset.job; $("#appForm").scrollIntoView({ behavior: "smooth" }); $("#a_name").focus({ preventScroll: true }); });
    $("#appForm").addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#a_name").value.trim(), phone = $("#a_phone").value.replace(/\D/g, "");
      const p = !name ? "err_name" : !/^[6-9]\d{9}$/.test(phone) ? "err_phone" : "";
      if (p) { $("#aErr").textContent = t(p); $("#aErr").hidden = false; return; }
      try {
        const job = JOBS.find(j => j.id === $("#a_job").value);
        await Store.create("applications", { job: job.title.hi + " / " + job.title.en, name, phone, experience: $("#a_exp").value.trim(), status: "Naya" }, "JB");
        $("#appForm").hidden = true; $("#aDone").hidden = false;
      } catch (er) { $("#aErr").textContent = t("err_save"); $("#aErr").hidden = false; }
    });
  };

  // ================= ABOUT =================
  pages.about = async () => {
    app().innerHTML = `${head("about_title")}
      <div class="about">
        <div class="prose"><p>${esc(t("about_p1"))}</p><p>${esc(t("about_p2"))}</p></div>
        <img src="images/gallery/team.svg" alt="" class="about-img">
      </div>
      <section><h2>${esc(t("values"))}</h2><ul class="vals">${["v1", "v2", "v3", "v4"].map(k => `<li>${esc(t(k))}</li>`).join("")}</ul></section>
      <section><h2>${esc(t("how_title"))}</h2>
        <ol class="how"><li><b>1</b><h3>${esc(t("how1_t"))}</h3><p>${esc(t("how1_p"))}</p></li><li><b>2</b><h3>${esc(t("how2_t"))}</h3><p>${esc(t("how2_p"))}</p></li><li><b>3</b><h3>${esc(t("how3_t"))}</h3><p>${esc(t("how3_p"))}</p></li></ol>
      </section>`;
  };

  // ================= CONTACT =================
  pages.contact = async () => {
    app().innerHTML = `${head("con_title", "con_sub")}
      <div class="cards3">
        <div class="panel"><h3 class="mini">${esc(t("con_phone"))}</h3><p class="big sel">${esc(B.phone)}</p><div class="cta"><a class="btn small" href="tel:+91${esc(B.phone)}">${esc(t("call"))}</a><a class="btn small sun" href="https://wa.me/91${esc(B.phone)}" target="_blank" rel="noopener">${esc(t("whatsapp"))}</a><button type="button" class="btn small ghost" data-copy="${esc(B.phone)}">${esc(t("copy"))}</button></div></div>
        <div class="panel"><h3 class="mini">${esc(t("con_email"))}</h3><p class="sel">${esc(B.email)}</p><button type="button" class="btn small ghost" data-copy="${esc(B.email)}">${esc(t("copy"))}</button></div>
        <div class="panel"><h3 class="mini">${esc(t("con_addr"))}</h3><p>${esc(B.address)}</p><p class="muted">${esc(L(B.hours))}</p></div>
      </div>
      <form class="panel" id="msgForm" novalidate>
        <div class="row2">
          <label for="m_name">${esc(t("f_name"))}<input id="m_name" autocomplete="name"></label>
          <label for="m_phone">${esc(t("f_phone"))}<input id="m_phone" type="tel" inputmode="numeric" maxlength="10"></label>
        </div>
        <label for="m_topic">${esc(t("f_topic"))}<select id="m_topic">${["t_q", "t_bulk", "t_complaint", "t_other"].map(k => `<option value="${k}">${esc(t(k))}</option>`).join("")}</select></label>
        <label for="m_msg">${esc(t("f_msg"))}<textarea id="m_msg"></textarea></label>
        <p class="err" id="mErr" hidden></p>
        <button class="btn" type="submit">${esc(t("send"))}</button>
      </form>
      <div class="panel done" id="mDone" hidden><div class="tick">✓</div><p>${esc(t("msg_done"))}</p></div>`;
    app().addEventListener("click", async e => {
      const b = e.target.closest("[data-copy]"); if (!b) return;
      try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = t("copied"); } catch (er) { const s = getSelection(), r = document.createRange(); r.selectNodeContents(b.previousElementSibling || b); s.removeAllRanges(); s.addRange(r); }
    });
    $("#msgForm").addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#m_name").value.trim(), phone = $("#m_phone").value.replace(/\D/g, ""), msg = $("#m_msg").value.trim();
      const p = !name ? "err_name" : !/^[6-9]\d{9}$/.test(phone) ? "err_phone" : msg.length < 3 ? "f_msg" : "";
      if (p) { $("#mErr").textContent = t(p); $("#mErr").hidden = false; return; }
      try {
        await Store.create("messages", { name, phone, topic: I18N[$("#m_topic").value][0], message: msg, status: "Naya" }, "MS");
        $("#msgForm").hidden = true; $("#mDone").hidden = false;
      } catch (er) { $("#mErr").textContent = t("err_save"); $("#mErr").hidden = false; }
    });
  };

  // ================= FAQ =================
  pages.faq = async () => {
    app().innerHTML = `${head("faq_title")}<div class="faq">${FAQ.map((f, i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(L(f.q))}</summary><p>${esc(L(f.a))}</p></details>`).join("")}</div>
      <div class="panel cta-panel"><p>${esc(t("con_sub"))}</p><a class="btn" href="contact.html">${esc(t("nav_contact"))}</a></div>`;
  };

  // ---- start ----
  renderLayout();
  const p = document.body.dataset.page;
  (pages[p] || pages.home)().then(() => applyI18n(app())).catch(e => { console.error(e); });
})();
