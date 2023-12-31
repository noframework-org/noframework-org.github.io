import { ContentStep, SsiIncludeReplaceCommand } from 'ssg-api'
import { SsiTitleReplaceCommand } from './replacement/SsiTitleReplaceCommand.js'
import { TitleReplaceCommand } from './replacement/TitleReplaceCommand.js'
import { VarReplaceCommand } from './replacement/VarReplaceCommand.js'

export class NoFrameworkContentStep extends ContentStep {
  constructor (contentRoots, output) {
    super([
        {
          roots: contentRoots,
          replacements: [
            new SsiIncludeReplaceCommand(),
            new SsiTitleReplaceCommand(),
            new VarReplaceCommand(),
            new TitleReplaceCommand('noframework'),
          ],
          getOutputFile (context) {
            return context.outputFile
          }
        }
      ]
      , output)
  }

  shouldProcess (_context) {
    return true // TODO: Don't process unmodified files
  }
}
