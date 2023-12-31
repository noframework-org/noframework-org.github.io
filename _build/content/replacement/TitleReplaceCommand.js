import { DomReplaceCommand } from 'ssg-api'

/**
 * Appends suffix to every <title> tag
 */
export class TitleReplaceCommand extends DomReplaceCommand {

  constructor(suffix) {
    super("title")
    this.suffix = suffix
  }

  async createReplacer(context) {
    return {
      replace: (elem) => {
        if (!elem.textContent.endsWith(this.suffix)) {
          elem.textContent += ' - ' + this.suffix
        }
        return elem
      }
    }
  }
}
