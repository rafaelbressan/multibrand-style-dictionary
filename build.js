/**
 * @file Build configuration for multibrand design tokens using Style Dictionary v4
 * @description This file configures Style Dictionary to generate design tokens for multiple brands.
 * It includes custom transforms for pixel-to-rem conversions, custom filters to organize tokens
 * by category, and multiple output formats (React Native, JavaScript, JSON).
 *
 * @see {@link https://styledictionary.com/|Style Dictionary Documentation}
 */

// Import Style Dictionary and helpers (ES Modules)
import StyleDictionary from 'style-dictionary';
import { fileHeader } from 'style-dictionary/utils';
import _ from 'lodash';
import fs from 'fs';

/**
 * Get the base font size for rem calculations
 * @param {Object} options - Configuration options
 * @param {number} [options.basePxFontSize=16] - Base font size in pixels
 * @returns {number} Base font size in pixels (defaults to 16)
 */
function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || 16;
}

//================================================//
// Transform Groups and Configuration
//================================================//

/**
 * Transform group using kebab-case naming convention
 * Applied to 'js', 'json', and 'rn' platforms
 * @type {string[]}
 */
const kebabTransformation = [
  "name/ti/kebab",        // Custom kebab-case naming without prefix
  "attribute/cti",        // Add category/type/item attributes
  "attribute/color",      // Add color-specific attributes
  "color/css",            // Convert colors to CSS format
  "time/seconds",         // Convert time to seconds
  "breakpoint/px",        // Custom: Convert breakpoints to px
  "font/rem",             // Custom: Convert font values to rem
  "spacing/pxToRem",      // Custom: Convert spacing to rem
  "size/pxToRem",         // Custom: Convert sizes to rem
  "border/pxToRem",       // Custom: Convert border widths to rem
  "radius/pxToRem"        // Custom: Convert radius to rem
];

/**
 * Transform group using CONSTANT_CASE naming convention
 * Applied to 'jsc' platform for constant-style exports
 * @type {string[]}
 */
const constantTransformation = [
  "name/constant",        // Style Dictionary v4 CONSTANT_CASE naming
  "attribute/cti",        // Add category/type/item attributes
  "attribute/color",      // Add color-specific attributes
  "color/css",            // Convert colors to CSS format
  "time/seconds",         // Convert time to seconds
  "breakpoint/px",        // Custom: Convert breakpoints to px
  "font/rem",             // Custom: Convert font values to rem
  "spacing/pxToRem",      // Custom: Convert spacing to rem
  "size/pxToRem",         // Custom: Convert sizes to rem
  "border/pxToRem",       // Custom: Convert border widths to rem
  "radius/pxToRem"        // Custom: Convert radius to rem
];

/**
 * Whether to preserve token references in output files
 * When true, outputs references like {color.primary.value} instead of resolved values
 * @type {boolean}
 */
const outputReferences = false;

/**
 * Name of the custom file header to use in generated files
 * @type {string}
 */
const tokenHeader = "tokenHeader";

//================================================//
// Brand Discovery
//================================================//

/**
 * Array of brand folder names found in tokens/brands/
 * Each brand folder should contain token override files
 * @type {string[]}
 */
const brandFolders = fs.readdirSync("./tokens/brands");

//================================================//
// Token Filter Functions
//================================================//

/**
 * Filter function to identify color tokens
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @returns {boolean} True if token is a color
 */
function isColor(token) {
  return token.attributes.category === 'color';
}

/**
 * Filter function to identify spacing tokens
 * Excludes spacing tokens from the plugin file to avoid duplicates
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @param {string} token.filePath - Source file path
 * @returns {boolean} True if token is a spacing token (excluding plugin file)
 */
function isSpacing(token) {
  return token.attributes.category === 'spacing' && token.filePath !== 'tokens/plugin/spacing.json';
}

/**
 * Filter function to identify font family tokens
 * Excludes deprecated and internal font properties
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @param {string} [token.attributes.subitem] - Token subitem attribute
 * @param {string} [token.attributes.state] - Token state attribute
 * @returns {boolean} True if token is a font family token
 */
