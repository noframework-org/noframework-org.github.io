import path from 'path'
import { ContentStep, CopyStep, DefaultLogger, Ssg, SsgContextImpl, SsgFile, SsiIncludeReplaceCommand } from 'ssg-api'
import { SsiTitleReplaceCommand } from './SsiTitleReplaceCommand.js'
import { TitleReplaceCommand } from './TitleReplaceCommand.js'

const context = new SsgContextImpl('en', new Map(), 'noframework', new DefaultLogger('noframework'))
const config = {
  outDir: 'out'
}
/**
 * @type {string[]}
 */
const contentRoots = [
  'index.html',
  'how/**/*.html',
  'read/**/*.html'
]
const contentReplacements = [
  new SsiIncludeReplaceCommand(),
  new SsiTitleReplaceCommand(),
  new TitleReplaceCommand('noframework')
]
const contentConfigs = [
  {
    roots: contentRoots,
    replacements: contentReplacements,
    /**
     * @param context
     * @return {SsgFile}
     */
    getOutputFile (context) {
      return context.outputFile
    }
  }
]
const outputFunc = async (context, info, outDir = config.outDir + '/') => {
  // TODO: Fix this
  if (info.name.startsWith(outDir)) {
    if (info.name.startsWith(path.join(outDir, outDir))) {
      info.name = info.name.substring(outDir.length)
    }
  } else {
    info.name = outDir + info.name
  }
  try {
    context.log('Writing', info.name)
    await info.write()
  } catch (e) {
    context.error(info.name, e)
  }
}

class NoFrameworkContentStep extends ContentStep {
  constructor (contents, output) {
    super(contents, output)
  }

  shouldProcess (_context) {
    return true // TODO: Don't process unmodified files
  }
}

new Ssg(config)
  .add(new NoFrameworkContentStep(contentConfigs, outputFunc))
  .add(new CopyStep(['logo.png', 'index.css', 'index.js'], config, { ignore: ['node_modules/**', 'out/**'] }))
  .start(context)
  .then(result => context.log('Completed', result))
  .catch(err => {
    try {
      context.error(err, context.inputFile.name, '=>', context.outputFile?.name)
    } catch (e) {
      context.error(err)
    }
  })
