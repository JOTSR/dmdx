/** @jsxImportSource https://esm.sh/preact@10.11.3 */
import { path, render } from '../deps.ts'
import { open } from '../deps.ts'

export async function preview(
	file: string,
	{ port, view }: { port: number; view: 'webview' | 'browser' },
) {
	const { default: App } = await import(path.toFileUrl(file).href)

	function Shell() {
		return (
			<html>
				<head>
					<title>preview - {path.parse(file).name}</title>
				</head>
				<body>
					<App />
				</body>
			</html>
		)
	}

	const app = render(Shell(), {}, { pretty: true })

	routes.set(
		`/${encodeURIComponent(file)}`,
		new Response(app, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
			},
		}),
	)

	open(`http://localhost:${port}/${encodeURIComponent(file)}`)
}

const routes: Map<string, Response> = new Map()

export function handler(req: Request): Response {
	return routes.get(new URL(req.url).pathname) ?? new Response(null)
}
