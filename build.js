//Importantdo o Style Dictionary e helpers
const StyleDictionary = require("style-dictionary");
const _ = require("lodash");
const { fileHeader } = StyleDictionary.formatHelpers;

function getBasePxFontSize(options) {
  return (options && options.basePxFontSize) || 16;
}

//================================================//

//Concentrando açgumas settings e transformações dos tokens em uma só variável

const transformations = [
  "attribute/cti",
  "name/ti/kebab",
  "attribute/color",
  "color/css",
  "time/seconds",
  "breakpoint/px",
  "font/rem",
  "spacing/pxToRem",
  "size/pxToRem",
  "border/pxToRem",
  "radius/pxToRem"
];

const outputReferences = false;
const tokenHeader = "tokenHeader";

//================================================//

//Estruturando os caminhos para identificar os nomes dos arquivos em cada pasta

const fs = require("fs");
const brandFolders = fs.readdirSync("./tokens/brands");

//================================================//

//Aplicando um Header Customizável

StyleDictionary.registerFileHeader({
  name: "tokenHeader",
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `Made by Pagar.me BaaS`];
  },
});

//================================================//

//Filtros

function isColor(token) {
  return token.attributes.category === 'color';
}

function isSpacing(token) {
  return token.attributes.category === 'spacing' && token.filePath !== 'tokens/plugin/spacing.json';
}

function isFonts(token) {
  return token.attributes.category === 'font' && !(['paragraphIndent', '_fontStyleOld', 'paragraphSpacing'].includes(token.attributes.subitem)) && !(['paragraphIndent', '_fontStyleOld', 'paragraphSpacing'].includes(token.attributes.state));
}

function isFontStyles(token) {
  return ['fontSize', 'letterSpacing', 'lineHeight'].includes(token.attributes.subitem) || ['fontSize', 'letterSpacing', 'lineHeight'].includes(token.attributes.state);
}

function isSize(token) {
  return token.category === 'size';
}

function isBreakpoint(token) {
  return token.category === 'breakpoint';
}

function isEffects(token) {
  return token.attributes.category === 'effect' && !(['type'].includes(token.attributes.item));
}

function isOpacity(token) {
  return token.attributes.category === 'opacity';
}

function isBorders(token) {
  return token.attributes.category === 'borders' && token.filePath !== 'tokens/plugin/borders.json';
}

function isBorderWeight(token) {
  return token.attributes.item === 'weight'
}

function isRadius(token) {
  return token.attributes.category === 'radius' && token.filePath !== 'tokens/plugin/radius.json';
}

//Filtro das cores
StyleDictionary.registerFilter({
  name: "isColors",
  matcher: isColor
});

//Filtro das fontes
StyleDictionary.registerFilter({
  name: "isFonts",
  matcher: isFonts
});

StyleDictionary.registerFilter({
  name: "isFontStyles",
  matcher: isFontStyles
});

//Filtro dos espaçamentos
StyleDictionary.registerFilter({
  name: "isSpacing",
  matcher: isSpacing
});

//Filtro dos tamanho
StyleDictionary.registerFilter({
  name: "isSize",
  matcher: isSize
});

//Filtro dos breakpoints
StyleDictionary.registerFilter({
  name: "isBreakpoint",
  matcher: isBreakpoint
});

//Filtro dos efeitos
StyleDictionary.registerFilter({
  name: "isEffects",
  matcher: isEffects
});

//Filtro das opacidades
StyleDictionary.registerFilter({
  name: "isOpacity",
  matcher: isOpacity
});

//Filtro das bordas
StyleDictionary.registerFilter({
  name: "isBorders",
  matcher: isBorders
});

//Filtro dos radius
StyleDictionary.registerFilter({
  name: "isRadius",
  matcher: isRadius
});

//================================================//

//Registrando formato customizável para react native

