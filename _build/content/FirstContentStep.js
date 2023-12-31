import { ContentStep, SsiIncludeReplaceCommand } from 'ssg-api'
import { SsiTitleReplaceCommand } from './replacement/SsiTitleReplaceCommand.js'
import { TitleReplaceCommand } from './replacement/TitleReplaceCommand.js'
import { VarReplaceCommand } from './replacement/VarReplaceCommand.js'
import { NavReplaceCommand } from './replacement/NavReplaceCommand.js'

export class FirstContentStep extends ContentStep {

  constructor (contentRoots, output, searchCommand) {
    super([
        {
          roots: contentRoots,
          replacements: [
            new SsiIncludeReplaceCommand(),
            new SsiTitleReplaceCommand(),
            new VarReplaceCommand(),
            new TitleReplaceCommand('noframework'),
            searchCommand,
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