function isFonts(token) {
  return token.attributes.category === 'font' &&
    !(['paragraphIndent', '_fontStyleOld', 'paragraphSpacing'].includes(token.attributes.subitem)) &&
    !(['paragraphIndent', '_fontStyleOld', 'paragraphSpacing'].includes(token.attributes.state));
}

/**
 * Filter function to identify font style tokens (size, spacing, height)
 * Used to apply rem conversion transforms
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} [token.attributes.subitem] - Token subitem attribute
 * @param {string} [token.attributes.state] - Token state attribute
 * @returns {boolean} True if token is fontSize, letterSpacing, or lineHeight
 */
function isFontStyles(token) {
  return ['fontSize', 'letterSpacing', 'lineHeight'].includes(token.attributes.subitem) ||
    ['fontSize', 'letterSpacing', 'lineHeight'].includes(token.attributes.state);
}

/**
 * Filter function to identify size tokens (width, height)
 * @param {Object} token - Design token object
 * @param {string} token.category - Token category
 * @returns {boolean} True if token is a size
 */
function isSize(token) {
  return token.category === 'size';
}

/**
 * Filter function to identify responsive breakpoint tokens
 * @param {Object} token - Design token object
 * @param {string} token.category - Token category
 * @returns {boolean} True if token is a breakpoint
 */
function isBreakpoint(token) {
  return token.category === 'breakpoint';
}

/**
 * Filter function to identify shadow/effect tokens
 * Excludes type-only properties
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @param {string} [token.attributes.item] - Token item attribute
 * @returns {boolean} True if token is an effect (shadow)
 */
function isEffects(token) {
  return token.attributes.category === 'effect' && !(['type'].includes(token.attributes.item));
}

/**
 * Filter function to identify opacity tokens
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @returns {boolean} True if token is an opacity value
 */
function isOpacity(token) {
  return token.attributes.category === 'opacity';
}

/**
 * Filter function to identify border tokens
 * Excludes border tokens from the plugin file to avoid duplicates
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @param {string} token.filePath - Source file path
 * @returns {boolean} True if token is a border (excluding plugin file)
 */
function isBorders(token) {
  return token.attributes.category === 'borders' && token.filePath !== 'tokens/plugin/borders.json';
}

/**
 * Filter function to identify border weight (width) tokens
 * Used to apply rem conversion transforms to border widths
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} [token.attributes.item] - Token item attribute
 * @returns {boolean} True if token is a border weight
 */
function isBorderWeight(token) {
  return token.attributes.item === 'weight'
}

/**
 * Filter function to identify border radius tokens
 * Excludes radius tokens from the plugin file to avoid duplicates
 * @param {Object} token - Design token object
 * @param {Object} token.attributes - Token attributes
 * @param {string} token.attributes.category - Token category
 * @param {string} token.filePath - Source file path
 * @returns {boolean} True if token is a radius (excluding plugin file)
 */
function isRadius(token) {
  return token.attributes.category === 'radius' && token.filePath !== 'tokens/plugin/radius.json';
}

//================================================//
// Style Dictionary Configuration Function
//================================================//

/**
 * Generate Style Dictionary configuration for a specific brand
 * @param {string} brand - Brand name (folder name in tokens/brands/)
 * @returns {Object} Style Dictionary configuration object
 * @description
 * Creates a Style Dictionary configuration with:
 * - Source files from brand-specific folder (overrides)
 * - Include files from replacers and plugin folders (base tokens)
 * - Custom transforms for size and spacing conversions
 * - Multiple platform outputs (React Native, JavaScript, JSON)
 *
 * Token Resolution Order:
 * 1. Plugin tokens (tokens/plugin/*.json) - Base from Figma
 * 2. Replacer tokens (tokens/replacers/*.json) - Semantic mappings
 * 3. Brand tokens (tokens/brands/[brand]/*.json) - Brand overrides
 *
 * Brand tokens override replacer and plugin tokens with the same path.
 */
