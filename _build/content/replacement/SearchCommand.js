import { HtmlSsgFile } from 'ssg-api';
import fs from 'fs';

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

class WordCount {
  /**
   * @type {number}
   */
  pageIndex
  /**
   *
   * @type {number}
   */
  count
}

class SearchIndex {
  /**
   * @type {PageInfo[]}
   */
  pages
  /**
   *
   * @type {{[key: string]: WordCount[]}}
   */
  words
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

  /**
   * @protected
   * @param {Document} doc
   * @return {string}
   */
  getContents(doc) {
    const div = doc.createElement('div');
    div.append(doc.body);
    this.removeTags(div, 'script');
    this.removeTags(div, 'nav');
    this.removeTags(div, 'footer');
    return div.textContent;
  }

  async contentStepEnd() {
  }

  /**
   * @protected
   * @param {HTMLDivElement} div
   * @param {string} selector
   */
  removeTags(div, selector) {
    const found = div.querySelectorAll(selector);
    let i = found.length;
    while (i--) {
      found[i].parentNode.removeChild(found[i]);
    }
  }
}
