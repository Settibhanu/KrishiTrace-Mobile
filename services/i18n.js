import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      tabs: {
        home: 'Home',
        harvest: 'Harvest',
        scan: 'Scan QR',
        hub: 'Hub',
        profile: 'Profile'
      },
      dashboard: {
        greeting: 'Welcome back.',
        quick_actions: 'Quick Actions',
        ledger: 'Ledger',
        reports: 'Analytics / Reports',
        iot: 'IoT Sensors',
        gis: 'GIS Map',
        market: 'Market Prices',
        recent_activity: 'Recent Activity'
      },
      harvest: {
        title: 'My Harvests',
        advisor: 'Advisor',
        ai_assist: 'AI Assist',
        add: 'Add',
        empty: 'No harvests yet.',
        crop: 'Crop Type',
        quantity: 'Quantity',
        unit: 'Unit',
        location: 'Location / Village',
        payout: 'Farmer Payout (₹/kg)',
        consumer_price: 'Consumer Price (₹/kg)',
        transport: 'Transport Cost (₹/kg)',
        submit: 'Save to Ledger'
      },
      assistant: {
        placeholder: 'Speak via Wispr Flow...',
        listening: 'Listening...',
        processing: 'Parsing command...',
        success: 'Command executed',
        error: 'Sorry, I didn\'t understand that.',
        navigating: 'Navigating to {{screen}}.',
        checking_market: 'Checking market prices for you.',
        found_harvest: 'Found {{crop}} harvest. Opening form.'
      },
      market: {
        eyebrow: 'Mandi update', title: 'Market Prices', subtitle: 'Live crop rates in a simple farmer-friendly view.',
        banner: '{{count}} crops tracked · Updated just now', empty: 'No market data available yet.', neighbors: 'NEIGHBORING FARMERS'
      },
      iot: {
        title: 'IoT Sensor Data', subtitle: 'Temperature & humidity monitoring', total_readings: 'Total Readings',
        alerts: 'Alerts', normal: 'Normal', empty_title: 'No IoT readings yet.', empty_sub: 'Connect sensors to start monitoring.',
        temperature: 'Temperature', humidity: 'Humidity', perimeter: 'Perimeter', alert_status: 'ALERT',
        safe_status: 'SAFE', active_alerts: 'active alert(s) — check readings below'
      },
      scan: {
        title: 'QR Trace Scanner', subtitle: 'Scan KrishiTrace QR to view the full supply chain trace.', tip_title: 'Farmer tip',
        tip_desc: 'Use at mandi pickup to instantly confirm crop history and trust.', start: 'Start Scanning',
        cam_title: 'Camera Access Required', cam_desc: 'KrishiTrace needs camera to scan QR.', cam_grant: 'Grant Permission',
        hint_point: 'Point camera at QR code', hint_fetch: 'Fetching trace data...', cancel: 'Cancel',
        res_title: 'Trace Found', res_sub: 'Supply chain verified', block_ok: 'Blockchain Verified',
        block_bad: 'Chain Integrity Broken', block_desc: '{{blocks}} blocks · {{harvests}} harvests on chain',
        sec_crop: 'Crop Information', sec_origin: 'Origin', sec_farmer: 'Farmer Information', sec_ledger: 'Ledger',
        sec_iot: 'IoT Sensor Data', scan_again: 'Scan Another QR'
      },
      gis: {
        title: 'GIS Farm Tracker', subtitle: 'Geographic farm & shipment locations', map_title: 'Farm Location Map',
        map_sub: '{{count}} farms tracked', loc_title: 'FARM LOCATIONS', all_title: 'ALL FARM RECORDS',
        empty_title: 'No farm locations yet.', empty_sub: 'Add your farm address during registration or harvest.',
        note: '💡 Full interactive map with satellite view available in the KrishiTrace Web App.', batches: 'batch(es)'
      },
      reports: {
        title: 'Reports & Compliance', subtitle: 'Supply chain analytics', req_title: 'FPO Admin Access Required',
        req_sub: 'Full reports are available for FPO Admin and Operator roles.\nLog in with your admin account to view compliance analytics.',
        demo_title: 'Demo Admin Login', demo_cred: 'Mobile: 9000000003\nPassword: demo1234', summary: 'COMPLIANCE SUMMARY',
        total: 'Total Records', compliant: 'Compliant', violations: 'Violations', rate: 'Compliance Rate',
        overall: 'OVERALL COMPLIANCE', rate_sub: 'of harvests meet fair price standards', by_crop: 'BY CROP TYPE',
        recent_viol: 'RECENT VIOLATIONS', empty: 'No report data available.', records: 'records'
      },
      qr: {
        title: 'QR Generator', subtitle: 'Generate sample QR codes for traceability demonstration',
        sample_title: 'Sample Harvest Batches', sample_sub: 'Tap any batch to generate its QR code. Scan with the KrishiTrace scanner to see full details.',
        gen_btn: 'Generate QR', modal_title: 'Traceability QR Code', modal_sub: 'Scan this code with the KrishiTrace Scanner.',
        batch_info: 'Batch Information', close: 'Close', print: 'Print / Share'
      },
      bc: {
        title: 'Blockchain Explorer', subtitle: 'Local chain simulation', mining_title: 'Mining Block...',
        mining_sub: 'Computing SHA-256 hash', block_gen: 'Genesis Block', block_tamper: 'Tampered Block',
        block_valid: 'Valid Block', hash_title: 'CRYPTOGRAPHIC HASHES', hash_block: 'Block Hash',
        hash_prev: 'Previous Hash', nonce: 'Nonce', time_title: 'TIMESTAMP', time_created: 'Created',
        data_title: 'BLOCK DATA', status_tamper: 'Hash Mismatch Detected', status_valid: 'Hash Verified',
        status_tamper_sub: 'Data modified after creation.', status_valid_sub: 'Data integrity confirmed.',
        chain_valid: 'Chain Valid', chain_broken: 'Chain Broken!', stats: '{{blocks}} blocks · {{harvests}} harvests',
        btn_tamper: 'Tamper Test', btn_restore: 'Restore Chain', btn_view: 'View Mode', btn_reset: 'Reset',
        empty: 'No blocks yet', empty_sub: 'Add a harvest to create your first block.', tap_hint: 'tap to inspect →'
      },
      ledger: {
        title: 'Ledger', subtitle: '{{count}} records on chain', compliant: 'Compliant', violation: 'Violation',
        qty: 'Quantity', farmer: 'Farmer Payout', consumer: 'Consumer Price', date: 'Date', tx: 'TX Hash',
        empty: 'No ledger records yet.', empty_sub: 'Submit a harvest to create an entry.'
      }
    }
  },
  hi: {
    translation: {
      tabs: { home: 'होम', harvest: 'फसल', scan: 'स्कैन', hub: 'हब', profile: 'प्रोफ़ाइल' },
      dashboard: {
        greeting: 'वापसी पर स्वागत है।',
        quick_actions: 'त्वरित कार्रवाई',
        ledger: 'बहीखाता',
        reports: 'रिपोर्ट',
        iot: 'IoT सेंसर',
        gis: 'खेत का नक्शा',
        market: 'बाज़ार भाव',
        recent_activity: 'हाल की गतिविधि'
      },
      harvest: {
        title: 'मेरी फसलें', advisor: 'सलाहकार', ai_assist: 'AI सहायता', add: 'जोड़ें', empty: 'अभी कोई फसल नहीं।',
        crop: 'फसल का प्रकार', quantity: 'मात्रा', unit: 'इकाई', location: 'स्थान / गाँव',
        payout: 'किसान भुगतान (₹/kg)', consumer_price: 'उपभोक्ता मूल्य (₹/kg)', transport: 'परिवहन लागत (₹/kg)', submit: 'बहीखाते में सहेजें'
      },
      assistant: {
        placeholder: 'Wispr Flow के माध्यम से बोलें...',
        listening: 'सुन रहा हूँ...',
        processing: 'कमांड पार्स हो रहा है...',
        success: 'कमांड निष्पादित',
        error: 'क्षमा करें, मुझे समझ नहीं आया।',
        navigating: '{{screen}} पर जा रहे हैं।',
        checking_market: 'आपके लिए बाजार भाव देख रहे हैं।',
        found_harvest: '{{crop}} की फसल मिली। फॉर्म खोल रहे हैं।'
      },
      market: {
        eyebrow: 'मंडी अपडेट', title: 'बाज़ार भाव', subtitle: 'किसान के अनुकूल लाइव फसल रेट।',
        banner: '{{count}} फसलों पर नज़र · अभी अपडेट किया गया', empty: 'अभी कोई बाज़ार डेटा उपलब्ध नहीं है।', neighbors: 'पड़ोसी किसान'
      },
      iot: {
        title: 'IoT सेंसर डेटा', subtitle: 'तापमान और आर्द्रता निगरानी', total_readings: 'कुल रीडिंग',
        alerts: 'अलर्ट', normal: 'सामान्य', empty_title: 'अभी कोई IoT रीडिंग नहीं।', empty_sub: 'निगरानी शुरू करने के लिए सेंसर कनेक्ट करें।',
        temperature: 'तापमान', humidity: 'नमी', perimeter: 'परिधि', alert_status: 'खतरा',
        safe_status: 'सुरक्षित', active_alerts: 'सक्रिय चेतावनी — नीचे रीडिंग देखें'
      },
      scan: {
        title: 'QR ट्रेस स्कैनर', subtitle: 'सप्लाई चेन ट्रेस देखने के लिए QR कोड स्कैन करें।', tip_title: 'किसान टिप',
        tip_desc: 'मंडी में फसल का इतिहास और भरोसा तुरंत जांचें।', start: 'स्कैन शुरू करें',
        cam_title: 'कैमरा अनुमति आवश्यक है', cam_desc: 'KrishiTrace को कैमरे की आवश्यकता है।', cam_grant: 'अनुमति दें',
        hint_point: 'QR कोड पर कैमरा पॉइंट करें', hint_fetch: 'ट्रेस डेटा ला रहे हैं...', cancel: 'रद्द करें',
        res_title: 'ट्रेस मिला', res_sub: 'सप्लाई चेन रिकॉर्ड सत्यापित है', block_ok: 'ब्लॉकचेन सत्यापित',
        block_bad: 'चेन अखंडता टूट गई है', block_desc: '{{blocks}} ब्लॉक · {{harvests}} फसलें चेन पर',
        sec_crop: 'फसल की जानकारी', sec_origin: 'मूल स्थान', sec_farmer: 'किसान की जानकारी', sec_ledger: 'बहीखाता',
        sec_iot: 'IoT सेंसर डेटा', scan_again: 'दूसरा QR स्कैन करें'
      },
      gis: {
        title: 'GIS खेत ट्रैकर', subtitle: 'भौगोलिक खेत और शिपमेंट स्थान', map_title: 'खेत का नक्शा',
        map_sub: '{{count}} खेत', loc_title: 'खेत के स्थान', all_title: 'सभी खेत रिकॉर्ड',
        empty_title: 'अभी कोई खेत स्थान नहीं है।', empty_sub: 'पंजीकरण या फसल के दौरान अपना पता जोड़ें।',
        note: '💡 पूरा नक्शा KrishiTrace वेब ऐप पर उपलब्ध है।', batches: 'बैच'
      },
      reports: {
        title: 'रिपोर्ट और अनुपालन', subtitle: 'सप्लाई चेन विश्लेषण', req_title: 'FPO एडमिन एक्सेस आवश्यक',
        req_sub: 'पूरी रिपोर्ट केवल एडमिन के लिए उपलब्ध है।\nलॉग इन करें।',
        demo_title: 'डेमो एडमिन', demo_cred: 'मोबाइल: 9000000003\nपासवर्ड: demo1234', summary: 'अनुपालन सारांश',
        total: 'कुल रिकॉर्ड', compliant: 'अनुपालन', violations: 'उल्लंघन', rate: 'अनुपालन दर',
        overall: 'कुल अनुपालन', rate_sub: 'फसलें उचित मूल्य मानकों को पूरा करती हैं', by_crop: 'फसल प्रकार के अनुसार',
        recent_viol: 'हालिया उल्लंघन', empty: 'कोई रिपोर्ट डेटा नहीं है।', records: 'रिकॉर्ड'
      },
      qr: {
        title: 'QR जेनरेटर', subtitle: 'ट्रेसेबिलिटी डेमो के लिए QR उत्पन्न करें',
        sample_title: 'नमूना फसल बैच', sample_sub: 'QR बनाने के लिए किसी भी बैच पर टैप करें।',
        gen_btn: 'QR बनाएँ', modal_title: 'ट्रेसेबिलिटी QR कोड', modal_sub: 'इसे KrishiTrace स्कैनर के साथ स्कैन करें।',
        batch_info: 'बैच की जानकारी', close: 'बंद करें', print: 'प्रिंट / शेयर करें'
      },
      bc: {
        title: 'ब्लॉकचेन एक्सप्लोरर', subtitle: 'स्थानीय चेन सिमुलेशन', mining_title: 'माइनिंग ब्लॉक...',
        mining_sub: 'SHA-256 हैश की गणना की जा रही है', block_gen: 'जेनेसिस ब्लॉक', block_tamper: 'छेड़छाड़ किया हुआ ब्लॉक',
        block_valid: 'वैध ब्लॉक', hash_title: 'क्रिप्टोग्राफिक हैश', hash_block: 'ब्लॉक हैश',
        hash_prev: 'पिछला हैश', nonce: 'नोंस', time_title: 'समय', time_created: 'बनाया गया',
        data_title: 'ब्लॉक डेटा', status_tamper: 'हैश बेमेल', status_valid: 'हैश सत्यापित',
        status_tamper_sub: 'निर्माण के बाद डेटा संशोधित किया गया है।', status_valid_sub: 'डेटा अखंडता की पुष्टि की गई।',
        chain_valid: 'चेन वैध', chain_broken: 'चेन टूट गई!', stats: '{{blocks}} ब्लॉक · {{harvests}} फसलें',
        btn_tamper: 'छेड़छाड़ परीक्षण', btn_restore: 'चेन बहाल करें', btn_view: 'देखें', btn_reset: 'रीसेट',
        empty: 'अभी कोई ब्लॉक नहीं', empty_sub: 'अपना पहला ब्लॉक बनाने के लिए फसल जोड़ें।', tap_hint: 'देखने के लिए टैप करें →'
      },
      ledger: {
        title: 'बहीखाता', subtitle: 'चेन पर {{count}} रिकॉर्ड', compliant: 'अनुपालन', violation: 'उल्लंघन',
        qty: 'मात्रा', farmer: 'किसान का भुगतान', consumer: 'उपभोक्ता मूल्य', date: 'तारीख', tx: 'TX हैश',
        empty: 'अभी कोई बहीखाता रिकॉर्ड नहीं।', empty_sub: 'प्रविष्टि बनाने के लिए फसल जमा करें।'
      }
    }
  },
  te: {
    translation: {
      tabs: { home: 'హోమ్', harvest: 'పంట', scan: 'స్కాన్', hub: 'హబ్', profile: 'ప్రొఫైల్' },
      dashboard: {
        greeting: 'స్వాగతం.',
        quick_actions: 'త్వరిత చర్యలు',
        ledger: 'లెడ్జర్',
        reports: 'నివేదికలు',
        iot: 'IoT సెన్సార్లు',
        gis: 'పొలం మ్యాప్',
        market: 'మార్కెట్ ధరలు',
        recent_activity: 'ఇటీవలి కార్యాచరణ'
      },
      harvest: {
        title: 'నా పంటలు', advisor: 'సలహాదారు', ai_assist: 'AI సహాయం', add: 'జోడించు', empty: 'ఇంకా పంటలు లేవు.',
        crop: 'పంట రకం', quantity: 'పరిమాణం', unit: 'యూనిట్', location: 'స్థానం',
        payout: 'రైతు చెల్లింపు (₹/kg)', consumer_price: 'వినియోగదారు ధర (₹/kg)', transport: 'రవాణా ఖర్చు (₹/kg)', submit: 'లెడ్జర్‌కు సేవ్ చేయండి'
      },
      assistant: {
        placeholder: 'Wispr Flow ద్వారా మాట్లాడండి...',
        listening: 'వింటున్నాను...',
        processing: 'కమాండ్‌ను విశ్లేషిస్తోంది...',
        success: 'కమాండ్ అమలు చేయబడింది',
        error: 'క్షమించండి, నాకు అర్థం కాలేదు.',
        navigating: '{{screen}}కు వెళ్తున్నాము.',
        checking_market: 'మీ కోసం మార్కెట్ ధరలను తనిఖీ చేస్తున్నాము.',
        found_harvest: '{{crop}} పంట దొరికింది. ఫారమ్‌ను తెరుస్తున్నాము.'
      },
      market: {
        eyebrow: 'మండీ అప్‌డేట్', title: 'మార్కెట్ ధరలు', subtitle: 'రైతులకు అనుకూలమైన లైవ్ పంట ధరలు.',
        banner: '{{count}} పంటలు ట్రాక్ చేయబడ్డాయి · ఇప్పుడే అప్‌డేట్ చేయబడింది', empty: 'ఇంకా మార్కెట్ డేటా లేదు.', neighbors: 'పొరుగు రైతులు'
      },
      iot: {
        title: 'IoT సెన్సార్ డేటా', subtitle: 'ఉష్ణోగ్రత & తేమ పర్యవేక్షణ', total_readings: 'మొత్తం రీడింగ్‌లు',
        alerts: 'అలర్ట్‌లు', normal: 'సాధారణం', empty_title: 'ఇంకా IoT రీడింగ్‌లు లేవు.', empty_sub: 'పర్యవేక్షణ కోసం సెన్సార్లను కనెక్ట్ చేయండి.',
        temperature: 'ఉష్ణోగ్రత', humidity: 'తేమ', perimeter: 'పరిధి', alert_status: 'అలర్ట్',
        safe_status: 'సురక్షితం', active_alerts: 'సక్రియ హెచ్చరికలు — క్రింద తనిఖీ చేయండి'
      },
      scan: {
        title: 'QR ట్రేస్ స్కానర్', subtitle: 'సప్లయ్ చైన్ ట్రేస్ చూడటానికి QR కోడ్‌ని స్కాన్ చేయండి.', tip_title: 'రైతు చిట్కా',
        tip_desc: 'మండీలో పంట చరిత్ర మరియు నమ్మకాన్ని వెంటనే నిర్ధారించుకోండి.', start: 'స్కాన్ ప్రారంభించండి',
        cam_title: 'కెమెరా అనుమతి అవసరం', cam_desc: 'QR స్కాన్ చేయడానికి కెమెరా యాక్సెస్ అవసరం.', cam_grant: 'అనుమతించు',
        hint_point: 'QR కోడ్‌ వైపు కెమెరాను చూపండి', hint_fetch: 'డేటాను లోడ్ చేస్తున్నాము...', cancel: 'రద్దు చేయండి',
        res_title: 'ట్రేస్ దొరికింది', res_sub: 'సప్లయ్ చైన్ రికార్డులో ధృవీకరించబడింది', block_ok: 'బ్లాక్‌చైన్ ధృవీకరించబడింది',
        block_bad: 'చైన్ సమగ్రత దెబ్బతింది', block_desc: '{{blocks}} బ్లాక్‌లు · చైన్‌లో {{harvests}} పంటలు',
        sec_crop: 'పంట సమాచారం', sec_origin: 'స్థలం', sec_farmer: 'రైతు సమాచారం', sec_ledger: 'లెడ్జర్',
        sec_iot: 'IoT సెన్సార్ డేటా', scan_again: 'మరొక QR స్కాన్ చేయండి'
      },
      gis: {
        title: 'GIS ఫార్మ్ ట్రాకర్', subtitle: 'భౌగోళిక పొలం స్థానాలు', map_title: 'పొలం మ్యాప్',
        map_sub: '{{count}} పొలాలు ట్రాక్ చేయబడ్డాయి', loc_title: 'పొలం స్థానాలు', all_title: 'అన్ని నమోదులు',
        empty_title: 'ఇంకా పొలం లేదు.', empty_sub: 'నమోదు చేసేటప్పుడు మీ చిరునామాను జోడించండి.',
        note: '💡 పూర్తి మ్యాప్ KrishiTrace వెబ్ యాప్‌లో అందుబాటులో ఉంది.', batches: 'బ్యాచ్‌లు'
      },
      reports: {
        title: 'నివేదికలు & అనుసరణ', subtitle: 'సప్లై చైన్ అనలిటిక్స్', req_title: 'FPO అడ్మిన్ యాక్సెస్ అవసరం',
        req_sub: 'పూర్తి నివేదికలు అడ్మిన్‌లకు మాత్రమే.\nచూడడానికి లాగిన్ అవ్వండి.',
        demo_title: 'డెమో అడ్మిన్ లాగిన్', demo_cred: 'మొబైల్: 9000000003\nపాస్‌వర్డ్: demo1234', summary: 'సారాంశం',
        total: 'మొత్తం రికార్డులు', compliant: 'అనుసరణ', violations: 'ఉల్లంఘనలు', rate: 'అనుసరణ రేటు',
        overall: 'మొత్తం అనుసరణ', rate_sub: 'పంటలు సరసమైన ధర ప్రమాణాలను అందుకుంటాయి', by_crop: 'పంట రకం ప్రకారం',
        recent_viol: 'ఇటీవలి ఉల్లంఘనలు', empty: 'ఎలాంటి నివేదిక లేదు.', records: 'రికార్డులు'
      },
      qr: {
        title: 'QR జనరేటర్', subtitle: 'డెమో కోసం QRలను సృష్టించండి',
        sample_title: 'నమూనా పంటలు', sample_sub: 'QR పొందడానికి ట్యాప్ చేయండి.',
        gen_btn: 'QR సృష్టించండి', modal_title: 'ట్రేసబిలిటీ QR కోడ్', modal_sub: 'దీన్ని KrishiTrace స్కానర్‌తో స్కాన్ చేయండి.',
        batch_info: 'సమాచారం', close: 'మూసివేయు', print: 'ప్రింట్ చేయండి'
      },
      bc: {
        title: 'బ్లాక్‌చైన్ ఎక్స్‌ప్లోరర్', subtitle: 'లోకల్ చైన్ సిమ్యులేషన్', mining_title: 'బ్లాక్ మైనింగ్...',
        mining_sub: 'SHA-256 లెక్కింపు', block_gen: 'జెనెసిస్ బ్లాక్', block_tamper: 'ట్యాంపర్డ్ బ్లాక్',
        block_valid: 'చెల్లుబాటయ్యే బ్లాక్', hash_title: 'క్రిప్టోగ్రాఫిక్ హ్యాష్', hash_block: 'బ్లాక్ హ్యాష్',
        hash_prev: 'మునుపటి హ్యాష్', nonce: 'నాన్స్', time_title: 'సమయం', time_created: 'సృష్టించబడింది',
        data_title: 'బ్లాక్ డేటా', status_tamper: 'హ్యాష్ మిస్‌మ్యాచ్', status_valid: 'హ్యాష్ ధృవీకరించబడింది',
        status_tamper_sub: 'సృష్టించిన తర్వాత డేటా సవరించబడింది.', status_valid_sub: 'డేటా సమగ్రత నిర్ధారించబడింది.',
        chain_valid: 'చైన్ చెల్లుబాటు', chain_broken: 'చైన్ విచ్ఛిన్నమైంది!', stats: '{{blocks}} బ్లాక్‌లు · {{harvests}} పంటలు',
        btn_tamper: 'ట్యాంపర్ టెస్ట్', btn_restore: 'చైన్ పునరుద్ధరించు', btn_view: 'వీక్షణ', btn_reset: 'రీసెట్ చేయండి',
        empty: 'ఇంకా బ్లాక్‌లు లేవు', empty_sub: 'మీ మొదటి బ్లాక్‌ను సృష్టించడానికి పంటను జోడించండి.', tap_hint: 'చూడటానికి ట్యాప్ చేయండి →'
      },
      ledger: {
        title: 'లెడ్జర్', subtitle: 'చైన్‌లో {{count}} రికార్డులు', compliant: 'అనుసరణ', violation: 'ఉల్లంఘన',
        qty: 'పరిమాణం', farmer: 'రైతు చెల్లింపు', consumer: 'వినియోగదారు ధర', date: 'తేదీ', tx: 'TX హ్యాష్',
        empty: 'ఇంకా లెడ్జర్ రికార్డులు లేవు.', empty_sub: 'మొదటి ఎంట్రీ కోసం పంటను సమర్పించండి.'
      }
    }
  },
  kn: {
    translation: {
      tabs: { home: 'ಮುಖಪುಟ', harvest: 'ಫಸಲು', scan: 'ಸ್ಕ್ಯಾನ್', hub: 'ಹಬ್', profile: 'ಪ್ರೊಫೈಲ್' },
      dashboard: {
        greeting: 'ಸ್ವಾಗತ.', quick_actions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು', ledger: 'ಲೆಡ್ಜರ್', reports: 'ವರದಿಗಳು',
        iot: 'ಸಂವೇದಕಗಳು (IoT)', gis: 'ನಕ್ಷೆ', market: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು', recent_activity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ'
      },
      harvest: {
        title: 'ನನ್ನ ಫಸಲುಗಳು', advisor: 'ಸಲಹೆಗಾರ', ai_assist: 'AI ಸಹಾಯ', add: 'ಸೇರಿಸಿ', empty: 'ಯಾವುದೇ ಫಸಲುಗಳಿಲ್ಲ.',
        crop: 'ಬೆಳೆಯ ಪ್ರಕಾರ', quantity: 'ಪ್ರಮಾಣ', unit: 'ಘಟಕ', location: 'ಸ್ಥಳ / ಗ್ರಾಮ',
        payout: 'ರೈತರ ಪಾವತಿ (₹/kg)', consumer_price: 'ಗ್ರಾಹಕರ ಬೆಲೆ (₹/kg)', transport: 'ಸಾರಿಗೆ ವೆಚ್ಚ (₹/kg)', submit: 'ಉಳಿಸು'
      },
      assistant: {
        placeholder: 'Wispr Flow ಮೂಲಕ ಮಾತನಾಡಿ...',
        listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',
        processing: 'ಆಜ್ಞೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
        success: 'ಆಜ್ಞೆಯನ್ನು ಕಾರ್ಯಗತಗೊಳಿಸಲಾಗಿದೆ',
        error: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ.',
        navigating: '{{screen}}ಗೆ ಹೋಗುತ್ತಿದ್ದೇವೆ.',
        checking_market: 'ನಿಮಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.',
        found_harvest: '{{crop}} ಫಸಲು ಕಂಡುಬಂದಿದೆ. ಫಾರ್ಮ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ.'
      },
      market: {
        eyebrow: 'ಮಂಡಿ ಅಪ್‌ಡೇಟ್', title: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು', subtitle: 'ರೈತಸ್ನೇಹಿ ಲೈವ್ ಬೆಳೆ ದರಗಳು.',
        banner: '{{count}} ಬೆಳೆಗಳು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ · ಈಗ ತಾನೇ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ', empty: 'ಯಾವುದೇ ಮಾರುಕಟ್ಟೆ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ.', neighbors: 'ನೆರೆಯ ರೈತರು'
      },
      iot: {
        title: 'IoT ಸಂವೇದಕ ಡೇಟಾ', subtitle: 'ತಾಪಮಾನ ಮತ್ತು ಆರ್ದ್ರತೆ ಮೇಲ್ವಿಚಾರಣೆ', total_readings: 'ಒಟ್ಟು ವಾಚನಗೋಷ್ಠಿಗಳು',
        alerts: 'ಎಚ್ಚರಿಕೆಗಳು', normal: 'ಸಾಮಾನ್ಯ', empty_title: 'ಯಾವುದೇ IoT ವಾಚನಗೋಷ್ಠಿಗಳಿಲ್ಲ.', empty_sub: 'ಸಂವೇದಕಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        temperature: 'ತಾಪಮಾನ', humidity: 'ಆರ್ದ್ರತೆ', perimeter: 'ಪರಿಧಿ', alert_status: 'ಎಚ್ಚರಿಕೆ',
        safe_status: 'ಸುರಕ್ಷಿತ', active_alerts: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆ(ಗಳು) — ಕೆಳಗೆ ಪರಿಶೀಲಿಸಿ'
      },
      scan: {
        title: 'QR ಟ್ರೇಸ್ ಸ್ಕ್ಯಾನರ್', subtitle: 'ಪೂರೈಕೆ ಸರಪಳಿ ಟ್ರೇಸ್ ನೋಡಲು QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.', tip_title: 'ರೈತ ಟಿಪ್',
        tip_desc: 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಳೆ ಇತಿಹಾಸವನ್ನು ತ್ವರಿತವಾಗಿ ದೃಢೀಕರಿಸಲು ಬಳಸಿ.', start: 'ಸ್ಕ್ಯಾನಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
        cam_title: 'ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ', cam_desc: 'QR ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ.', cam_grant: 'ಅನುಮತಿ ನೀಡಿ',
        hint_point: 'ಕ್ಯಾಮೆರಾವನ್ನು QR ಕಡೆ ತೋರಿಸಿ', hint_fetch: 'ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ...', cancel: 'ರದ್ದುಮಾಡು',
        res_title: 'ಟ್ರೇಸ್ ಕಂಡುಬಂದಿದೆ', res_sub: 'ಪೂರೈಕೆ ಸರಪಳಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ', block_ok: 'ಬ್ಲಾಕ್ಚೈನ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
        block_bad: 'ಸರಪಳಿ ಸಮಗ್ರತೆ ಮುರಿದುಬಿದ್ದಿದೆ', block_desc: '{{blocks}} ಬ್ಲಾಕ್‌ಗಳು · ಸರಪಳಿಯಲ್ಲಿ {{harvests}} ವಾಚನಗೋಷ್ಠಿಗಳು',
        sec_crop: 'ಬೆಳೆ ಮಾಹಿತಿ', sec_origin: 'ಮೂಲ', sec_farmer: 'ರೈತ ಮಾಹಿತಿ', sec_ledger: 'ಲೆಡ್ಜರ್',
        sec_iot: 'IoT ಸಂವೇದಕ ಡೇಟಾ', scan_again: 'ಮತ್ತೊಂದು QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
      },
      gis: {
        title: 'GIS ಫಾರ್ಮ್ ಟ್ರ್ಯಾಕರ್', subtitle: 'ಭೌಗೋಳಿಕ ಸ್ಥಳಗಳು', map_title: 'ಫಾರ್ಮ್ ನಕ್ಷೆ',
        map_sub: '{{count}} ಫಾರ್ಮ್‌ಗಳು', loc_title: 'ಫಾರ್ಮ್ ಸ್ಥಳಗಳು', all_title: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳು',
        empty_title: 'ಯಾವುದೇ ಫಾರ್ಮ್ ಸ್ಥಳಗಳಿಲ್ಲ.', empty_sub: 'ನೋಂದಣಿ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ಸೇರಿಸಿ.',
        note: '💡 ಸಂಪೂರ್ಣ ನಕ್ಷೆಯು KrishiTrace ವೆಬ್ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.', batches: 'ಬ್ಯಾಚ್‌ಗಳು'
      },
      reports: {
        title: 'ವರದಿಗಳು', subtitle: 'ವಿಶ್ಲೇಷಣೆಗಳು', req_title: 'FPO ಅಡ್ಮಿನ್ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ',
        req_sub: 'ಸಂಪೂರ್ಣ ವರದಿಗಳು ಅಡ್ಮಿನ್‌ಗೆ ಲಭ್ಯವಿದೆ.\nಲಾಗಿನ್ ಮಾಡಿ.',
        demo_title: 'ಡೆಮೊ ಅಡ್ಮಿನ್', demo_cred: 'ಮೊಬೈಲ್: 9000000003\nಪಾಸ್‌ವರ್ಡ್: demo1234', summary: 'ಸಾರಾಂಶ',
        total: 'ಒಟ್ಟು', compliant: 'ಕಂಪ್ಲೈಂಟ್', violations: 'ಉಲ್ಲಂಘನೆಗಳು', rate: 'ದರ',
        overall: 'ಒಟ್ಟು ಪಾಲನೆ', rate_sub: 'ನ್ಯಾಯಯುತ ಬೆಲೆಮಾನಿತ ಫಸಲುಗಳು', by_crop: 'ಬೆಳೆಯ ಪ್ರಕಾರ',
        recent_viol: 'ಇತ್ತೀಚಿನ ಉಲ್ಲಂಘನೆಗಳು', empty: 'ಯಾವುದೇ ವರದಿ ಲಭ್ಯವಿಲ್ಲ.', records: 'ದಾಖಲೆಗಳು'
      },
      qr: {
        title: 'QR ಜನರೇಟರ್', subtitle: 'ಪರೀಕ್ಷೆಗಾಗಿ QR ಗಳನ್ನು ರಚಿಸಿ',
        sample_title: 'ಮಾದರಿ ಬೆಳೆಗಳು', sample_sub: 'QR ಪಡೆಯಲು ಟ್ಯಾಪ್ ಮಾಡಿ.',
        gen_btn: 'QR ರಚಿಸಿ', modal_title: 'ಟ್ರೇಸಬಿಲಿಟಿ QR ಕೋಡ್', modal_sub: 'KrishiTrace ಸ್ಕ್ಯಾನರ್ನೊಂದಿಗೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
        batch_info: 'ಮಾಹಿತಿ', close: 'ಮುಚ್ಚಿ', print: 'ಪ್ರಿಂಟ್ ಮಾಡಿ'
      },
      bc: {
        title: 'ಬ್ಲಾಕ್‌ಚೈನ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್', subtitle: 'ಸ್ಥಳೀಯ ಸರಪಳಿ ಸಿಮ್ಯುಲೇಶನ್', mining_title: 'ಮೈನಿಂಗ್ ಬ್ಲಾಕ್...',
        mining_sub: 'SHA-256 ಲೆಕ್ಕಾಚಾರ', block_gen: 'ಜೆನೆಸಿಸ್ ಬ್ಲಾಕ್', block_tamper: 'ತಿರುಚಿದ ಬ್ಲಾಕ್',
        block_valid: 'ಮಾನ್ಯ ಬ್ಲಾಕ್', hash_title: 'ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಹ್ಯಾಶ್ಗಳು', hash_block: 'ಬ್ಲಾಕ್ ಹ್ಯಾಶ್',
        hash_prev: 'ಹಿಂದಿನ ಹ್ಯಾಶ್', nonce: 'ನಾನ್ಸ್', time_title: 'ಸಮಯಮಾನ', time_created: 'ರಚಿಸಲಾಗಿದೆ',
        data_title: 'ಬ್ಲಾಕ್ ಡೇಟಾ', status_tamper: 'ಹ್ಯಾಶ್ ಅಸಾಮರಸ್ಯ', status_valid: 'ಹ್ಯಾಶ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
        status_tamper_sub: 'ರಚನೆಯ ನಂತರ ಡೇಟಾವನ್ನು ಮಾರ್ಪಡಿಸಲಾಗಿದೆ.', status_valid_sub: 'ಡೇಟಾ ಸಮಗ್ರತೆಯನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ.',
        chain_valid: 'ಮಾನ್ಯ ಸರಪಳಿ', chain_broken: 'ಸರಪಳಿ ಮುರಿದಿದೆ!', stats: '{{blocks}} ಬ್ಲಾಕ್ಗಳು · {{harvests}} ಬೆಳೆಗಳು',
        btn_tamper: 'ಟ್ಯಾಂಪರ್ ಪರೀಕ್ಷೆ', btn_restore: 'ಮರುಸ್ಥಾಪಿಸಿ', btn_view: 'ವೀಕ್ಷಣೆ', btn_reset: 'ಮರುಹೊಂದಿಸಿ',
        empty: 'ಇನ್ನೂ ಯಾವುದೇ ಬ್ಲಾಕ್‌ಗಳಿಲ್ಲ', empty_sub: 'ನಿಮ್ಮ ಮೊದಲ ಬ್ಲಾಕ್ ರಚಿಸಲು ಬೆಳೆ ಸೇರಿಸಿ.', tap_hint: 'ಪರಿಶೀಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ →'
      },
      ledger: {
        title: 'ಲೆಡ್ಜರ್', subtitle: 'ಸರಪಳಿಯಲ್ಲಿ {{count}} ದಾಖಲೆಗಳು', compliant: 'ಕಂಪ್ಲೈಂಟ್', violation: 'ಉಲ್ಲಂಘನೆ',
        qty: 'ಪ್ರಮಾಣ', farmer: 'ರೈತರ ಪಾವತಿ', consumer: 'ಗ್ರಾಹಕರ ಬೆಲೆ', date: 'ದಿನಾಂಕ', tx: 'TX ಹ್ಯಾಶ್',
        empty: 'ಇನ್ನೂ ಯಾವುದೇ ಲೆಡ್ಜರ್ ದಾಖಲೆಗಳಿಲ್ಲ.', empty_sub: 'ಗೊಂದಲವನ್ನು ತಪ್ಪಿಸಲು ಬೆಳೆ ಸೇರಿಸಿ.'
      }
    }
  },
  ta: {
    translation: {
      tabs: { home: 'முகப்பு', harvest: 'அறுவடை', scan: 'ஸ்கேன்', hub: 'மையம்', profile: 'விவரம்' },
      dashboard: {
        greeting: 'வரவேற்கிறோம்.', quick_actions: 'செயல்பாடுகள்', ledger: 'லெட்ஜர்', reports: 'அறிக்கைகள்',
        iot: 'கருவிகள்', gis: 'வரைபடம்', market: 'சந்தை விலைகள்', recent_activity: 'சமீபத்திய செயல்பாடு'
      },
      harvest: {
        title: 'என் அறுவடைகள்', advisor: 'ஆலோசகர்', ai_assist: 'AI உதவி', add: 'சேர்', empty: 'எந்த அறுவடையும் இல்லை.',
        crop: 'பயிர் வகை', quantity: 'அளவு', unit: 'அலகு', location: 'இடம்',
        payout: 'விவசாயி கட்டணம் (₹/kg)', consumer_price: 'நுகர்வோர் விலை (₹/kg)', transport: 'போக்குவரத்து செலவு (₹/kg)', submit: 'சேமிக்க'
      },
      assistant: {
        placeholder: 'Wispr Flow மூலம் பேசவும்...',
        listening: 'கேட்கிறேன்...',
        processing: 'கட்டளையை ஆய்வு செய்கிறேன்...',
        success: 'கட்டளை நிறைவேற்றப்பட்டது',
        error: 'மன்னிக்கவும், எனக்கு புரியவில்லை.',
        navigating: '{{screen}}க்கு செல்கிறோம்.',
        checking_market: 'உங்களுக்காக சந்தை விலைகளை சரிபார்க்கிறோம்.',
        found_harvest: '{{crop}} அறுவடை கிடைத்தது. படிவத்தைத் திறக்கிறோம்.'
      },
      market: {
        eyebrow: 'மண்டி அப்டேட்', title: 'சந்தை விலைகள்', subtitle: 'விவசாயிகளுக்கு ஏற்ற நேரடி பயிர் விலை.',
        banner: '{{count}} பயிர்கள் · இப்போது புதுப்பிக்கப்பட்டது', empty: 'எந்த சந்தை தரவுகளும் இல்லை.', neighbors: 'அண்டை விவசாயிகள்'
      },
      iot: {
        title: 'IoT சென்சார் தரவு', subtitle: 'வெப்பநிலை மற்றும் ஈரப்பதம்', total_readings: 'மொத்த அளவீடுகள்',
        alerts: 'எச்சரிக்கைகள்', normal: 'சாதாரணம்', empty_title: 'IoT அளவீடுகள் எதுவும் இல்லை.', empty_sub: 'கண்காணிக்க சென்சார்களை இணைக்கவும்.',
        temperature: 'வெப்பநிலை', humidity: 'ஈரப்பதம்', perimeter: 'சுற்றுப்பகுதி', alert_status: 'எச்சரிக்கை',
        safe_status: 'பாதுகாப்பு', active_alerts: 'செயலில் உள்ள எச்சரிக்கை(கள்)'
      },
      scan: {
        title: 'QR டிரேஸ் ஸ்கேனர்', subtitle: 'விநியோக சங்கிலியை காண QR ஸ்கேன் செய்யவும்.', tip_title: 'விவசாயி குறிப்பு',
        tip_desc: 'மண்டியில் பயிர் வரலாறு மற்றும் நம்பிக்கையை உறுதிப்படுத்த பயன்படுத்தவும்.', start: 'ஸ்கேன் செய்யத் தொடங்கு',
        cam_title: 'கேமரா அனுமதி தேவை', cam_desc: 'QR ஸ்கேன் செய்ய கேமரா தேவை.', cam_grant: 'அனுமதி அளி',
        hint_point: 'QR குறியீட்டில் கேமராவை காட்டு', hint_fetch: 'தரவைப் பெறுகிறது...', cancel: 'ரத்துசெய்',
        res_title: 'கண்டுபிடிக்கப்பட்டது', res_sub: 'விநியோக சங்கிலி சரிபார்க்கப்பட்டது', block_ok: 'பிளாக்செயின் சரிபார்க்கப்பட்டது',
        block_bad: 'சங்கிலி ஒருமைப்பாடு உடைந்தது', block_desc: '{{blocks}} பிளாக்குகள் · {{harvests}} அறுவடைகள்',
        sec_crop: 'பயிர் தகவல்', sec_origin: 'இடம்', sec_farmer: 'விவசாயி தகவல்', sec_ledger: 'லெட்ஜர்',
        sec_iot: 'IoT சென்சார் தரவு', scan_again: 'மற்றொரு QR ஐ ஸ்கேன் செய்'
      },
      gis: {
        title: 'GIS பண்ணை டிராக்கர்', subtitle: 'புவியியல் பண்ணை இருப்பிடங்கள்', map_title: 'பண்ணை வரைபடம்',
        map_sub: '{{count}} பண்ணைகள்', loc_title: 'பண்ணை இடங்கள்', all_title: 'அனைத்து பண்ணை பதிவுகள்',
        empty_title: 'எந்த பண்ணை இடங்களும் இல்லை.', empty_sub: 'பதிவின் போது பண்ணை முகவரியை சேர்க்கவும்.',
        note: '💡 முழு வரைபடம் KrishiTrace Web App இல் கிடைக்கிறது.', batches: 'தொகுப்புகள்'
      },
      reports: {
        title: 'அறிக்கைகள் மற்றும் இணக்கம்', subtitle: 'பகுப்பாய்வு', req_title: 'நிர்வாகி அணுகல் தேவை',
        req_sub: 'முழு அறிக்கைகள் அட்மினுக்கு மட்டுமே கிடைக்கும்.\nஉள்நுழையவும்.',
        demo_title: 'டெமோ அட்மின்', demo_cred: 'மொபைல்: 9000000003\nகடவுச்சொல்: demo1234', summary: 'சுருக்கம்',
        total: 'மொத்தம்', compliant: 'இணக்கம்', violations: 'மீறல்கள்', rate: 'இணக்க விகிதம்',
        overall: 'ஒட்டுமொத்த இணக்கம்', rate_sub: 'பயிர்கள் நேர்மையான விலையை எட்டுகின்றன', by_crop: 'பயிர் வகை மூலம்',
        recent_viol: 'சமீபத்திய மீறல்கள்', empty: 'எந்த அறிக்கையும் இல்லை.', records: 'பதிவுகள்'
      },
      qr: {
        title: 'QR ஜெனரேட்டர்', subtitle: 'மாதிரி QR களை உருவாக்கவும்',
        sample_title: 'மாதிரி அறுவடைகள்', sample_sub: 'QR ஐ காண தட்டவும்.',
        gen_btn: 'QR உருவாக்கு', modal_title: 'டிரேசபிலிட்டி QR குறியீடு', modal_sub: 'KrishiTrace ஸ்கேனர் மூலம் ஸ்கேன் செய்யவும்.',
        batch_info: 'தகவல்', close: 'மூடு', print: 'அச்சிடு / பகிர்'
      },
      bc: {
        title: 'பிளாக்செயின் எக்ஸ்ப்ளோரர்', subtitle: 'உள்ளூர் சங்கிலி உருவகப்படுத்துதல்', mining_title: 'மைனிங் பிளாக்...',
        mining_sub: 'SHA-256 கணக்கிடப்படுகிறது', block_gen: 'ஜெனிசிஸ் பிளாக்', block_tamper: 'மாற்றப்பட்ட பிளாக்',
        block_valid: 'சரியான பிளாக்', hash_title: 'கிரிப்ட்டோகிராபிக் ஹேஷ்கள்', hash_block: 'பிளாக் ஹேஷ்',
        hash_prev: 'முந்தைய ஹேஷ்', nonce: 'நான்ஸ்', time_title: 'நேரமுத்திரை', time_created: 'உருவாக்கப்பட்டது',
        data_title: 'பிளாக் தரவு', status_tamper: 'ஹேஷ் பொருந்தவில்லை', status_valid: 'ஹேஷ் சரிபார்க்கப்பட்டது',
        status_tamper_sub: 'தரவு மாற்றப்பட்டுள்ளது.', status_valid_sub: 'தரவு நேர்மை உறுதிபடுத்தப்பட்டது.',
        chain_valid: 'சங்கிலி சரி', chain_broken: 'சங்கிலி உடைந்தது!', stats: '{{blocks}} பிளாக்குகள் · {{harvests}} அறுவடைகள்',
        btn_tamper: 'டேம்பர் டெஸ்ட்', btn_restore: 'சங்கிலியை மீட்டமை', btn_view: 'பார்வை', btn_reset: 'மீட்டமை',
        empty: 'எந்த பிளாக்குகளும் இல்லை', empty_sub: 'முதல் பிளாக்கை உருவாக்க அறுவடை சேர்க்கவும்.', tap_hint: 'பார்க்க தட்டவும் →'
      },
      ledger: {
        title: 'லெட்ஜர்', subtitle: 'சங்கிலியில் {{count}} பதிவுகள்', compliant: 'இணக்கம்', violation: 'மீறல்',
        qty: 'அளவு', farmer: 'விவசாயி செலுத்துகை', consumer: 'நுகர்வோர் விலை', date: 'தேதி', tx: 'TX ஹேஷ்',
        empty: 'லெட்ஜர் பதிவுகள் இல்லை.', empty_sub: 'முதல் பதிவை உருவாக்க அறுவடையை சமர்ப்பிக்கவும்.'
      }
    }
  }
};

const initI18n = async () => {
  let savedLang = 'en';
  try {
    const val = await AsyncStorage.getItem('appLang');
    if (val) savedLang = val;
  } catch (e) {
    console.log('Error reading language', e);
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3' // Required for Android React Native
  });
};

initI18n();

export default i18n;
