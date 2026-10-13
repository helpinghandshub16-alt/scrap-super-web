// Data layer: Firebase Firestore agar config bhara hai, warna DEMO (localStorage)
(function () {
  const DEFAULT_RATES = [
    { id: "newspaper", name: "Akhbaar / Newspaper", price: 14, unit: "kg", img: "images/newspaper.svg", order: 1 },
    { id: "cardboard", name: "Gatta / Cardboard", price: 10, unit: "kg", img: "images/cardboard.svg", order: 2 },
    { id: "books", name: "Copy / Kitaab", price: 12, unit: "kg", img: "images/books.svg", order: 3 },
    { id: "plastic", name: "Plastic", price: 12, unit: "kg", img: "images/plastic.svg", order: 4 },
    { id: "iron", name: "Loha / Iron", price: 28, unit: "kg", img: "images/iron.svg", order: 5 },
    { id: "steel", name: "Steel", price: 40, unit: "kg", img: "images/steel.svg", order: 6 },
    { id: "aluminium", name: "Aluminium", price: 110, unit: "kg", img: "images/aluminium.svg", order: 7 },
    { id: "copper", name: "Tamba / Copper", price: 650, unit: "kg", img: "images/copper.svg", order: 8 },
    { id: "brass", name: "Peetal / Brass", price: 400, unit: "kg", img: "images/brass.svg", order: 9 },
    { id: "battery", name: "Battery (Inverter)", price: 80, unit: "kg", img: "images/battery.svg", order: 10 }
  ];

  const cfg = window.FIREBASE_CONFIG || {};
  const live = cfg.apiKey && cfg.apiKey !== "PASTE_HERE" && window.firebase;
  let fs = null, auth = null;
  if (live) {
    firebase.initializeApp(cfg);
    fs = firebase.firestore();
    auth = firebase.auth();
  }

  const ls = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  window.Store = {
    isLive: !!live,

    async getRates() {
      if (!live) return ls.get("ss_rates", DEFAULT_RATES);
      const snap = await fs.collection("rates").orderBy("order").get();
      if (snap.empty) return DEFAULT_RATES;
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async saveRate(rate) {
      if (!live) {
        const all = ls.get("ss_rates", DEFAULT_RATES);
        const i = all.findIndex(r => r.id === rate.id);
        if (i >= 0) all[i] = rate; else all.push(rate);
        ls.set("ss_rates", all); return;
      }
      const { id, ...data } = rate;
      await fs.collection("rates").doc(id).set(data);
    },

    async deleteRate(id) {
      if (!live) { ls.set("ss_rates", ls.get("ss_rates", DEFAULT_RATES).filter(r => r.id !== id)); return; }
      await fs.collection("rates").doc(id).delete();
    },

    async seedRatesIfEmpty() {
      if (!live) return;
      const snap = await fs.collection("rates").limit(1).get();
      if (!snap.empty) return;
      const batch = fs.batch();
      DEFAULT_RATES.forEach(({ id, ...d }) => batch.set(fs.collection("rates").doc(id), d));
      await batch.commit();
    },

    async addOrder(order) {
      const o = { ...order, status: "Naya", createdAt: Date.now() };
      if (!live) {
        const all = ls.get("ss_orders", []);
        o.id = "D" + Date.now().toString().slice(-6);
        all.unshift(o); ls.set("ss_orders", all); return o.id;
      }
      const ref = await fs.collection("orders").add(o);
      return ref.id.slice(0, 6).toUpperCase();
    },

    // callback har badlav par chalega (live updates)
    watchOrders(cb) {
      if (!live) { cb(ls.get("ss_orders", [])); return () => {}; }
      return fs.collection("orders").orderBy("createdAt", "desc").onSnapshot(
        s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))),
        e => alertBox("Orders load nahi hue: " + e.message)
      );
    },

    async updateOrder(id, patch) {
      if (!live) {
        const all = ls.get("ss_orders", []);
        const o = all.find(x => x.id === id); if (o) Object.assign(o, patch);
        ls.set("ss_orders", all); return;
      }
      await fs.collection("orders").doc(id).update(patch);
    },

    async deleteOrder(id) {
      if (!live) { ls.set("ss_orders", ls.get("ss_orders", []).filter(x => x.id !== id)); return; }
      await fs.collection("orders").doc(id).delete();
    },

    // ---- Admin login ----
    onAuth(cb) {
      if (!live) { cb(sessionStorage.getItem("ss_demo_admin") ? { email: "demo" } : null); return; }
      auth.onAuthStateChanged(cb);
    },
    async login(email, pass) {
      if (!live) {
        if (pass !== "admin123") throw new Error("Demo password: admin123");
        sessionStorage.setItem("ss_demo_admin", "1"); return;
      }
      await auth.signInWithEmailAndPassword(email, pass);
    },
    async logout() {
      if (!live) { sessionStorage.removeItem("ss_demo_admin"); return; }
      await auth.signOut();
    }
  };

  function alertBox(msg) { console.error(msg); }

  // PWA: service worker register
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
