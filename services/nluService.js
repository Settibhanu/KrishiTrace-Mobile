/**
 * nluService classifies voice transcripts into intents.
 * Supported intents: NAVIGATE, HARVEST_ENTRY, MARKET_QUERY
 */
const nluService = {
  // Mapping of common keywords across 5 languages
  keywords: {
    NAVIGATE: {
      en: ['go to', 'open', 'show', 'navigate'],
      hi: ['जाओ', 'खोलो', 'दिखाओ'], // gao, kholo, dikhao
      te: ['వెళ్ళు', 'తెరవండి', 'చూపించు'], // vellu, teravandi, chupinchu
      kn: ['ಹೋಗಿ', 'ತೆರೆಯಿರಿ', 'ತೋರಿಸಿ'], // hogu, tereyiri, thorisi
      ta: ['செல்லவும்', 'திறக்கவும்', 'காண்பிக்கவும்'], // sellavum, thirakkavum, kaanbikkavum
    },
    HARVEST: {
      en: ['add', 'harvest', 'batch', 'record', 'tomato', 'potato', 'onion', 'rice', 'wheat'],
      hi: ['कटाई', 'बैच', 'टमाटर', 'आलू', 'प्याज', 'चावल', 'गेहूं'],
      te: ['కోత', 'టమాటా', 'బంగాళదుంప', 'ఉల్లిపాయ', 'వరి', 'గోధుమ'],
      kn: ['ಕೊಯ್ಲು', 'ಟೊಮ್ಯಾಟೊ', 'ಆಲೂಗಡ್ಡೆ', 'ಈರುಳ್ಳಿ', 'ಅಕ್ಕಿ', 'ಗೋಧಿ'],
      ta: ['அறுவடை', 'தக்காளி', 'உருளைக்கிழங்கு', 'வெங்காயம்', 'அரிசி', 'கோதுமை'],
    },
    MARKET: {
      en: ['price', 'market', 'mandi', 'rate', 'cost'],
      hi: ['कीमत', 'बाजार', 'मंडी', 'भाव', 'दर'],
      te: ['ధర', 'మార్కెట్', 'మండి', 'రేటు'],
      kn: ['ಬೆಲೆ', 'ಮಾರುಕಟ್ಟೆ', 'ಮಂಡಿ', 'ದರ'],
      ta: ['விலை', 'சந்தை', 'மண்டி', 'விகிதம்'],
    }
  },

  // Target paths for navigation
  paths: {
    dashboard: ['dashboard', 'home', 'main', 'मुख्य', 'होम', 'ముఖ్య'],
    harvest:   ['harvest', 'batch', 'कटाई', 'कोత', 'ಕೊಯ್ಲು', 'அறுவடை'],
    scan:      ['scan', 'camera', 'qr', 'स्कैन', 'స్కాన్', 'ಸ್ಕ್ಯಾನ್', 'ஸ்கேன்'],
    profile:   ['profile', 'account', 'user', 'प्रोफ़ाइल', 'ప్రొఫైల్', 'ಪ್ರೊಫೈಲ್', 'சுயவிவரம்'],
    market:    ['market', 'price', 'mandi', 'बाजार', 'మార్కెట్', 'ಮಾರುಕಟ್ಟೆ', 'சந்தை'],
    iot:       ['iot', 'sensors', 'alert', 'सेंसर', 'సెన్సార్', 'ಸೆನ್ಸರ್', 'சென்சார்'],
    blockchain:['blockchain', 'ledger', 'blocks', 'ब्लॉकचेन', 'బ్లాక్‌చెయిన్'],
    gis:       ['map', 'gis', 'location', 'नक्शा', 'మ్యాప్', 'ನಕ್ಷೆ', 'வரைபடம்'],
  },

  /**
   * Classify a transcript into an intent.
   * @param {string} text 
   * @param {string} lang 
   */
  classify: (text, lang = 'en') => {
    const transcript = text.toLowerCase();
    
    // 1. Check for Navigation Intent
    const isNav = nluService.keywords.NAVIGATE[lang]?.some(k => transcript.includes(k)) || 
                  nluService.keywords.NAVIGATE.en.some(k => transcript.includes(k));

    if (isNav) {
      // Find the best matching path
      for (const [path, aliases] of Object.entries(nluService.paths)) {
        if (aliases.some(alias => transcript.includes(alias))) {
          return { intent: 'NAVIGATE', data: { path: `/(tabs)/${path}` } };
        }
      }
    }

    // 2. Check for Market Query
    const isMarket = nluService.keywords.MARKET[lang]?.some(k => transcript.includes(k)) || 
                     nluService.keywords.MARKET.en.some(k => transcript.includes(k));
    
    if (isMarket) {
      return { intent: 'MARKET_QUERY', data: { query: transcript } };
    }

    // 3. Check for Harvest Entry
    const isHarvest = nluService.keywords.HARVEST[lang]?.some(k => transcript.includes(k)) || 
                      nluService.keywords.HARVEST.en.some(k => transcript.includes(k));
    
    if (isHarvest) {
      return { intent: 'HARVEST_ENTRY', data: { transcript: transcript } };
    }

    return { intent: 'UNKNOWN', data: { transcript: transcript } };
  }
};

export default nluService;
