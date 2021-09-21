const StyleDictionary = require("style-dictionary").extend({
  source: ["tokens/**/*.json"],
  platforms: {
    js: {
      transforms:['attribute/cti', 'name/cti/camel', 'size/object', 'color/css'],
      buildPath: "build/react-native/styleguide/",
      files: [
        {
            name: "colorsBase",
            destination: "colorsBase.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isColorBase",
          },
          {
            name: "colorsContext",
            destination: "colorsContext.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isColorContext",
          },
          {
            name: "fonts",
            destination: "fonts.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isFont",
          },
          {
            name: "opacities",
            destination: "opacities.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isOpacity",
          },
          {
            name: "radius",
            destination: "radius.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isRadius",
          },
          {
            name: "shadows",
            destination: "shadows.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isShadow",
          },
          {
            name: "sizes",
            destination: "sizes.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isSize",
          },
          {
            name: "spacings",
            destination: "spacings.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isSpacing",
          },
      ],
    },
  },
});

//Header

StyleDictionary.registerFileHeader({
  name: "tokenHeader",
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `Made by Pagar.me BaaS`];
  },
});

//Filters

StyleDictionary.registerFilter({
  name: "isSpacing",
  matcher: function (token) {
    return token.attributes.category === "spacing";
  },
});

StyleDictionary.registerFilter({
  name: "isOpacity",
  matcher: function (token) {
    return token.type === "opacity"
  },
});

StyleDictionary.registerFilter({
  name: "isRadius",
  matcher: function (token) {
    return token.type === "custom-radius"
  },
});

StyleDictionary.registerFilter({
    name: "isColorBase",
    matcher: function (token) {
      return (token.attributes.category === "color" && token.attributes.type === "base") || token.attributes.type === "neutral"
    },
  });

  StyleDictionary.registerFilter({
    name: "isColorContext",
    matcher: function (token) {
      return token.attributes.type === "context"
    },
  });

  StyleDictionary.registerFilter({
    name: "isFont",
    matcher: function (token) {
      return token.type === "custom-fontStyle"
    },
  });

  StyleDictionary.registerFilter({
    name: "isShadow",
    matcher: function (token) {
      return token.type === "custom-shadow"
    },
  });

  StyleDictionary.registerFilter({
    name: "isSize",
    matcher: function (token) {
      return token.type === "dimension"
    },
  });

StyleDictionary.buildAllPlatforms();