function getStyleDictionaryConfig(brand) {
  return {
    // Source files (brand-specific): These override included files
    // Add brand-specific token files (colors, fonts, etc.) to tokens/brands/[brand]/
    // These values will override tokens from "include" files
    source: [`tokens/brands/${brand}/*.json`],

    // Include files (base tokens): These are loaded first
    // - replacers: Semantic token mappings
    // - plugin: Base design tokens from Figma
    include: [`tokens/replacers/*.json`, `tokens/plugin/*.json`],

    // Log configuration
    log: {
      warnings: 'warn',
      verbosity: 'default'
    },

    // Preprocessor for handling transitive transforms (v4 compatible)
    preprocessors: [],

    // Platform configurations: Define output formats for different platforms
    platforms: {
      /**
       * React Native Platform
       * Outputs tokens in custom React Native format with kebab-case naming
       * Build path: build/rn/[brand]/
       */
      rn: {
        transforms: kebabTransformation,
        buildPath: `build/rn/${brand}/`,
        files: [
          {
            destination: `colors.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            destination: `fonts.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            destination: `spacing.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            destination: `size.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            destination: `breakpoint.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            destination: `effects.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            destination: `opacity.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            destination: `borders.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            destination: `radius.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isRadius`,
          },
        ],
      },
      /**
       * JSON Platform
       * Outputs tokens in flat JSON format with kebab-case naming
       * Build path: build/json/[brand]/
       * Format: { "color-base-turquoise-20": "rgba(...)" }
       */
      json: {
        transforms: kebabTransformation,
        buildPath: `build/json/${brand}/`,
        files: [
          {
            destination: `colors.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            destination: `fonts.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            destination: `spacing.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            destination: `size.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            destination: `breakpoint.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            destination: `effects.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            destination: `opacity.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            destination: `borders.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            destination: `radius.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isRadius`,
          },
        ],
      },
      /**
       * JavaScript Platform (kebab-case)
       * Outputs tokens as ES6 modules with kebab-case naming
       * Build path: build/js/[brand]/
       * Format: export const colorBaseTurquoise20 = "rgba(...)";
       */
      js: {
        transforms: kebabTransformation,
        buildPath: `build/js/${brand}/`,
        files: [
          {
            destination: `colors.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            destination: `fonts.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            destination: `spacing.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            destination: `size.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            destination: `breakpoint.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            destination: `effects.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            destination: `opacity.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            destination: `borders.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            destination: `radius.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isRadius`,
          },
        ],
      },
      /**
       * JavaScript Constant Platform (CONSTANT_CASE)
       * Outputs tokens as ES6 modules with CONSTANT_CASE naming
       * Build path: build/jsc/[brand]/
       * Format: export const COLOR_BASE_TURQUOISE_20 = "rgba(...)";
       */
      jsc: {
        transforms: constantTransformation,
        buildPath: `build/jsc/${brand}/`,
        files: [
          {
            destination: `colors.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            destination: `fonts.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            destination: `spacing.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            destination: `size.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            destination: `breakpoint.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            destination: `effects.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            destination: `opacity.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            destination: `borders.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            destination: `radius.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isRadius`,
          },
        ],
      },
    },
  };
}

//================================================//
// Custom Hooks Registration (V4 API)
//================================================//

/**
 * Register custom file header hook
 * Adds "Made by Pagar.me BaaS" to the default Style Dictionary header
 */
StyleDictionary.registerFileHeader({
  name: "tokenHeader",
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `Made by Pagar.me BaaS`];
  },
});

// Register all custom filters
StyleDictionary.registerFilter({
  name: "isColors",
  filter: isColor
});

StyleDictionary.registerFilter({
  name: "isFonts",
  filter: isFonts
});

StyleDictionary.registerFilter({
  name: "isFontStyles",
  filter: isFontStyles
});

StyleDictionary.registerFilter({
  name: "isSpacing",
  filter: isSpacing
});

StyleDictionary.registerFilter({
  name: "isSize",
  filter: isSize
});

StyleDictionary.registerFilter({
  name: "isBreakpoint",
  filter: isBreakpoint
});

StyleDictionary.registerFilter({
  name: "isEffects",
  filter: isEffects
});

