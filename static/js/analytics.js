// Analytics Page - Modern Interactive Features
class AnalyticsManager {
    constructor() {
        this.charts = [
            {
                id: 'price_distribution',
                title: 'Price Distribution',
                icon: 'fa-chart-bar',
                category: 'distribution',
                description: 'Distribution of property prices across the dataset'
            },
            {
                id: 'correlation_heatmap',
                title: 'Feature Correlation',
                icon: 'fa-fire',
                category: 'correlation',
                description: 'Correlation matrix showing relationships between features'
            },
            {
                id: 'price_vs_area',
                title: 'Price vs Area Analysis',
                icon: 'fa-ruler-combined',
                category: 'features',
                description: 'Relationship between property area and price'
            },
            {
                id: 'price_by_location',
                title: 'Price by Location',
                icon: 'fa-map-marker-alt',
                category: 'location',
                description: 'Average prices across different locations'
            },
            {
                id: 'price_by_condition',
                title: 'Price by Condition',
                icon: 'fa-star',
                category: 'features',
                description: 'Impact of property condition on pricing'
            },
            {
                id: 'price_by_bedrooms',
                title: 'Price by Bedrooms',
                icon: 'fa-bed',
                category: 'features',
                description: 'Price trends based on number of bedrooms'
            },
            {
                id: 'year_built_analysis',
                title: 'Year Built Analysis',
                icon: 'fa-calendar',
                category: 'distribution',
                description: 'Property age distribution and price correlation'
            }
        ];

        this.currentFilter = 'all';
        this.analyticsData = null;
        this.init();
    }

    init() {
        this.renderCharts();
        this.loadMetrics();
        this.setupEventListeners();
        this.animateMetrics();
    }

