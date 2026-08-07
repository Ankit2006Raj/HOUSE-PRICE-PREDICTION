# 🏡 House Price Prediction - AI Powered Real Estate Valuation

A complete full-stack machine learning web application that predicts house prices using advanced ML algorithms. Built with Python Flask backend and modern responsive frontend.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3.2-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌟 Features

- **AI-Powered Predictions**: Multiple ML models (Linear Regression, Ridge, Lasso, Random Forest, Gradient Boosting)
- **Interactive Web Interface**: Modern, responsive design with Bootstrap 5
- **Real-time Analytics**: Comprehensive data visualizations and insights
- **High Accuracy**: R² score above 0.85 on test data
- **User-Friendly**: Intuitive interface requiring no technical knowledge
- **Instant Results**: Get predictions in under 2 seconds

## 📊 Project Structure

```
HOUSE-PRICE-PREDICTION/
├── app.py                          # Flask application (main entry point)
├── train_model.py                  # ML model training script
├── eda_analysis.py                 # Exploratory Data Analysis
├── requirements.txt                # Python dependencies
├── README.md                       # Project documentation
│
├── Dataset/                        # Raw datasets folder
├── House Price Prediction Dataset.csv
├── Housing.csv
├── Real estate valuation data set.xlsx
│
├── models/                         # Trained models (auto-generated)
│   ├── house_price_model.pkl
│   ├── scaler.pkl
│   ├── location_encoder.pkl
│   ├── condition_encoder.pkl
│   └── model_metrics.pkl
│
├── static/                         # Static files
│   ├── css/
│   │   └── style.css              # Custom styles
│   ├── js/
│   │   ├── main.js                # Homepage scripts
│   │   └── predict.js             # Prediction page scripts
│   ├── images/                    # Generated visualizations
│   └── data/                      # Processed data
│
└── templates/                      # HTML templates
    ├── index.html                 # Homepage
    ├── predict.html               # Prediction page
    ├── analytics.html             # Analytics dashboard
    └── about.html                 # About page
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd HOUSE-PRICE-PREDICTION
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Exploratory Data Analysis (Optional)**
   ```bash
   python eda_analysis.py
   ```
   This generates visualizations in `static/images/`

4. **Train the ML Model**
   ```bash
   python train_model.py
   ```
   This will:
   - Load and preprocess the dataset
   - Train multiple ML models
   - Save the best model
   - Generate model metrics

5. **Start the Flask Application**
   ```bash
   
   python app.py
   
   ```

6. **Open your browser**
   Navigate to: `http://localhost:5000`

## 🎯 Usage

### Making Predictions

1. Go to the **Predict Price** page
2. Enter property details:
   - Area (sq ft)
   - Number of bedrooms
   - Number of bathrooms
   - Number of floors
   - Year built
   - Location (Downtown/Rural/Suburban/Urban)
   - Condition (Excellent/Good/Fair/Poor)
   - Garage availability
3. Click **Predict Price**
4. View the AI-generated price estimate

### Viewing Analytics

Navigate to the **Analytics** page to see:
- Price distribution analysis
- Feature correlation heatmap
- Price vs Area relationship
- Location-based pricing
- Condition impact on prices
- Bedroom count analysis
- Year built trends

## 🤖 Machine Learning Models

The system trains and compares multiple models:

1. **Linear Regression** - Baseline model
2. **Ridge Regression** - L2 regularization
3. **Lasso Regression** - L1 regularization
4. **Random Forest** - Ensemble method
5. **Gradient Boosting** - Advanced boosting

The best performing model is automatically selected and deployed.

## 📈 Model Performance

- **R² Score**: > 0.85
- **Mean Absolute Error (MAE)**: Low prediction error
- **Root Mean Squared Error (RMSE)**: Optimized for accuracy
- **Training Data**: 80% of dataset
- **Testing Data**: 20% of dataset

## 🎨 Features Used

The model considers the following features:

- **Area**: Property size in square feet
- **Bedrooms**: Number of bedrooms
- **Bathrooms**: Number of bathrooms
- **Floors**: Number of floors
- **Year Built**: Construction year
- **Location**: Geographic location (encoded)
- **Condition**: Property condition (encoded)
- **Garage**: Garage availability (binary)

## 🛠️ Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **Scikit-learn** - Machine learning
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Matplotlib/Seaborn** - Data visualization

### Frontend
- **HTML5**
- **CSS3** (Custom + Bootstrap 5)
- **JavaScript** (Vanilla)
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security

- Input validation on both client and server side
- Secure data handling
- No sensitive data storage
- CSRF protection (Flask built-in)

## 📝 API Endpoints

### `POST /api/predict`
Predict house price based on features

**Request Body:**
```json
{
  "area": 2500,
  "bedrooms": 3,
  "bathrooms": 2,
  "floors": 2,
  "yearBuilt": 2010,
  "location": 0,
  "condition": 2,
  "garage": 1
}
```

**Response:**
```json
{
  "success": true,
  "predicted_price": 450000.50,
  "formatted_price": "$450,000.50"
}
```

### `GET /api/model-info`
Get model performance metrics

**Response:**
```json
{
  "best_model": "Random Forest",
  "models": {
    "Linear Regression": {...},
    "Random Forest": {...}
  },
  "feature_names": [...],
  "location_classes": [...],
  "condition_classes": [...]
}
```

## 🎓 Learning Outcomes

This project demonstrates:
- End-to-end ML pipeline development
- Data preprocessing and feature engineering
- Model training and evaluation
- Web application development with Flask
- RESTful API design
- Responsive frontend development
- Data visualization
- Model deployment

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Machine Learning & Flask

## 🙏 Acknowledgments

- Dataset sources: Real estate market data
- Bootstrap team for the UI framework
- Scikit-learn community for ML tools
- Flask community for the web framework

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**⭐ If you find this project helpful, please give it a star!**

## 🚀 Future Enhancements

- [ ] Add more ML models (XGBoost, Neural Networks)
- [ ] Implement user authentication
- [ ] Add price history tracking
- [ ] Include map-based location selection
- [ ] Add property image upload and analysis
- [ ] Implement comparison feature
- [ ] Add export functionality (PDF reports)
- [ ] Mobile app development
- [ ] Real-time market data integration
- [ ] Multi-language support

---

**Made with 🏡 for better real estate decisions**
"# HOUSE-PRICE-PREDICTION" 
