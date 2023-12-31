import { RegexReplaceCommand } from 'ssg-api'

class RegexReplacer {

  constructor (context) {
    this.context = context
  }

  replace (_match, ...args) {
    const fullKey = args[0]
    const keys = fullKey.split('.')
    let i = 0
    let key = keys[i]
    let result = this.context.getVar(key)
    while (i + 1 < keys.length) {
      key = keys[++i]
      result = result[key]
    }
    return result || ''
  }
}

export class VarReplaceCommand extends RegexReplaceCommand {

  constructor () {
    super(new RegExp(`\\$\{(.*?)\}`, 'gs'))
  }

  async createReplacer (context) {
    return new RegexReplacer(context)
  }
}
