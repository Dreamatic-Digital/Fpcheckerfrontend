#!/bin/bash

# Fitness Calculator - Production Cleanup Script
# This script removes development files and optimizes for production

echo "🧹 Starting production cleanup..."

# Remove legacy files
echo "📁 Removing legacy files..."
rm -f API_PAYLOAD_EXAMPLE.md
rm -f Attributions.md
rm -f EmbeddableCalculator.tsx
rm -f FramerCalculatorFinalStyled.tsx
rm -f FramerFitnessCalculator.tsx
rm -f FramerFitnessCalculatorComplete.tsx
rm -f FramerFitnessCalculatorStyled.tsx
rm -f api-field-mapping.md
rm -f api-integration-guide.md
rm -f deployment-guide.md
rm -f final-framer-setup-guide.md
rm -f framer-embed-guide.md
rm -f framer-embed-snippets.md
rm -f framer-styled-setup-guide.md
rm -f framer-supabase-setup.md
rm -f framer-troubleshooting-checklist.md
rm -f step-by-step-framer-guide.md
rm -f standalone-calculator.html

# Remove unused services
echo "🔧 Removing unused services..."
rm -f services/assessmentService.ts

# Remove unused directories
echo "📂 Cleaning up directories..."
rm -rf guidelines/
rm -rf integration-guides/
rm -rf supabase/
rm -rf utils/

# Remove unused ShadCN components (keep only what's needed)
echo "🎨 Removing unused UI components..."
cd components/ui/
keep_components=("button.tsx" "input.tsx" "select.tsx" "alert.tsx" "progress.tsx" "label.tsx" "radio-group.tsx" "checkbox.tsx" "utils.ts")

for file in *.tsx *.ts; do
  if [[ ! " ${keep_components[@]} " =~ " ${file} " ]]; then
    echo "  Removing $file"
    rm -f "$file"
  fi
done

cd ../..

# Clean up node_modules cache
echo "🧽 Cleaning npm cache..."
npm cache clean --force

# Remove any .DS_Store files
echo "🗑️  Removing system files..."
find . -name ".DS_Store" -delete

echo "✅ Production cleanup complete!"
echo ""
echo "📋 Summary:"
echo "  - Removed legacy files and duplicates"
echo "  - Cleaned up unused services"
echo "  - Removed unnecessary ShadCN components" 
echo "  - Cleared npm cache"
echo ""
echo "🚀 Ready for production deployment!"