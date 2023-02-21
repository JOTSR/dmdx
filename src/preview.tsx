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
                    <style>{ defaultStyle }</style>
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

const defaultStyle = /*css*/`
    html {
        scroll-behaviour: smoot;
    }

    * {
        box-sizing: border-box,
    }

    :root {
        --color: #444;
        --bg-color: #eee;
        accent-color: #18e,
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --color: #eee;
            --bg-color: #444;
        }
    }

    body {
        position: absolute;
        margin: 0;
        padding: 1rem;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-size: 100%;
        color: var(--color);
        background-color: var(--bg-color);
    }
`