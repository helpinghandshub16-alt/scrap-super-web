// Data layer: Firebase Firestore agar config bhara hai, warna DEMO (localStorage)
(function () {
  const cfg = window.FIREBASE_CONFIG || {};
  const live = !!(cfg.apiKey && cfg.apiKey !== "PASTE_HERE" && window.firebase);
  let fs = null, auth = null;
  if (live) { firebase.initializeApp(cfg); fs = firebase.firestore(); auth = firebase.auth ? firebase.auth() : null; }

  const ls = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const key = c => "ss_db_" + c;
  const defaults = { rates: () => window.DEFAULT_RATES || [], news: () => window.DEFAULT_NEWS || [] };
  const demoAll = c => ls.get(key(c), defaults[c] ? defaults[c]() : []);

  // Booking number: SS + 6 akshar (galti se milte-julte akshar hataye)
  const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const newId = (p = "SS") => p + Array.from(crypto.getRandomValues(new Uint8Array(6)), b => ABC[b % ABC.length]).join("");

  const sortBy = (list, f, desc) => list.slice().sort((a, b) => (a[f] > b[f] ? 1 : a[f] < b[f] ? -1 : 0) * (desc ? -1 : 1));

  window.Store = {
    isLive: live,
    newId,

    async list(c, orderField = "createdAt", desc = true) {
      if (!live) return sortBy(demoAll(c), orderField, desc);
      let q = fs.collection(c).orderBy(orderField, desc ? "desc" : "asc");
      const s = await q.get();
      if (s.empty && defaults[c]) return defaults[c]();
      return s.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async get(c, id) {
      if (!live) return demoAll(c).find(x => x.id === id) || null;
      const d = await fs.collection(c).doc(id).get();
      return d.exists ? { id: d.id, ...d.data() } : null;
    },

    async set(c, id, data) {
      if (!live) {
        const all = demoAll(c); const i = all.findIndex(x => x.id === id);
        const row = { ...data, id }; if (i >= 0) all[i] = row; else all.unshift(row);
        ls.set(key(c), all); return id;
      }
      const { id: _drop, ...clean } = data;
      await fs.collection(c).doc(id).set(clean); return id;
    },

    async update(c, id, patch) {
      if (!live) {
        const all = demoAll(c); const o = all.find(x => x.id === id);
        if (o) Object.assign(o, patch); ls.set(key(c), all); return;
      }
      await fs.collection(c).doc(id).update(patch);
    },

    async remove(c, id) {
      if (!live) { ls.set(key(c), demoAll(c).filter(x => x.id !== id)); return; }
      await fs.collection(c).doc(id).delete();
    },

    // Customer / visitor ki taraf se naya record (order, application, message)
    async create(c, data, prefix) {
      const id = newId(prefix);
      await this.set(c, id, { ...data, createdAt: Date.now() });
      return id;
    },

    // Admin: live updates
    watch(c, cb, orderField = "createdAt") {
      if (!live) { cb(sortBy(demoAll(c), orderField, true)); return () => {}; }
      return fs.collection(c).orderBy(orderField, "desc").onSnapshot(
        s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))),
        e => console.error(c, e)
      );
    },

    async seedIfEmpty(c) {
      if (!live || !defaults[c]) return;
      const s = await fs.collection(c).limit(1).get();
      if (!s.empty) return;
      const batch = fs.batch();
      defaults[c]().forEach(({ id, ...d }) => batch.set(fs.collection(c).doc(id), d));
      await batch.commit();
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

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
