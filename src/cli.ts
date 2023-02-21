import { expandGlob, path } from '../deps.ts'
import { parse } from './parse.ts'
import { preview } from './preview.tsx'
import { transform } from './transform.ts'

export async function cliTransform(
	directoryOrFile: string,
	{ jsxImportSource, type, fmt }: Partial<ToJsxOptions>,
) {
	const glob = directoryOrFile.endsWith('.mdx')
		? directoryOrFile
		: path.join(directoryOrFile, '*.mdx')
	for await (const file of expandGlob(glob)) {
		if (file.isFile) {
			const { dir, name } = path.parse(file.path)
			const outName = `${path.join(dir, name)}.${type}`
			toJSX(file.path, outName, { jsxImportSource, type, fmt })
		}
	}
}
export async function previewAndclear(
	directoryOrFile: string,
	{ type, port, view }: {
		type: ToJsxOptions['type']
		port: number
		view: 'webview' | 'browser'
	},
) {
	const glob = directoryOrFile.endsWith('.mdx')
		? directoryOrFile
		: path.join(directoryOrFile, '*.mdx')
	for await (const file of expandGlob(glob)) {
		if (file.isFile) {
			const { dir, name } = path.parse(file.path)
			const filenName = `${path.join(dir, name)}.${type}`
			await toJSX(file.path, filenName, {
				jsxImportSource: 'https://esm.sh/preact@10.11.3',
				type,
			})
			await preview(filenName, { port, view })
			Deno.remove(filenName)
		}
	}
}

export async function toJSX(
	input: string,
	output: string,
	{ jsxImportSource, type, fmt }: Partial<ToJsxOptions>,
) {
	const mdx = await Deno.readTextFile(input)
	const parsed = parse(mdx)
	const jsx = transform(parsed, {
		jsxImportSource,
		type: type ?? defaultToJsxOptions.type,
	})
	Deno.writeTextFile(output, jsx)
	if (fmt) {
		const shell = Deno.build.os === 'windows' ? 'cmd' : 'bash'
		const cmd = Deno.build.os === 'windows' ? '/c' : '-c'
		new Deno.Command(shell, {
			args: [
				cmd,
				`${fmt ?? defaultToJsxOptions} ${output}`,
			],
		}).spawn()
	}
}

export type ToJsxOptions = {
	jsxImportSource?: string
	type: 'tsx' | 'jsx'
	fmt: false | string
}

const defaultToJsxOptions = {
	type: 'tsx',
	fmt: 'deno fmt',
} satisfies ToJsxOptions
