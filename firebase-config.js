// ============================================================
//  SCRAP SUPER — Settings
//  README ke Step 1 se apni Firebase details yahan paste karein.
//  Jab tak "PASTE_HERE" likha hai, website DEMO MODE me chalegi.
// ============================================================
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};

// ---- Aapke business ki jaankari (website par har jagah dikhegi) ----
window.BUSINESS = {
  phone: "9999999999",            // Call / WhatsApp number (bina +91)
  email: "scrapsuper@gmail.com",
  address: "Main Road, Maudaha, Hamirpur, Uttar Pradesh",
  city: "Maudaha",
  hours: { hi: "Somvar – Shanivar, subah 9 se shaam 7", en: "Mon – Sat, 9 AM to 7 PM" },
  upiName: "Scrap Super",
  // Kin pincode me pickup hota hai (apne hisaab se badlein)
  pincodes: ["210507"],
  minPickupKg: 10                 // kam se kam kitna kabaad ho to pickup aayega
};
