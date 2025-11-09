# Multibrand Style Dictionary

[English](#english) | [Português](#português)

---

## English

### Overview

This project is a comprehensive Style Dictionary implementation for managing design tokens across multiple brands within the StoneCo ecosystem, including Pagar.me, TON, Conta Stone, and other Banking as a Service (BaaS) clients. It provides a centralized system for maintaining consistent design tokens that can be exported to multiple platforms and formats.

### Features

- **Multi-brand support**: Manage tokens for multiple brands from a single codebase
- **Multiple output formats**: Generate tokens for React Native, JavaScript modules, and JSON
- **Custom transforms**: Automatic pixel-to-rem conversions for accessibility and responsive design
- **Flexible naming conventions**: Support for both kebab-case and CONSTANT_CASE naming
- **Token categories**: Colors, fonts, spacing, sizes, borders, radius, effects, breakpoints, and opacity
- **Brand-specific overrides**: Easy customization per brand while maintaining global defaults

### Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd multibrand-style-dictionary
```

2. Install dependencies:
```bash
npm install
```

### Quick Start

Build all design tokens for all brands:

```bash
npm run build
```

Watch for changes and rebuild automatically:

```bash
npm run watch
```

Clean the build directory:

```bash
npm run clean
```

### Project Structure

```
multibrand-style-dictionary/
├── build.js                    # Main build configuration and custom transforms
├── package.json                # Project dependencies and scripts
├── tokens/                     # Source design tokens
│   ├── brands/                 # Brand-specific token overrides
│   │   └── [brand-name]/       # Individual brand folders (e.g., pagarme/)
│   │       ├── colors.json     # Brand color overrides
│   │       └── fonts.json      # Brand font overrides
│   ├── plugin/                 # Base tokens exported from Figma
│   │   ├── colors.json         # Base color palette
│   │   ├── fonts.json          # Typography definitions
│   │   ├── spacing.json        # Spacing scale
│   │   ├── size.json           # Size values
│   │   ├── borders.json        # Border definitions
│   │   ├── radius.json         # Border radius values
│   │   ├── effects.json        # Shadow effects
│   │   └── breakpoints.json    # Responsive breakpoints
│   └── replacers/              # Semantic token mappings
│       ├── spacing.json        # Semantic spacing tokens
│       ├── radius.json         # Semantic radius tokens
│       ├── borders.json        # Semantic border tokens
│       └── opacity.json        # Opacity values
└── build/                      # Generated output files (gitignored)
    ├── rn/                     # React Native tokens
    │   └── [brand]/            # Per-brand output
    │       ├── colors.js
    │       ├── fonts.js
    │       └── ...
    ├── js/                     # JavaScript ES6 modules (kebab-case)
    │   └── [brand]/
    ├── jsc/                    # JavaScript ES6 modules (CONSTANT_CASE)
    │   └── [brand]/
    └── json/                   # JSON flat format
        └── [brand]/
```

### Token Organization

#### Plugin Tokens
Located in `tokens/plugin/`, these are the base design tokens typically exported from Figma. They define the foundational design values used across all brands.

#### Replacer Tokens
Located in `tokens/replacers/`, these provide semantic mappings and alternative token definitions that can reference plugin tokens.

#### Brand Tokens
Located in `tokens/brands/[brand-name]/`, these allow brand-specific overrides of global tokens. Values defined here take precedence over plugin and replacer tokens.

### Custom Transforms

The build system includes several custom transforms for converting design token values:

#### `font/rem`
Converts font-size, line-height, and letter-spacing values from pixels to rem units.
- **Base font size**: 16px (configurable)
- **Example**: `24px` → `1.5rem`

#### `spacing/pxToRem`
Converts spacing values from pixels to rem units.
- **Applied to**: Margin, padding, gap values
- **Example**: `16px` → `1rem`

#### `size/pxToRem`
Converts size values from pixels to rem units.
- **Applied to**: Width, height values

#### `border/pxToRem`
Converts border-weight values from pixels to rem units.
- **Applied to**: Border widths

#### `radius/pxToRem`
Converts border-radius values from pixels to rem units.
- **Applied to**: Border radius values

#### `breakpoint/px`
Ensures breakpoint values are formatted with px units.
- **Example**: `768` → `768px`

### Output Formats

#### React Native (rn/)
Custom format optimized for React Native applications. Exports tokens as default exports with nested object structure.

```javascript
export default colors = {
  "color": {
    "base": {
      "turquoise": {
        "20": {...}
      }
    }
  }
}
```

#### JavaScript Modules (js/ and jsc/)
Flat format ES6 modules suitable for web applications.
- **js/**: Uses kebab-case naming (e.g., `color-base-turquoise-20`)
- **jsc/**: Uses CONSTANT_CASE naming (e.g., `COLOR_BASE_TURQUOISE_20`)

```javascript
export const colorBaseTurquoise20 = "rgba(156, 228, 237, 1)";
```

#### JSON (json/)
Flat JSON format for maximum compatibility.

```json
{
  "color-base-turquoise-20": "rgba(156, 228, 237, 1)"
}
```

### Custom Filters

The build system uses custom filters to organize tokens by category:

- **isColors**: Filters color tokens
- **isFonts**: Filters font-family tokens
- **isFontStyles**: Filters font-size, line-height, letter-spacing
- **isSpacing**: Filters spacing/margin/padding tokens
- **isSize**: Filters width/height tokens
- **isBreakpoint**: Filters responsive breakpoint tokens
- **isEffects**: Filters shadow/elevation effects
- **isOpacity**: Filters opacity values
- **isBorders**: Filters border definitions
- **isRadius**: Filters border-radius values

### Adding a New Brand

1. Create a new directory in `tokens/brands/`:
```bash
mkdir tokens/brands/your-brand-name
```

2. Add brand-specific token files:
```bash
# Example: Override colors for your brand
tokens/brands/your-brand-name/colors.json
```

3. Define your overrides following the same structure as plugin tokens:
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

4. Run the build:
```bash
npm run build
```

Your brand tokens will be generated in `build/[format]/your-brand-name/`.

### Build Output Example

When you run `npm run build`, you should see output similar to:

```
Build started...

==============================================

Processing pagarme styles...

rn
✔︎ build/rn/pagarme/colors.js
✔︎ build/rn/pagarme/fonts.js
✔︎ build/rn/pagarme/spacing.js
...

==============================================

End pagarme processing.

==============================================

Build completed.
```

### Troubleshooting

#### Error: Cannot find module 'style-dictionary'
Run `npm install` to install all dependencies.

#### Error: ENOENT: no such file or directory, scandir './tokens/brands'
Create the `tokens/brands/` directory and add at least one brand folder with token files.

#### Tokens not being overridden
Ensure your brand tokens follow the exact same structure as the base tokens you want to override. The token paths must match exactly.

#### Build fails with parsing error
Validate your JSON files for syntax errors. Each token must have a `value` and `type` property.

### API Reference

For detailed information about custom transforms, filters, and formatters, see [ARCHITECTURE.md](./ARCHITECTURE.md).

### Contributing

When contributing to this project:

1. Ensure all JSON files are valid and properly formatted
2. Test your changes by running `npm run build`
3. Update documentation for any new features or changes
4. Follow the existing code style and structure

### Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Pagar.me Design System](https://zeroheight.com/7aba22741)

---

## Português

### Visão Geral

Este projeto estrutura uma série de styleguides para todas as marcas da companhia StoneCo, incluindo Pagar.me, TON, Conta Stone e outros clientes de serviços de Banking as a Service (BaaS). Ele fornece um sistema centralizado para manter tokens de design consistentes que podem ser exportados para múltiplas plataformas e formatos.

### Funcionalidades

- **Suporte multi-marca**: Gerencie tokens para múltiplas marcas a partir de uma única base de código
- **Múltiplos formatos de saída**: Gere tokens para React Native, módulos JavaScript e JSON
- **Transformações customizadas**: Conversões automáticas de pixel para rem para acessibilidade e design responsivo
- **Convenções de nomenclatura flexíveis**: Suporte para kebab-case e CONSTANT_CASE
- **Categorias de tokens**: Cores, fontes, espaçamentos, tamanhos, bordas, raios, efeitos, breakpoints e opacidade
- **Sobrescritas específicas por marca**: Fácil customização por marca mantendo valores globais padrão

### Pré-requisitos

- **Node.js**: v14 ou superior
- **npm**: v6 ou superior

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd multibrand-style-dictionary
```

2. Instale as dependências:
```bash
npm install
```

### Início Rápido

Construa todos os tokens de design para todas as marcas:

```bash
npm run build
```

Observe mudanças e reconstrua automaticamente:

```bash
npm run watch
```

Limpe o diretório de build:

```bash
npm run clean
```

### Estrutura do Projeto

```
multibrand-style-dictionary/
├── build.js                    # Configuração principal e transformações customizadas
├── package.json                # Dependências e scripts do projeto
├── tokens/                     # Tokens de design fonte
│   ├── brands/                 # Sobrescritas específicas por marca
│   │   └── [nome-marca]/       # Pastas individuais de marca (ex: pagarme/)
│   │       ├── colors.json     # Sobrescritas de cores da marca
│   │       └── fonts.json      # Sobrescritas de fontes da marca
│   ├── plugin/                 # Tokens base exportados do Figma
│   │   ├── colors.json         # Paleta de cores base
│   │   ├── fonts.json          # Definições de tipografia
│   │   ├── spacing.json        # Escala de espaçamento
│   │   ├── size.json           # Valores de tamanho
│   │   ├── borders.json        # Definições de borda
│   │   ├── radius.json         # Valores de border radius
│   │   ├── effects.json        # Efeitos de sombra
│   │   └── breakpoints.json    # Breakpoints responsivos
│   └── replacers/              # Mapeamentos semânticos de tokens
│       ├── spacing.json        # Tokens de espaçamento semânticos
│       ├── radius.json         # Tokens de raio semânticos
│       ├── borders.json        # Tokens de borda semânticos
│       └── opacity.json        # Valores de opacidade
└── build/                      # Arquivos de saída gerados (gitignored)
    ├── rn/                     # Tokens React Native
    │   └── [marca]/            # Saída por marca
    │       ├── colors.js
    │       ├── fonts.js
    │       └── ...
    ├── js/                     # Módulos JavaScript ES6 (kebab-case)
    │   └── [marca]/
    ├── jsc/                    # Módulos JavaScript ES6 (CONSTANT_CASE)
    │   └── [marca]/
    └── json/                   # Formato JSON plano
        └── [marca]/
```

### Organização dos Tokens

#### Tokens Plugin
Localizados em `tokens/plugin/`, estes são os tokens de design base tipicamente exportados do Figma. Eles definem os valores de design fundamentais usados em todas as marcas.

#### Tokens Replacers
Localizados em `tokens/replacers/`, estes fornecem mapeamentos semânticos e definições alternativas de tokens que podem referenciar tokens plugin.

#### Tokens de Marca
Localizados em `tokens/brands/[nome-marca]/`, estes permitem sobrescritas específicas por marca dos tokens globais. Valores definidos aqui têm precedência sobre tokens plugin e replacer.

### Transformações Customizadas

O sistema de build inclui várias transformações customizadas para converter valores de tokens de design:

#### `font/rem`
Converte valores de font-size, line-height e letter-spacing de pixels para unidades rem.
- **Tamanho de fonte base**: 16px (configurável)
- **Exemplo**: `24px` → `1.5rem`

#### `spacing/pxToRem`
Converte valores de espaçamento de pixels para unidades rem.
- **Aplicado a**: Valores de margin, padding, gap
- **Exemplo**: `16px` → `1rem`

#### `size/pxToRem`
Converte valores de tamanho de pixels para unidades rem.
- **Aplicado a**: Valores de width, height

#### `border/pxToRem`
Converte valores de border-weight de pixels para unidades rem.
- **Aplicado a**: Larguras de borda

#### `radius/pxToRem`
Converte valores de border-radius de pixels para unidades rem.
- **Aplicado a**: Valores de raio de borda

#### `breakpoint/px`
Garante que valores de breakpoint sejam formatados com unidades px.
- **Exemplo**: `768` → `768px`

### Formatos de Saída

#### React Native (rn/)
Formato customizado otimizado para aplicações React Native. Exporta tokens como exportações padrão com estrutura de objeto aninhada.

```javascript
export default colors = {
  "color": {
    "base": {
      "turquoise": {
        "20": {...}
      }
    }
  }
}
```

#### Módulos JavaScript (js/ e jsc/)
Formato plano de módulos ES6 adequado para aplicações web.
- **js/**: Usa nomenclatura kebab-case (ex: `color-base-turquoise-20`)
- **jsc/**: Usa nomenclatura CONSTANT_CASE (ex: `COLOR_BASE_TURQUOISE_20`)

```javascript
export const colorBaseTurquoise20 = "rgba(156, 228, 237, 1)";
```

#### JSON (json/)
Formato JSON plano para máxima compatibilidade.

```json
{
  "color-base-turquoise-20": "rgba(156, 228, 237, 1)"
}
```

### Filtros Customizados

O sistema de build usa filtros customizados para organizar tokens por categoria:

- **isColors**: Filtra tokens de cor
- **isFonts**: Filtra tokens de font-family
- **isFontStyles**: Filtra font-size, line-height, letter-spacing
- **isSpacing**: Filtra tokens de spacing/margin/padding
- **isSize**: Filtra tokens de width/height
- **isBreakpoint**: Filtra tokens de breakpoint responsivo
- **isEffects**: Filtra efeitos de shadow/elevation
- **isOpacity**: Filtra valores de opacidade
- **isBorders**: Filtra definições de borda
- **isRadius**: Filtra valores de border-radius

### Adicionando uma Nova Marca

1. Crie um novo diretório em `tokens/brands/`:
```bash
mkdir tokens/brands/nome-sua-marca
```

2. Adicione arquivos de tokens específicos da marca:
```bash
# Exemplo: Sobrescrever cores para sua marca
tokens/brands/nome-sua-marca/colors.json
```

3. Defina suas sobrescritas seguindo a mesma estrutura dos tokens plugin:
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

4. Execute o build:
```bash
npm run build
```

Os tokens da sua marca serão gerados em `build/[formato]/nome-sua-marca/`.

### Exemplo de Saída do Build

Quando você executa `npm run build`, deve ver uma saída similar a:

```
Build started...

==============================================

Processing pagarme styles...

rn
✔︎ build/rn/pagarme/colors.js
✔︎ build/rn/pagarme/fonts.js
✔︎ build/rn/pagarme/spacing.js
...

==============================================

End pagarme processing.

==============================================

Build completed.
```

### Solução de Problemas

#### Erro: Cannot find module 'style-dictionary'
Execute `npm install` para instalar todas as dependências.

#### Erro: ENOENT: no such file or directory, scandir './tokens/brands'
Crie o diretório `tokens/brands/` e adicione pelo menos uma pasta de marca com arquivos de tokens.

#### Tokens não estão sendo sobrescritos
Certifique-se de que seus tokens de marca seguem exatamente a mesma estrutura dos tokens base que você quer sobrescrever. Os caminhos dos tokens devem corresponder exatamente.

#### Build falha com erro de parsing
Valide seus arquivos JSON para erros de sintaxe. Cada token deve ter uma propriedade `value` e `type`.

### Referência da API

Para informações detalhadas sobre transformações customizadas, filtros e formatadores, veja [ARCHITECTURE.md](./ARCHITECTURE.md).

### Contribuindo

Ao contribuir para este projeto:

1. Certifique-se de que todos os arquivos JSON são válidos e formatados corretamente
2. Teste suas mudanças executando `npm run build`
3. Atualize a documentação para quaisquer novos recursos ou mudanças
4. Siga o estilo e estrutura de código existente

### Recursos

- [Documentação do Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Design System da Pagar.me](https://zeroheight.com/7aba22741)
