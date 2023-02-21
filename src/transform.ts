import { Marked } from '../deps.ts'
import { Parsed } from '../types.ts'

export function transform(
	parsed: Parsed[],
	{ jsxImportSource }: { jsxImportSource?: string; type: 'jsx' | 'tsx' },
): string {
	const file: string[] = []
	if (jsxImportSource) {
		file.push(`/** @jsxImportSource ${jsxImportSource} */\n`)
	}
	const rest: string[] = []
	for (const entry of parsed) {
		if (entry.type === 'imports') file.push(entry.value)
		if (entry.type === 'exports') file.push(entry.value)
		if (entry.type === 'tag') rest.push(entry.value)
		if (entry.type === 'markdown') {
			rest.push(Marked.parse(entry.value, { escape: (s) => s }).content)
		}
	}
	file.push(`
    export default function() {
        return (
            <>
            ${rest.join('')}
            </>
        )
    }
    `)
	return file.join('')
}
