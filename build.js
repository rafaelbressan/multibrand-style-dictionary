//Importantdo o Style Dictionary
const StyleDictionary = require("style-dictionary");
const { fileHeader } = StyleDictionary.formatHelpers;

//================================================//

//Concentrando açgumas settings e transformações dos tokens em uma só variável

const transformations = [
  "attribute/cti",
  "name/cti/camel",
  "size/object",
  "color/css",
];

const outputReferences = false;
const tokenHeader = "tokenHeader";

//================================================//

//Estruturando os caminhos para identificar os nomes dos arquivos em cada pasta

const fs = require("fs");
const brandFolders = fs.readdirSync("./tokens/brands");
const globalFolders = fs.readdirSync("./tokens/globals");

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

// //Filtro de Espaçamento
// StyleDictionary.registerFilter({
//   name: "isSpacings",
//   matcher: function (token) {
//     return token.attributes.category === "spacing";
//   },
// });

// //Filtro de opacidades / transparência
// StyleDictionary.registerFilter({
//   name: "isOpacities",
//   matcher: function (token) {
//     return token.type === "opacity";
//   },
// });

// //Filtro de tamanhos de bordas
// StyleDictionary.registerFilter({
//   name: "isRadius",
//   matcher: function (token) {
//     return token.type === "custom-radius";
//   },
// });

//Filtro das cores
StyleDictionary.registerFilter({
  name: "isColors",
  matcher: function (token) {
    return token.attributes.category === "color"
  },
});

// //Filtro de fontes / tipografia
// StyleDictionary.registerFilter({
//   name: "isFonts",
//   matcher: function (token) {
//     return token.attributes.category === "font"
//   },
// });

// //Filtro de sombras
// StyleDictionary.registerFilter({
//   name: "isShadows",
//   matcher: function (token) {
//     return token.attributes.category === "effect";
//   },
// });

// //Filtro de tamanhos
// StyleDictionary.registerFilter({
//   name: "isSizes",
//   matcher: function (token) {
//     return (
//       token.type === "dimension"
//     );
//   },
// });

// //Filtro de breakpoionts
// StyleDictionary.registerFilter({
//   name: "isBreakpoints",
//   matcher: function (token) {
//     return (
//       token.type === "breakpoint"
//     );
//   },
// });

// //Filtro de bordas
// StyleDictionary.registerFilter({
//   name: "isBorders",
//   matcher: function (token) {
//     return token.attributes.category === "border";
//   },
// });

//================================================//

//Criação da função para gerar os styleguides

function getStyleDictionaryStyleguideConfig(brand) {
  return {
    // O arquivo "source" sobrescreve os valores dos arquivos colocados em "include".

    // Logo, toda vez que precisar adicionar algum arquivo .json com alguma configuração personalizada de
    // tamanho, cor, fonte, etc. na pasta da marca, é só adicionar dentro da pasta da brand específica,
    // que os valores do "tokens/globals" serão sobrescritos pelos da marca.

    source: [`tokens/brands/${brand}/*.json`],
    include: [`tokens/globals/*.json`],
    platforms: {
      rn: {
        transforms: transformations,
        buildPath: `build/rn/${brand}/`,
        files: [
          {
            name: "colors",
            destination: `colors.css`,
            format: "javascript/reactnative",
            options: {
              outputReferences: outputReferences,
              fileHeader: tokenHeader,
            },
            filter: `isColors`,
          },
          // {
          //   name: "borders",
          //   destination: `borders.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isBorders`,
          // },
          // {
          //   name: "fonts",
          //   destination: `fonts.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isFonts`,
          // },
          // {
          //   name: "breakpoints",
          //   destination: `breakpoints.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isBreakpoints`,
          // },
          // {
          //   name: "opacities",
          //   destination: `opacities.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isOpacities`,
          // },
          // {
          //   name: "radius",
          //   destination: `radius.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isRadius`,
          // },
          // {
          //   name: "shadows",
          //   destination: `shadows.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isShadows`,
          // },
          // {
          //   name: "sizes",
          //   destination: `sizes.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isSizes`,
          // },
          // {
          //   name: "spacings",
          //   destination: `spacings.css`,
          //   format: "css/variables",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isSpacings`,
          // },
        ],
      },
      js: {
        transforms: transformations,
        buildPath: `build/js/${brand}/`,
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
          // {
          //   name: "borders",
          //   destination: `borders.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isBorders`,
          // },
          // {
          //   name: "fonts",
          //   destination: `fonts.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isFonts`,
          // },
          // {
          //   name: "breakpoints",
          //   destination: `breakpoints.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isBreakpoints`,
          // },
          // {
          //   name: "opacities",
          //   destination: `opacities.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isOpacities`,
          // },
          // {
          //   name: "radius",
          //   destination: `radius.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isRadius`,
          // },
          // {
          //   name: "shadows",
          //   destination: `shadows.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isShadows`,
          // },
          // {
          //   name: "sizes",
          //   destination: `sizes.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isSizes`,
          // },
          // {
          //   name: "spacings",
          //   destination: `spacings.js`,
          //   format: "javascript/reactnative",
          //   options: {
          //     outputReferences: outputReferences,
          //     fileHeader: tokenHeader,
          //   },
          //   filter: `isSpacings`,
          // },
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
  console.log(`\nEnd ${brand} processing.`);
});

console.log("\n==============================================");
console.log("\nBuild completed.");
