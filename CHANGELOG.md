# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2024-11-10

### BREAKING CHANGES
- **Migrated to Style Dictionary v4.4.0**
  - Complete rewrite to ES Modules (import/export syntax)
  - Async build process with class-based API
  - Requires Node.js 18+ (current: v22.21.1)
  - Projects customizing build.js must migrate to v4 API

### Changed
- **Migration to ES Modules**
  - Added `"type": "module"` to package.json
  - Converted all `require()` to `import` statements
  - Build.js now uses ES6 module syntax throughout
- **Style Dictionary v4 API Updates**
  - Changed from `StyleDictionary.extend()` to `new StyleDictionary()`
  - Build process is now asynchronous using `await`
  - Updated filter API: `matcher:` → `filter:`
  - Updated transform API: `transformer:` → `transform:`
  - Updated format API: `formatter:` → `format:`
  - Changed import path for utilities: `style-dictionary/utils`
  - Updated transform name: `name/ti/constant` → `name/constant`
- **Dependencies**
  - Updated style-dictionary from 3.9.2 to 4.4.0 (major version bump)
  - Added lodash as direct dependency (no longer bundled with style-dictionary)
- **Build Process**
  - Now uses async/await pattern for better error handling
  - Improved error messages for transform failures
  - Added error logging for invalid token values

### Added
- Comprehensive JSDoc documentation for v4 API changes
- Error handling for invalid token values in custom transforms
- V4-compatible configuration structure with new options
- Better logging configuration in Style Dictionary config

### Fixed
- All transforms updated to v4 API specifications
- File header import path corrected for v4
- Custom format registration updated for v4 compatibility

### Migration Notes
**For Users**:
- Output token files remain unchanged - no action needed
- All 4 platforms (rn, json, js, jsc) continue to work identically

**For Developers**:
- If customizing build.js, migrate to ES Modules and v4 API
- See official migration guide: https://v4.styledictionary.com/version-4/migration/
- Update any scripts importing build.js to use ES6 imports

**Testing**:
- ✅ All 36 output files generate successfully
- ✅ px-to-rem transformations working correctly
- ✅ Custom filters and formats functional
- ✅ CONSTANT_CASE and kebab-case naming both working

## [1.1.0] - 2024-11-09

### Security
- Fixed 6 security vulnerabilities in dependencies (1 critical, 4 high, 1 low)
  - ansi-regex: Regular Expression Complexity vulnerability
  - brace-expansion: ReDoS vulnerability
  - braces: Uncontrolled resource consumption
  - json5: Prototype Pollution
  - minimatch: ReDoS vulnerability
  - minimist: Prototype Pollution (critical)

### Changed
- Updated style-dictionary from 3.0.2 to 3.9.2 (latest v3.x)
  - Includes bug fixes and improvements
  - No breaking changes
- Updated multiple transitive dependencies via `npm audit fix`

### Added
- Comprehensive README documentation with bilingual support (English and Portuguese)
- JSDoc documentation for all functions and transforms in build.js
- Inline code comments explaining complex logic
- ARCHITECTURE.md with system design documentation
- This CHANGELOG.md to track project changes
- Documentation of future upgrade path to v4/v5

### Note on Future Upgrades
- **Style Dictionary v4.x** (Available but not yet adopted)
  - Requires migration to ES Modules (`import` instead of `require`)
  - Style Dictionary becomes a class (requires `new` keyword)
  - Many methods become asynchronous
  - Requires code rewrite - planned for future major release
  - See: https://v4.styledictionary.com/version-4/migration/

- **Style Dictionary v5.x** (Available but not yet adopted)
  - Requires Node.js 22+ ✅ (current version: v22.21.1)
  - Builds on v4 with additional token reference restrictions
  - Requires v4 migration first
  - See: https://styledictionary.com/versions/v5/migration/

### Fixed
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
