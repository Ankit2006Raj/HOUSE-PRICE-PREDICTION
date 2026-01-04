// Modern Prediction Form Handler
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupPreviewUpdates();
});

// Initialize form
function initializeForm() {
    const form = document.getElementById('predictionForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handlePrediction();
    });
}

// Step navigation
function nextStep(step) {
    // Validate current step
    const currentStep = document.querySelector('.form-step.active');
    const inputs = currentStep.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    // Move to next step
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    document.querySelectorAll('.progress-steps .step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.progress-steps .step[data-step="${step}"]`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    document.querySelectorAll('.progress-steps .step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.progress-steps .step[data-step="${step}"]`).classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup live preview updates
function setupPreviewUpdates() {
    const fields = ['area', 'bedrooms', 'bathrooms', 'floors', 'yearBuilt', 'location', 'condition'];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('change', updatePreview);
            element.addEventListener('input', updatePreview);
        }
    });

    // Garage radio buttons
    document.querySelectorAll('input[name="garage"]').forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });
}

// Update preview
function updatePreview() {
    const area = document.getElementById('area').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const floors = document.getElementById('floors').value;
    const yearBuilt = document.getElementById('yearBuilt').value;
    const location = document.getElementById('location').value;
    const condition = document.getElementById('condition').value;
    const garage = document.querySelector('input[name="garage"]:checked');

    document.getElementById('previewArea').textContent = area ? `${area} sq ft` : '-';
    document.getElementById('previewBedrooms').textContent = bedrooms || '-';
    document.getElementById('previewBathrooms').textContent = bathrooms || '-';
    document.getElementById('previewFloors').textContent = floors || '-';
    document.getElementById('previewYear').textContent = yearBuilt || '-';
    document.getElementById('previewLocation').textContent = location ? getLocationName(parseInt(location)) : '-';
    document.getElementById('previewCondition').textContent = condition ? getConditionName(parseInt(condition)) : '-';
    document.getElementById('previewGarage').textContent = garage ? (garage.value === '1' ? 'Yes' : 'No') : '-';
}

// Handle prediction
async function handlePrediction() {
    const formData = {
        area: parseFloat(document.getElementById('area').value),
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseInt(document.getElementById('bathrooms').value),
        floors: parseInt(document.getElementById('floors').value),
        yearBuilt: parseInt(document.getElementById('yearBuilt').value),
        location: parseInt(document.getElementById('location').value),
        condition: parseInt(document.getElementById('condition').value),
        garage: parseInt(document.querySelector('input[name="garage"]:checked').value)
    };

    // Show loading
    document.getElementById('predictionForm').style.display = 'none';
    document.getElementById('propertyPreview').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            // Save to history
            if (window.savePredictionToHistory) {
                window.savePredictionToHistory({
                    ...formData,
                    predictedPrice: data.predicted_price
                });
            }

            // Show result
            setTimeout(() => {
                document.getElementById('loadingState').style.display = 'none';
                showResult(data.predicted_price);

                // Show success toast
                setTimeout(() => {
                    document.querySelector('.success-toast').classList.add('show');
                    setTimeout(() => {
                        document.querySelector('.success-toast').classList.remove('show');
                    }, 3000);
                }, 500);
            }, 2000);
        } else {
            throw new Error(data.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('predictionForm').style.display = 'block';
        document.getElementById('propertyPreview').style.display = 'block';
        showNotification(error.message, 'error');
    }
}

// Show result
function showResult(price) {
    document.getElementById('resultCard').style.display = 'block';

    // Animate price
    animatePrice(price);

    // Update progress
    document.querySelectorAll('.progress-steps .step').forEach(s => s.classList.remove('active'));
    document.querySelector('.progress-steps .step[data-step="3"]').classList.add('active');
}

// Animate price
function animatePrice(targetPrice) {
    const element = document.getElementById('predictedPrice');
    const duration = 2000;
    const increment = targetPrice / (duration / 16);
    let current = 0;

    const updatePrice = () => {
        current += increment;
        if (current < targetPrice) {
            element.textContent = formatPrice(current);
            requestAnimationFrame(updatePrice);
        } else {
            element.textContent = formatPrice(targetPrice);
        }
    };

    updatePrice();
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

function getLocationName(code) {
    const locations = { 0: 'Downtown', 1: 'Rural', 2: 'Suburban', 3: 'Urban' };
    return locations[code] || 'Unknown';
}

function getConditionName(code) {
    const conditions = { 0: 'Excellent', 1: 'Fair', 2: 'Good', 3: 'Poor' };
    return conditions[code] || 'Unknown';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
