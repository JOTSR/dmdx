export { toJSX } from './src/cli.ts'
export { parse } from './src/parse.ts'
export { transform } from './src/transform.ts'

import { Command, DenoLandProvider, EnumType, UpgradeCommand } from './deps.ts'
import { cliTransform, previewAndclear } from './src/cli.ts'
import { handler } from "./src/preview.tsx";

if (import.meta.main) {
	const transform = new Command()
		.name('transform')
		.description('Transform a .mdx file into a jsx or tsx file.')
		.arguments('<path:file>')
		.type('type', new EnumType(['tsx', 'jsx']))
		.option('-t, --type <code:type>', 'Type of used code.', {
			default: 'tsx',
		})
		.option(
			'-c, --source <source:string>',
			'Value for "jsxImportSource" comment directive.',
			{
				default: 'https://esm.sh/preact@10.11.3',
			},
		)
		.option(
			'-f, --fmt [format:string]',
			'Formating cli command. (-f use "deno fmt" else -f="your fmt")',
		)
		.action(({ type, source: jsxImportSource, fmt }, path) => {
			cliTransform(
				path,
				{
					type,
					jsxImportSource,
					fmt: fmt === true ? 'deno fmt' : fmt,
				} as {
					type: 'tsx' | 'jsx'
				},
			)
		})

	const preview = new Command()
		.name('preview')
		.description('Serve a ssr preview of a .mdx file.')
		.arguments('<path:file>')
		.type('type', new EnumType(['tsx', 'jsx']))
		.option('-t, --type <code:type>', 'Type of used code.', {
			default: 'tsx',
		})
		// .type('view', new EnumType(['webview', 'browser']))
		// .option(
		//     '-w, --view <view_type:view>','Preview in browser or webview',
		//     { default: 'browser' }
		// )
		.option('-p, --port <port:number>', 'Server port', { default: 8735 })
		.action(async ({ type, port }, path) => {
			await previewAndclear(
				path,
				{
					type,
					port,
					view: 'browser',
				} as {
					type: 'tsx' | 'jsx'
					view: 'browser' | 'webview'
					port: number
				},
			)
            Deno.serve({ port }, handler)
		})

	await new Command()
		.name('dmdx')
		.version('0.1.0')
		.command('transform', transform)
		.command('preview', preview)
        .command('upgrade', new UpgradeCommand({
            main: 'mod.ts',
            args: ['--allow-read', '--allow-write', '--allow-run', '--allow-net=localhost,127.0.0.1,0.0.0.0,deno.land,cdn.deno.land', '--unstable', '-n dmdx', '--quiet', '--no-check'],
            provider: new DenoLandProvider()
        }))
		.parse(Deno.args)
}
