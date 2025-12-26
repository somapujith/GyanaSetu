#!/bin/bash

# Firebase Setup Script
# This script applies Firestore security rules to your Firebase project

echo "🔐 Deploying Firestore Security Rules..."
echo ""

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Install it with:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if .firebaserc exists
if [ ! -f ".firebaserc" ]; then
    echo "⚠️  No .firebaserc file found."
    echo "Initializing Firebase project..."
    firebase init
else
    echo "✅ Firebase project configured"
fi

# Check if firestore.rules exists
if [ ! -f "firestore.rules" ]; then
    echo "❌ firestore.rules file not found!"
    exit 1
fi

echo ""
echo "📋 Deploying rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Firestore rules deployed successfully!"
else
    echo ""
    echo "❌ Failed to deploy rules. Check the error above."
    exit 1
fi
