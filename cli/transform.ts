import { Command, EnumType } from '../deps.ts'
import { cliTransform } from '../src/cli_utils.ts'

export const transform = new Command()
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
