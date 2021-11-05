
module.exports = (brand, rnTransforms) => {
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