import { DomReplaceCommand } from 'ssg-api'

export class NavReplaceCommand extends DomReplaceCommand {
  /**
   *
   * @param {PageInfo[]} pages
   */
  constructor (pages) {
    super('#main-nav ul:empty')
    this.pages = pages
  }

  async createReplacer (context) {
    const items = context.inputFile.name.split('/')
    items.splice(0, 1) // remove "/out"
    return {
      replace: (elem) => {
        for (let pathElem of items) {
          if (!pathElem.endsWith('index.html')) {
            pathElem += '/index.html'
          }
          const doc = context.outputFile.document
          const li = doc.createElement('li')
          const a = doc.createElement('a')
          li.append(a)
          const page = this.pages.find(page => page.url === pathElem)
          if (page) {
            a.textContent = page.title
            a.href = page.url
          } else {
            a.textContent = pathElem
          }
          elem.appendChild(li)
        }
        return elem
      }
    }
  }

  async contentStepEnd () {
  }
}
