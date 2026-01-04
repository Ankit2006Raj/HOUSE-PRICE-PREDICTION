// Prediction Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const resultSection = document.getElementById('resultSection');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const predictedPriceElement = document.getElementById('predictedPrice');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            area: parseFloat(document.getElementById('area').value),
            bedrooms: parseInt(document.getElementById('bedrooms').value),
            bathrooms: parseInt(document.getElementById('bathrooms').value),
            floors: parseInt(document.getElementById('floors').value),
            yearBuilt: parseInt(document.getElementById('yearBuilt').value),
            location: parseInt(document.getElementById('location').value),
            condition: parseInt(document.getElementById('condition').value),
            garage: parseInt(document.getElementById('garage').value)
        };

        // Validate data
        if (!validateFormData(formData)) {
            showError('Please fill all fields correctly');
            return;
        }

        // Show loading
        form.style.display = 'none';
        loadingSpinner.style.display = 'block';
        resultSection.style.display = 'none';

        try {
            // Make prediction request
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Show result
                predictedPriceElement.textContent = data.formatted_price;
                loadingSpinner.style.display = 'none';
                resultSection.style.display = 'block';

                // Animate price
                animatePrice(data.predicted_price);

                // Save to history
                if (window.savePredictionToHistory) {
                    window.savePredictionToHistory({
                        ...formData,
                        predictedPrice: data.predicted_price
                    });
                }
            } else {
                throw new Error(data.error || 'Prediction failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
            form.style.display = 'block';
            loadingSpinner.style.display = 'none';
        }
    });

    // Form reset handler
    form.addEventListener('reset', () => {
        resultSection.style.display = 'none';
    });
});

// Validate form data
function validateFormData(data) {
    if (data.area < 500 || data.area > 5000) {
        alert('Area must be between 500 and 5000 sq ft');
        return false;
    }

    if (data.yearBuilt < 1900 || data.yearBuilt > 2024) {
        alert('Year built must be between 1900 and 2024');
        return false;
    }

    return true;
}

// Animate price counter
function animatePrice(targetPrice) {
    const element = document.getElementById('predictedPrice');
    const duration = 1500;
    const increment = targetPrice / (duration / 16);
    let current = 0;

    const updatePrice = () => {
        current += increment;
        if (current < targetPrice) {
            element.textContent = `$${Math.floor(current).toLocaleString()}`;
            requestAnimationFrame(updatePrice);
        } else {
            element.textContent = `$${Math.round(targetPrice).toLocaleString()}`;
        }
    };

    updatePrice();
}

// Show error message
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alertDiv.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const form = document.getElementById('predictionForm');
    form.parentNode.insertBefore(alertDiv, form);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Input validation and formatting
document.addEventListener('DOMContentLoaded', () => {
    // Area input formatting
    const areaInput = document.getElementById('area');
    if (areaInput) {
        areaInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 500) {
                e.target.setCustomValidity('Minimum area is 500 sq ft');
            } else if (value > 5000) {
                e.target.setCustomValidity('Maximum area is 5000 sq ft');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    // Year built validation
    const yearInput = document.getElementById('yearBuilt');
    if (yearInput) {
        yearInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1900) {
                e.target.setCustomValidity('Year must be 1900 or later');
            } else if (value > 2024) {
                e.target.setCustomValidity('Year cannot be in the future');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }
});
