import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import pickle
import os
import sys
import warnings
warnings.filterwarnings('ignore')

# Create necessary directories
os.makedirs('models', exist_ok=True)
os.makedirs('static/data', exist_ok=True)

print("=" * 60)
print("🏡 HOUSE PRICE PREDICTION - MODEL TRAINING")
print("=" * 60)

# Load dataset
print("\n📊 Loading dataset...")
# Try different possible locations
dataset_paths = [
    'House Price Prediction Dataset.csv',
    'Dataset/House Price Prediction Dataset.csv',
    '../House Price Prediction Dataset.csv'
]

df = None
for path in dataset_paths:
    try:
        df = pd.read_csv(path)
        print(f"✓ Dataset loaded from: {path}")
        break
    except FileNotFoundError:
        continue

if df is None:
    print("✗ Error: Dataset not found!")
    print("Please ensure 'House Price Prediction Dataset.csv' is in the project directory")
    sys.exit(1)

print(f"✓ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Display basic info
print("\n📋 Dataset Info:")
print(df.head())
print("\n" + "=" * 60)
print(df.info())
print("\n" + "=" * 60)
print(df.describe())

# Data Preprocessing
print("\n🔧 Data Preprocessing...")

# Check for missing values
print(f"Missing values:\n{df.isnull().sum()}")

# Encode categorical variables
le_location = LabelEncoder()
le_condition = LabelEncoder()

df['Location_Encoded'] = le_location.fit_transform(df['Location'])
df['Condition_Encoded'] = le_condition.fit_transform(df['Condition'])
df['Garage_Binary'] = df['Garage'].map({'Yes': 1, 'No': 0})

# Save encoders for later use
with open('models/location_encoder.pkl', 'wb') as f:
    pickle.dump(le_location, f)
with open('models/condition_encoder.pkl', 'wb') as f:
    pickle.dump(le_condition, f)

print("✓ Categorical variables encoded")

# Feature selection
features = ['Area', 'Bedrooms', 'Bathrooms', 'Floors', 'YearBuilt', 
            'Location_Encoded', 'Condition_Encoded', 'Garage_Binary']
target = 'Price'

X = df[features]
y = df[target]

print(f"✓ Features selected: {len(features)} features")
print(f"  Features: {features}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"✓ Data split: {len(X_train)} training, {len(X_test)} testing samples")

# Feature Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler
with open('models/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("✓ Features scaled and scaler saved")

# Train multiple models
print("\n🤖 Training Models...")
print("=" * 60)

models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(alpha=1.0),
    'Lasso Regression': Lasso(alpha=1.0),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}

results = {}
best_model = None
best_score = -float('inf')
best_model_name = ''

for name, model in models.items():
    print(f"\n🔄 Training {name}...")
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    
    # Metrics
    r2_train = r2_score(y_train, y_pred_train)
    r2_test = r2_score(y_test, y_pred_test)
    mae = mean_absolute_error(y_test, y_pred_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    
    results[name] = {
        'R2_Train': r2_train,
        'R2_Test': r2_test,
        'MAE': mae,
        'RMSE': rmse
    }
    
    print(f"  ✓ R² Score (Train): {r2_train:.4f}")
    print(f"  ✓ R² Score (Test):  {r2_test:.4f}")
    print(f"  ✓ MAE:  ${mae:,.2f}")
    print(f"  ✓ RMSE: ${rmse:,.2f}")
    
    # Track best model
    if r2_test > best_score:
        best_score = r2_test
        best_model = model
        best_model_name = name

print("\n" + "=" * 60)
print(f"🏆 Best Model: {best_model_name}")
print(f"   R² Score: {best_score:.4f}")
print("=" * 60)

# Save best model
with open('models/house_price_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)
print(f"\n✓ Best model saved: {best_model_name}")

# Save model metrics
metrics_data = {
    'best_model': best_model_name,
    'models': results,
    'feature_names': features,
    'location_classes': le_location.classes_.tolist(),
    'condition_classes': le_condition.classes_.tolist()
}

with open('models/model_metrics.pkl', 'wb') as f:
    pickle.dump(metrics_data, f)
print("✓ Model metrics saved")

# Save processed data for analytics
df_processed = df.copy()
df_processed['Predicted_Price'] = best_model.predict(scaler.transform(X))
df_processed.to_csv('static/data/processed_data.csv', index=False)
print("✓ Processed data saved for analytics")

# Feature importance (if available)
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n📊 Feature Importance:")
    print(feature_importance.to_string(index=False))
    
    feature_importance.to_csv('static/data/feature_importance.csv', index=False)

print("\n" + "=" * 60)
print("✅ MODEL TRAINING COMPLETED SUCCESSFULLY!")
print("=" * 60)
print("\n💡 Next steps:")
print("   1. Run: python app.py")
print("   2. Open: http://localhost:5000")
print("   3. Start predicting house prices!")
print("\n")
