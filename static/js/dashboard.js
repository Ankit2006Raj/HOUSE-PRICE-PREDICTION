// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

// Load dashboard data
function loadDashboard() {
    const predictions = getPredictionHistory();

    if (predictions.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
        updateStats(predictions);
        displayHistoryTable(predictions);
        displayRecentCards(predictions);
    }
}

// Get prediction history from localStorage
function getPredictionHistory() {
    const history = localStorage.getItem('predictionHistory');
    return history ? JSON.parse(history) : [];
}

// Save prediction to history
function savePrediction(predictionData) {
    const predictions = getPredictionHistory();
    const newPrediction = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...predictionData
    };
    predictions.unshift(newPrediction);

    // Keep only last 50 predictions
    if (predictions.length > 50) {
        predictions.pop();
    }

    localStorage.setItem('predictionHistory', JSON.stringify(predictions));
}

// Update dashboard stats
function updateStats(predictions) {
    const prices = predictions.map(p => p.predictedPrice);

    document.getElementById('totalPredictions').textContent = predictions.length;

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    document.getElementById('avgPrice').textContent = formatPrice(avgPrice);

    const highestPrice = Math.max(...prices);
    document.getElementById('highestPrice').textContent = formatPrice(highestPrice);

    const lowestPrice = Math.min(...prices);
    document.getElementById('lowestPrice').textContent = formatPrice(lowestPrice);
}

// Display history table
function displayHistoryTable(predictions) {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';

    predictions.forEach((pred, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDateTime(pred.timestamp)}</td>
            <td>${pred.area}</td>
            <td>${pred.bedrooms}</td>
            <td>${getLocationName(pred.location)}</td>
            <td>${getConditionName(pred.condition)}</td>
            <td class="price-cell">${formatPrice(pred.predictedPrice)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePrediction(${pred.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display recent prediction cards
function displayRecentCards(predictions) {
    const container = document.getElementById('recentCards');
    container.innerHTML = '';

    const recent = predictions.slice(0, 6);

    recent.forEach(pred => {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6';
        card.innerHTML = `
            <div class="prediction-card-item">
                <div class="card-header-dash">
                    <span class="badge bg-gradient">${getLocationName(pred.location)}</span>
                    <span class="time-ago">${getTimeAgo(pred.timestamp)}</span>
                </div>
                <div class="card-body-dash">
                    <div class="price-display">${formatPrice(pred.predictedPrice)}</div>
                    <div class="property-details">
                        <div class="detail-item">
                            <i class="fas fa-ruler-combined"></i>
                            <span>${pred.area} sq ft</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-bed"></i>
                            <span>${pred.bedrooms} Beds</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-bath"></i>
                            <span>${pred.bathrooms} Baths</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <span>${getConditionName(pred.condition)}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer-dash">
                    <button class="btn btn-sm btn-outline-light" onclick="viewDetails(${pred.id})">
                        <i class="fas fa-eye me-1"></i>Details
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePrediction(${pred.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Delete prediction
function deletePrediction(id) {
    if (confirm('Are you sure you want to delete this prediction?')) {
        let predictions = getPredictionHistory();
        predictions = predictions.filter(p => p.id !== id);
        localStorage.setItem('predictionHistory', JSON.stringify(predictions));
        loadDashboard();
    }
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all prediction history?')) {
        localStorage.removeItem('predictionHistory');
        loadDashboard();
    }
}

// View prediction details
function viewDetails(id) {
    const predictions = getPredictionHistory();
    const prediction = predictions.find(p => p.id === id);

    if (prediction) {
        alert(`
Prediction Details:
━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${formatDateTime(prediction.timestamp)}
💰 Price: ${formatPrice(prediction.predictedPrice)}
📏 Area: ${prediction.area} sq ft
🛏️ Bedrooms: ${prediction.bedrooms}
🛁 Bathrooms: ${prediction.bathrooms}
🏢 Floors: ${prediction.floors}
📍 Location: ${getLocationName(prediction.location)}
⭐ Condition: ${getConditionName(prediction.condition)}
🚗 Garage: ${prediction.garage ? 'Yes' : 'No'}
        `);
    }
}

// Show/Hide empty state
function showEmptyState() {
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('historyTable').style.display = 'none';
    document.getElementById('recentCards').innerHTML = '';
}

function hideEmptyState() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('historyTable').style.display = 'block';
}

// Helper functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(timestamp);
}

function getLocationName(code) {
    const locations = {
        0: 'Downtown',
        1: 'Rural',
        2: 'Suburban',
        3: 'Urban'
    };
    return locations[code] || 'Unknown';
}

function getConditionName(code) {
    const conditions = {
        0: 'Excellent',
        1: 'Fair',
        2: 'Good',
        3: 'Poor'
    };
    return conditions[code] || 'Unknown';
}

// Export function for use in predict.js
window.savePredictionToHistory = savePrediction;
