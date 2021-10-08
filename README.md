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
Os arquivos gerados pelo Style Dictionary da plataforma `js` podem ser vistos nos seus diretórios correspondentes. Se observar os diretórios criados dentro de `build`, deve ter uma estrutura semelhante à exemplificada abaixo:
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

Se você abrir o `build.js` vocÊ verá a plataforma JS e dentro dela uma série de exportações de arquivos para melhor organização. Cada arquivo contém seu filtro específico, registrado como `StyleDictionary.registerFilter` e os buildPaths para exportação em suas respectivas pastas finais. Os arquivos finais, como por exemplo o arquivo de `opacities.js`, devem ser semelhantes a isso:

**JavaScript**
```js
export default opacities = {
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

## O que aconteceu?

1. O sistema realiza um merge de todos os arquivos JSON definidos no atributo `source` especificado em `build.js`. Assim é possível dividir e organizar os arquivos JSON que você quiser da maneira que quiser, o build sempre vai realizar um merge geral no final.
2. O sistema resolve todas as referências, como por exemplo `{font.button.small.value}` em `button.json`. Ele já está especificado que, em alguns casos, como por exemplo na exportação de CSS ou SCSS, é possível ver a referência, com o atributo `outputReferences: true`.
3. O sistema exporta para o formato desejado, no caso, o formato específico para React Native criado internamente `javascript/reactnative`. No entanto, pode-se gerar tokens para quaisquer tipos de plataformas, como CSS, SCSS e em outros formatos customizados também.

---

Você pode consultar mais da documentação em [Amazon Style Dictionary](https://amzn.github.io/style-dictionary/#/README) e conferir a aplicação dos tokens no [Design System da Pagar.me](https://zeroheight.com/7aba22741).
