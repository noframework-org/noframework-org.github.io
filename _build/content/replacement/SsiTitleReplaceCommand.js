import { SsiEchoVarReplaceCommand } from 'ssg-api'

/**
 * Replaces "<!--#echo var="title" -->" by the page's <title> content,
 * with a link if there's a <meta name="url"> content.
 */
export class SsiTitleReplaceCommand extends SsiEchoVarReplaceCommand {

  constructor() {
    super("title")
  }

  async createReplacer(context) {
    return {
      replace: () => {
        return context.file.title
      }
    }
  }
}
