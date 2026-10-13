// ============================================================
//  Website ka content — rates, gallery, jobs, FAQ, news
//  Yahan badlav karke website ka content badal sakte hain.
//  (Rates aur News Admin Panel se bhi badal sakte hain.)
// ============================================================

window.CATEGORIES = [
  { id: "paper",     hi: "काग़ज़ और गत्ता",      en: "Paper & Cardboard" },
  { id: "plastic",   hi: "प्लास्टिक",             en: "Plastic" },
  { id: "metal",     hi: "धातु (मेटल)",           en: "Metals" },
  { id: "ewaste",    hi: "ई-वेस्ट (इलेक्ट्रॉनिक)", en: "E-waste" },
  { id: "appliance", hi: "घरेलू उपकरण",          en: "Home Appliances" }
];

// unit: "kg" ya "pc" (piece / नग)
window.DEFAULT_RATES = [
  { id: "newspaper", cat: "paper", hi: "अख़बार", en: "Newspaper", price: 14, unit: "kg", img: "images/newspaper.svg" },
  { id: "cardboard", cat: "paper", hi: "गत्ता / कार्टन", en: "Cardboard / Carton", price: 10, unit: "kg", img: "images/cardboard.svg" },
  { id: "books", cat: "paper", hi: "कॉपी / किताब", en: "Books / Notebooks", price: 12, unit: "kg", img: "images/books.svg" },
  { id: "magazine", cat: "paper", hi: "मैगज़ीन / रद्दी काग़ज़", en: "Magazines / Mixed paper", price: 8, unit: "kg", img: "images/magazine.svg" },

  { id: "plastic", cat: "plastic", hi: "सख़्त प्लास्टिक (बाल्टी, डिब्बे)", en: "Hard plastic (buckets, tubs)", price: 12, unit: "kg", img: "images/plastic.svg" },
  { id: "pet", cat: "plastic", hi: "प्लास्टिक बोतल (PET)", en: "PET bottles", price: 10, unit: "kg", img: "images/pet.svg" },
  { id: "polythene", cat: "plastic", hi: "पन्नी / पॉलीथीन", en: "Polythene / Soft plastic", price: 5, unit: "kg", img: "images/polythene.svg" },

  { id: "iron", cat: "metal", hi: "लोहा", en: "Iron", price: 28, unit: "kg", img: "images/iron.svg" },
  { id: "tin", cat: "metal", hi: "टीन / कनस्तर", en: "Tin sheet / Canister", price: 20, unit: "kg", img: "images/tin.svg" },
  { id: "steel", cat: "metal", hi: "स्टील के बर्तन", en: "Steel utensils", price: 40, unit: "kg", img: "images/steel.svg" },
  { id: "aluminium", cat: "metal", hi: "एल्युमिनियम", en: "Aluminium", price: 110, unit: "kg", img: "images/aluminium.svg" },
  { id: "brass", cat: "metal", hi: "पीतल", en: "Brass", price: 400, unit: "kg", img: "images/brass.svg" },
  { id: "copper", cat: "metal", hi: "तांबा", en: "Copper", price: 650, unit: "kg", img: "images/copper.svg" },

  { id: "battery", cat: "ewaste", hi: "इन्वर्टर बैटरी", en: "Inverter battery", price: 80, unit: "kg", img: "images/battery.svg" },
  { id: "mobile", cat: "ewaste", hi: "पुराना मोबाइल", en: "Old mobile phone", price: 50, unit: "pc", img: "images/mobile.svg" },
  { id: "laptop", cat: "ewaste", hi: "लैपटॉप", en: "Laptop", price: 300, unit: "pc", img: "images/laptop.svg" },
  { id: "cpu", cat: "ewaste", hi: "कंप्यूटर CPU", en: "Computer CPU", price: 250, unit: "pc", img: "images/cpu.svg" },
  { id: "printer", cat: "ewaste", hi: "प्रिंटर", en: "Printer", price: 100, unit: "pc", img: "images/printer.svg" },
  { id: "tv", cat: "ewaste", hi: "टीवी (LED / पुराना)", en: "TV (LED / CRT)", price: 200, unit: "pc", img: "images/tv.svg" },

  { id: "fridge", cat: "appliance", hi: "फ्रिज", en: "Refrigerator", price: 1200, unit: "pc", img: "images/fridge.svg" },
  { id: "washing", cat: "appliance", hi: "वॉशिंग मशीन", en: "Washing machine", price: 900, unit: "pc", img: "images/washing.svg" },
  { id: "ac", cat: "appliance", hi: "AC (स्प्लिट / विंडो)", en: "AC (Split / Window)", price: 3000, unit: "pc", img: "images/ac.svg" },
  { id: "cooler", cat: "appliance", hi: "कूलर", en: "Air cooler", price: 500, unit: "pc", img: "images/cooler.svg" },
  { id: "fan", cat: "appliance", hi: "पंखा", en: "Ceiling fan", price: 150, unit: "pc", img: "images/fan.svg" },
  { id: "geyser", cat: "appliance", hi: "गीज़र", en: "Geyser", price: 400, unit: "pc", img: "images/geyser.svg" },
  { id: "microwave", cat: "appliance", hi: "माइक्रोवेव / ओवन", en: "Microwave / Oven", price: 250, unit: "pc", img: "images/microwave.svg" }
].map((r, i) => ({ ...r, order: i + 1 }));

