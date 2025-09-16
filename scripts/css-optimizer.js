// CSS Optimizer Plugin for Kids Tasks Card
// Removes unused CSS variables and optimizes style declarations

class CSSOptimizer {
  constructor(options = {}) {
    this.options = {
      removeUnused: true,
      optimizeSelectors: true,
      compressValues: true,
      generateReport: true,
      ...options
    };
    this.usedVariables = new Set();
    this.definedVariables = new Set();
    this.optimizationReport = {
      originalSize: 0,
      optimizedSize: 0,
      variablesRemoved: [],
      selectorsOptimized: [],
      savings: 0
    };
  }

  // Main optimization method
  optimize(cssContent) {
    this.optimizationReport.originalSize = cssContent.length;
    
    let optimized = cssContent;
    
    if (this.options.removeUnused) {
      optimized = this.removeUnusedVariables(optimized);
    }
    
    if (this.options.optimizeSelectors) {
      optimized = this.optimizeSelectors(optimized);
    }
    
    if (this.options.compressValues) {
      optimized = this.compressValues(optimized);
    }
    
    this.optimizationReport.optimizedSize = optimized.length;
    this.optimizationReport.savings = this.optimizationReport.originalSize - this.optimizationReport.optimizedSize;
    
    return {
      css: optimized,
      report: this.optimizationReport
    };
  }

