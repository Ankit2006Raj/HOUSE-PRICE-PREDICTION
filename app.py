from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Load the trained model
MODEL_PATH = 'models/house_price_model.pkl'
SCALER_PATH = 'models/scaler.pkl'

model = None
scaler = None

def load_model():
    global model, scaler
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
        return True
    return False

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET'])
def predict_page():
    return render_template('predict.html')

@app.route('/analytics', methods=['GET'])
def analytics():
    return render_template('analytics.html')

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/dashboard', methods=['GET'])
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded. Please train the model first.'}), 400
        
        data = request.get_json()
        
        # Extract features from request
        features = [
            float(data.get('area', 0)),
            int(data.get('bedrooms', 0)),
            int(data.get('bathrooms', 0)),
            int(data.get('floors', 0)),
            int(data.get('yearBuilt', 0)),
            int(data.get('location', 0)),  # Encoded
            int(data.get('condition', 0)),  # Encoded
            int(data.get('garage', 0))  # 0 or 1
        ]
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        
        return jsonify({
            'success': True,
            'predicted_price': round(prediction, 2),
            'formatted_price': f"${prediction:,.2f}"
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/model-info', methods=['GET'])
def model_info():
    if os.path.exists('models/model_metrics.pkl'):
        with open('models/model_metrics.pkl', 'rb') as f:
            metrics = pickle.load(f)
        return jsonify(metrics)
    return jsonify({'error': 'Model metrics not available'}), 404

@app.route('/api/analytics-data', methods=['GET'])
def analytics_data():
    """Provide real-time analytics data"""
    try:
        # Try to load the dataset
        dataset_paths = [
            'House Price Prediction Dataset.csv',
            'Dataset/House Price Prediction Dataset.csv'
        ]
        
        df = None
        for path in dataset_paths:
            if os.path.exists(path):
                df = pd.read_csv(path)
                break
        
        if df is None:
            return jsonify({'error': 'Dataset not found'}), 404
        
        # Calculate metrics
        metrics = {
            'totalProperties': int(len(df)),
            'avgPrice': float(df['Price'].mean()),
            'medianPrice': float(df['Price'].median()),
            'avgArea': float(df['Area'].mean()),
            'minPrice': float(df['Price'].min()),
            'maxPrice': float(df['Price'].max()),
            'priceStd': float(df['Price'].std()),
            'locationStats': df.groupby('Location')['Price'].agg(['mean', 'count']).to_dict('index'),
            'conditionStats': df.groupby('Condition')['Price'].agg(['mean', 'count']).to_dict('index'),
            'bedroomStats': df.groupby('Bedrooms')['Price'].mean().to_dict(),
            'yearRange': {
                'min': int(df['YearBuilt'].min()),
                'max': int(df['YearBuilt'].max())
            }
        }
        
        return jsonify(metrics)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Try to load model
    if load_model():
        print("✓ Model loaded successfully!")
    else:
        print("⚠ Model not found. Please run train_model.py first.")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
