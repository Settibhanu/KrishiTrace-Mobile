/**
 * harvestVoiceParser extracts crop, quantity, and price from voice transcripts.
 */
const harvestVoiceParser = {
  CROPS: {
    en: ['tomato', 'potato', 'onion', 'rice', 'wheat', 'maize', 'mango', 'banana', 'jackfruit', 'sugarcane', 'cotton', 'soybean', 'groundnut', 'chilli', 'pineapple'],
    hi: ['टमाटर', 'आलू', 'प्याज', 'चावल', 'गेहूं', 'मक्का', 'आम', 'केला', 'कटहल', 'गन्ना', 'कपास', 'सोयाबीन', 'मूंगफली', 'मिर्च', 'अनानास'],
    te: ['టమాటా', 'బంగాళదుంప', 'ఉల్లిపాయ', 'వరి', 'గోధుమ', 'మొక్కజొన్న', 'మామిడి', 'అరటి', 'పనస', 'చెరకు', 'ప్రత్తి', 'సోయాబీన్', 'వేరుశనగ', 'మిరప', 'అనాస'],
    kn: ['ಟೊಮ್ಯಾಟೊ', 'ಆಲೂಗಡ್ಡೆ', 'ಈರುಳ್ಳಿ', 'ಅಕ್ಕಿ', 'ಗೋಧಿ', 'ಮೆಕ್ಕೆಜೋಳ', 'ಮಾವು', 'ಬಾಳೆಹಣ್ಣು', 'ಹಲಸಿನ ಹಣ್ಣು', 'ಕಬ್ಬು', 'ಹತ್ತಿ', 'ಸೋಯಾಬೀನ್', 'ನೆಲಗಡಲೆ', 'ಮೆಣಸಿನಕಾಯಿ', 'ಅನಾನಸ್'],
    ta: ['தக்காளி', 'உருளைக்கிழங்கு', 'வெங்காயம்', 'அரிசி', 'கோதுமை', 'சோளம்', 'மாம்பழம்', 'வாழைப்பழம்', 'பலாப்பழம்', 'கரும்பு', 'பருத்தி', 'சோயாபீன்', 'நிலக்கடலை', 'மிளகாய்', 'அன்னாசி'],
  },

  UNITS: {
    en: ['kg', 'kilo', 'quintal', 'ton', 'bag'],
    hi: ['किलो', 'क्विंटल', 'टन', 'बोरी'],
    te: ['కేజీలు', 'క్వింటాల్', 'టన్ను', 'బస్తా'],
    kn: ['ಕಿಲೋ', 'ಕ್ವಿಂಟಾಲ್', 'ಟನ್', 'ಚೀಲ'],
    ta: ['கிலோ', 'க்விண்டால்', 'டன்', 'மூட்டை'],
  },

  /**
   * Parse a transcript into structured harvest data.
   * @param {string} text 
   * @param {string} lang 
   */
  parse: (text, lang = 'en') => {
    const transcript = text.toLowerCase();
    const result = {
      cropType: null,
      quantity: null,
      unit: 'kg',
      farmerPayout: null,
    };

    // 1. Identify Crop
    const langCrops = harvestVoiceParser.CROPS[lang] || harvestVoiceParser.CROPS.en;
    for (let i = 0; i < langCrops.length; i++) {
      if (transcript.includes(langCrops[i].toLowerCase())) {
        // Always return the English name for the database consistency
        result.cropType = harvestVoiceParser.CROPS.en[i];
        break;
      }
    }

    // 2. Identify Numbers (Quantity & Price)
    // Simple logic: first number is usually quantity, second is price
    const numbers = transcript.match(/\d+/g);
    if (numbers && numbers.length >= 1) {
      result.quantity = numbers[0];
      if (numbers.length >= 2) {
        result.farmerPayout = numbers[1];
      }
    }

    // 3. Identify Unit
    const langUnits = harvestVoiceParser.UNITS[lang] || harvestVoiceParser.UNITS.en;
    for (let i = 0; i < langUnits.length; i++) {
      if (transcript.includes(langUnits[i].toLowerCase())) {
        result.unit = harvestVoiceParser.UNITS.en[i] === 'kilo' ? 'kg' : harvestVoiceParser.UNITS.en[i];
        break;
      }
    }

    return result;
  }
};

export default harvestVoiceParser;
