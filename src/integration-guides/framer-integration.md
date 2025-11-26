# Integrating Fitness Calculator with Framer

## Option 1: Framer Code Component (Recommended)

### Requirements
- Framer Pro plan or higher
- Access to Code Components feature

### Steps

1. **Create a new Code Component in Framer:**
   - Open your Framer project
   - Go to Assets panel → Code Components → "+"
   - Create a new component called "FitnessCalculator"

2. **Add the main component code:**
   Copy your entire App.tsx content but wrap it as a Framer Code Component:

```tsx
import React, { useState, useEffect } from 'react'
import { addPropertyControls, ControlType } from 'framer'

// Import all your existing components and types here
// (Copy all the imports from your App.tsx)

export default function FitnessCalculator(props) {
    // Copy your entire App component logic here
    // Keep all the useState, useEffect, and functions exactly the same
    
    return (
        // Your existing JSX return statement
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            {/* Rest of your component JSX */}
        </div>
    )
}

// Add Framer property controls if needed
addPropertyControls(FitnessCalculator, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Fitness Benefits Eligibility Calculator"
    },
    showBackground: {
        type: ControlType.Boolean,
        title: "Show Background",
        defaultValue: true
    }
})
```

3. **Add supporting files:**
   - Create separate Code Components for each of your step components
   - Or include all components in a single file (simpler but larger)

4. **Handle Framer-specific considerations:**
   - Remove `min-h-screen` if you want it to fit within a Framer frame
   - Consider making the background optional via props

## Option 2: Simplified Single-File Component

If Code Components are complex, create a simplified version:

```tsx
import React, { useState } from 'react'

export default function FitnessCalculatorSimple() {
    // Simplified version with basic form steps
    // Inline all components to avoid import issues
    
    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Simplified calculator implementation */}
        </div>
    )
}
```

## Option 3: External Hosting + Embed

### Deploy your calculator separately:

1. **Deploy to Vercel/Netlify:**
   - Push your current code to GitHub
   - Connect to Vercel or Netlify
   - Deploy and get a public URL

2. **Embed in Framer:**
   - Use Framer's Embed component
   - Add your deployed URL
   - Set appropriate dimensions

### Benefits:
- Full functionality preserved
- Easy updates
- No Framer plan restrictions

### Considerations:
- Less integrated experience
- Requires separate hosting
- iframe limitations

## Option 4: Framer-Optimized Component

Create a version specifically optimized for Framer:
```tsx
import React, { useState, useEffect } from 'react'
import { addPropertyControls, ControlType } from 'framer'

interface FramerFitnessCalculatorProps {
    backgroundColor?: string
    primaryColor?: string
    borderRadius?: number
    showHeader?: boolean
    headerText?: string
}

export default function FramerFitnessCalculator({
    backgroundColor = "#f8fafc",
    primaryColor = "#3b82f6",
    borderRadius = 16,
    showHeader = true,
    headerText = "Fitness Benefits Eligibility Calculator"
}: FramerFitnessCalculatorProps) {
    // Your component logic here with Framer-specific styling
    
    const dynamicStyles = {
        '--primary-color': primaryColor,
        '--bg-color': backgroundColor,
        '--border-radius': `${borderRadius}px`
    } as React.CSSProperties
    
    return (
        <div 
            className="w-full p-6 rounded-lg shadow-lg"
            style={dynamicStyles}
        >
            {showHeader && (
                <h1 className="text-3xl font-bold text-center mb-6">
                    {headerText}
                </h1>
            )}
            {/* Rest of your calculator */}
        </div>
    )
}

addPropertyControls(FramerFitnessCalculator, {
    backgroundColor: {
        type: ControlType.Color,
        title: "Background Color",
        defaultValue: "#ffffff"
    },
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color", 
        defaultValue: "#3b82f6"
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        min: 0,
        max: 50,
        defaultValue: 16
    },
    showHeader: {
        type: ControlType.Boolean,
        title: "Show Header",
        defaultValue: true
    },
    headerText: {
        type: ControlType.String,
        title: "Header Text",
        defaultValue: "Fitness Benefits Eligibility Calculator"
    }
})
```

## Recommended Approach

I recommend **Option 1 (Code Component)** if you have Framer Pro, or **Option 3 (External Hosting)** for maximum functionality and ease of maintenance.

### For Code Component approach:
1. Start with a simplified version
2. Test in Framer
3. Gradually add complexity
4. Ensure localStorage works in Framer environment

### For External Hosting:
1. Deploy current app as-is
2. Embed in Framer
3. Style the embed to fit your design
4. Consider responsive iframe sizing