  // Extract all CSS variable definitions and usages
  analyzeVariables(cssContent) {
    // Find variable definitions
    const variableDefinitions = cssContent.match(/--[\w-]+:\s*[^;]+/g) || [];
    variableDefinitions.forEach(def => {
      const variable = def.split(':')[0].trim();
      this.definedVariables.add(variable);
    });

    // Find variable usages
    const variableUsages = cssContent.match(/var\(--[\w-]+[^)]*\)/g) || [];
    variableUsages.forEach(usage => {
      const variable = usage.match(/--[\w-]+/)[0];
      this.usedVariables.add(variable);
    });
  }

  // Remove unused CSS variables
  removeUnusedVariables(cssContent) {
    this.analyzeVariables(cssContent);
    
    const unused = Array.from(this.definedVariables).filter(
      variable => !this.usedVariables.has(variable)
    );
    
    let optimized = cssContent;
    unused.forEach(variable => {
      // Remove the variable definition line
      const regex = new RegExp(`\\s*${this.escapeRegExp(variable)}:\\s*[^;]+;\\s*`, 'g');
      optimized = optimized.replace(regex, '');
      this.optimizationReport.variablesRemoved.push(variable);
    });
    
    return optimized;
  }

  // Optimize CSS selectors by removing duplicates and merging
  optimizeSelectors(cssContent) {
    // Remove duplicate selectors with identical properties
    const selectorBlocks = {};
    let optimized = cssContent;
    
    // Match CSS rules
    const rules = cssContent.match(/[^{}]+\{[^{}]*\}/g) || [];
    
    rules.forEach(rule => {
      const [selector, properties] = rule.split('{');
      const cleanSelector = selector.trim();
      const cleanProperties = properties.replace('}', '').trim();
      
      if (selectorBlocks[cleanProperties]) {
        // Merge selectors with identical properties
        selectorBlocks[cleanProperties] += ', ' + cleanSelector;
        // Remove the duplicate rule
        optimized = optimized.replace(rule, '');
        this.optimizationReport.selectorsOptimized.push(cleanSelector);
      } else {
        selectorBlocks[cleanProperties] = cleanSelector;
      }
    });
    
    return optimized;
  }

  // Compress CSS values
  compressValues(cssContent) {
    let optimized = cssContent;
    
    // Compress margin/padding shorthand
    optimized = optimized.replace(
      /(\w+):\s*(\d+px)\s+\2\s+\2\s+\2/g,
      '$1: $2' // 16px 16px 16px 16px -> 16px
    );
    
    optimized = optimized.replace(
      /(\w+):\s*(\d+px)\s+(\d+px)\s+\2\s+\3/g,
      '$1: $2 $3' // 16px 8px 16px 8px -> 16px 8px
    );
    
    // Compress colors
    optimized = optimized.replace(
      /#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g,
      '#$1$2$3' // #aabbcc -> #abc
    );
    
    // Remove unnecessary zeros
    optimized = optimized.replace(/\b0+(\.\d+)/g, '$1'); // 0.5 -> .5
    optimized = optimized.replace(/(\d+)\.0+(px|em|rem|%)/g, '$1$2'); // 16.0px -> 16px
    
    // Compress font weights
    optimized = optimized.replace(/font-weight:\s*normal/g, 'font-weight: 400');
    optimized = optimized.replace(/font-weight:\s*bold/g, 'font-weight: 700');
    
    return optimized;
  }

  // Helper: Escape special regex characters
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Generate optimization report
  generateReport() {
    const report = this.optimizationReport;
    const savingsPercent = ((report.savings / report.originalSize) * 100).toFixed(1);
    
    return `
📊 CSS Optimization Report
═════════════════════════
📏 Original size: ${report.originalSize} bytes
⚡ Optimized size: ${report.optimizedSize} bytes
💾 Savings: ${report.savings} bytes (${savingsPercent}%)

🗑️ Variables removed: ${report.variablesRemoved.length}
${report.variablesRemoved.slice(0, 5).map(v => `   • ${v}`).join('\n')}
${report.variablesRemoved.length > 5 ? `   • ... and ${report.variablesRemoved.length - 5} more` : ''}

🔧 Selectors optimized: ${report.selectorsOptimized.length}
${report.selectorsOptimized.slice(0, 3).map(s => `   • ${s}`).join('\n')}
${report.selectorsOptimized.length > 3 ? `   • ... and ${report.selectorsOptimized.length - 3} more` : ''}
`;
  }

  // Static method to get Kids Tasks specific optimization rules
  static getKidsTasksOptimizations() {
    return {
      // Variables that are safe to remove if unused
      safeToRemove: [
        '--kt-rarity-common', '--kt-rarity-rare', '--kt-rarity-epic', '--kt-rarity-legendary',
        '--kt-notification-success', '--kt-notification-error', '--kt-notification-info',
        '--kt-font-size-xs', '--kt-font-size-xl', '--kt-shadow-heavy', '--kt-overlay'
      ],
      
      // Variables that should be kept even if seemingly unused (used in JS)
      alwaysKeep: [
        '--kt-primary', '--kt-success', '--kt-error', '--kt-warning', '--kt-info',
        '--kt-space-xs', '--kt-space-sm', '--kt-space-md', '--kt-space-lg',
        '--kt-radius-sm', '--kt-radius-md', '--kt-radius-lg'
      ],
      
      // Selectors that can be simplified
      simplifySelectors: {
        '.kt-flex.kt-flex-center': '.kt-flex-center',
        '.kt-p-md.kt-m-md': '.kt-p-md.kt-m-md' // Keep compound classes
      }
    };
  }
}

// Rollup plugin wrapper
function cssOptimizerPlugin(options = {}) {
  return {
    name: 'css-optimizer',
    generateBundle(outputOptions, bundle) {
      Object.keys(bundle).forEach(fileName => {
        const file = bundle[fileName];
        
        if (file.type === 'chunk' && file.code) {
          // Extract CSS from JavaScript template literals
          const cssRegex = /`\s*<style[^>]*>([\s\S]*?)<\/style>\s*`/g;
          let match;
          let totalSavings = 0;
          
          while ((match = cssRegex.exec(file.code)) !== null) {
            const cssContent = match[1];
            const optimizer = new CSSOptimizer(options);
            const result = optimizer.optimize(cssContent);
            
            // Replace the CSS in the JavaScript
            file.code = file.code.replace(match[0], 
              `\`<style>${result.css}</style>\``
            );
            
            totalSavings += result.report.savings;
            
            if (options.verbose) {
              console.log(optimizer.generateReport());
            }
          }
          
          if (totalSavings > 0) {
            console.log(`🎨 CSS optimized in ${fileName}: ${totalSavings} bytes saved`);
          }
        }
      });
    }
  };
}

// Export for use
export { CSSOptimizer, cssOptimizerPlugin };

// Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CSSOptimizer, cssOptimizerPlugin };
}