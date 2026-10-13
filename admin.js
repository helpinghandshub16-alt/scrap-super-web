(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const money = n => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
  const today = iso(new Date());
  const tm = new Date(); tm.setDate(tm.getDate() + 1); const tomorrow = iso(tm);
  const B = window.BUSINESS || {};
  const PAY = { cash: "💵 Cash", upi: "📲 UPI", donate: "🤝 Daan" };

  if (!Store.isLive) { $("#demoBanner").hidden = false; $("#l_email").value = "demo@scrapsuper.in"; }

  let orders = [], apps = [], msgs = [], unsubs = [];

  // sab functions ban jaane ke baad login check
  setTimeout(() => Store.onAuth(user => {
    $("#loginBox").hidden = !!user; $("#dash").hidden = !user; $("#logoutBtn").hidden = !user;
    unsubs.forEach(u => u()); unsubs = [];
    if (!user) return;
    Store.seedIfEmpty("rates").catch(() => {});
    Store.seedIfEmpty("news").catch(() => {});
    unsubs.push(Store.watch("orders", l => { orders = l; renderOrders(); }));
    unsubs.push(Store.watch("applications", l => { apps = l; renderPeople("apps"); }));
    unsubs.push(Store.watch("messages", l => { msgs = l; renderPeople("msgs"); }));
    renderRates(); renderNews();
  }), 0);

  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault(); $("#loginErr").hidden = true;
    try { await Store.login($("#l_email").value.trim(), $("#l_pass").value); if (!Store.isLive) location.reload(); }
    catch (er) { $("#loginErr").textContent = Store.isLive ? "Email ya password galat hai." : er.message; $("#loginErr").hidden = false; }
  });
  $("#logoutBtn").addEventListener("click", async () => { await Store.logout(); if (!Store.isLive) location.reload(); });

  document.querySelector(".tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]"); if (!b) return;
    document.querySelectorAll("[data-tab]").forEach(x => x.setAttribute("aria-selected", x === b));
    document.querySelectorAll("[data-pane]").forEach(p => p.hidden = p.dataset.pane !== b.dataset.tab);
  });
  const badge = (id, n) => { const el = $(id); el.textContent = n; el.hidden = !n; };

  // demo mode me badlav ke baad dobara list padhna padta hai
  const refreshDemo = async c => {
    if (Store.isLive) return;
    const l = await Store.list(c);
    if (c === "orders") { orders = l; renderOrders(); } else if (c === "applications") { apps = l; renderPeople("apps"); } else { msgs = l; renderPeople("msgs"); }
  };
  // do baar dabane par delete
  const confirmTap = b => { if (b.dataset.sure === "1") return true; b.dataset.sure = "1"; const o = b.textContent; b.textContent = "Pakka? Dobara dabayein"; setTimeout(() => { b.dataset.sure = ""; b.textContent = o; }, 3000); return false; };

  // ================= ORDERS =================
  ["#q", "#fStatus", "#fDate"].forEach(s => $(s).addEventListener("input", renderOrders));
  function filtered() {
    const q = $("#q").value.trim().toLowerCase(), st = $("#fStatus").value, fd = $("#fDate").value;
    return orders.filter(o => {
      if (st && o.status !== st) return false;
      if (fd === "today" && o.date !== today) return false;
      if (fd === "tomorrow" && o.date !== tomorrow) return false;
      if (fd === "upcoming" && !(o.date >= today)) return false;
      if (q && !`${o.id} ${o.name} ${o.phone} ${o.address} ${o.pincode}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }
  const dlabel = d => !d ? "" : d === today ? "Aaj" : d === tomorrow ? "Kal" : new Date(d + "T00:00").toLocaleDateString("hi-IN", { day: "numeric", month: "short" });

  function renderOrders() {
    const ym = today.slice(0, 7);
    badge("#cOrders", orders.filter(o => o.status === "Naya").length);
    $("#sNew").textContent = orders.filter(o => o.status === "Naya").length;
    $("#sToday").textContent = orders.filter(o => o.date === today && !["Cancel", "Paid"].includes(o.status)).length;
    $("#sDue").textContent = orders.filter(o => o.status === "Picked").length;
    $("#sPaid").textContent = money(orders.filter(o => o.status === "Paid" && iso(new Date(o.paidAt || o.createdAt)).slice(0, 7) === ym).reduce((s, o) => s + (Number(o.finalAmount) || 0), 0));
    const list = filtered();
    if (!list.length) { $("#orderList").innerHTML = `<div class="empty">${orders.length ? "Is filter me koi order nahi." : "Abhi koi order nahi aaya. Customer website se booking karega to yahan turant dikhega."}</div>`; return; }
    $("#orderList").innerHTML = list.map(o => {
      const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.address + " " + (o.pincode || ""));
      const wa = "https://wa.me/91" + o.phone + "?text=" + encodeURIComponent(`Namaste ${o.name} ji, Scrap Super se. Aapka pickup (#${o.id}) ${dlabel(o.date)} ${o.slot || ""} ko confirm hai.`);
      const amt = Number(o.finalAmount) || 0;
      const upiLink = o.payMethod === "upi" && o.upi && amt
        ? `upi://pay?pa=${encodeURIComponent(o.upi.includes("@") ? o.upi : o.upi + "@upi")}&pn=${encodeURIComponent(o.name)}&am=${amt}&cu=INR&tn=${encodeURIComponent("Scrap Super " + o.id)}` : "";
      const items = (o.items || []).map(i => `${esc(i.name.split(" / ")[0])} <b>${esc(i.qty)}${i.unit === "pc" ? " नग" : " kg"}</b>`).join(", ");
      return `
      <article class="order" data-id="${esc(o.id)}">
        <div class="hd">
          <div><h3>${esc(o.name)}</h3><div class="meta">#${esc(o.id)} · ${new Date(o.createdAt).toLocaleString("hi-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</div></div>
          <span class="pill ${esc(o.status)}">${esc(o.status)}</span>
        </div>
        <div class="meta">
          <div>📞 <a href="tel:+91${esc(o.phone)}">${esc(o.phone)}</a> · <a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a></div>
          <div>📍 ${esc(o.address)}${o.pincode ? " – " + esc(o.pincode) : ""} · <a href="${esc(maps)}" target="_blank" rel="noopener">Map</a></div>
          <div>♻️ ${items || "—"}</div>
          <div>🗓️ <b>${esc(dlabel(o.date))}</b> · ${esc(o.slot || "")}</div>
          <div>💰 Anumaan ${money(o.estimate)} · ${esc(PAY[o.payMethod] || "Cash")}${o.upi ? ` <span style="user-select:all">${esc(o.upi)}</span>` : ""}${amt ? ` · <b>Final ${money(amt)}</b>` : ""}</div>
          ${o.note ? `<div>📝 ${esc(o.note)}</div>` : ""}
        </div>
        <div class="acts">
          <select aria-label="Status" data-act="status">${["Naya", "Confirmed", "Picked", "Paid", "Cancel"].map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select>
          <input type="number" inputmode="decimal" placeholder="Final ₹" value="${amt || ""}" data-act="amt" aria-label="Final amount">
          <button class="btn small" data-act="saveamt" type="button">₹ Save</button>
          ${upiLink ? `<a class="btn small sun" href="${esc(upiLink)}">UPI se ${money(amt)} bhejein</a>` : ""}
          <button class="btn small danger" data-act="del" type="button">Delete</button>
        </div>
      </article>`;
    }).join("");
  }
  $("#orderList").addEventListener("change", async e => {
    if (e.target.dataset.act !== "status") return;
    const id = e.target.closest(".order").dataset.id, s = e.target.value;
    await Store.update("orders", id, s === "Paid" ? { status: s, paidAt: Date.now() } : { status: s }); refreshDemo("orders");
  });
  $("#orderList").addEventListener("click", async e => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const card = b.closest(".order"), id = card.dataset.id;
    if (b.dataset.act === "saveamt") {
      const v = Number(card.querySelector("[data-act=amt]").value) || 0;
      await Store.update("orders", id, { finalAmount: v }); refreshDemo("orders");
    }
    if (b.dataset.act === "del" && confirmTap(b)) { await Store.remove("orders", id); refreshDemo("orders"); }
  });
  $("#csvBtn").addEventListener("click", () => {
    const rows = [["Booking", "Tareekh", "Samay", "Naam", "Mobile", "Pata", "Pincode", "Saman", "Anumaan", "Final", "Payment", "UPI", "Status", "Note"]]
      .concat(filtered().map(o => [o.id, o.date, o.slot, o.name, o.phone, o.address, o.pincode, (o.items || []).map(i => i.name.split(" / ")[1] + " " + i.qty + i.unit).join(" + "), o.estimate, o.finalAmount || "", o.payMethod, o.upi, o.status, o.note]));
    const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" })); a.download = "scrap-orders-" + today + ".csv"; a.click();
  });

  // ================= RATES =================
  async function renderRates() {
    const rates = await Store.list("rates", "order", false);
    $("#rateList").innerHTML = rates.map(rateRow).join("");
  }
  function rateRow(r) {
    return `<div class="rate-edit" data-id="${esc(r.id)}" data-order="${esc(r.order || 99)}">
      <img src="${esc(r.img)}" alt="">
      <div class="nmrow">
        <input value="${esc(r.hi)}" data-f="hi" aria-label="Naam (Hindi)" placeholder="Naam (Hindi)">
        <input value="${esc(r.en)}" data-f="en" aria-label="Name (English)" placeholder="Name (English)">
      </div>
      <input type="number" inputmode="decimal" value="${esc(r.price)}" data-f="price" aria-label="Rate ₹">
      <div class="ract">
        <select data-f="unit" aria-label="Unit"><option value="kg" ${r.unit === "kg" ? "selected" : ""}>₹ / kg</option><option value="pc" ${r.unit === "pc" ? "selected" : ""}>₹ / नग</option></select>
        <select data-f="cat" aria-label="Category">${CATEGORIES.map(c => `<option value="${c.id}" ${c.id === r.cat ? "selected" : ""}>${esc(c.hi)}</option>`).join("")}</select>
        <input value="${esc(r.img)}" data-f="img" aria-label="Photo link" placeholder="Photo link" style="flex:1;min-width:120px">
        <button class="btn small" data-act="save" type="button">Save</button>
        <button class="btn small danger" data-act="rm" type="button">Hatao</button>
      </div>
    </div>`;
  }
  $("#rateList").addEventListener("click", async e => {
    const b = e.target.closest("button"); if (!b) return;
    const row = b.closest(".rate-edit"), id = row.dataset.id;
    const v = f => row.querySelector(`[data-f=${f}]`).value.trim();
    if (b.dataset.act === "save") {
      await Store.set("rates", id, { hi: v("hi"), en: v("en") || v("hi"), img: v("img"), price: Number(v("price")) || 0, unit: v("unit"), cat: v("cat"), order: Number(row.dataset.order) });
      row.querySelector("img").src = v("img"); b.textContent = "Saved ✓"; setTimeout(() => b.textContent = "Save", 1500);
    }
    if (b.dataset.act === "rm" && confirmTap(b)) { await Store.remove("rates", id); row.remove(); }
  });
  $("#addRate").addEventListener("click", () => {
    $("#rateList").insertAdjacentHTML("beforeend", rateRow({ id: "item" + Date.now().toString(36), hi: "", en: "", img: "images/other.svg", price: 0, unit: "kg", cat: "metal", order: 100 }));
    $("#rateList").lastElementChild.querySelector("input").focus();
  });

  // ================= NEWS =================
  $("#n_date").value = today;
  async function renderNews() {
    const news = await Store.list("news", "date", true);
    $("#newsList").innerHTML = news.map(n => `<article class="order" data-id="${esc(n.id)}"><div class="hd"><div><h3>${esc(n.title.hi)}</h3><div class="meta">${esc(n.date)} · ${esc(n.title.en)}</div></div><button class="btn small danger" data-act="del" type="button">Delete</button></div><div class="meta">${esc(n.body.hi)}</div></article>`).join("") || `<div class="empty">Koi khabar nahi.</div>`;
  }
  $("#newsForm").addEventListener("submit", async e => {
    e.preventDefault();
    const v = id => $("#" + id).value.trim();
    await Store.set("news", "n" + Date.now().toString(36), { date: v("n_date"), title: { hi: v("n_thi"), en: v("n_ten") || v("n_thi") }, body: { hi: v("n_bhi"), en: v("n_ben") || v("n_bhi") } });
    ["n_thi", "n_ten", "n_bhi", "n_ben"].forEach(id => $("#" + id).value = "");
    renderNews();
  });
  $("#newsList").addEventListener("click", async e => {
    const b = e.target.closest("[data-act=del]"); if (!b || !confirmTap(b)) return;
    await Store.remove("news", b.closest(".order").dataset.id); renderNews();
  });

  // ================= APPLICATIONS + MESSAGES =================
  function renderPeople(kind) {
    const list = kind === "apps" ? apps : msgs, el = kind === "apps" ? "#appList" : "#msgList", c = kind === "apps" ? "applications" : "messages";
    badge(kind === "apps" ? "#cApps" : "#cMsgs", list.filter(x => x.status === "Naya").length);
    $(el).innerHTML = list.map(x => `
      <article class="order" data-id="${esc(x.id)}" data-c="${c}">
        <div class="hd"><div><h3>${esc(x.name)}</h3><div class="meta">${esc(kind === "apps" ? x.job : x.topic)} · ${new Date(x.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short" })}</div></div><span class="pill ${x.status === "Naya" ? "Naya" : "Done"}">${x.status === "Naya" ? "Naya" : "Ho gaya"}</span></div>
        <div class="meta"><div>📞 <a href="tel:+91${esc(x.phone)}">${esc(x.phone)}</a> · <a href="https://wa.me/91${esc(x.phone)}" target="_blank" rel="noopener">WhatsApp</a></div>
        ${kind === "apps" ? (x.experience ? `<div>🧰 ${esc(x.experience)}</div>` : "") : `<div>💬 ${esc(x.message)}</div>`}</div>
        <div class="acts">${x.status === "Naya" ? `<button class="btn small" data-act="done" type="button">✓ Ho gaya</button>` : ""}<button class="btn small danger" data-act="del" type="button">Delete</button></div>
      </article>`).join("") || `<div class="empty">Abhi kuch nahi aaya.</div>`;
  }
  ["#appList", "#msgList"].forEach(sel => $(sel).addEventListener("click", async e => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const card = b.closest(".order"), c = card.dataset.c, id = card.dataset.id;
    if (b.dataset.act === "done") await Store.update(c, id, { status: "Done" });
    if (b.dataset.act === "del") { if (!confirmTap(b)) return; await Store.remove(c, id); }
    refreshDemo(c);
  }));
})();
