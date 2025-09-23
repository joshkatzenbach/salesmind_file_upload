#!/bin/bash

# Salesmind File Upload - Firebase Deployment Script
# This script builds the Angular app and deploys it to Firebase

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf dist/

# Build the Angular app for production
print_status "Building Angular app for production..."
npm run build:prod

# Check if build was successful
if [ ! -d "dist/salesmind-file-upload" ]; then
    print_error "Build failed - dist/salesmind-file-upload directory not found"
    exit 1
fi

print_success "Build completed successfully!"

# Deploy to Firebase
print_status "Deploying to Firebase..."
firebase deploy

# Check deployment status
if [ $? -eq 0 ]; then
    print_success "🎉 Deployment completed successfully!"
    print_status "Your app is now live on Firebase Hosting"
else
    print_error "Deployment failed!"
    exit 1
fi
