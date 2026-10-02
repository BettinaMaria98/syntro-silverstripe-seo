import { useContext } from 'react';
import { DOMContext } from 'Components/DOMContext';

const GOOGLE_MAX_DESCRIPTION_LENGTH = 160;
const GOOGLE_MAX_TITLE_LENGTH = 70;

/**
 * breadcrumbsFromPath - returns the breadcrumbs from the URL & Link as an array
 *
 * `link` is sometimes a full absolute URL (e.g. "https://example.com/about")
 * rather than a relative path, so we resolve it against `baseUrl` and only
 * use the resulting `pathname` — otherwise the scheme/host would get split
 * into their own breadcrumb segments too.
 *
 * @param  {string} baseUrl the base url
 * @param  {string} link    the link (relative path or full absolute URL)
 * @return {array}          the breadcrumbs as array of strings
 */
function breadcrumbsFromPath(baseUrl, link) {
  const breadcrumbs = [baseUrl];
  let pathname = link;
  try {
    pathname = new URL(link, baseUrl).pathname;
  } catch (e) {
    // link wasn't parseable as a URL (shouldn't normally happen) — fall
    // back to treating it as a plain path.
  }
  const path = pathname.split('/');
  for (let i = 0; i < path.length; i += 1) {
    if (path[i] !== '') {
      breadcrumbs.push(path[i]);
    }
  }
  return breadcrumbs;
}

/**
 * padKeyword - cuts out text around the given keyword
 *
 * @param  {string} text    the text to cut
 * @param  {string} keyword the keyword to cut out
 * @param  {number} length  the target length
 * @return {string}         the cut text snippet
 */
function padKeyword(text, keyword, length) {
  const keywordPos = keyword && keyword !== '' ? text.toLowerCase().indexOf(keyword.toLowerCase()) : -1;
  const padding = keyword && keyword !== '' ? (length - keyword.length) * 0.5 : length * 0.5;
  if (text.length <= length) {
    return text;
  }
  if (
    keywordPos < 0
    || keywordPos <= padding
  ) {
    return `${text.substring(0, length)}...`;
  } if ((text.length - keywordPos) < padding) {
    return `...${text.substring((text.length - length), text.length)}`;
  }
  return `...${text.substring((keywordPos - padding), (keywordPos + keyword.length + padding))}...`;
}

/**
 * snippetFromPage - returns the SERP Snippet from the page
 *
 * @param  {string} page    the page html
 * @param  {string} keyword the keyword to look for
 * @return {string}         the padded snippet
 */
function snippetFromPage(page, keyword) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(page, 'text/html');
  dom.querySelectorAll('nav').forEach((item) => {
    item.remove();
  });
  dom.querySelectorAll('footer').forEach((item) => {
    item.remove();
  });

  let content = null;
  const metadesc = dom.querySelector('meta[name="description"]');
  if (metadesc) {
    content = metadesc.content;
    if (keyword && keyword !== '' && content.toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
      const bodyContent = dom.querySelector('body').innerText.replace(/^( *)$/gm, '').replace(/^( +)/gm, ' ').replace(/(\r\n|\n|\r)/gm, '');
      if (bodyContent.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
        content = bodyContent;
      }
    }
  } else {
    content = dom.querySelector('body').innerText.replace(/^( *)$/gm, '').replace(/^( +)/gm, ' ').replace(/(\r\n|\n|\r)/gm, '');
  }

  return padKeyword(content, keyword, GOOGLE_MAX_DESCRIPTION_LENGTH);
}

/**
 * useSERP - Hook to render the SERP Data
 *
 * @param  {string} baseUrl the base url
 * @param  {string} link    the link of the page to generate the SERP from
 * @param  {string} keyword the keyword to generate the SERP for
 * @return {object}         the data used for rendering the field
 */
function useSERP(baseUrl, link, keyword) {
  let breadcrumbs = [baseUrl, '...'];
  let title = '...';
  let snippet = '...';
  const page = useContext(DOMContext);
  if (page) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(page, 'text/html');
    breadcrumbs = breadcrumbsFromPath(baseUrl, link);
    title = padKeyword(dom.title, keyword, GOOGLE_MAX_TITLE_LENGTH);
    snippet = snippetFromPage(page, keyword);
  }
  return {
    breadcrumbs,
    title,
    snippet,
  };
}

export default useSERP;
