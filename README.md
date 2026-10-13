# Scrap Super — Website guide

## Website me kya-kya hai

**11 pages (customer ke liye):**

| Page | File | Kaam |
|---|---|---|
| Home | `index.html` | Hero, kaise kaam karta hai, mukhya rate, khabrein |
| Rate List | `rates.html` | 26 ghar ke kabaad ki rate list (kagaz, plastic, metal, e-waste, fridge/AC/cooler), category filter + search |
| Sell Scrap / Cart | `cart.html` | Cart, anumanit rakam, pickup booking, payment option |
| Track Booking | `track.html` | Booking number se status dekhna |
| News | `news.html` | Rate badlav, offer, khabrein (Admin se jodein) |
| Gallery | `gallery.html` | Tasveerein + bada dekhne ka option |
| Locator | `locator.html` | Pincode check, dukaan ka pata, Google Maps |
| Careers | `careers.html` | Naukri ki list + aavedan form |
| About Us | `about.html` | Business ke baare me, vaade |
| Contact | `contact.html` | Phone, WhatsApp, email, sandesh form |
| FAQ | `faq.html` | Sawal-jawab |

**Har page par:** हिं / EN bhasha button, cart icon (ginti ke saath), menu, WhatsApp button, footer.

**Payment option:** customer chunta hai — 💵 Cash, 📲 UPI (apni UPI ID deta hai), ya 🤝 Daan. Admin Panel me final rakam daalte hi “UPI se ₹… bhejein” button aata hai jo phone par Google Pay / PhonePe khol deta hai.

**Admin Panel (`admin.html`):** Orders (status: Naya → Confirmed → Picked → Paid), final rakam, UPI se bhugtan, Call/WhatsApp/Map, Excel download, Rates badlein (Hindi + English naam, ₹/kg ya ₹/नग, photo), News jodein, Job aavedan, Messages.

**PWA:** Android par “Install” button, iPhone par Share → Add to Home Screen. Bina internet ke bhi pages khulte hain.

---

## Apne hisaab se badlav (zaroori)

1. **`firebase-config.js`** — apna phone, email, pata, khulne ka samay, aur **pickup wale pincode** (`pincodes`) likhein.
2. **Rates** — Admin Panel → Rates tab se badlein (ya `data.js` me).
3. **Gallery photos** — apni asli photo `images/gallery/` me daalein aur `data.js` ke `GALLERY` me naam badlein.
4. **Naukri, FAQ** — `data.js` me badlein.

---

## Firebase (asli database) jodna

1. **https://console.firebase.google.com** → Create a project → naam `scrap-super`.
2. `</>` (Web) icon → app register karein → jo `firebaseConfig` mile uski 6 values `firebase-config.js` me `PASTE_HERE` ki jagah daalein.
3. **Build → Firestore Database → Create database** → location `asia-south1 (Mumbai)` → production mode.
4. **Rules** tab me `firestore.rules` ka poora text paste karein, `ADMIN_EMAIL_YAHAN` ki jagah apna email likhein → **Publish**.
5. **Build → Authentication → Email/Password** enable → **Users → Add user** (wahi email + password).
6. **Authentication → Settings → Authorized domains** me apni website ka domain jodein (jaise `aapka-username.github.io`).
7. Admin Panel me pehli baar login karte hi rates aur khabrein database me apne aap aa jayengi.

## GitHub Pages par daalna

1. github.com → **+ → New repository** → naam `scrap-super` → Public → Create.
2. **uploading an existing file** → is folder ke **andar ki sabhi files/folders** khinch kar chhodein → **Commit changes**.
3. **Settings → Pages → Branch: main, / (root) → Save**.
4. 2 minute baad: `https://aapka-username.github.io/scrap-super/`

**Purani website ko update karna:** repo me “Add file → Upload files” se nayi files daalein — same naam wali files apne aap badal jayengi → Commit.

## Demo mode
Jab tak Firebase nahi juda, bookings sirf usi phone me save hoti hain. Demo admin password: `admin123`.
