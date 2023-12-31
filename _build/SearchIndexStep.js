import {FileUtil} from "ssg-api"

/**
 * Saves the index file collected by the SearchCommand.
 */
export class SearchIndexStep {

  /**
   * @param {string} fileName
   * @param {SearchCommand} searchCommand
   */
  constructor(fileName, searchCommand) {
    this.name = 'search'
    this.fileName = fileName
    this.searchCommand = searchCommand
  }

  async execute(context) {
    context.log("Saving index at", this.fileName)
    await FileUtil.writeFile(this.fileName, JSON.stringify(this.searchCommand.index), "utf-8")
    return this.searchCommand.index.pages.length
  }
}
