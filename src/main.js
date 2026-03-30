import './style.css'

// DOM Elements
const txStreamBody = document.getElementById('tx-stream-body');
const totalProcessedEl = document.getElementById('stat-processed');
const fraudsPreventedEl = document.getElementById('stat-prevented');

// State
let totalProcessed = 0;
let fraudsPrevented = 0;
const MAX_ROWS = 25; // Keep up to 25 rows

// Chart State
let chartInstance;
function initChart() {
    const ctx = document.getElementById('protectionChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Safe Verified', 'Threats Blocked'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'right', labels: { color: '#64748b', font: { family: 'Inter', size: 11 } } }
            }
        }
    });
}

// Helper: Format Number
const formatNum = (num) => num.toLocaleString('en-US');

// Initialize Counters on Load
totalProcessedEl.textContent = formatNum(totalProcessed);
fraudsPreventedEl.textContent = formatNum(fraudsPrevented);

// Render Request to Table
function renderRequest(tx) {
  const row = document.createElement('tr');
  
  const riskColorClass = tx.isFraud ? 'risk-high' : 'risk-low';
  const badgeClass = tx.isFraud ? 'fraud' : 'safe';
  const badgeText = tx.isFraud ? 'OTP Blocked' : 'SMS Sent';
  const badgeIcon = tx.isFraud ? 'shield-off' : 'send';

  // Calculate percentage format for Risk using the OTP tailored variables
  const riskPercentage = (tx.finalRiskScore * 100).toFixed(1);

  row.innerHTML = `
    <td class="tx-id">${tx.sessionId}</td>
    <td style="color: var(--text-muted);">${tx.timeStr}</td>
    <td style="font-family: monospace; font-size: 0.8rem;">${tx.locationInfo}</td>
    <td style="color: var(--primary-blue); font-weight: 600; font-family: monospace;">${tx.targetPhone}</td>
    <td class="risk-score ${riskColorClass}">${riskPercentage}% Threat</td>
    <td>
      <span class="badge ${badgeClass}">
        <i data-feather="${badgeIcon}" style="width: 14px; height: 14px;"></i>
        ${badgeText}
      </span>
    </td>
  `;

  // Prepend to top of the table
  txStreamBody.insertBefore(row, txStreamBody.firstChild);

  // Initialize feather icons for the new row
  if (window.feather) {
      window.feather.replace();
  }

  // Remove oldest row if exceeding limit
  if (txStreamBody.children.length > MAX_ROWS) {
    txStreamBody.removeChild(txStreamBody.lastChild);
  }

  // Update Global Counters
  totalProcessed++;
  totalProcessedEl.textContent = formatNum(totalProcessed);
  
  if (tx.isFraud) {
    fraudsPrevented++;
    fraudsPreventedEl.textContent = formatNum(fraudsPrevented);
  }

  // Update Chart
  if (chartInstance) {
      chartInstance.data.datasets[0].data = [totalProcessed - fraudsPrevented, fraudsPrevented];
      chartInstance.update();
  }
}

// Fetch single request from Node.js server
async function fetchTransaction() {
    try {
        const response = await fetch('http://localhost:3001/api/transactions');
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const tx = await response.json();
        renderRequest(tx);
    } catch (error) {
        console.error("Failed to fetch. Is backend running?", error);
    }
}

// Runtime State
let isSimulationRunning = true;
let simulationTimeout;

// Main Polling Loop - MADE MUCH FASTER
async function runSimulation() {
  if (!isSimulationRunning) return;

  await fetchTransaction();

  if (!isSimulationRunning) return; // double check after network request
  
  // REALLY FAST POLLING: Randomize ping between 200ms to 700ms for rapid burst traffic
  const nextInterval = Math.floor(Math.random() * 500) + 200;
  simulationTimeout = setTimeout(runSimulation, nextInterval);
}

// Interactivity: Status Toggle
const gatewayToggleBtn = document.getElementById('gateway-toggle-btn');
const gatewayStatusText = document.getElementById('gateway-status-text');
const gatewayDot = document.getElementById('gateway-dot');
const gatewayLabel = document.getElementById('gateway-label');

gatewayToggleBtn.addEventListener('click', () => {
    isSimulationRunning = !isSimulationRunning;
    
    // Slight bump animation
    gatewayToggleBtn.style.transform = 'scale(0.95)';
    setTimeout(() => gatewayToggleBtn.style.transform = 'scale(1)', 100);

    if (isSimulationRunning) {
        // Resume UI state
        gatewayStatusText.style.color = 'var(--primary-green)';
        gatewayDot.style.background = 'var(--primary-green)';
        gatewayDot.classList.add('pulse');
        gatewayLabel.textContent = 'Active Protection';
        runSimulation(); // Restart loop
    } else {
        // Paused UI state
        clearTimeout(simulationTimeout);
        gatewayStatusText.style.color = 'var(--text-muted)';
        gatewayDot.style.background = 'var(--text-muted)';
        gatewayDot.classList.remove('pulse');
        gatewayLabel.textContent = 'Protection Paused';
    }
});

// Interactivity: Restart System
const restartBtn = document.getElementById('restart-btn');

restartBtn.addEventListener('click', () => {
    // Slight bump animation
    restartBtn.style.transform = 'scale(0.95)';
    setTimeout(() => restartBtn.style.transform = 'scale(1)', 100);

    // Reset Global Counters
    totalProcessed = 0;
    fraudsPrevented = 0;
    totalProcessedEl.textContent = formatNum(totalProcessed);
    fraudsPreventedEl.textContent = formatNum(fraudsPrevented);

    // Reset Chart
    if (chartInstance) {
        chartInstance.data.datasets[0].data = [0, 0];
        chartInstance.update();
    }

    // Clear the table DOM completely
    txStreamBody.innerHTML = '';

    // If it was paused, let's force it to instantly reboot
    if (!isSimulationRunning) {
        gatewayToggleBtn.click(); // Trigger the start/stop logic elegantly to resume
    }
});

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initChart();

    // Perform rapid initial fetch to populate the tables fast
    let initialLoads = 0;
    const interval = setInterval(() => {
        if(!isSimulationRunning) return;
        fetchTransaction();
        initialLoads++;
        
        // Stop rapid burst and hand over to continuous polling
        if (initialLoads >= 12) {
            clearInterval(interval);
            simulationTimeout = setTimeout(runSimulation, 400);
        }
    }, 50);
});
