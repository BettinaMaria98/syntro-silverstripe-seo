const GOOGLE_OPT_CONTENT_LENGTH = 300;

function analyseContentWordCount(dom, keyword, t) { // eslint-disable-line no-unused-vars
  // Work on a clone so nav/footer boilerplate (menus, footer links, etc.)
  // doesn't inflate the word count, without mutating the shared dom that
  // the other analyses further down the pipeline still rely on.
  const content = dom.querySelector('body').cloneNode(true);
  content.querySelectorAll('nav').forEach((item) => { item.remove(); });
  content.querySelectorAll('footer').forEach((item) => { item.remove(); });
  const bodyText = content.textContent.replace(/^( *)$/gm, '').replace(/^( +)/gm, ' ').replace(/(\r\n|\n|\r)/gm, '');
  const wordCount = (bodyText.length && bodyText.split(/\s+\b/).length) || 0;

  if (wordCount > GOOGLE_OPT_CONTENT_LENGTH) {
    return {
      show: true,
      state: 'success',
      message: t(
        'analyseContentWordCount.COUNTOK',
        'The content of this page contains <b>{{wordCount}} words</b>',
        { wordCount },
      ),
    };
  }
  return {
    show: true,
    state: 'warning',
    message: t(
      'analyseContentWordCount.COUNTLOW',
      'The content of this page contains <b>{{wordCount}} words</b>, which is less than the recommended {{GOOGLE_OPT_CONTENT_LENGTH}} words.',
      { wordCount, GOOGLE_OPT_CONTENT_LENGTH },
    ),
  };
}

export default analyseContentWordCount;
