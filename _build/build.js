import path from "path"
import { ConsoleLogger, CopyStep, Ssg, SsgContextImpl } from "ssg-api"
import { PackageJsonStep } from "./PackageJsonStep.js"
import { FirstContentStep } from "./content/FirstContentStep.js"
import { SearchIndexStep } from "./SearchIndexStep.js"
import { SearchCommand } from "./content/replacement/SearchCommand.js"
import { SecondContentStep } from "./content/SecondContentStep.js"

const context = new SsgContextImpl("en", new Map(), "noframework", new ConsoleLogger("noframework"))
const outDir = "out"
const config = { outDir }
const getOutputPath = (context) => path.join(outDir, context.file.name)
/**
 * @type {string[]}
 */
const contentRoots = [
  "index.html",
  "how/**/*.html",
  "read/**/*.html"
]
const outputFunc = async (context, info, outDir = config.outDir + "/") => {
  // TODO: Fix this
  if (info.name.startsWith(outDir)) {
    if (info.name.startsWith(path.join(outDir, outDir))) {
      info.name = info.name.substring(outDir.length)
    }
  } else {
    info.name = outDir + info.name
  }
  try {
    context.log("Writing", info.name)
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
    .add(new PackageJsonStep("package.json"))
    .add(new FirstContentStep(contentRoots, outputFunc, searchCommand, getOutputPath))
    .add(new CopyStep({
      getOutputPath,
      destDir: outDir,
      sourcePatterns: ["logo.png", "index.css", "index.js", "search.js"],
      options: { ignore: ["node_modules/**", "out/**"] }
    }))
    .add(new SearchIndexStep("out/index.json", searchCommand))
    .add(new SecondContentStep(contentRoots.map(root => "out/" + root), outputFunc, searchCommand, getOutputPath))
    .start(context)
  context.log("Completed", result)
} catch (err) {
  try {
    context.error(err, context.inputFile.name, "=>", context.outputFile?.name)
  } catch (e) {
    context.error(err)
  }
}
