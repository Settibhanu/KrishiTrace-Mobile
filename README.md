# KrishiTrace Mobile App

**KrishiTrace** is an advanced AI and Blockchain-powered farm-to-table platform. This mobile application acts as the companion app for farmers, warehouse managers, and supply chain operators to log harvests, track market prices, and monitor IoT sensor data on the go.

> **Note:** A `README.md` is simply a documentation file for human developers. It is 100% allowed and does not affect how the app runs on Expo Go!

---

## 🌟 Key Features Built for the Hackathon

1. **🌾 AI-Powered Harvest Logging**
   Instead of filling out long forms, farmers can type natural language phrases (like *"Tomato 50 kg payout 30 rupees"*). The backend parses this using an AI engine to auto-fill the forms. (Native Voice integration has been swapped to Text for maximum stability during the demo).
2. **📈 Market Price Advisor (Chatbot & Autofill)**
   - The app natively pulls from 15 supported crops in the MongoDB backend.
   - Selecting a crop immediately autofills the `Farmer Payout` and `Consumer Price` based on live Mandi datasets.
   - Features a **🤖 Market Advisor Chatbot** (floating button) that answers conversational queries like *"When is the best time to sell onions?"*
3. **🌍 Global Language Translation (i18n)**
   - The app is fully translated into **English, Hindi, Telugu, Kannada, and Tamil**.
   - Language preferences are instantly saved and applied across the entire app via the `🌐` globe icon on the Dashboard.
4. **🔗 Blockchain Ledger Dashboard**
   Live tracking of supply chain operations, viewing compliance tags, and transaction hashes straight from the database.
5. **📡 IoT Monitoring**
   Live dashboard visualizing telemetry data (temperature, humidity, pH) coming off farm hardware sensors.

---

## 🚀 How to Run the App (Expo Go)

Follow these steps to run the app during your presentation:

### 1. Install Dependencies
If you have just cloned the repo or added new features (like i18n), you must run:
```bash
npm install
```

### 2. Start the Metro Server
We highly recommend running with the `--tunnel` flag to bypass any campus or public Wi-Fi firewall issues when connecting to your phone. We also clear the cache (`-c`) to ensure you always get the latest layout:
```bash
npx expo start -c --tunnel
```

### 3. Open on your Phone
1. Download **Expo Go** from the iOS App Store or Google Play Store.
2. Open the Camera app on your phone.
3. Scan the QR code that appears in your terminal.
4. The app will build and open directly on your device!

---

## 🔐 Credentials for Demo

If the app asks for a login during the sequence (it is hooked to your Vercel backend API), you can use the standard mock credentials:
- **Farmer Login:** `9000000001` / `demo1234`
- **Admin Login:** `9000000003` / `demo1234`

## ⚠️ Known Demo Limitations
- **Voice Features:** Native React Native voice APIs are strictly tied to specific Operating System versions. We have provided an **"AI Assist"** text-box alternative instead of microphone access to ensure 100% demo success rate without device-specific crashing.
- **GIS Maps:** Depending on Expo Go limitations, native interactive maps may be swapped with placeholder cards to prevent Google Play Services credential blocks during live demonstrations.
