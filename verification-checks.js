// Automated Accessibility and UX Verification Script
// Run with: node verification-checks.js

const fs = require('fs');
const path = require('path');

// Color contrast ratios (WCAG AA standards)
const CONTRAST_REQUIREMENTS = {
  normal: 4.5,
  large: 3.0
};

// Check for ARIA labels and semantic HTML
function checkAccessibility(filePath, content) {
  const issues = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for buttons without aria-label or proper text
    if (line.includes('<button') && !line.includes('aria-label') && !line.includes('aria-labelledby')) {
      // Check if button has text content or children
      const hasText = line.includes('>') && line.split('>')[1] && line.split('>')[1].trim().length > 0;
      if (!hasText && !line.includes('children') && !line.includes('aria-label')) {
        issues.push({
          type: 'accessibility',
          severity: 'warning',
          message: 'Button may need aria-label or visible text',
          file: filePath,
          line: lineNumber
        });
      }
    }

    // Check for images without alt text
    if (line.includes('<img') && !line.includes('alt=')) {
      issues.push({
        type: 'accessibility',
        severity: 'error',
        message: 'Image missing alt attribute',
        file: filePath,
        line: lineNumber
      });
    }

    // Check for form inputs without labels
    if (line.includes('<input') && !line.includes('aria-label') && !line.includes('aria-labelledby')) {
      // Look for associated label in nearby lines
      let hasLabel = false;
      for (let i = Math.max(0, index - 3); i < Math.min(lines.length, index + 3); i++) {
        if (lines[i].includes('<label') && lines[i].includes('htmlFor')) {
          hasLabel = true;
          break;
        }
      }
      if (!hasLabel) {
        issues.push({
          type: 'accessibility',
          severity: 'warning',
          message: 'Input may need associated label',
          file: filePath,
          line: lineNumber
        });
      }
    }
  });

  return issues;
}

// Check for responsive design utilities
function checkResponsiveDesign(content) {
  const issues = [];
  const responsiveClasses = [
    'sm:', 'md:', 'lg:', 'xl:', 'mobile-', 'tablet-', 'desktop-'
  ];

  const hasResponsiveClasses = responsiveClasses.some(cls =>
    content.includes(cls)
  );

  if (!hasResponsiveClasses) {
    issues.push({
      type: 'responsive',
      severity: 'info',
      message: 'Consider adding responsive design classes',
      file: 'N/A'
    });
  }

  return issues;
}

// Check for animation and loading states
function checkAnimationsAndLoaders(content) {
  const issues = [];
  const animationClasses = [
    'animate-', 'transition-', 'duration-', 'loading-', 'skeleton'
  ];

  const hasAnimations = animationClasses.some(cls =>
    content.includes(cls)
  );

  if (!hasAnimations) {
    issues.push({
      type: 'ux',
      severity: 'info',
      message: 'Consider adding animations for better UX',
      file: 'N/A'
    });
  }

  return issues;
}

// Main verification function
function runVerification() {
  console.log('🔍 Running Automated UX/UI Verification Checks\n');

  const srcDir = path.join(__dirname, 'src');
  const allIssues = [];

  // Scan all TypeScript/React files
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');

          // Run checks
          const accessibilityIssues = checkAccessibility(filePath, content);
          const responsiveIssues = checkResponsiveDesign(content);
          const animationIssues = checkAnimationsAndLoaders(content);

          allIssues.push(...accessibilityIssues, ...responsiveIssues, ...animationIssues);
        } catch (error) {
          console.error(`Error reading ${filePath}:`, error.message);
        }
      }
    });
  }

  scanDirectory(srcDir);

  // Display results
  if (allIssues.length === 0) {
    console.log('✅ No issues found in automated checks!');
  } else {
    console.log(`📋 Found ${allIssues.length} items to review:\n`);

    const groupedIssues = {
      accessibility: allIssues.filter(i => i.type === 'accessibility'),
      responsive: allIssues.filter(i => i.type === 'responsive'),
      ux: allIssues.filter(i => i.type === 'ux')
    };

    Object.entries(groupedIssues).forEach(([type, issues]) => {
      if (issues.length > 0) {
        console.log(`🔧 ${type.toUpperCase()} ISSUES:`);
        issues.forEach(issue => {
          const severityIcon = {
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
          }[issue.severity];

          console.log(`  ${severityIcon} ${issue.message}`);
          if (issue.file !== 'N/A') {
            console.log(`     📁 ${path.relative(__dirname, issue.file)}:${issue.line}`);
          }
        });
        console.log('');
      }
    });
  }

  // Manual verification checklist
  console.log('📝 MANUAL VERIFICATION CHECKLIST:');
  console.log('');
  console.log('1. 🎯 ACCESSIBILITY TESTING:');
  console.log('   □ Open http://localhost:3000 in browser');
  console.log('   □ Press Tab to navigate through all interactive elements');
  console.log('   □ Verify focus indicators are visible on all buttons/links');
  console.log('   □ Test Enter/Space keys on buttons');
  console.log('   □ Check that all images have alt text (right-click > Inspect)');
  console.log('   □ Verify form labels are properly associated with inputs');
  console.log('');
  console.log('2. 📱 RESPONSIVE DESIGN TESTING:');
  console.log('   □ Resize browser window to mobile size (< 640px)');
  console.log('   □ Check that navigation collapses properly');
  console.log('   □ Verify text sizes are readable on small screens');
  console.log('   □ Test touch targets are at least 44px');
  console.log('   □ Check that tables/data grids scroll horizontally on mobile');
  console.log('');
  console.log('3. 🎨 COLOR CONTRAST TESTING:');
  console.log('   □ Use browser dev tools: Elements > Computed > Color');
  console.log('   □ Verify text contrast ratios meet WCAG AA (4.5:1 minimum)');
  console.log('   □ Check focus states have sufficient contrast');
  console.log('   □ Test in high contrast mode (Windows: Settings > Ease of Access)');
  console.log('');
  console.log('4. ⌨️ KEYBOARD NAVIGATION TESTING:');
  console.log('   □ Tab through all form fields in order');
  console.log('   □ Use Shift+Tab to navigate backwards');
  console.log('   □ Test modal dialogs trap focus correctly (if any)');
  console.log('   □ Verify skip links work (if implemented)');
  console.log('');
  console.log('5. 🔊 SCREEN READER TESTING:');
  console.log('   □ Enable Windows Narrator (Win+Ctrl+Enter)');
  console.log('   □ Navigate through the page and listen to announcements');
  console.log('   □ Verify ARIA labels are read correctly');
  console.log('   □ Check that headings provide proper page structure');
  console.log('');
  console.log('6. ⚡ PERFORMANCE TESTING:');
  console.log('   □ Open browser dev tools > Lighthouse');
  console.log('   □ Run accessibility audit');
  console.log('   □ Check for any accessibility violations');
  console.log('   □ Verify color contrast issues are resolved');
  console.log('');
  console.log('🎯 QUICK ACCESSIBILITY SHORTCUTS:');
  console.log('   • Chrome DevTools: F12 > Elements > Accessibility tab');
  console.log('   • WAVE Tool: https://wave.webaim.org/');
  console.log('   • axe DevTools: Chrome extension');
  console.log('   • Color Contrast Analyzer: https://developer.paciellogroup.com/resources/contrastanalyser/');
}

// Run the verification
if (require.main === module) {
  runVerification();
}

module.exports = { runVerification, checkAccessibility, checkResponsiveDesign, checkAnimationsAndLoaders };
