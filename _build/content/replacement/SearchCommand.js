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
  /**
   *
   * @type {string}
   */
  indexContent
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
   * @readonly
   * @protected
   * @type {fs.WriteStream | undefined}
   */
  contentStream

  /**
   * @param {SearchCommandOptions} options
   */
  constructor(options) {
    this.options = options
    const indexContent = this.options.indexContent;
    if (indexContent) {
      this.contentStream = fs.createWriteStream(indexContent);
    }
  }

  async contentStepEnd() {
    const contentStream = this.contentStream;
    if (contentStream) {
      contentStream.write('\n]');
      contentStream.end();
    }
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
    if (this.options.indexContent) {
      this.indexContent(context, outputFile);
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

  /**
   * @protected
   */
  indexContent(context, outputFile) {
    const contents = this.getContents(outputFile.document);
    const contentsRecord = {
      title: outputFile.title,
      url: context.outputFile.name,
      html: contents
    };
    const prefix = this.contentStream.bytesWritten === 0 ? '[\n' : ',\n';
    let str = prefix + JSON.stringify(contentsRecord);
    this.contentStream.write(str);
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
