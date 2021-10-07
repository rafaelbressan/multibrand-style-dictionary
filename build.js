//Importantdo o Style Dictionary
const StyleDictionary = require("style-dictionary");

//================================================//

//Concentrando as transformações dos tokens em uma só variável
const jsTransforms = [
  "attribute/cti",
  "name/cti/camel",
  "size/object",
  "color/css",
];

//================================================//

//Estruturando os caminhos para identificar os nomes dos arquivos em cada pasta

const fs = require("fs");
const brandFolders = fs.readdirSync("./tokens/brands");
const componentFolders = fs.readdirSync("./tokens/globals/component");
const componentList = componentFolders.map((element) => {
  return element.split(".json")[0];
});
const styleguideFolders = fs.readdirSync("./tokens/globals/styleguide")
const styleguideList = styleguideFolders.map((element) => {
  return element.split(".json")[0]
})

//================================================//

//Aplicanto um Header Customizável
StyleDictionary.registerFileHeader({
  name: "tokenHeader",
  fileHeader: function (defaultMessage) {
    return [...defaultMessage, `Made by Pagar.me BaaS`];
  },
});

//================================================//


//Criando filtros para cada transformação poder gerar seu arquivo específico (cor, fonte, tamanhos,etc.)

//Filtro de Espaçamento
StyleDictionary.registerFilter({
  name: "isSpacing",
  matcher: function (token) {
    return token.attributes.category === "spacing";
  },
});

//Filtro de opacidades / transparência
StyleDictionary.registerFilter({
  name: "isOpacity",
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
  name: "isColor",
  matcher: function (token) {
    return token.attributes.category === "color";
  },
});

//Filtro de fontes / tipografia
StyleDictionary.registerFilter({
  name: "isFont",
  matcher: function (token) {
    return token.type === "custom-fontStyle";
  },
});

//Filtro de sombras
StyleDictionary.registerFilter({
  name: "isShadow",
  matcher: function (token) {
    return token.type === "custom-shadow";
  },
});

//Filtro de dimensões / tamanhos
StyleDictionary.registerFilter({
  name: "isSize",
  matcher: function (token) {
    return token.type === "dimension";
  },
});

//================================================//

//Components

//Função de criação do nome do filtro dos tokens
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    source:[`tokens/brands/${brand}/*.json`],
    include: [`tokens/globals/styleguide/*.json`],
    platforms: {
      js: {
        transforms: jsTransforms,
        buildPath: `build/js/brands/${brand}/styleguide/`,
        files: [
          {
            name: "colors",
            destination: "colors.js",
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
            },
            filter: "isColor",
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
  };
}

//================================================//

//Criação da função que gera os componentes
function getStyleDictionaryComponentConfig(brand, component) {
  return {
    source: [`tokens/brands/${brand}/*.json`, `tokens/globals/component/*.json`],
    include: [`tokens/globals/styleguide/*.json`],
    platforms: {
      js: {
        transforms: jsTransforms,
        buildPath: `build/js/brands/${brand}/component/`,
        files: [
          {
            name: component,
            destination: `${component}.js`,
            format: "javascript/object",
            options: {
              outputReferences: true,
              fileHeader: "tokenHeader",
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

//Mapeamento dos arquivos de marca de cada cliente para gerar os tokens do styleguide
brandFolders.map(function (brand) {
  console.log("\n==============================================");
  console.log(`\nProcessing ${brand} styles`);

  //Criação dos brand styles
  StyleDictionary.extend(
    getStyleDictionaryStyleguideConfig(brand)
  ).buildAllPlatforms();

  //Mapeamento dos arquivos dos componentes para gerar os tokens de cada aplicação
  componentList.map(function (component) {
    StyleDictionary.extend(
      getStyleDictionaryComponentConfig(brand, component)
    ).buildAllPlatforms();
  });

  console.log(`\nEnd ${brand} processing`);
});

console.log("\n==============================================");
console.log("\nBuild completed!");
