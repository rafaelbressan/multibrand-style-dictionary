//Importantdo o Style Dictionary
const styleguide = require("./styleguide")
const StyleDictionary = require("style-dictionary");
const { fileHeader } = StyleDictionary.formatHelpers;

//================================================//

//Concentrando açgumas settings e transformações dos tokens em uma só variável

const rnTransforms = [
  "attribute/cti",
  "name/cti/camel",
  "size/object",
  "color/css",
];

const outputReferences = true;
const tokenHeader = "tokenHeader";

//================================================//

//Estruturando os caminhos para identificar os nomes dos arquivos em cada pasta

const fs = require("fs");
const brandFolders = fs.readdirSync("./tokens/brands");

const componentFolders = fs.readdirSync("./tokens/globals/component");
const componentList = componentFolders.map((element) => {
  return element.split(".json")[0];
});

const styleguideFolders = fs.readdirSync("./tokens/globals/styleguide");
const styleguideList = styleguideFolders.map((element) => {
  return element.split(".json")[0];
});

//================================================//

//Aplicando um Header Customizável

StyleDictionary.registerFileHeader({
  name: "tokenHeader",
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `Made by Pagar.me BaaS`];
  },
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

//================================================//

//Função de criação do nome do filtro dos tokens

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//================================================//

//Styleguides

//Filtro de Espaçamento
StyleDictionary.registerFilter({
  name: "isSpacings",
  matcher: function (token) {
    return token.attributes.category === "spacing";
  },
});

//Filtro de opacidades / transparência
StyleDictionary.registerFilter({
  name: "isOpacities",
  matcher: function (token) {
    return token.type === "opacity";
  },
});

//Filtro de tamanhos de bordas
StyleDictionary.registerFilter({
  name: "isRadius",
  matcher: function (token) {
    return token.type === "custom-radius";
  },
});

//Filtro das cores base
StyleDictionary.registerFilter({
  name: "isColors",
  matcher: function (token) {
    return token.attributes.category === "color";
  },
});

//Filtro de fontes / tipografia
StyleDictionary.registerFilter({
  name: "isFonts",
  matcher: function (token) {
    return token.type === "custom-fontStyle";
  },
});

//Filtro de sombras
StyleDictionary.registerFilter({
  name: "isShadows",
  matcher: function (token) {
    return token.type === "custom-shadow";
  },
});

//Filtro de tamanhos
StyleDictionary.registerFilter({
  name: "isSizes",
  matcher: function (token) {
    return (
      token.type === "dimension" &&
      token.filePath === "tokens/globals/styleguide/sizes.json"
    );
  },
});

//Filtro de breakpoionts
StyleDictionary.registerFilter({
  name: "isBreakpoints",
  matcher: function (token) {
    return (
      token.type === "dimension" &&
      token.filePath === "tokens/globals/styleguide/breakpoints.json"
    );
  },
});

//Filtro de bordas
StyleDictionary.registerFilter({
  name: "isBorders",
  matcher: function (token) {
    return token.type === "custom-stroke";
  },
});

//================================================//

//Components

//Função de criação de filtros dos componentes
function filterComponent(component) {
  var filterComponentMatcher = {
    name: `is${capitalizeFirstLetter(component)}`,
    matcher: function (token) {
      return token.attributes.category === component;
    },
  };
  StyleDictionary.registerFilter(filterComponentMatcher);
}

//Criação de filtros de componentes baseados nos JSONs nas pastas de componentes
componentList.forEach(function (component) {
  filterComponent(component);
});

//================================================//

//Criação da função para gerar os styleguides

function getStyleDictionaryStyleguideConfig(brand) {
  return {
    // O arquivo Source sobrescreve os valores dos arquivos globais.

    // Logo, toda vez que precisar adicionar algum arquivo .json com alguma configuração personalizada de
    // tamanho, cor, fonte, etc. na pasta da marca, é só adicionar dentro da pasta do cliente específico,
    // que os valores do "tokens/globals" serão sobrescritos pelos da marca.

    source: [`tokens/brands/${brand}/*.json`],
    include: [`tokens/globals/styleguide/*.json`],
    platforms: {
      js: {
        transforms: rnTransforms,
        buildPath: `build/js/brands/${brand}/styleguide/`,
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
            name: "breakpoints",
            destination: `breakpoints.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isBreakpoints`,
          },
          {
            name: "opacities",
            destination: `opacities.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isOpacities`,
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
          {
            name: "shadows",
            destination: `shadows.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isShadows`,
          },
          {
            name: "sizes",
            destination: `sizes.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSizes`,
          },
          {
            name: "spacings",
            destination: `spacings.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isSpacings`,
          },
        ],
      },
    },
  };
}

//================================================//

//Criação da função que gera os componentes

function getStyleDictionaryComponentConfig(brand, component) {
  return {
    source: [
      `tokens/brands/${brand}/*.json`,
      `tokens/globals/component/*.json`,
    ],
    include: [`tokens/globals/styleguide/*.json`],
    platforms: {
      js: {
        transforms: rnTransforms,
        buildPath: `build/js/brands/${brand}/component/`,
        files: [
          {
            name: component,
            destination: `${component}.js`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `is${capitalizeFirstLetter(component)}`,
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

  console.log(`-------\nProcessing ${brand} styleguides`);
  StyleDictionary.extend(
    getStyleDictionaryStyleguideConfig(brand)
  ).buildAllPlatforms();

  console.log(`\nEnd ${brand} styleguides.`);
  console.log("\n==============================================");
  console.log(`\nProcessing ${brand} components...\n`);

  //Mapeamento dos arquivos dos componentes para gerar os tokens de cada aplicação

  componentList.map(function (component) {
    console.log(`-------\nProcessing ${component}`);
    StyleDictionary.extend(
      getStyleDictionaryComponentConfig(brand, component)
    ).buildAllPlatforms();
  });
  console.log(`\nEnd ${brand} components.`);
  console.log("\n==============================================");
  console.log(`\nEnd ${brand} processing.`);
});

console.log("\n==============================================");
console.log("\nBuild completed.");