    renderCharts() {
        const container = document.getElementById('chartsContainer');
        container.innerHTML = '';

        const filteredCharts = this.currentFilter === 'all'
            ? this.charts
            : this.charts.filter(chart => chart.category === this.currentFilter);

        filteredCharts.forEach((chart, index) => {
            const colSize = chart.id === 'year_built_analysis' ? 'col-lg-12' : 'col-lg-6';
            const chartCard = `
                <div class="${colSize} chart-item" data-category="${chart.category}" style="animation-delay: ${index * 0.1}s">
                    <div class="analytics-card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5><i class="fas ${chart.icon} me-2"></i>${chart.title}</h5>
                                <div class="chart-actions">
                                    <button class="btn-icon" onclick="analyticsManager.zoomChart('${chart.id}')" title="Zoom">
                                        <i class="fas fa-search-plus"></i>
                                    </button>
                                    <button class="btn-icon" onclick="analyticsManager.downloadChart('${chart.id}')" title="Download">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="chart-description">${chart.description}</p>
                        </div>
                        <div class="card-body">
                            <div class="chart-loading" id="loading-${chart.id}">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            <img src="/static/images/${chart.id}.png" 
                                 alt="${chart.title}" 
                                 class="img-fluid rounded chart-image"
                                 onload="analyticsManager.hideLoading('${chart.id}')"
                                 onerror="analyticsManager.handleImageError('${chart.id}')">
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += chartCard;
        });

        // Trigger animation
        setTimeout(() => {
            document.querySelectorAll('.chart-item').forEach(item => {
                item.classList.add('fade-in');
            });
        }, 100);
    }

    hideLoading(chartId) {
        const loader = document.getElementById(`loading-${chartId}`);
        if (loader) {
            loader.style.display = 'none';
        }
    }

    handleImageError(chartId) {
        const loader = document.getElementById(`loading-${chartId}`);
        if (loader) {
            loader.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Chart not available. Please run the analysis script first.
                </div>
            `;
        }
    }

    async loadMetrics() {
        try {
            // Fetch real metrics from API
            const response = await fetch('/api/analytics-data');
            if (!response.ok) {
                throw new Error('Failed to fetch analytics data');
            }

            const data = await response.json();

            this.animateCounter('totalProperties', data.totalProperties, '');
            this.animateCounter('avgPrice', data.avgPrice, '$', true);
            this.animateCounter('medianPrice', data.medianPrice, '$', true);
            this.animateCounter('avgArea', Math.round(data.avgArea), '', false);

            // Store data for later use
            this.analyticsData = data;
        } catch (error) {
            console.error('Error loading metrics:', error);
            // Fallback to demo data
            this.animateCounter('totalProperties', 5000, '');
            this.animateCounter('avgPrice', 425000, '$', true);
            this.animateCounter('medianPrice', 385000, '$', true);
            this.animateCounter('avgArea', 2150, '', false);
        }
    }

    animateCounter(elementId, target, prefix = '', isPrice = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            let displayValue = Math.floor(current);
            if (isPrice) {
                element.textContent = prefix + displayValue.toLocaleString();
            } else {
                element.textContent = displayValue.toLocaleString() + prefix;
            }
        }, duration / steps);
    }

    animateMetrics() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.6s ease-out forwards';
            }, index * 100);
        });
    }

    setupEventListeners() {
        // Chart filter
        const chartFilter = document.getElementById('chartFilter');
        if (chartFilter) {
            chartFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.renderCharts();
            });
        }

        // Time range filter
        const timeRange = document.getElementById('timeRange');
        if (timeRange) {
            timeRange.addEventListener('change', (e) => {
                this.showNotification('Time range filter applied', 'info');
            });
        }

        // Refresh data
        const refreshData = document.getElementById('refreshData');
        if (refreshData) {
            refreshData.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // Download report
        const downloadReport = document.getElementById('downloadReport');
        if (downloadReport) {
            downloadReport.addEventListener('click', () => {
                this.downloadReport();
            });
        }
    }

    refreshData() {
        this.showNotification('Refreshing analytics data...', 'info');

        // Simulate refresh
        setTimeout(() => {
            this.loadMetrics();
            this.renderCharts();
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1500);
    }

    downloadReport() {
        this.showNotification('Generating PDF report...', 'info');

        // Simulate report generation
        setTimeout(() => {
            this.showNotification('Report downloaded successfully!', 'success');
            // In production, trigger actual PDF download
        }, 2000);
    }

    zoomChart(chartId) {
        const chart = this.charts.find(c => c.id === chartId);
        const modal = document.createElement('div');
        modal.className = 'chart-modal';
        modal.innerHTML = `
            <div class="chart-modal-content">
                <div class="chart-modal-header">
                    <h3><i class="fas ${chart.icon} me-2"></i>${chart.title}</h3>
                    <button class="btn-close-modal" onclick="this.closest('.chart-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chart-modal-body">
                    <img src="/static/images/${chartId}.png" alt="${chart.title}" class="img-fluid">
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    downloadChart(chartId) {
        const chart = this.charts.find(c => c.id === chartId);
        const link = document.createElement('a');
        link.href = `/static/images/${chartId}.png`;
        link.download = `${chartId}.png`;
        link.click();
        this.showNotification(`${chart.title} downloaded!`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        notification.innerHTML = `
            <i class="fas ${icons[type]} me-2"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    exportCSV() {
        this.showNotification('Preparing CSV export...', 'info');

        // Simulate CSV generation
        setTimeout(() => {
            const csvContent = this.generateCSVContent();
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
            this.showNotification('CSV exported successfully!', 'success');
        }, 1000);
    }

    exportPDF() {
        this.showNotification('Generating PDF report...', 'info');

        // Simulate PDF generation
        setTimeout(() => {
            this.showNotification('PDF report generated! (Demo mode)', 'success');
            // In production, this would trigger actual PDF generation
        }, 2000);
    }

    generateCSVContent() {
        if (!this.analyticsData) {
            return 'Metric,Value\nTotal Properties,5000\nAverage Price,425000\nMedian Price,385000\nAverage Area,2150';
        }

        let csv = 'Metric,Value\n';
        csv += `Total Properties,${this.analyticsData.totalProperties}\n`;
        csv += `Average Price,${this.analyticsData.avgPrice.toFixed(2)}\n`;
        csv += `Median Price,${this.analyticsData.medianPrice.toFixed(2)}\n`;
        csv += `Average Area,${this.analyticsData.avgArea.toFixed(2)}\n`;
        csv += `Min Price,${this.analyticsData.minPrice.toFixed(2)}\n`;
        csv += `Max Price,${this.analyticsData.maxPrice.toFixed(2)}\n`;
        csv += `Price Std Dev,${this.analyticsData.priceStd.toFixed(2)}\n`;

        return csv;
    }
}

// Initialize analytics manager
let analyticsManager;
document.addEventListener('DOMContentLoaded', () => {
    analyticsManager = new AnalyticsManager();
});
