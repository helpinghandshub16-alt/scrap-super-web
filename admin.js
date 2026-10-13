(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = iso(new Date());
  const tm = new Date(); tm.setDate(tm.getDate() + 1); const tomorrow = iso(tm);

  if (!Store.isLive) { $("#demoBanner").hidden = false; $("#l_email").value = "demo@scrapsuper.in"; }

  let orders = [], unwatch = null;

  Store.onAuth(user => {
    $("#loginBox").hidden = !!user;
    $("#dash").hidden = !user;
    $("#logoutBtn").hidden = !user;
    if (user) {
      Store.seedRatesIfEmpty().catch(() => {});
      unwatch = Store.watchOrders(list => { orders = list; renderOrders(); });
      renderRates();
    } else if (unwatch) { unwatch(); unwatch = null; }
  });

  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    $("#loginErr").hidden = true;
    try {
      await Store.login($("#l_email").value.trim(), $("#l_pass").value);
      if (!Store.isLive) location.reload();
    } catch (er) {
      $("#loginErr").textContent = Store.isLive ? "Email ya password galat hai." : er.message;
      $("#loginErr").hidden = false;
    }
  });
  $("#logoutBtn").addEventListener("click", async () => { await Store.logout(); if (!Store.isLive) location.reload(); });

  // Tabs
  const tabs = { tabOrders: "paneOrders", tabRates: "paneRates" };
  Object.keys(tabs).forEach(t => $("#" + t).addEventListener("click", () => {
    Object.entries(tabs).forEach(([b, p]) => { $("#" + b).setAttribute("aria-selected", b === t); $("#" + p).hidden = b !== t; });
  }));

  // ---------- Orders ----------
  ["#q", "#fStatus", "#fDate"].forEach(s => $(s).addEventListener("input", renderOrders));

  function filtered() {
    const q = $("#q").value.trim().toLowerCase(), st = $("#fStatus").value, fd = $("#fDate").value;
    return orders.filter(o => {
      if (st && o.status !== st) return false;
      if (fd === "today" && o.date !== today) return false;
      if (fd === "tomorrow" && o.date !== tomorrow) return false;
      if (fd === "upcoming" && !(o.date >= today)) return false;
      if (q && !`${o.name} ${o.phone} ${o.address}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function fmtDate(d) {
    if (!d) return "";
    if (d === today) return "Aaj";
    if (d === tomorrow) return "Kal";
    return new Date(d + "T00:00").toLocaleDateString("hi-IN", { day: "numeric", month: "short" });
  }

  function renderOrders() {
    $("#sNew").textContent = orders.filter(o => o.status === "Naya").length;
    $("#sToday").textContent = orders.filter(o => o.date === today && o.status !== "Cancel").length;
    $("#sDone").textContent = orders.filter(o => o.status === "Picked").length;
    $("#sAll").textContent = orders.length;

    const list = filtered();
    if (!list.length) {
      $("#orderList").innerHTML = `<div class="empty">${orders.length ? "Is filter me koi order nahi." : "Abhi koi order nahi aaya. Jab customer website se pickup book karega, wo yahan turant dikhega."}</div>`;
      return;
    }
    $("#orderList").innerHTML = list.map(o => {
      const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.address);
      const wa = "https://wa.me/91" + o.phone + "?text=" + encodeURIComponent(`Namaste ${o.name} ji, Scrap Super se. Aapka pickup ${fmtDate(o.date)} ${o.slot || ""} ko confirm hai.`);
      return `
      <article class="order" data-id="${esc(o.id)}">
        <div class="hd">
          <div><h3>${esc(o.name)}</h3><div class="meta">#${esc(String(o.id).slice(0, 6).toUpperCase())} · ${new Date(o.createdAt).toLocaleString("hi-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</div></div>
          <span class="pill ${esc(o.status)}">${esc(o.status)}</span>
        </div>
        <div class="meta">
          <div>📞 <a href="tel:+91${esc(o.phone)}">${esc(o.phone)}</a> · <a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a></div>
          <div>📍 ${esc(o.address)} · <a href="${esc(maps)}" target="_blank" rel="noopener">Map</a></div>
          <div>♻️ ${esc((o.items || []).join(", "))}${o.qty ? " · " + esc(o.qty) : ""}</div>
          <div>🗓️ <b>${esc(fmtDate(o.date))}</b> · ${esc(o.slot || "")}</div>
          ${o.note ? `<div>📝 ${esc(o.note)}</div>` : ""}
        </div>
        <div class="acts">
          <select aria-label="Status badlein" data-act="status">
            ${["Naya", "Confirmed", "Picked", "Cancel"].map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
          </select>
          <button class="btn small danger" data-act="del" type="button">Delete</button>
        </div>
      </article>`;
    }).join("");
  }

  $("#orderList").addEventListener("change", async e => {
    if (e.target.dataset.act !== "status") return;
    const id = e.target.closest(".order").dataset.id;
    await Store.updateOrder(id, { status: e.target.value });
    if (!Store.isLive) { orders.find(o => o.id === id).status = e.target.value; renderOrders(); }
  });
  $("#orderList").addEventListener("click", async e => {
    const b = e.target.closest("[data-act=del]"); if (!b) return;
    if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Pakka? Dobara dabayein"; setTimeout(() => { b.dataset.sure = ""; b.textContent = "Delete"; }, 3000); return; }
    const id = b.closest(".order").dataset.id;
    await Store.deleteOrder(id);
    if (!Store.isLive) { orders = orders.filter(o => o.id !== id); renderOrders(); }
  });

  $("#csvBtn").addEventListener("click", async () => {
    const rows = [["ID", "Naam", "Mobile", "Pata", "Scrap", "Vazan", "Tareekh", "Samay", "Note", "Status"]]
      .concat(filtered().map(o => [o.id, o.name, o.phone, o.address, (o.items || []).join(" + "), o.qty, o.date, o.slot, o.note, o.status]));
    const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    try { await navigator.clipboard.writeText(csv); $("#csvBtn").textContent = "Copy ho gaya ✓"; }
    catch (e) {
      const blob = new Blob(["﻿" + csv], { type: "text/csv" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "scrap-orders-" + today + ".csv"; a.click();
      $("#csvBtn").textContent = "Download ho gaya ✓";
    }
    setTimeout(() => $("#csvBtn").textContent = "Excel (CSV) copy", 2500);
  });

  // ---------- Rates ----------
  async function renderRates() {
    const rates = await Store.getRates();
    $("#rateList").innerHTML = rates.map(r => rateRow(r)).join("");
  }
  function rateRow(r) {
    return `<div class="rate-edit" data-id="${esc(r.id)}" data-order="${esc(r.order || 99)}">
      <img src="${esc(r.img)}" alt="">
      <div class="nmrow">
        <input value="${esc(r.name)}" data-f="name" aria-label="Naam">
        <input value="${esc(r.img)}" data-f="img" aria-label="Photo link">
      </div>
      <input type="number" inputmode="decimal" value="${esc(r.price)}" data-f="price" aria-label="Rate ₹/kg">
      <div style="display:grid;gap:4px">
        <button class="btn small" data-act="save" type="button">Save</button>
        <button class="btn small danger" data-act="rm" type="button">Hatao</button>
      </div>
    </div>`;
  }
  $("#rateList").addEventListener("click", async e => {
    const b = e.target.closest("button"); if (!b) return;
    const row = b.closest(".rate-edit"); const id = row.dataset.id;
    if (b.dataset.act === "save") {
      const v = f => row.querySelector(`[data-f=${f}]`).value.trim();
      await Store.saveRate({ id, name: v("name"), img: v("img"), price: Number(v("price")) || 0, unit: "kg", order: Number(row.dataset.order) });
      row.querySelector("img").src = v("img");
      b.textContent = "Saved ✓"; setTimeout(() => b.textContent = "Save", 1500);
    }
    if (b.dataset.act === "rm") {
      if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Pakka?"; return; }
      await Store.deleteRate(id); row.remove();
    }
  });
  $("#addRate").addEventListener("click", () => {
    const id = "item" + Date.now().toString(36);
    $("#rateList").insertAdjacentHTML("beforeend", rateRow({ id, name: "Naya scrap", img: "images/other.svg", price: 0, order: 50 }));
  });
})();
