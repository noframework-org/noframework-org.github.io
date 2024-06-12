import { ContentStep } from "ssg-api"
import { NavReplaceCommand } from "./replacement/NavReplaceCommand.js"

export class SecondContentStep extends ContentStep {

  constructor (contentRoots, output, searchCommand, getOutputPath) {
    super([
        {
          roots: contentRoots,
          replacements: [
            new NavReplaceCommand(searchCommand.index.pages)
          ],
          getOutputPath
        }
      ]
      , output)
  }

  shouldProcess (_context) {
    return true // TODO: Don't process unmodified files
  }
}
