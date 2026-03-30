# 🛡️ TrustGuard: OTP Fraud Authentication Dashboard

> A real-time, high-speed simulated machine learning dashboard designed to detect, track, and mitigate SMS/OTP authentication fraud across global telecommunication networks.

## 🌟 Key Features

- **Live Request Simulation**: A continuously streaming Node.js backend generating a rapid, randomized burst of mock OTP authentication requests.
- **Dynamic Threat Detection Models**: Features real-time calculated threat scoring utilizing three simulated mechanisms:
  - 🖥️ **Device Fingerprinting Risk** (Known Bad Actors)
  - 🌍 **Geo-Velocity Checking** (Impossible Travel detection mapping IP origins)
  - 🧠 **Behavioral Neural Network Ensembler** (Phishing Pattern matching)
- **Living Traffic Visualization**: An active **Chart.js** doughnut graph continuously charting the live ratio of Safe Requests vs Blocked Threats.
- **Interactive Start/Stop Gateway**: A beautiful, un-intrusive toggle system embedded in the metrics to pause or resume the security engine on demand.
- **Instant System Reboot**: Complete numerical layout reset via the "Restart From Zero" button on the navigation bar.

## 🛠️ Technology Stack

- **Frontend Core**: Highly optimized Vanilla HTML/JS/CSS, powered by **Vite** for blazing-fast compilation.
- **Mock Backend API**: Pure Node.js underlying HTTP server (`server.js`) serving randomized REST JSON responses without leaning heavily on external dependencies.
- **Design Language**: Crafted with strict modern, premium minimalist aesthetics. Features soft shadows, glass-like styling, inter-typeface, and **Feather Icons**.

## 🚀 Running the Project Locally

No massive installations are required. Follow these steps to simultaneously launch both the engine and UI.

### 1. Start the Secure Backend (Data Engine)
Open a terminal in the project directory and run:
```bash
node server.js
```
*The API will go live immediately on `http://localhost:3001`.*

### 2. Start the Frontend (Dashboard UI)
Open a second terminal window and use Vite to launch the interface:
```bash
npm run dev
```
*(If you are on Windows and PowerShell blocks `npm`, open CMD and use `cmd /c npm run dev`)*

Once both are active, access your live, fast-paced analytical dashboard at the localhost link provided by Vite (usually `http://localhost:5173`)!

## 📸 Quick Note on Preview Images
*Take a beautiful snippet of the dashboard while the data is flowing! You can add it directly to this README by dragging and dropping your screenshot onto the GitHub web editor at the very top of the page!*

---

Built for the **[otp-fraud-detection](https://github.com/maviyamustahsin/otp-fraud-detection)** repository by **[@maviyamustahsin](https://github.com/maviyamustahsin)**.

<div align="right">
  <a href="#-trustguard-otp-fraud-authentication-dashboard">🔼 Back to Top</a>
</div>
