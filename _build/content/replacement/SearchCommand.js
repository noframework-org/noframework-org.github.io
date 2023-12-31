import { HtmlSsgFile } from 'ssg-api';

class PageInfo {
  /**
   * @type {string}
   */
  title
  /**
   * @type {string}
   */
  url
}

class SearchIndex {
  /**
   * @type {PageInfo[]}
   */
  pages
}

export class SearchCommandOptions {
  /**
   * @type {string[]}
   */
  notIndexedUrls
}

/**
 * Builds an index of pages.
 */
export class SearchCommand {
  /**
   * @readonly
   * @type {SearchIndex}
   */
  index = {
    pages: [],
    words: {}
  };

  /**
   * @param {SearchCommandOptions} options
   */
  constructor(options) {
    this.options = options
  }

  /**
   * @return {Promise<HtmlSsgFile>}
   */
  async execute(context) {
    const outputFile = context.outputFile;
    const title = outputFile.title;
    const url = outputFile.name;
    if (title && !this.options.notIndexedUrls.includes(url)) {
      const indexedPages = this.index.pages;
      const titleIndexed = indexedPages.find(page => page.title === title && page.url !== url);
      if (titleIndexed) {
        context.warn(`Title "${title}" with URL ${url} is already indexed with URL ${titleIndexed.url}`);
      }
      indexedPages.push({title, url});
    }
    return outputFile;
  }

  async contentStepEnd() {
  }
}
