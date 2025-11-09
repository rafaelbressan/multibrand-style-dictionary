# Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Token Flow](#token-flow)
3. [Directory Structure](#directory-structure)
4. [Custom Transforms](#custom-transforms)
5. [Custom Filters](#custom-filters)
6. [Custom Formats](#custom-formats)
7. [Build Process](#build-process)
8. [Platform Outputs](#platform-outputs)
9. [Extension Points](#extension-points)

## System Overview

The Multibrand Style Dictionary is built on top of [Amazon Style Dictionary](https://amzn.github.io/style-dictionary/), a build system for creating and distributing design tokens across platforms and brands.

### Key Components

```
┌─────────────────┐
│  Figma Design   │
│     System      │
└────────┬────────┘
         │ Export
         ▼
┌─────────────────┐
│ Plugin Tokens   │ ◄─── Base design values
│ tokens/plugin/  │
└────────┬────────┘
         │
         │ Include
         ▼
┌─────────────────┐
│    Replacers    │ ◄─── Semantic mappings
│tokens/replacers/│
└────────┬────────┘
         │
         │ Include
         ▼
┌─────────────────┐
│  Brand Tokens   │ ◄─── Brand overrides
│ tokens/brands/  │
└────────┬────────┘
         │
         │ Build
         ▼
┌─────────────────┐
│  build.js       │ ◄─── Custom transforms & filters
│  (Build Script) │
└────────┬────────┘
         │
         │ Generate
         ▼
┌─────────────────┐
│   Output Files  │
│  build/[platform]/[brand]/
│  ├── rn/        │ ◄─── React Native
│  ├── json/      │ ◄─── JSON flat
│  ├── js/        │ ◄─── JS kebab-case
│  └── jsc/       │ ◄─── JS CONSTANT_CASE
└─────────────────┘
```

## Token Flow

### 1. Token Resolution Order

Tokens are resolved in the following order (later overrides earlier):

1. **Plugin Tokens** (`tokens/plugin/*.json`)
   - Base design tokens exported from Figma
   - Define foundational values (colors, fonts, spacing, etc.)
   - Should rarely be edited manually

2. **Replacer Tokens** (`tokens/replacers/*.json`)
   - Semantic token mappings
   - Can reference plugin tokens
   - Provide alternative definitions

3. **Brand Tokens** (`tokens/brands/[brand]/*.json`)
   - Brand-specific overrides
   - Highest priority
   - Only need to define values that differ from base

### 2. Token Transformation Pipeline

```
Source Token → Matchers → Transforms → Filters → Format → Output File
```

#### Example: Color Token

```json
// Input: tokens/plugin/colors.json
{
  "color": {
    "base": {
      "turquoise": {
        "20": {
          "value": "rgba(156, 228, 237, 1)",
          "type": "color",
          "category": "color"
        }
      }
    }
  }
}

// After Transforms (kebab-case naming, color/css)
{
  "name": "color-base-turquoise-20",
  "value": "rgba(156, 228, 237, 1)",
  "category": "color"
}

// After Filter (isColors matcher)
// Token passes filter ✓

// After Format (javascript/module-flat)
export const colorBaseTurquoise20 = "rgba(156, 228, 237, 1)";
```

#### Example: Spacing Token with px to rem

```json
// Input: tokens/plugin/spacing.json
{
  "spacing": {
    "small": {
      "value": 16,
      "type": "spacing",
      "category": "spacing"
    }
  }
}

// After Transform (spacing/pxToRem)
{
  "name": "spacing-small",
  "value": "1rem",  // 16 / 16 = 1rem
  "category": "spacing"
}

// Output
export const spacingSmall = "1rem";
```

## Directory Structure

```
multibrand-style-dictionary/
│
├── build.js                    # Main build script with custom config
├── package.json                # Dependencies and npm scripts
├── README.md                   # Project documentation
├── CHANGELOG.md               # Version history
├── ARCHITECTURE.md            # This file
│
├── tokens/                     # Source design tokens
│   ├── brands/                 # Brand-specific overrides
│   │   ├── pagarme/           # Example brand
│   │   │   ├── colors.json
│   │   │   └── fonts.json
│   │   └── [brand-name]/      # Additional brands
│   │
│   ├── plugin/                 # Base tokens from Figma
│   │   ├── colors.json         # Base color palette
│   │   ├── fonts.json          # Typography system
│   │   ├── spacing.json        # Spacing scale
│   │   ├── size.json           # Size values
│   │   ├── borders.json        # Border definitions
│   │   ├── radius.json         # Border radius values
│   │   ├── effects.json        # Shadow/elevation effects
│   │   └── breakpoints.json    # Responsive breakpoints
│   │
│   └── replacers/              # Semantic mappings
│       ├── spacing.json
│       ├── radius.json
│       ├── borders.json
│       └── opacity.json
│
└── build/                      # Generated output (gitignored)
    ├── rn/[brand]/            # React Native format
    ├── json/[brand]/          # JSON flat format
    ├── js/[brand]/            # JS kebab-case format
    └── jsc/[brand]/           # JS CONSTANT_CASE format
```

## Custom Transforms

### Overview

Transforms modify token values during the build process. Custom transforms handle unit conversions (px to rem) for web accessibility.

### Base Font Size

All rem calculations use a base font size of **16px** (configurable via `getBasePxFontSize(options)`).

### Transform: `name/ti/kebab`

**Type:** Name transform
**Purpose:** Convert token paths to kebab-case names without prefix

```javascript
// Token path: ["color", "base", "turquoise", "20"]
// Output: "base-turquoise-20"

StyleDictionary.registerTransform({
  name: 'name/ti/kebab',
  type: 'name',
  transformer: function (token, options) {
    // Skip first segment, convert to kebab-case
    return _.kebabCase(
      [options.prefix]
        .concat(token.path.slice(1, token.path.length))
        .join(' ')
    );
  }
});
```

### Transform: `font/rem`

**Type:** Value transform
**Matcher:** `isFontStyles` (fontSize, lineHeight, letterSpacing)
**Purpose:** Convert font values from pixels to rem

```javascript
// Input: 24 (pixels)
// Output: "1.5rem" (24 / 16 = 1.5)

transformer: (token, options) => {
  const baseFont = getBasePxFontSize(options); // 16
  const floatVal = parseFloat(token.value);    // 24
  return `${floatVal / baseFont}rem`;          // "1.5rem"
}
```

### Transform: `spacing/pxToRem`

**Type:** Value transform
**Matcher:** `isSpacing`
**Purpose:** Convert spacing values from pixels to rem

```javascript
// Input: 8 (pixels)
// Output: "0.5rem" (8 / 16 = 0.5)
```

### Transform: `size/pxToRem`

**Type:** Value transform
**Matcher:** `isSize`
**Purpose:** Convert size values (width, height) from pixels to rem

```javascript
// Input: 32 (pixels)
// Output: "2rem" (32 / 16 = 2)
```

### Transform: `border/pxToRem`

**Type:** Value transform
**Matcher:** `isBorderWeight`
**Transitive:** Yes
**Purpose:** Convert border widths from pixels to rem

```javascript
// Input: 2 (pixels)
// Output: "0.125rem" (2 / 16 = 0.125)
```

### Transform: `radius/pxToRem`

**Type:** Value transform
**Matcher:** `isRadius`
**Transitive:** Yes
**Purpose:** Convert border-radius from pixels to rem

```javascript
// Input: 8 (pixels)
// Output: "0.5rem" (8 / 16 = 0.5)
```

### Transform: `breakpoint/px`

**Type:** Value transform
**Matcher:** `isBreakpoint`
**Purpose:** Ensure breakpoints have px units

```javascript
// Input: 768 (number)
// Output: "768px" (string with units)
```

## Custom Filters

Filters determine which tokens are included in each output file. Each filter is registered with a matcher function.

### Filter: `isColors`

**Matcher:** `token.attributes.category === 'color'`
**Includes:** All color tokens
**Output:** `colors.js`, `colors.json`

### Filter: `isFonts`

**Matcher:** `token.attributes.category === 'font'` (excluding deprecated properties)
**Excludes:** `paragraphIndent`, `_fontStyleOld`, `paragraphSpacing`
**Includes:** Font family definitions
**Output:** `fonts.js`, `fonts.json`

### Filter: `isFontStyles`

**Matcher:** fontSize, lineHeight, letterSpacing attributes
**Used by:** `font/rem` transform
**Purpose:** Identify font values that need rem conversion

### Filter: `isSpacing`

**Matcher:** `token.attributes.category === 'spacing'` AND not from plugin file
**Excludes:** Plugin spacing to avoid duplicates
**Includes:** Semantic spacing tokens
**Output:** `spacing.js`, `spacing.json`

### Filter: `isSize`

**Matcher:** `token.category === 'size'`
**Includes:** Width and height values
**Output:** `size.js`, `size.json`

### Filter: `isBreakpoint`

**Matcher:** `token.category === 'breakpoint'`
**Includes:** Responsive breakpoint values
**Output:** `breakpoint.js`, `breakpoint.json`

### Filter: `isEffects`

**Matcher:** `token.attributes.category === 'effect'` (excluding type properties)
**Includes:** Shadow and elevation effects
**Output:** `effects.js`, `effects.json`

### Filter: `isOpacity`

**Matcher:** `token.attributes.category === 'opacity'`
**Includes:** Opacity values (0-1)
**Output:** `opacity.js`, `opacity.json`

### Filter: `isBorders`

**Matcher:** `token.attributes.category === 'borders'` AND not from plugin file
**Excludes:** Plugin borders to avoid duplicates
**Includes:** Semantic border tokens
**Output:** `borders.js`, `borders.json`

### Filter: `isRadius`

**Matcher:** `token.attributes.category === 'radius'` AND not from plugin file
**Excludes:** Plugin radius to avoid duplicates
**Includes:** Semantic radius tokens
**Output:** `radius.js`, `radius.json`

## Custom Formats

### Format: `javascript/reactnative`

**Purpose:** Generate React Native compatible JavaScript exports
**Structure:** Nested objects with default export
**Naming:** Preserves token hierarchy

```javascript
// Output format
export default colors = {
  "color": {
    "base": {
      "turquoise": {
        "20": {
          "type": "color",
          "value": "rgba(156, 228, 237, 1)",
          "filePath": "tokens/plugin/colors.json",
          "name": "colorBaseTurquoise20",
          "path": ["color", "base", "turquoise", "20"]
        }
      }
    }
  }
};
```

**Use case:** React Native applications that need full token metadata

## Build Process

### 1. Initialization

```javascript
const brandFolders = fs.readdirSync("./tokens/brands");
```

- Scans `tokens/brands/` directory
- Identifies all brand folders
- Each folder becomes a build target

### 2. Brand Configuration

For each brand, `getStyleDictionaryStyles(brand)` creates a configuration:

```javascript
{
  source: [`tokens/brands/${brand}/*.json`],    // Brand overrides
  include: [                                     // Base tokens
    `tokens/replacers/*.json`,
    `tokens/plugin/*.json`
  ],
  transform: { /* custom transforms */ },
  platforms: { /* rn, json, js, jsc */ }
}
```

### 3. Style Dictionary Extension

```javascript
StyleDictionary.extend(
  getStyleDictionaryStyles(brand)
).buildAllPlatforms();
```

- Extends Style Dictionary with brand config
- Processes all platforms defined in config
- Generates output files for each platform

### 4. Output Generation

For each platform:
1. Apply transforms (name, value conversions)
2. Apply filters (select relevant tokens)
3. Apply format (generate output structure)
4. Write to destination file

## Platform Outputs

### Platform: `rn` (React Native)

**Transform Group:** `kebabTransformation`
**Build Path:** `build/rn/[brand]/`
**Format:** `javascript/reactnative`
**Files:** colors.js, fonts.js, spacing.js, size.js, breakpoint.js, effects.js, opacity.js, borders.js, radius.js

**Example:**
```javascript
export default colors = { "color": { ... } };
```

### Platform: `json` (JSON Flat)

**Transform Group:** `kebabTransformation`
**Build Path:** `build/json/[brand]/`
**Format:** `json/flat`
**Files:** colors.json, fonts.json, spacing.json, etc.

**Example:**
```json
{
  "color-base-turquoise-20": "rgba(156, 228, 237, 1)",
  "color-base-turquoise-50": "rgba(78, 205, 222, 1)"
}
```

### Platform: `js` (JavaScript kebab-case)

**Transform Group:** `kebabTransformation`
**Build Path:** `build/js/[brand]/`
**Format:** `javascript/module-flat`
**Files:** colors.js, fonts.js, spacing.js, etc.

**Example:**
```javascript
export const colorBaseTurquoise20 = "rgba(156, 228, 237, 1)";
export const colorBaseTurquoise50 = "rgba(78, 205, 222, 1)";
```

### Platform: `jsc` (JavaScript CONSTANT_CASE)

**Transform Group:** `constantTransformation`
**Build Path:** `build/jsc/[brand]/`
**Format:** `javascript/module-flat`
**Files:** colors.js, fonts.js, spacing.js, etc.

**Example:**
```javascript
export const COLOR_BASE_TURQUOISE_20 = "rgba(156, 228, 237, 1)";
export const COLOR_BASE_TURQUOISE_50 = "rgba(78, 205, 222, 1)";
```

## Extension Points

### Adding a New Transform

```javascript
StyleDictionary.registerTransform({
  name: 'custom/transform',
  type: 'value', // or 'name', 'attribute'
  matcher: (token) => {
    // Return true if transform should apply
    return token.type === 'custom';
  },
  transformer: (token, options) => {
    // Return transformed value
    return customTransform(token.value);
  }
});
```

### Adding a New Filter

```javascript
function isCustomType(token) {
  return token.attributes.category === 'custom';
}

StyleDictionary.registerFilter({
  name: "isCustom",
  matcher: isCustomType
});
```

Then add to platform files configuration:
```javascript
{
  name: "custom",
  destination: `custom.js`,
  format: "javascript/module-flat",
  filter: `isCustom`
}
```

### Adding a New Format

```javascript
StyleDictionary.registerFormat({
  name: 'custom/format',
  formatter: function ({ dictionary, file, options }) {
    return dictionary.allTokens
      .map(token => `${token.name}: ${token.value}`)
      .join('\n');
  }
});
```

### Adding a New Platform

In `getStyleDictionaryStyles()`, add to platforms object:

```javascript
platforms: {
  // ... existing platforms
  customPlatform: {
    transforms: ['custom/transform'],
    buildPath: `build/custom/${brand}/`,
    files: [
      {
        destination: 'tokens.custom',
        format: 'custom/format'
      }
    ]
  }
}
```

### Adding a New Brand

1. Create brand directory:
```bash
mkdir tokens/brands/new-brand
```

2. Add override files:
```bash
touch tokens/brands/new-brand/colors.json
touch tokens/brands/new-brand/fonts.json
```

3. Define overrides matching base token structure:
```json
{
  "color": {
    "primary": {
      "value": "#FF0000",
      "type": "color"
    }
  }
}
```

4. Run build:
```bash
npm run build
```

Output will be generated in `build/[platform]/new-brand/`

## Performance Considerations

### Build Time

- **Typical build time:** 2-5 seconds per brand
- **Factors:**
  - Number of tokens
  - Number of platforms
  - Transform complexity
  - File I/O

### Optimization Tips

1. **Limit token file size:** Keep individual token files under 1000 tokens
2. **Use specific filters:** Avoid processing unnecessary tokens
3. **Cache builds:** Use `npm run watch` for incremental builds during development
4. **Minimize transforms:** Only apply transforms where needed

## Troubleshooting

### Common Issues

#### Build fails with "Cannot find module 'style-dictionary'"
**Solution:** Run `npm install`

#### Build fails with "scandir './tokens/brands'"
**Solution:** Create `tokens/brands/` directory with at least one brand folder

#### Tokens not overriding
**Solution:** Ensure brand token structure exactly matches base token path

#### Transform not applying
**Solution:** Check matcher function returns true for target tokens

#### Filter excluding tokens
**Solution:** Verify token has correct `attributes.category` or other matcher properties

## Best Practices

1. **Keep plugin tokens clean:** Only edit when updating from Figma
2. **Use replacers for semantic meaning:** Map generic tokens to semantic names
3. **Brand overrides only:** Only define what's different in brand files
4. **Consistent structure:** Match token paths exactly when overriding
5. **Document custom tokens:** Add comments in JSON (note: will be stripped in output)
6. **Test builds:** Run `npm run build` before committing changes
7. **Version control:** Track changes in CHANGELOG.md
8. **Token naming:** Use clear, descriptive token names following design system conventions

## Future Enhancements

Potential improvements to consider:

- [ ] CSS Variables output format
- [ ] Sass/SCSS variables format
- [ ] TypeScript type definitions
- [ ] Token validation schema
- [ ] Automated token syncing from Figma
- [ ] Design token documentation generator
- [ ] Theme switching support
- [ ] Dark mode token variants
- [ ] Component-specific token grouping
- [ ] Token usage reporting
