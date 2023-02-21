import { Parsed } from '../types.ts'

const buffer = {
	_value: [] as string[],
	add(char: string) {
		this._value.push(char)
	},
	clear() {
		this._value = []
	},
	get value() {
		return this._value.join('')
	},
	parse(regexp: RegExp, registry: Parsed[], type: Parsed['type']) {
		const [_, prev, value] = this.value.match(regexp) ?? []
		if (prev) {
			registry.push({
				type: 'markdown',
				value: prev,
			})
		}
		if (value) {
			registry.push({
				type,
				value,
			})
			this.clear()
		}
		return value !== undefined
	},
}

export function parse(file: string): Parsed[] {
	const parsed: Parsed[] = []
	for (const char of file.split('')) {
		buffer.add(char)
		// import/export statement
		if (buffer.parse(/()(import\s.+\r?\n)/, parsed, 'imports')) continue
		//TODO support multiline export statement
		if (buffer.parse(/()(export\s.+\r?\n)/, parsed, 'exports')) continue

		// self closed tag
		if (buffer.parse(/([^]+)(<\w+.*\/>\r?\n?)/, parsed, 'tag')) continue

		// tag pair
		if (buffer.parse(/([^]+)(<\w+.*>\r?\n?)/, parsed, 'tag')) continue
		if (buffer.parse(/([^]+)(<\/\w+>\r?\n?)/, parsed, 'tag')) continue
	}
	parsed.push({
		type: 'markdown',
		value: buffer.value,
	})
	return parsed
}
