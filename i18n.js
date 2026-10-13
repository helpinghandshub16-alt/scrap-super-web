// Hindi / English text. Naya text jodne ke liye dono bhasha me likhein.
window.I18N = {
  // nav
  nav_home: ["होम", "Home"], nav_rates: ["रेट लिस्ट", "Rate List"], nav_cart: ["कबाड़ बेचें", "Sell Scrap"],
  nav_track: ["बुकिंग स्टेटस", "Track Booking"], nav_news: ["न्यूज़", "News"], nav_gallery: ["गैलरी", "Gallery"],
  nav_locator: ["लोकेटर", "Locator"], nav_careers: ["करियर", "Careers"], nav_about: ["हमारे बारे में", "About Us"],
  nav_contact: ["संपर्क", "Contact"], nav_faq: ["सवाल-जवाब", "FAQ"], nav_admin: ["एडमिन", "Admin"],
  menu: ["मेन्यू", "Menu"], close: ["बंद करें", "Close"], call: ["कॉल करें", "Call"], cart: ["कार्ट", "Cart"],
  demo_banner: ["डेमो मोड: बुकिंग अभी सिर्फ़ इसी फ़ोन में सेव हो रही है। README देखकर Firebase जोड़ें।", "Demo mode: bookings are saved only on this phone. Connect Firebase using the README."],

  // home
  hero_t1: ["कबाड़ दो,", "Give scrap,"], hero_t2: ["तुरंत पैसा लो", "get paid instantly"],
  hero_p: ["अख़बार, गत्ता, प्लास्टिक, लोहा, तांबा, फ्रिज, कूलर — सब घर से उठाते हैं। सही कांटा, सही रेट, पिकअप बिल्कुल फ्री।",
           "Newspaper, cardboard, plastic, iron, copper, fridges, coolers — we pick it all up from your home. Honest scale, fair rates, free pickup."],
  hero_cta: ["कबाड़ बेचें", "Sell scrap now"], hero_cta2: ["रेट लिस्ट देखें", "See rate list"],
  how_title: ["कैसे काम करता है", "How it works"],
  how1_t: ["कबाड़ चुनें", "Pick your scrap"], how1_p: ["रेट लिस्ट से सामान कार्ट में डालें", "Add items from the rate list to your cart"],
  how2_t: ["पिकअप बुक करें", "Book a pickup"], how2_p: ["तारीख़ और समय चुनें", "Choose a date and time slot"],
  how3_t: ["तौल और भुगतान", "Weigh & get paid"], how3_p: ["आपके सामने तौल, नक़द या UPI से पैसा", "Weighed in front of you, paid in cash or UPI"],
  why_title: ["स्क्रैप सुपर क्यों", "Why Scrap Super"],
  why1: ["डिजिटल कांटा, सही तौल", "Digital scale, honest weight"], why2: ["पिकअप बिल्कुल फ्री", "Pickup is free"],
  why3: ["तुरंत नक़द या UPI", "Instant cash or UPI"], why4: ["कबाड़ रीसाइक्लिंग में जाता है", "Scrap goes to recycling"],
  popular: ["आज के मुख्य रेट", "Today's top rates"], see_all: ["सब देखें →", "See all →"],
  latest_news: ["ताज़ा ख़बरें", "Latest news"],
  stats_pickups: ["पिकअप पूरे", "pickups done"], stats_kg: ["किलो रीसाइकल", "kg recycled"], stats_areas: ["इलाक़े", "areas served"],

  // rates
  rates_title: ["कबाड़ रेट लिस्ट", "Scrap Rate List"],
  rates_sub: ["घर से उठाए जाने वाला कबाड़ और आज के रेट", "Household scrap we pick up, with today's rates"],
  all: ["सभी", "All"], search_ph: ["सामान खोजें…", "Search items…"],
  per_kg: ["प्रति किलो", "per kg"], per_pc: ["प्रति नग", "per piece"], kg: ["किलो", "kg"], pc: ["नग", "pc"],
  add: ["कार्ट में डालें", "Add to cart"], added: ["कार्ट में है ✓", "In cart ✓"],
  rates_note: ["रेट सामान की क्वालिटी और बाज़ार के हिसाब से बदल सकते हैं। फ़ाइनल रेट कांटे पर तय होगा। उपकरण का रेट उसके साइज़ और हालत पर निर्भर है।",
               "Rates may vary with quality and market. Final price is set at weighing. Appliance prices depend on size and condition."],
  updated: ["अपडेट:", "Updated:"],

  // cart / checkout
  cart_title: ["आपका कबाड़ कार्ट", "Your scrap cart"],
  cart_empty: ["कार्ट ख़ाली है। रेट लिस्ट से सामान जोड़ें।", "Your cart is empty. Add items from the rate list."],
  qty: ["मात्रा", "Quantity"], est_total: ["अनुमानित रक़म", "Estimated amount"], remove: ["हटाएँ", "Remove"],
  est_note: ["यह सिर्फ़ अनुमान है। असली रक़म तौल के बाद तय होगी।", "This is an estimate. Final amount is decided after weighing."],
  min_note: ["कम से कम {n} किलो कबाड़ पर पिकअप फ्री।", "Free pickup for {n} kg or more."],
  step_details: ["आपकी जानकारी", "Your details"], f_name: ["आपका नाम", "Your name"], f_phone: ["मोबाइल नंबर", "Mobile number"],
  f_addr: ["पूरा पता", "Full address"], f_addr_ph: ["मकान नं., गली, मोहल्ला, लैंडमार्क", "House no., street, locality, landmark"],
  f_pin: ["पिनकोड", "Pincode"], f_date: ["पिकअप की तारीख़", "Pickup date"], f_slot: ["समय", "Time slot"],
  slot1: ["सुबह (9–12)", "Morning (9–12)"], slot2: ["दोपहर (12–3)", "Afternoon (12–3)"], slot3: ["शाम (3–7)", "Evening (3–7)"],
  f_note: ["और कुछ? (वैकल्पिक)", "Anything else? (optional)"], f_note_ph: ["जैसे: तीसरी मंज़िल, लिफ़्ट नहीं", "e.g. 3rd floor, no lift"],
  pay_title: ["पैसा कैसे लेना चाहेंगे?", "How would you like to be paid?"],
  pay_cash: ["नक़द (कैश)", "Cash"], pay_cash_d: ["तौल के बाद हाथों-हाथ", "Handed over after weighing"],
  pay_upi: ["UPI", "UPI"], pay_upi_d: ["Google Pay / PhonePe / Paytm", "Google Pay / PhonePe / Paytm"],
  pay_donate: ["दान करें", "Donate"], pay_donate_d: ["रक़म ज़रूरतमंदों की मदद में", "Amount goes to a local cause"],
  f_upi: ["आपकी UPI ID या UPI नंबर", "Your UPI ID or UPI number"], f_upi_ph: ["जैसे 98xxxxxx@ybl", "e.g. 98xxxxxx@ybl"],
  confirm: ["पिकअप कन्फ़र्म करें", "Confirm pickup"], saving: ["सेव हो रहा है…", "Saving…"],
  err_name: ["कृपया अपना नाम लिखें।", "Please enter your name."], err_phone: ["सही 10 अंकों का मोबाइल नंबर लिखें।", "Enter a valid 10-digit mobile number."],
  err_addr: ["कृपया पूरा पता लिखें।", "Please enter your full address."], err_cart: ["कम से कम एक सामान चुनें।", "Add at least one item."],
  err_date: ["पिकअप की तारीख़ चुनें।", "Choose a pickup date."], err_upi: ["UPI ID लिखें या नक़द चुनें।", "Enter a UPI ID or choose cash."],
  err_save: ["बुकिंग सेव नहीं हुई। इंटरनेट चेक करके दोबारा कोशिश करें या हमें कॉल करें।", "Booking could not be saved. Check your internet and try again, or call us."],
  err_pin: ["इस पिनकोड में अभी पिकअप नहीं है। कॉल करके पूछें।", "We don't serve this pincode yet. Call us to ask."],
  done_t: ["बुकिंग हो गई!", "Booking confirmed!"], done_id: ["आपका बुकिंग नंबर", "Your booking number"],
  done_p: ["हमारी टीम जल्दी आपको कॉल करेगी। इस नंबर से स्टेटस देख सकते हैं।", "Our team will call you soon. Use this number to track your booking."],
  track_it: ["स्टेटस देखें", "Track status"], book_again: ["नई बुकिंग", "New booking"],
  quick_add: ["सामान याद नहीं? नीचे से जल्दी जोड़ें", "Quick add more items"],

  // track
  track_title: ["बुकिंग स्टेटस देखें", "Track your booking"], track_ph: ["बुकिंग नंबर, जैसे SS4K7P2Q", "Booking number, e.g. SS4K7P2Q"],
  track_btn: ["देखें", "Check"], track_none: ["इस नंबर की कोई बुकिंग नहीं मिली।", "No booking found with this number."],
  st_Naya: ["बुकिंग मिली", "Booking received"], st_Confirmed: ["कन्फ़र्म", "Confirmed"], st_Picked: ["कबाड़ उठ गया", "Picked up"],
  st_Paid: ["भुगतान हो गया", "Paid"], st_Cancel: ["कैंसल", "Cancelled"],
  final_amt: ["फ़ाइनल रक़म", "Final amount"], recent: ["इस फ़ोन से की गई बुकिंग", "Bookings made on this phone"],

  // news / gallery
  news_title: ["न्यूज़ और अपडेट", "News & updates"], news_sub: ["रेट में बदलाव, ऑफ़र और ख़बरें", "Rate changes, offers and announcements"],
  gallery_title: ["गैलरी", "Gallery"], gallery_sub: ["हमारा काम तस्वीरों में", "Our work in pictures"],

  // locator
  loc_title: ["लोकेटर", "Locator"], loc_sub: ["देखें हम आपके इलाक़े में आते हैं या नहीं", "Check if we pick up in your area"],
  loc_pin_ph: ["अपना 6 अंकों का पिनकोड", "Your 6-digit pincode"], loc_check: ["चेक करें", "Check"],
  loc_yes: ["बढ़िया! हम आपके इलाक़े में पिकअप करते हैं।", "Great! We pick up in your area."],
  loc_no: ["अभी यहाँ पिकअप नहीं है, पर कॉल करके पूछ सकते हैं।", "Not served yet, but call us to ask."],
  loc_shop: ["हमारा गोदाम / दुकान", "Our yard / shop"], loc_dir: ["Google Maps पर रास्ता देखें", "Get directions on Google Maps"],
  loc_hours: ["खुलने का समय", "Opening hours"], loc_areas: ["सेवा वाले पिनकोड", "Pincodes we serve"],

  // careers
  car_title: ["करियर", "Careers"], car_sub: ["स्क्रैप सुपर टीम से जुड़ें", "Join the Scrap Super team"],
  apply: ["आवेदन करें", "Apply"], apply_for: ["पद", "Position"], f_exp: ["अनुभव (वैकल्पिक)", "Experience (optional)"],
  f_exp_ph: ["जैसे: 2 साल ड्राइविंग", "e.g. 2 years driving"], send: ["भेजें", "Send"],
  apply_done: ["आवेदन मिल गया! हम जल्दी संपर्क करेंगे।", "Application received! We'll contact you soon."],

  // about
  about_title: ["हमारे बारे में", "About Us"],
  about_p1: ["स्क्रैप सुपर एक स्थानीय कबाड़ ख़रीद सेवा है। हम घर-घर जाकर कबाड़ ईमानदार तौल और सही रेट पर ख़रीदते हैं।",
             "Scrap Super is a local scrap-buying service. We collect scrap door to door, with honest weighing and fair rates."],
  about_p2: ["हमारा मक़सद है कि कबाड़ बेचना आसान हो और हर किलो रीसाइक्लिंग तक पहुँचे, ताकि शहर साफ़ रहे।",
             "Our goal is to make selling scrap easy and send every kilo to recycling, keeping our town clean."],
  values: ["हमारे वादे", "Our promises"], v1: ["ग्राहक के सामने तौल", "Weighing in front of you"],
  v2: ["रेट पहले से वेबसाइट पर", "Rates published in advance"], v3: ["समय पर पिकअप", "On-time pickup"], v4: ["कोई छिपा चार्ज नहीं", "No hidden charges"],

  // contact
  con_title: ["संपर्क करें", "Contact Us"], con_sub: ["सवाल, शिकायत या बड़ा कबाड़? हमें बताइए", "Questions, complaints or bulk scrap? Tell us"],
  con_phone: ["फ़ोन / WhatsApp", "Phone / WhatsApp"], con_email: ["ईमेल", "Email"], con_addr: ["पता", "Address"],
  f_msg: ["आपका संदेश", "Your message"], f_topic: ["विषय", "Topic"],
  t_q: ["सवाल", "Question"], t_bulk: ["बड़ी मात्रा / दुकान / फ़ैक्टरी का कबाड़", "Bulk / shop / factory scrap"], t_complaint: ["शिकायत", "Complaint"], t_other: ["अन्य", "Other"],
  msg_done: ["संदेश मिल गया! हम जल्दी जवाब देंगे।", "Message received! We'll reply soon."], copy: ["कॉपी", "Copy"], copied: ["कॉपी हुआ ✓", "Copied ✓"],
  whatsapp: ["WhatsApp करें", "WhatsApp us"],

  faq_title: ["सवाल-जवाब", "Frequently asked questions"],
  install_txt: ["स्क्रैप सुपर को ऐप की तरह फ़ोन पर रखें", "Keep Scrap Super on your phone like an app"],
  install_ios: ["iPhone पर: नीचे Share ⬆️ दबाएँ, फिर “Add to Home Screen”", "On iPhone: tap Share ⬆️, then “Add to Home Screen”"],
  install: ["इंस्टॉल", "Install"], footer_tag: ["घर का कबाड़, सही दाम पर।", "Household scrap, fair price."],
  terms: ["नियम व शर्तें", "Terms"], rights: ["सर्वाधिकार सुरक्षित", "All rights reserved"]
};

(function () {
  let lang = "hi";
  try { lang = localStorage.getItem("ss_lang") || "hi"; } catch (e) {}
  window.LANG = lang;
  window.t = (k, vars) => {
    const v = (I18N[k] || [k, k])[lang === "en" ? 1 : 0];
    return vars ? v.replace(/\{(\w+)\}/g, (_, n) => vars[n]) : v;
  };
  // {hi, en} object se sahi bhasha
  window.L = o => (o && typeof o === "object") ? (o[lang] || o.hi || o.en || "") : (o ?? "");
  window.applyI18n = (root = document) => {
    document.documentElement.lang = lang;
    root.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    root.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
  };
  window.setLang = l => { try { localStorage.setItem("ss_lang", l); } catch (e) {} location.reload(); };
})();
