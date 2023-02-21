# DMDX

Simple and light MDX to TSX/JSX transformer for Deno that supports inline typescript.

## Installation

```sh
deno install --force --quiet --no-check --allow-read --allow-write --allow-run --allow-net=localhost,127.0.0.1,0.0.0.0,deno.land,cdn.deno.land --unstable -n dmdx https://deno.land/x/dmdx/mod.ts
```

## Usage

- Transform all .mdx file in a dir.
    ```sh
    dmdx transform ./dir
    ```

- Preview all .mdx file in a dir as ssr jsx rendered file.
    ```sh
    dmdx preview ./dir
    ```

- help
  ```sh
  dmdx -h
  ```