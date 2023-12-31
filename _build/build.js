import path from 'path'
import { CopyStep, DefaultLogger, Ssg, SsgContextImpl } from 'ssg-api'
import { PackageJsonStep } from './PackageJsonStep.js'
import { NoFrameworkContentStep } from './content/NoFrameworkContentStep.js'
import { SearchIndexStep } from './SearchIndexStep.js'
import { SearchCommand } from './content/replacement/SearchCommand.js'

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
const searchCommand = new SearchCommand({
  notIndexedUrls: [],
  indexContent: 'out/contentsIndex.json'
})
new Ssg(config)
  .add(new PackageJsonStep('package.json'))
  .add(new NoFrameworkContentStep(contentRoots, outputFunc, searchCommand))
  .add(new CopyStep(['logo.png', 'index.css', 'index.js', 'search.js'], config, { ignore: ['node_modules/**', 'out/**'] }))
  .add(new SearchIndexStep('out/index.json', searchCommand))
  .start(context)
  .then(result => context.log('Completed', result))
  .catch(err => {
    try {
      context.error(err, context.inputFile.name, '=>', context.outputFile?.name)
    } catch (e) {
      context.error(err)
    }
  })
