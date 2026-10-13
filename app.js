(async function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const phone = window.BUSINESS_PHONE || "";
  $("#callBtn").href = "tel:+91" + phone;
  $("#callBtn").textContent = "📞 " + phone;
  $("#footCity").textContent = window.BUSINESS_CITY || "";
  if (!Store.isLive) $("#demoBanner").hidden = false;

  // Date: aaj se pehle ki tareekh na chune
  const today = new Date();
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  $("#f_date").min = iso(today);
  $("#f_date").value = iso(tomorrow);
  $("#rateDate").textContent = today.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" });

  // Rates
  let rates = [];
  try { rates = await Store.getRates(); } catch (e) { console.error(e); }
  $("#rateGrid").innerHTML = rates.map(r => `
    <article class="rate">
      <div class="ph"><img src="${esc(r.img)}" alt="${esc(r.name)}" loading="lazy"></div>
      <div class="info">
        <div class="nm">${esc(r.name)}</div>
        <div class="pr">₹${esc(r.price)} <small>/ ${esc(r.unit || "kg")}</small></div>
      </div>
    </article>`).join("");
  $("#itemChips").innerHTML = rates.map(r =>
    `<label><input type="checkbox" name="items" value="${esc(r.name)}">${esc(r.name)}</label>`).join("") +
    `<label><input type="checkbox" name="items" value="Anya / Other">Anya / Other</label>`;

  // Booking
  const form = $("#bookForm"), err = $("#formErr"), btn = $("#submitBtn");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    err.hidden = true;
    const fd = new FormData(form);
    const items = fd.getAll("items");
    const data = {
      name: (fd.get("name") || "").trim(),
      phone: (fd.get("phone") || "").replace(/\D/g, ""),
      address: (fd.get("address") || "").trim(),
      items, qty: fd.get("qty") || "", date: fd.get("date"),
      slot: fd.get("slot"), note: (fd.get("note") || "").trim()
    };
    const problem =
      !data.name ? "Kripya apna naam likhein." :
      !/^[6-9]\d{9}$/.test(data.phone) ? "Sahi 10 digit mobile number likhein." :
      data.address.length < 8 ? "Kripya pura pata likhein." :
      !items.length ? "Kam se kam ek scrap chunein." :
      !data.date ? "Pickup ki tareekh chunein." : "";
    if (problem) { err.textContent = problem; err.hidden = false; return; }

    btn.disabled = true; btn.textContent = "Save ho raha hai…";
    try {
      const id = await Store.addOrder(data);
      $("#doneId").textContent = id;
      form.hidden = true; $("#doneBox").hidden = false;
      $("#book").scrollIntoView({ behavior: "smooth" });
    } catch (e2) {
      err.textContent = "Booking save nahi hui. Internet check karke dobara koshish karein, ya hamein call karein.";
      err.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = "Pickup confirm karein";
    }
  });
  $("#againBtn").addEventListener("click", () => {
    form.reset(); $("#f_date").value = iso(tomorrow);
    form.hidden = false; $("#doneBox").hidden = true;
  });

  // Install (PWA) prompt
  let deferred = null;
  const bar = $("#installBar");
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  let closed = false; try { closed = !!localStorage.getItem("ss_install_closed"); } catch (e) {}
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); deferred = e;
    if (!closed) bar.hidden = false;
  });
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS && !standalone && !closed) {
    $("#installText").textContent = "iPhone par: niche Share ⬆️ dabayein, phir “Add to Home Screen”";
    $("#installBtn").hidden = true;
    bar.hidden = false;
  }
  $("#installBtn").addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt(); await deferred.userChoice; deferred = null; bar.hidden = true;
  });
  $("#installClose").addEventListener("click", () => {
    bar.hidden = true; try { localStorage.setItem("ss_install_closed", "1"); } catch (e) {}
  });
})();
