from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import pandas as pd
import os

# Base directory for resolving all relative paths (Vercel compatible)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__,
            static_folder=os.path.join(BASE_DIR, 'static'),
            template_folder=os.path.join(BASE_DIR, 'templates'))

# Load the trained model
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'house_price_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')

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
    if os.path.exists(os.path.join(BASE_DIR, 'models', 'model_metrics.pkl')):
        with open(os.path.join(BASE_DIR, 'models', 'model_metrics.pkl'), 'rb') as f:
            metrics = pickle.load(f)
        return jsonify(metrics)
    return jsonify({'error': 'Model metrics not available'}), 404

@app.route('/api/analytics-data', methods=['GET'])
def analytics_data():
    """Provide real-time analytics data"""
    try:
        # Try to load the dataset
        dataset_paths = [
            os.path.join(BASE_DIR, 'Dataset', 'House Price Prediction Dataset.csv'),
            os.path.join(BASE_DIR, 'static', 'data', 'processed_data.csv')
        ]
        
        df = None
        for path in dataset_paths:
            if os.path.exists(path):
                df = pd.read_csv(path)
                break
        
        if df is None:
            # Return fallback data if no dataset found
            return jsonify({
                'totalProperties': 5000,
                'avgPrice': 425000.00,
                'medianPrice': 385000.00,
                'avgArea': 2150.00,
                'minPrice': 50000.00,
                'maxPrice': 1500000.00,
                'priceStd': 125000.00
            })
        
        # Calculate metrics
        metrics = {
            'totalProperties': int(len(df)),
            'avgPrice': float(df['Price'].mean()),
            'medianPrice': float(df['Price'].median()),
            'avgArea': float(df['Area'].mean()),
            'minPrice': float(df['Price'].min()),
            'maxPrice': float(df['Price'].max()),
            'priceStd': float(df['Price'].std())
        }
        
        # Add location stats if available
        if 'Location' in df.columns:
            location_stats = df.groupby('Location')['Price'].agg(['mean', 'count']).to_dict('index')
            metrics['locationStats'] = location_stats
        
        # Add condition stats if available
        if 'Condition' in df.columns:
            condition_stats = df.groupby('Condition')['Price'].agg(['mean', 'count']).to_dict('index')
            metrics['conditionStats'] = condition_stats
        
        # Add bedroom stats if available
        if 'Bedrooms' in df.columns:
            bedroom_stats = df.groupby('Bedrooms')['Price'].mean().to_dict()
            metrics['bedroomStats'] = bedroom_stats
        
        # Add year range if available
        if 'YearBuilt' in df.columns:
            metrics['yearRange'] = {
                'min': int(df['YearBuilt'].min()),
                'max': int(df['YearBuilt'].max())
            }
        
        return jsonify(metrics)
    
    except Exception as e:
        print(f"Error in analytics_data: {str(e)}")
        # Return fallback data on error
        return jsonify({
            'totalProperties': 5000,
            'avgPrice': 425000.00,
            'medianPrice': 385000.00,
            'avgArea': 2150.00,
            'minPrice': 50000.00,
            'maxPrice': 1500000.00,
            'priceStd': 125000.00
        })

# Auto-load model on import (needed for Vercel serverless)
if load_model():
    print("[OK] Model loaded successfully!")
else:
    print("[WARN] Model not found. Please run train_model.py first.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
