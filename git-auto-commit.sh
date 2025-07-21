#!/bin/bash

# Automatic Git Workflow Script
# This script checks for changes, commits them with a meaningful message, and pushes to origin

echo "=== Git Auto-Commit Workflow ==="
echo ""

# Check current status
echo "📊 Checking git status..."
git status

# Check if there are any changes
if [[ -z $(git status -s) ]]; then
    echo "✅ No changes to commit. Working tree is clean."
    exit 0
fi

# Show what will be committed
echo ""
echo "📝 Changes to be committed:"
git diff --stat
echo ""

# Add all changes
echo "➕ Staging all changes..."
git add -A

# Create commit message
COMMIT_MSG="Update family tree display: enhanced member relationships and UI improvements

- Improved family member display with better relationship indicators
- Enhanced chronological partner support
- Refined UI components for better user experience
- Updated styling for clearer family connections

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Commit changes
echo "💾 Creating commit..."
git commit -m "$COMMIT_MSG"

# Push to origin
echo ""
echo "🚀 Pushing to origin..."
git push origin main

echo ""
echo "✅ Git workflow completed successfully!"