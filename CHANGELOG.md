# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README documentation with bilingual support (English and Portuguese)
- JSDoc documentation for all functions and transforms in build.js
- Inline code comments explaining complex logic
- ARCHITECTURE.md with system design documentation
- This CHANGELOG.md to track project changes

### Changed
- Improved code organization with clear section headers in build.js

## [1.0.0] - 2024-11-09

### Added
- Sharon Sans font integration
- Constant naming style (CONSTANT_CASE) support
- New export format `jsc` for JavaScript with constant naming
- Custom pixel-to-rem transforms for:
  - Font values (fontSize, lineHeight, letterSpacing)
  - Spacing values
  - Size values
  - Border widths
  - Border radius
- Flat format exports for both JS and JSON
- Token replacers for cleaner exports:
  - Opacity replacers
  - Radius replacers
  - Spacing replacers
  - Border replacers
- Four output platforms:
  - `rn` - React Native with nested object structure
  - `json` - Flat JSON format
  - `js` - ES6 modules with kebab-case naming
  - `jsc` - ES6 modules with CONSTANT_CASE naming

### Changed
- Simplified to single Pagar.me brand focus
- Updated all tokens with new values from design system
- Removed backup build copy files
- Improved token export from Figma plugin

### Fixed
- Border filter issues resolved
- Export format compatibility for both React Native and web platforms

## [0.9.0] - Earlier Releases

### Added
- Prudential brand colors and fonts
- Financier brand style colors
- Montserrat font to Financier brand
- CSS exporting capability
- Plugin folder structure for Figma-generated files
- Custom token filtering system:
  - Colors filter
  - Fonts filter
  - Spacing filter
  - Size filter
  - Breakpoints filter
  - Effects (shadows) filter
  - Opacity filter
  - Borders filter
  - Radius filter

### Changed
- Moved from automatic styleguide generation to manual configuration
- Improved brand parameter override system
- Separated Figma plugin outputs from custom token definitions

### Removed
- SCSS exporting (replaced with CSS due to Tailwind usage)
- Component-specific tokens (simplified to styleguide tokens only)
- Automatic processing that failed with brand overrides

## [0.1.0] - Initial Release

### Added
- Initial Style Dictionary implementation
- Multi-brand support structure
- Base token categories:
  - Colors
  - Fonts (typography)
  - Spacing
  - Sizes
  - Borders
  - Border radius
  - Effects (shadows)
  - Breakpoints
  - Opacity
- Global tokens folder structure
- Brand-specific override system
- Basic build script
- Git repository initialization

---

## Release Notes

### Version Numbering
- **Major version** (X.0.0): Breaking changes to token structure or build process
- **Minor version** (0.X.0): New features, new brands, new token categories
- **Patch version** (0.0.X): Bug fixes, documentation updates, minor improvements

### Upgrading
When upgrading between versions, check for:
1. Changes to token structure that may affect your imports
2. New output formats that may be beneficial for your use case
3. Deprecated tokens that should be replaced
4. New transform configurations that may affect values

### Contributing
See CONTRIBUTING.md for guidelines on how to contribute to this project.
