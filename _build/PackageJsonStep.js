import { FileContents } from "@javarome/fileutil"

export class PackageJsonStep {
  constructor (fileName) {
    this.name = "package"
    this.fileName = fileName
  }

  execute (context) {
    const { _encoding, contents } = FileContents.getContents(this.fileName)
    const json = JSON.parse(contents)
    context.setVar("package", json)
    return this.fileName
  }
}