StyleDictionary.registerFormat({
  name: "javascript/reactnative",
  formatter: function ({ dictionary, file }) {
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

//Registrando transformação kebab sem prefixo

StyleDictionary.registerTransform({
  name: 'name/ti/kebab',
  type: 'name',
  transformer: function (token, options) {
    return (_.kebabCase([options.prefix].concat(token.path.slice(1, token.path.length)).join(' ')));
  }
});

//================================================//

//Registrando transformação de valores de font para rem

StyleDictionary.registerTransform({
  name: 'font/rem',
  type: 'value',
  matcher: isFontStyles,
  transitive: true,
  transformer: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'rem');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

//================================================//

//Registrando transformação de spacing para rem

StyleDictionary.registerTransform({
  name: 'spacing/pxToRem',
  type: 'value',
  matcher: isSpacing,
  transformer: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'rem');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

//================================================//

//Registrando transformação de breakpoint para pixel

StyleDictionary.registerTransform({
  name: 'breakpoint/px',
  type: 'value',
  matcher: isBreakpoint,
  transformer: (token) => {
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'px');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal}px`;
  }
});

//================================================//

//Registrando transformação de border para rem

StyleDictionary.registerTransform({
  name: 'border/pxToRem',
  type: 'value',
  transitive:true,
  matcher: isBorderWeight,
  transformer: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);
    
    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'rem');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

//================================================//

//Registrando transformação de radius para rem

StyleDictionary.registerTransform({
  name: 'radius/pxToRem',
  type: 'value',
  transitive: true,
  matcher: isRadius,
  transformer: (token, options) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throwSizeError(token.name, token.value, 'rem');
    }

    if (floatVal === 0) {
      return '0';
    }

    return `${floatVal / baseFont}rem`;
  }
});

//================================================//

//Criação da função para gerar os styleguides

function getStyleDictionaryStyles(brand) {
  return {
    // O arquivo "source" sobrescreve os valores dos arquivos colocados em "include".

    // Logo, toda vez que precisar adicionar algum arquivo .json com alguma configuração personalizada de
    // tamanho, cor, fonte, etc. na pasta da marca, é só adicionar dentro da pasta da brand específica,
    // que os valores do "tokens/globals" serão sobrescritos pelos da marca.

    source: [`tokens/brands/${brand}/*.json`],

    include: [`tokens/replacers/*.json`, `tokens/plugin/*.json`],

    transform: {
      "spacing/pxToRem": { ...StyleDictionary.transform["spacing/pxToRem"], transitive: true },
      "size/pxToRem": { ...StyleDictionary.transform["size/pxToRem"], transitive: true, matcher: isSize }
    },

    platforms: {
      rn: {
        transforms: transformations,
        buildPath: `build/rn/${brand}/`,
        files: [
          {
            name: "colors",
            destination: `colors.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            name: "fonts",
            destination: `fonts.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            name: "spacing",
            destination: `spacing.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            name: "size",
            destination: `size.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            name: "breakpoint",
            destination: `breakpoint.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            name: "effects",
            destination: `effects.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            name: "opacity",
            destination: `opacity.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            name: "borders",
            destination: `borders.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            name: "radius",
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
      json: {
        transforms: transformations,
        buildPath: `build/json/${brand}/`,
        files: [
          {
            name: "colors",
            destination: `colors.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            name: "fonts",
            destination: `fonts.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            name: "spacing",
            destination: `spacing.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            name: "size",
            destination: `size.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            name: "breakpoint",
            destination: `breakpoint.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            name: "effects",
            destination: `effects.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            name: "opacity",
            destination: `opacity.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            name: "borders",
            destination: `borders.json`,
            format: "json/flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            name: "radius",
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
      js: {
        transforms: transformations,
        buildPath: `build/js/${brand}/`,
        files: [
          {
            name: "colors",
            destination: `colors.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          {
            name: "fonts",
            destination: `fonts.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isFonts`,
          },
          {
            name: "spacing",
            destination: `spacing.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacing`,
          },
          {
            name: "size",
            destination: `size.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSize`,
          },
          {
            name: "breakpoint",
            destination: `breakpoint.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoint`,
          },
          {
            name: "effects",
            destination: `effects.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isEffects`,
          },
          {
            name: "opacity",
            destination: `opacity.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacity`,
          },
          {
            name: "borders",
            destination: `borders.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBorders`,
          },
          {
            name: "radius",
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

//Processo de Build dos Tokens

console.log("Build started...");

//Mapeamento dos arquivos de marca de cada cliente para gerar os tokens dos styleguides e componentes

brandFolders.map(function (brand) {
  console.log("\n==============================================");
  console.log(`\nProcessing ${brand} styles...\n`);

  //Geração dos tokens de styleguide de cada marca

  StyleDictionary.extend(
    getStyleDictionaryStyles(brand)
  ).buildAllPlatforms();

  console.log("\n==============================================");
  console.log(`\nEnd ${brand} processing.`);
});

console.log("\n==============================================");
console.log("\nBuild completed.");
