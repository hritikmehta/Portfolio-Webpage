// Simple build script to create analytics bundle
const fs = require('fs');

// For static sites, we'll use the inject method
const analyticsCode = `
(function() {
  // Vercel Web Analytics - Auto-injected when deployed
  // This script prepares the environment for Vercel's analytics
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
})();
`;

fs.writeFileSync('analytics-bundle.js', analyticsCode);
console.log('Analytics bundle created successfully!');
