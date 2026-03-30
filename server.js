import http from 'http';

function generateOTPRequest() {
    // INCREASED FRAUD RATE for visual activity (30%)
    const isFraudAttack = Math.random() > 0.70; 
    
    // Session ID instead of TX ID
    const sessionId = 'AUTH-SESS-' + Math.floor(100000 + Math.random() * 900000).toString();
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // IP and Location Simulation (Replacing Amount & VPA)
    const locations = ['Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'London, UK', 'Lagos, NG', 'Moscow, RU', 'Beijing, CN'];
    let location = '';
    let ip = '';
    
    if (isFraudAttack) {
        // High risk locations or sketchy IPs for fraud
        location = locations[Math.floor(Math.random() * 4) + 3]; // UK, NG, RU, CN
        ip = `${Math.floor(Math.random()*200 + 50)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.9`;
    } else {
        // Safe local requests
        location = locations[Math.floor(Math.random() * 3)]; // IN locations
        ip = `103.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.1`;
    }

    // Phone Number Target
    const phonePrefix = ['+91 98', '+91 88', '+91 79', '+91 99'];
    const phone = phonePrefix[Math.floor(Math.random() * phonePrefix.length)] + Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // OTP Specific Models
    // 1. Device Fingerprinting Risk
    let fingerprintRisk = isFraudAttack ? 0.70 + (Math.random() * 0.25) : Math.random() * 0.2;
    
    // 2. Geographic Velocity / Impossible travel
    let geoVelocityRisk = isFraudAttack ? 0.6 + (Math.random() * 0.4) : Math.random() * 0.15;

    // 3. Final Neural Net Output Probability
    let finalRiskScore = (fingerprintRisk * 0.5) + (geoVelocityRisk * 0.5);
    const isFraud = finalRiskScore > 0.65;

    return {
        sessionId,
        timeStr,
        locationInfo: `${ip} (${location})`,
        targetPhone: phone,
        fingerprintRisk: fingerprintRisk.toFixed(3),
        geoVelocityRisk: geoVelocityRisk.toFixed(2),
        isFraud,
        finalRiskScore: finalRiskScore.toFixed(3) // Ensure this is sent to UI
    };
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/transactions' && req.method === 'GET') {
        const tx = generateOTPRequest();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tx));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
