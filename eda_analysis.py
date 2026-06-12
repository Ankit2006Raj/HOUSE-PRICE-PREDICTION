import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import warnings
warnings.filterwarnings('ignore')

# Create directories
os.makedirs('static/images', exist_ok=True)

print("=" * 60)
print("📊 EXPLORATORY DATA ANALYSIS (EDA)")
print("=" * 60)

# Load dataset
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
    import sys
    sys.exit(1)

print(f"✓ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['figure.facecolor'] = '#FAF9F5'
plt.rcParams['axes.facecolor'] = '#FFFFFF'
plt.rcParams['text.color'] = '#1C2E1A'
plt.rcParams['axes.labelcolor'] = '#1C2E1A'
plt.rcParams['xtick.color'] = '#1C2E1A'
plt.rcParams['ytick.color'] = '#1C2E1A'

# 1. Price Distribution
print("\n📈 Generating Price Distribution plot...")
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.hist(df['Price'], bins=50, color='#5E8256', edgecolor='#1C2E1A', alpha=0.8)
plt.xlabel('Price ($)', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.title('House Price Distribution', fontsize=14, fontweight='bold')
plt.grid(axis='y', alpha=0.3)

plt.subplot(1, 2, 2)
plt.boxplot(df['Price'], vert=True, patch_artist=True,
            boxprops=dict(facecolor='#8EB486', color='#1C2E1A', alpha=0.8))
plt.ylabel('Price ($)', fontsize=12)
plt.title('Price Boxplot (Outlier Detection)', fontsize=14, fontweight='bold')
plt.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('static/images/price_distribution.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: price_distribution.png")

# 2. Correlation Heatmap
print("\n🔥 Generating Correlation Heatmap...")
numeric_cols = ['Area', 'Bedrooms', 'Bathrooms', 'Floors', 'YearBuilt', 'Price']
correlation = df[numeric_cols].corr()

plt.figure(figsize=(10, 8))
sns.heatmap(correlation, annot=True, fmt='.2f', cmap='YlGn', center=0.5,
            square=True, linewidths=1, cbar_kws={"shrink": 0.8})
plt.title('Feature Correlation Heatmap', fontsize=16, fontweight='bold', pad=20)
plt.tight_layout()
plt.savefig('static/images/correlation_heatmap.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: correlation_heatmap.png")

# 3. Price vs Area
print("\n📐 Generating Price vs Area plot...")
plt.figure(figsize=(12, 6))
plt.scatter(df['Area'], df['Price'], alpha=0.6, c='#8EB486', edgecolors='#1C2E1A', linewidth=0.5)
plt.xlabel('Area (sq ft)', fontsize=12)
plt.ylabel('Price ($)', fontsize=12)
plt.title('House Price vs Area', fontsize=14, fontweight='bold')
plt.grid(alpha=0.3)

# Add trend line
z = np.polyfit(df['Area'], df['Price'], 1)
p = np.poly1d(z)
plt.plot(df['Area'], p(df['Area']), color='#C5A880', linestyle='--', linewidth=2, label='Trend Line')
plt.legend()

plt.tight_layout()
plt.savefig('static/images/price_vs_area.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: price_vs_area.png")

# 4. Price by Location
print("\n🌍 Generating Price by Location plot...")
plt.figure(figsize=(12, 6))
location_price = df.groupby('Location')['Price'].mean().sort_values(ascending=False)
colors = ['#2C4C30', '#5E8256', '#8EB486', '#C5A880']
location_price.plot(kind='bar', color=colors, edgecolor='#1C2E1A', linewidth=1.2)
plt.xlabel('Location', fontsize=12)
plt.ylabel('Average Price ($)', fontsize=12)
plt.title('Average House Price by Location', fontsize=14, fontweight='bold')
plt.xticks(rotation=45)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig('static/images/price_by_location.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: price_by_location.png")

# 5. Price by Condition
print("\n⭐ Generating Price by Condition plot...")
plt.figure(figsize=(12, 6))
condition_order = ['Poor', 'Fair', 'Good', 'Excellent']
condition_price = df.groupby('Condition')['Price'].mean().reindex(condition_order)
colors_condition = ['#C5A880', '#8EB486', '#5E8256', '#2C4C30']
condition_price.plot(kind='bar', color=colors_condition, edgecolor='#1C2E1A', linewidth=1.2)
plt.xlabel('Condition', fontsize=12)
plt.ylabel('Average Price ($)', fontsize=12)
plt.title('Average House Price by Condition', fontsize=14, fontweight='bold')
plt.xticks(rotation=0)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig('static/images/price_by_condition.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: price_by_condition.png")

# 6. Bedrooms vs Price
print("\n🛏️ Generating Bedrooms vs Price plot...")
plt.figure(figsize=(12, 6))
bedroom_price = df.groupby('Bedrooms')['Price'].mean()
plt.plot(bedroom_price.index, bedroom_price.values, marker='o', linewidth=2, 
         markersize=10, color='#2C4C30', markerfacecolor='#C5A880', markeredgewidth=2)
plt.xlabel('Number of Bedrooms', fontsize=12)
plt.ylabel('Average Price ($)', fontsize=12)
plt.title('Average Price by Number of Bedrooms', fontsize=14, fontweight='bold')
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('static/images/price_by_bedrooms.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: price_by_bedrooms.png")

# 7. Year Built Distribution
print("\n📅 Generating Year Built analysis...")
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.hist(df['YearBuilt'], bins=30, color='#8EB486', edgecolor='#1C2E1A', alpha=0.8)
plt.xlabel('Year Built', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.title('Distribution of Year Built', fontsize=14, fontweight='bold')
plt.grid(axis='y', alpha=0.3)

plt.subplot(1, 2, 2)
plt.scatter(df['YearBuilt'], df['Price'], alpha=0.6, c='#5E8256', edgecolors='#1C2E1A', linewidth=0.5)
plt.xlabel('Year Built', fontsize=12)
plt.ylabel('Price ($)', fontsize=12)
plt.title('Price vs Year Built', fontsize=14, fontweight='bold')
plt.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('static/images/year_built_analysis.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Saved: year_built_analysis.png")

# 8. Summary Statistics
print("\n📊 Summary Statistics:")
print("=" * 60)
print(df[numeric_cols].describe())
print("=" * 60)

print("\n📍 Location Distribution:")
print(df['Location'].value_counts())

print("\n⭐ Condition Distribution:")
print(df['Condition'].value_counts())

print("\n🚗 Garage Distribution:")
print(df['Garage'].value_counts())

print("\n" + "=" * 60)
print("✅ EDA COMPLETED SUCCESSFULLY!")
print("=" * 60)
print(f"\n✓ All visualizations saved in 'static/images/' directory")
print("\n")