// Gallery — apni asli photos images/gallery/ me daal kar yahan naam badlein
window.GALLERY = [
  { img: "images/gallery/truck.svg", hi: "हमारी पिकअप गाड़ी", en: "Our pickup vehicle" },
  { img: "images/gallery/scale.svg", hi: "डिजिटल कांटा — सही तौल", en: "Digital scale — honest weight" },
  { img: "images/gallery/yard.svg", hi: "हमारा गोदाम", en: "Our sorting yard" },
  { img: "images/gallery/team.svg", hi: "हमारी टीम", en: "Our team" },
  { img: "images/gallery/sorting.svg", hi: "कबाड़ की छंटाई", en: "Sorting scrap" },
  { img: "images/gallery/recycle.svg", hi: "रीसाइक्लिंग के लिए तैयार", en: "Ready for recycling" }
];

// News — Admin Panel se bhi jod sakte hain. Ye pehle se dikhne wali khabrein hain.
window.DEFAULT_NEWS = [
  { id: "n1", date: "2026-10-10",
    title: { hi: "स्क्रैप सुपर अब ऑनलाइन!", en: "Scrap Super is now online!" },
    body: { hi: "अब आप घर बैठे कबाड़ के रेट देख सकते हैं और फ्री पिकअप बुक कर सकते हैं।", en: "You can now check scrap rates and book a free pickup from home." } },
  { id: "n2", date: "2026-10-05",
    title: { hi: "दिवाली सफ़ाई ऑफ़र", en: "Diwali cleaning offer" },
    body: { hi: "दिवाली तक 50 किलो से ज़्यादा कबाड़ पर हर किलो ₹1 ज़्यादा।", en: "Get ₹1 extra per kg on pickups above 50 kg till Diwali." } },
  { id: "n3", date: "2026-09-28",
    title: { hi: "तांबा और पीतल के रेट बढ़े", en: "Copper and brass rates go up" },
    body: { hi: "बाज़ार में तेज़ी के कारण तांबा और पीतल के रेट बढ़ाए गए हैं।", en: "Copper and brass rates have been raised following the market." } }
];

window.JOBS = [
  { id: "driver", title: { hi: "पिकअप ड्राइवर", en: "Pickup Driver" }, type: { hi: "फुल टाइम", en: "Full time" },
    desc: { hi: "छोटा वाहन चलाना आना चाहिए, ड्राइविंग लाइसेंस ज़रूरी।", en: "Must drive a small goods vehicle; valid licence required." } },
  { id: "helper", title: { hi: "लोडिंग हेल्पर", en: "Loading Helper" }, type: { hi: "फुल टाइम", en: "Full time" },
    desc: { hi: "कबाड़ उठाने, तौलने और छांटने में मदद।", en: "Help with lifting, weighing and sorting scrap." } },
  { id: "field", title: { hi: "फ़ील्ड एजेंट (कमीशन)", en: "Field Agent (commission)" }, type: { hi: "पार्ट टाइम", en: "Part time" },
    desc: { hi: "अपने मोहल्ले से पिकअप बुकिंग लाएँ, हर बुकिंग पर कमीशन।", en: "Bring pickup bookings from your area and earn per booking." } },
  { id: "office", title: { hi: "ऑफ़िस / कॉल असिस्टेंट", en: "Office / Call Assistant" }, type: { hi: "फुल टाइम", en: "Full time" },
    desc: { hi: "ग्राहकों के कॉल, बुकिंग और हिसाब संभालना।", en: "Handle customer calls, bookings and accounts." } }
];

window.FAQ = [
  { q: { hi: "क्या पिकअप फ्री है?", en: "Is pickup free?" },
    a: { hi: "हाँ, पिकअप बिल्कुल फ्री है। कम से कम 10 किलो कबाड़ होना चाहिए।", en: "Yes, pickup is completely free. A minimum of 10 kg is required." } },
  { q: { hi: "पैसा कैसे मिलेगा?", en: "How will I get paid?" },
    a: { hi: "तौल के तुरंत बाद नक़द या UPI (Google Pay, PhonePe, Paytm) से।", en: "Right after weighing, in cash or by UPI (Google Pay, PhonePe, Paytm)." } },
  { q: { hi: "तौल कैसे होती है?", en: "How is scrap weighed?" },
    a: { hi: "हम आपके सामने डिजिटल कांटे पर तौलते हैं।", en: "We weigh in front of you on a digital scale." } },
  { q: { hi: "रेट बदलते क्यों हैं?", en: "Why do rates change?" },
    a: { hi: "कबाड़ के रेट बाज़ार के हिसाब से ऊपर-नीचे होते हैं। वेबसाइट पर रोज़ के रेट मिलेंगे।", en: "Scrap rates follow the market. The website shows the latest rates." } },
  { q: { hi: "क्या आप फ्रिज, AC, कूलर भी लेते हैं?", en: "Do you take fridges, ACs and coolers?" },
    a: { hi: "हाँ, हम सभी पुराने घरेलू उपकरण और इलेक्ट्रॉनिक सामान लेते हैं।", en: "Yes, we buy all old home appliances and electronics." } },
  { q: { hi: "बुकिंग कैंसल कैसे करें?", en: "How do I cancel a booking?" },
    a: { hi: "हमें कॉल या WhatsApp करें, या पिकअप टीम के आने पर मना कर दें। कोई चार्ज नहीं।", en: "Call or WhatsApp us, or simply tell the team when they arrive. No charges." } },
  { q: { hi: "आप कौन-से इलाक़ों में आते हैं?", en: "Which areas do you serve?" },
    a: { hi: "लोकेटर पेज पर अपना पिनकोड डालकर देखें।", en: "Enter your pincode on the Locator page to check." } }
];
