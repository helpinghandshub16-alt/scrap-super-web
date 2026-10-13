# Scrap Super — Website chalu karne ki guide

Is folder me aapki poori website hai:

| File | Kaam |
|---|---|
| `index.html` | Customer website — rates + pickup booking |
| `admin.html` | Aapka Admin Panel — saare orders, status, rate badalna |
| `firebase-config.js` | Yahan apni Firebase details aur phone number daalein |
| `images/` | Scrap ki photos (apni asli photo isi naam se daal sakte hain) |
| `manifest.json`, `sw.js`, `icons/` | App ki tarah Home Screen par lagane ke liye (PWA) |
| `firestore.rules` | Database ki security (customer orders dekh nahi sakta, sirf aap) |

Abhi website **Demo mode** me hai — chal jaati hai, par booking sirf usi phone me save hoti hai. Asli database ke liye niche ke steps karein. Sab **free** hai (Firebase ka free plan chhote business ke liye kaafi hai).

---

## Step 1 — Firebase project banayein (10 minute)

1. Computer/mobile par **https://console.firebase.google.com** kholein, apne Gmail se login karein.
2. **Create a project** → naam `scrap-super` → Google Analytics band kar sakte hain → **Create**.
3. Project khulne par **`</>` (Web)** icon dabayein → App nickname `Scrap Super` → **Register app**.
4. Ek code dikhega jisme `firebaseConfig = { apiKey: "...", ... }` hoga. Ye 6 values copy karke `firebase-config.js` me `PASTE_HERE` ki jagah daal dein.
5. Usi file me `BUSINESS_PHONE` me apna mobile number likhein.

## Step 2 — Database chalu karein

1. Left menu → **Build → Firestore Database** → **Create database**.
2. Location: **asia-south1 (Mumbai)** → **Start in production mode** → Enable.
3. **Rules** tab kholein, `firestore.rules` file ka poora text paste karein.
4. Usme `ADMIN_EMAIL_YAHAN` ki jagah apna admin email likhein (jo Step 3 me banayenge) → **Publish**.

## Step 3 — Admin login banayein

1. Left menu → **Build → Authentication** → **Get started** → **Email/Password** → Enable → Save.
2. **Users** tab → **Add user** → apna email aur ek mazboot password → Add.
3. Yahi email Step 2 ki rules me hona chahiye.

## Step 4 — Website internet par daalein (Hosting)

**Sabse aasaan tarika — Netlify (bina coding):**
1. **https://app.netlify.com/drop** kholein (computer par).
2. Poora `scrap-super` folder us page par drag karke chhod dein.
3. 1 minute me aapko link milega jaise `https://scrap-super-xyz.netlify.app`. Site settings me naam badal kar `scrapsuper.netlify.app` jaisa kar sakte hain.
4. Firebase Console → Authentication → **Settings → Authorized domains** → apna Netlify domain add karein.

(Chahein to baad me apna domain jaise `scrapsuper.in` ~₹500–800/saal me jod sakte hain.)

## Step 5 — Check karein

1. Website kholein → ek test booking karein.
2. `aapki-site/admin.html` kholein → login karein → order dikhna chahiye.
3. Pehli baar admin login par saare rates database me apne aap save ho jayenge. **Rates badlein** tab se rate badalein.

---

## Mobile par App ki tarah lagana (PWA)

- **Android (Chrome):** website kholte hi niche "Install" button aayega, ya menu ⋮ → **Add to Home screen / Install app**.
- **iPhone (Safari):** niche **Share ⬆️** → **Add to Home Screen** → Add.
- Admin Panel ke liye `admin.html` khol kar alag se Home Screen par lagayein — aapke phone par "SS Admin" naam ka app ban jayega.

## Admin Panel me kya-kya hai
- Naye / aaj ke / pick ho chuke orders ki ginti
- Naam, number, pata se khoj; status aur tareekh se filter
- Ek tap me **Call**, **WhatsApp** (confirmation message ready), **Google Map** par pata
- Status badlein: Naya → Confirmed → Picked / Cancel
- Orders Excel (CSV) me copy
- Rates aur photos badlein, naya scrap jodein

## Photos badalna
`images/` folder me apni asli photo isi naam se rakhein (jaise `copper.jpg`), phir Admin → Rates badlein me photo link `images/copper.jpg` kar dein. Ya kisi bhi online photo ka link daal sakte hain.

## Zaroori
- Demo password `admin123` sirf demo mode me chalta hai. Firebase jodne ke baad sirf aapka asli email/password chalega.
- Rates sample hain — apne market ke hisaab se Admin Panel se turant badal dein.
