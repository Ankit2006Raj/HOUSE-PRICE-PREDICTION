"""
Setup script for House Price Prediction Project
This script automates the complete setup process
"""

import os
import sys
import subprocess

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60 + "\n")

def run_command(command, description):
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        print(f"✓ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error: {description} failed!")
        print(f"Error message: {e.stderr}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = [
        'models',
        'static/css',
        'static/js',
        'static/images',
        'static/data',
        'templates'
    ]
    
    print("📁 Creating directories...")
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    print("✓ All directories created!")

def main():
    print_header("🏡 HOUSE PRICE PREDICTION - SETUP")
    
    print("Welcome to the House Price Prediction setup wizard!")
    print("This script will set up everything you need to run the application.\n")
    
    # Step 1: Create directories
    create_directories()
    
    # Step 2: Install dependencies
    print_header("STEP 1: Installing Dependencies")
    if not run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installing Python packages"
    ):
        print("\n⚠️  Warning: Some packages may not have installed correctly.")
        print("Please check the error messages above.")
        response = input("\nContinue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Step 3: Run EDA
    print_header("STEP 2: Running Exploratory Data Analysis")
    print("This will generate visualizations for the analytics page...")
    if run_command(
        f"{sys.executable} eda_analysis.py",
        "Generating data visualizations"
    ):
        print("✓ Visualizations saved in 'static/images/' directory")
    else:
        print("⚠️  EDA failed. You can run it manually later with: python eda_analysis.py")
    
    # Step 4: Train model
    print_header("STEP 3: Training Machine Learning Model")
    print("This may take a few minutes...")
    if run_command(
        f"{sys.executable} train_model.py",
        "Training ML models"
    ):
        print("✓ Model trained and saved successfully!")
    else:
        print("✗ Model training failed!")
        print("Please run manually: python train_model.py")
        sys.exit(1)
    
    # Success message
    print_header("✅ SETUP COMPLETED SUCCESSFULLY!")
    print("Your House Price Prediction application is ready to use!\n")
    print("📝 Next steps:")
    print("   1. Run the application: python app.py")
    print("   2. Open your browser: http://localhost:5000")
    print("   3. Start predicting house prices!\n")
    print("📚 For more information, check README.md\n")
    
    # Ask if user wants to start the app
    response = input("Would you like to start the application now? (y/n): ")
    if response.lower() == 'y':
        print("\n🚀 Starting Flask application...")
        print("Press Ctrl+C to stop the server\n")
        try:
            subprocess.run(f"{sys.executable} app.py", shell=True)
        except KeyboardInterrupt:
            print("\n\n👋 Application stopped. Thank you for using HousePredict AI!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n✗ An error occurred: {str(e)}")
        sys.exit(1)
