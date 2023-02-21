import { Command, DenoLandProvider, UpgradeCommand } from '../deps.ts'
import { transform } from './transform.ts'
import { preview } from './preview.ts'

export const cli = new Command()
	.name('dmdx')
	.version('0.2.2')
	.command('transform', transform)
	.command('preview', preview)
	.command(
		'upgrade',
		new UpgradeCommand({
			main: './cli/dmdx.ts',
			args: [
				'--allow-read',
				'--allow-write',
				'--allow-run',
				'--allow-net=localhost,127.0.0.1,0.0.0.0,deno.land,cdn.deno.land',
				'--unstable',
				'--quiet',
				'--no-check',
			],
			provider: new DenoLandProvider(),
		}),
	)

if (import.meta.main) {
	await cli.parse(Deno.args)
}
