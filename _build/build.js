import path from 'path'
import { CopyStep, DefaultLogger, Ssg, SsgContextImpl } from 'ssg-api'
import { PackageJsonStep } from './PackageJsonStep.js'
import { FirstContentStep } from './content/FirstContentStep.js'
import { SearchIndexStep } from './SearchIndexStep.js'
import { SearchCommand } from './content/replacement/SearchCommand.js'
import { SecondContentStep } from './content/SecondContentStep.js'

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
  notIndexedUrls: []
})
try {
  const result = await new Ssg(config)
    .add(new PackageJsonStep('package.json'))
    .add(new FirstContentStep(contentRoots, outputFunc, searchCommand))
    .add(new CopyStep(['logo.png', 'index.css', 'index.js', 'search.js'], config, { ignore: ['node_modules/**', 'out/**'] }))
    .add(new SearchIndexStep('out/index.json', searchCommand))
    .add(new SecondContentStep(contentRoots.map(root => 'out/' + root), outputFunc, searchCommand))
    .start(context)
  context.log('Completed', result)
} catch (err) {
  try {
    context.error(err, context.inputFile.name, '=>', context.outputFile?.name)
  } catch (e) {
    context.error(err)
  }
}
