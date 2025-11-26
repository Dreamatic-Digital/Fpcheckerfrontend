import React from 'react';

interface EmbeddableCalculatorProps {
  calculatorUrl: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  boxShadow?: string;
  className?: string;
}

export default function EmbeddableCalculator({
  calculatorUrl,
  width = "100%",
  height = "800px",
  borderRadius = "16px",
  boxShadow = "0 10px 30px rgba(0,0,0,0.1)",
  className = ""
}: EmbeddableCalculatorProps) {
  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem"
  };

  const iframeStyle = {
    width,
    height,
    border: "none",
    borderRadius,
    boxShadow,
    display: "block"
  };

  return (
    <div style={containerStyle} className={className}>
      <iframe 
        src={calculatorUrl}
        style={iframeStyle}
        title="Fitness Benefits Eligibility Calculator"
        loading="lazy"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}

// Usage examples:
/*
// Basic usage
<EmbeddableCalculator calculatorUrl="https://your-calculator-url.com" />

// Custom styling
<EmbeddableCalculator 
  calculatorUrl="https://your-calculator-url.com"
  height="600px"
  borderRadius="20px"
  boxShadow="0 20px 60px rgba(0,0,0,0.15)"
  className="my-8"
/>

// Full-screen version
<EmbeddableCalculator 
  calculatorUrl="https://your-calculator-url.com"
  height="100vh"
  borderRadius="0"
  boxShadow="none"
/>
*/