import { cli } from './cli/dmdx.ts'

export { toJSX } from './src/cli_utils.ts'
export { parse } from './src/parse.ts'
export { transform } from './src/transform.ts'

if (import.meta.main) {
	await cli.parse(Deno.args)
}
