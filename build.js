import path from 'path'
import { ContentStep, DefaultLogger, Ssg, SsgContextImpl, SsgFile, SsiIncludeReplaceCommand } from 'ssg-api'

const context = new SsgContextImpl('en', new Map(), 'noframework', new DefaultLogger('noframework'))
/**
 * @type {SsgConfig}
 */
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
/**
 * @type {ReplaceCommand[]}
 */
const contentReplacements = [
  new SsiIncludeReplaceCommand()
]
/**
 * @type {ContentStepConfig[]}
 */
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
/**
 * @type {OutputFunc}
 */
const outputFunc
  /**
   * @param {SsgContext} context
   * @param {SsgFile} info
   * @param {string} outDir
   * @return {Promise<void>}
   */
  = async (context, info, outDir = config.outDir + '/') => {
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
  .start(context)
  .then(result => context.log('Completed', result))
  .catch(err => {
    try {
      context.error(err, context.inputFile.name, '=>', context.outputFile?.name)
    } catch (e) {
      context.error(err)
    }
  })
