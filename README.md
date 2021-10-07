# StoneCo Style Dictionary

Esse projeto visa estruturar uma série de styleguides para todas as marcas da companhia StoneCo, incluindo Pagar.me, TON, Conta Stone e outros clientes de serviços de Banking as a Service. É só entrar no projeto e rodar:

```bash
npm run build
```

Você deve ver algo parecido com isso como *output*:

```bash
Build started...

==============================================

Processing default styles

js
✔︎ build/js/brands/default/styleguide/colors.js
✔︎ build/js/brands/default/styleguide/fonts.js
✔︎ build/js/brands/default/styleguide/opacities.js
✔︎ build/js/brands/default/styleguide/radius.js
✔︎ build/js/brands/default/styleguide/shadows.js
✔︎ build/js/brands/default/styleguide/sizes.js
✔︎ build/js/brands/default/styleguide/spacings.js

js
✔︎ build/js/brands/default/component/button.js

End default processing

==============================================

Processing pagarme styles

js
✔︎ build/js/brands/pagarme/styleguide/colors.js
✔︎ build/js/brands/pagarme/styleguide/fonts.js
✔︎ build/js/brands/pagarme/styleguide/opacities.js
✔︎ build/js/brands/pagarme/styleguide/radius.js
✔︎ build/js/brands/pagarme/styleguide/shadows.js
✔︎ build/js/brands/pagarme/styleguide/sizes.js
✔︎ build/js/brands/pagarme/styleguide/spacings.js

js
✔︎ build/js/brands/pagarme/component/button.js

End pagarme processing

==============================================

Build completed!
```

Good for you! You have now built your first style dictionary! Moving on, take a look at what we have built. This should have created a build directory and it should look like this:
```
design-tokens/
├─ node_modules/
├─ build/
│  ├─ js/
│  │  ├─ brands/
│  │  │  ├─ default/
│  │  │  │  ├─ component/
│  │  │  │  │  ├─ button.js
│  │  │  │  ├─ styleguide/
│  │  │  │  │  ├─ radius.js
│  │  │  │  │  ├─ colors.js
│  │  │  │  │  ├─ breakpoints.js
│  │  │  │  │  ├─ spacings.js
│  │  │  │  │  ├─ fonts.js
│  │  │  │  │  ├─ opacities.js
│  │  │  │  │  ├─ shadows.js
│  │  │  │  │  ├─ sizes.js
│  │  │  ├─ pagarme/
│  │  │  │  ├─ component/
│  │  │  │  │  ├─ button.js
│  │  │  │  ├─ styleguide/
│  │  │  │  │  ├─ radius.js
│  │  │  │  │  ├─ shadows.js
│  │  │  │  │  ├─ colors.js
│  │  │  │  │  ├─ sizes.js
│  │  │  │  │  ├─ spacings.js
│  │  │  │  │  ├─ breakpoints.js
│  │  │  │  │  ├─ opacities.js
│  │  │  │  │  ├─ fonts.js
├─ tokens/
│  ├─ brands/
│  │  ├─ default/
│  │  │  ├─ colors.json
│  │  │  ├─ fonts.json
│  │  ├─ pagarme/
│  │  │  ├─ colors.json
│  ├─ globals/
│  │  ├─ component/
│  │  │  ├─ button.json
│  │  ├─ styleguide/
│  │  │  ├─ radius.json
│  │  │  ├─ shadows.json
│  │  │  ├─ opacities.json
│  │  │  ├─ fonts.json
│  │  │  ├─ colors.json
│  │  │  ├─ sizes.json
│  │  │  ├─ spacings.json
│  │  │  ├─ breakpoints.json
├─ build.js
├─ .gitignore
├─ package-lock.json
├─ README.md
├─ package.json

```

Se você abrir o `build.js` vocÊ verá a plataforma JS e dentro dela uma série de exportações de arquivos para melhor organização. Cada arquivo contém seu filtro específico, registrado como `StyleDictionary.registerFilter` e os buildPaths para exportação em suas respectivas pastas finais. Os arquivos finais devem ser semelhantes a isso:

**Android**
```js
var opacities = {
  "opacity": {
    "opaquest": {
      "type": "opacity",
      "value": 0.92,
      "filePath": "tokens/globals/styleguide/opacities.json",
      "isSource": false,
      "original": {
        "type": "opacity",
        "value": 0.92
      },
      "name": "opacityOpaquest",
      "attributes": {
        "category": "opacity",
        "type": "opaquest"
      },
      "path": [
        "opacity",
        "opaquest"
      ]
    }, ... // E assim por diante
  }
}
```

O que aconteceu?



Pretty nifty! This shows a few things happening:
1. The build system does a deep merge of all the token JSON files defined in the `source` attribute of `config.js`. This allows you to split up the token JSON files however you want. There are 2 JSON files with `color` as the top level key, but they get merged properly.
1. The build system resolves references to other design tokens. `{size.font.medium.value}` gets resolved properly.
1. The build system handles references to token values in other files as well as you can see in `tokens/color/font.json`.
