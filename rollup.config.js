import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import cleanup from 'rollup-plugin-cleanup';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { cssOptimizerPlugin } from './scripts/css-optimizer.js';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Home Assistant www directory paths (update these for your setup)
const HA_LOCAL_PATH = '/config/www/local/kids-tasks-card.js';
const HA_HACS_PATH = '/config/www/community/kids-tasks-card/kids-tasks-card.js';

console.log(`🛠️  Building Kids Tasks Card in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);

const config = {
  input: 'src/main.js',
  output: {
    format: 'es',
    sourcemap: isDevelopment,
    banner: isProduction 
      ? '/* Kids Tasks Card v2.0.0 - Optimized Build */'
      : '/* Kids Tasks Card v2.0.0 - Development Build */',
  },
  plugins: [
    nodeResolve(),
    
    // Replace environment variables
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VERSION': JSON.stringify(process.env.npm_package_version || '2.0.0'),
        '__DEV__': isDevelopment,
        '__PROD__': isProduction
      }
    }),

    // Clean up code
    cleanup({
      comments: isProduction ? 'none' : 'some',
      maxEmptyLines: isProduction ? 0 : 2
    }),

    // CSS optimization
    cssOptimizerPlugin({
      removeUnused: true,
      optimizeSelectors: true,
      compressValues: true,
      verbose: isDevelopment
    })
  ],
  
  // Watch options for development
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  }
};

// Output configuration based on environment
if (isDevelopment) {
  // Development build - readable, with sourcemaps
  config.output = {
    ...config.output,
    file: 'dist/kids-tasks-card.dev.js',
    compact: false,
    indent: '  '
  };
  
  // Add development plugins
  config.plugins.push(
    // Serve files for development
    serve({
      open: false,
      contentBase: ['dist', '.'],
      host: 'localhost',
      port: 8080,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }),
    
    // Live reload
    livereload({
      watch: 'dist',
      verbose: false
    })
  );
  
} else {
  // Production build - minified, optimized
  config.output = {
    ...config.output,
    file: 'dist/kids-tasks-card.js',
    compact: true
  };
  
  // Add production plugins
  config.plugins.push(
    terser({
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.warn']
      },
      format: {
        comments: false
      }
    })
  );
}

// Export multiple configurations if needed
export default [
  config,
  
  // Additional config for direct HA deployment in development
  ...(isDevelopment ? [{
    ...config,
    output: {
      ...config.output,
      file: 'dist/kids-tasks-card-ha-dev.js'
    },
    plugins: config.plugins.filter(plugin => 
      // Remove serve and livereload for this build
      plugin.name !== 'serve' && plugin.name !== 'livereload'
    )
  }] : [])
];