StyleDictionary.registerFilter({
  name: "isOpacity",
  filter: isOpacity
});

StyleDictionary.registerFilter({
  name: "isBorders",
  filter: isBorders
});

StyleDictionary.registerFilter({
  name: "isRadius",
  filter: isRadius
});

//================================================//
// Custom Format Registration
//================================================//

/**
 * Register custom React Native format
 * Outputs tokens as a default export with nested object structure
 * Example: export default colors = { "color": { ... } };
 */
StyleDictionary.registerFormat({
  name: "javascript/reactnative",
  format: function ({ dictionary, file }) {
    return (
      fileHeader({ file }) +
      "export default " +
      (file.name || "_styleDictionary") +
      " = " +
      JSON.stringify(dictionary.tokens, null, 2) +
      ";"
    );
  },
});

//================================================//
// Custom Transform Registration
//================================================//

/**
 * Register custom kebab-case naming transform without prefix
 * Converts token paths to kebab-case names, skipping the first path segment
 * Example: color.base.turquoise.20 -> base-turquoise-20
 */
StyleDictionary.registerTransform({
  name: 'name/ti/kebab',
  type: 'name',
  transform: function (token, options) {
    return (_.kebabCase([options.prefix].concat(token.path.slice(1, token.path.length)).join(' ')));
  }
});

/**
 * Register font value to rem transform
 * Converts fontSize, lineHeight, and letterSpacing from pixels to rem
 */
StyleDictionary.registerTransform({
  name: 'font/rem',
  type: 'value',
  filter: isFontStyles,
  transitive: true,
  transform: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      console.error(`Invalid font value for ${token.name}: ${token.value}`);
      return token.value;
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

/**
 * Register spacing value to rem transform
 * Converts spacing/padding/margin values from pixels to rem
 */
StyleDictionary.registerTransform({
  name: 'spacing/pxToRem',
  type: 'value',
  filter: isSpacing,
  transform: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      console.error(`Invalid spacing value for ${token.name}: ${token.value}`);
      return token.value;
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

/**
 * Register breakpoint value to px transform
 * Ensures breakpoint values have px units
 */
StyleDictionary.registerTransform({
  name: 'breakpoint/px',
  type: 'value',
  filter: isBreakpoint,
  transform: (token) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      console.error(`Invalid breakpoint value for ${token.name}: ${token.value}`);
      return token.value;
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal}px`;
  }
});

/**
 * Register border width to rem transform
 * Converts border-weight values from pixels to rem
 */
StyleDictionary.registerTransform({
  name: 'border/pxToRem',
  type: 'value',
  transitive: true,
  filter: isBorderWeight,
  transform: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      console.error(`Invalid border value for ${token.name}: ${token.value}`);
      return token.value;
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

/**
 * Register radius value to rem transform
 * Converts border-radius values from pixels to rem
 */
StyleDictionary.registerTransform({
  name: 'radius/pxToRem',
  type: 'value',
  transitive: true,
  filter: isRadius,
  transform: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      console.error(`Invalid radius value for ${token.name}: ${token.value}`);
      return token.value;
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

//================================================//
// Build Process Execution (V4 Async API)
//================================================//

console.log("Build started...");

/**
 * Build tokens for each brand (V4 async approach)
 * Iterates through all brand folders found in tokens/brands/
 * For each brand:
 * 1. Creates a new Style Dictionary instance
 * 2. Builds all platforms asynchronously
 * 3. Outputs generated files to build/[platform]/[brand]/
 */
async function buildAllBrands() {
  for (const brand of brandFolders) {
    console.log("\n==============================================");
    console.log(`\nProcessing ${brand} styles...\n`);

    // V4 API: Create a new StyleDictionary instance
    const sd = new StyleDictionary(getStyleDictionaryConfig(brand));

    // V4 API: Build all platforms asynchronously
    await sd.buildAllPlatforms();

    console.log("\n==============================================");
    console.log(`\nEnd ${brand} processing.`);
  }

  console.log("\n==============================================");
  console.log("\nBuild completed.");
}

// Execute the async build process
buildAllBrands().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
