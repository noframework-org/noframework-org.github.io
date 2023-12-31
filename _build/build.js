import path from 'path'
import { CopyStep, DefaultLogger, Ssg, SsgContextImpl } from 'ssg-api'
import { PackageJsonStep } from './PackageJsonStep.js'
import { NoFrameworkContentStep } from './content/NoFrameworkContentStep.js'

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

new Ssg(config)
  .add(new PackageJsonStep('package.json'))
  .add(new NoFrameworkContentStep(contentRoots, outputFunc))
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
