import { SsgFile } from 'ssg-api'

export class PackageJsonStep {
  constructor (fileName) {
    this.name = 'package'
    this.fileName = fileName
  }

  execute (context) {
    const { _encoding, contents } = SsgFile.getContents(context, this.fileName)
    const json = JSON.parse(contents)
    context.setVar('package', json)
    return this.fileName
  }
}
