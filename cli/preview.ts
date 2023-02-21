import { Command, EnumType } from '../deps.ts'
import { previewAndclear } from '../src/cli_utils.ts'
import { handler } from '../src/preview.tsx'

export const preview = new Command()
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
