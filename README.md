# Indecisive

> Input how much each factor is weighed, and compare each option only W.R.T. a
> single factor. Let the math decide the rest.

[Demo](https://indecisive.hedy.dev/)

*WIP*

## stack

- js - SolidJS (a *teeny* little bloat) (but I get to have the possibly
  delusional sense of perfectly managed, *fine-grained reactivity*)
- css - bulma (a *little* blaot) (but I get to write 0 lines of custom css)

## build

the resulting output is < 100kB in total (HTML + CSS + JS + assets **before
gzip**) thanks to minification and purging unused styles.

- build: `pnpm build`
- live reloading server (vite): `pnpm dev`

<!--
rsync -rv dist/* pgs.sh:/indecisive
-->
