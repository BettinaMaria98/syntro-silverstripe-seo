function analyseContentFocus(dom, keyword, t) { // eslint-disable-line no-unused-vars
  if (!keyword) {
    return {
      show: false,
      state: 'secondary',
    };
  }

  // Work on a clone so nav/footer boilerplate (menus, footer links, etc.)
  // can't produce false-positive keyword matches, without mutating the
  // shared dom that the other analyses further down the pipeline still
  // rely on.
  const content = dom.querySelector('body').cloneNode(true);
  content.querySelectorAll('nav').forEach((item) => { item.remove(); });
  content.querySelectorAll('footer').forEach((item) => { item.remove(); });
  const bodyText = content.textContent.replace(/^( *)$/gm, '').replace(/^( +)/gm, ' ').replace(/(\r\n|\n|\r)/gm, '');

  const re = new RegExp(keyword, 'gi');
  const matches = bodyText.match(re);

  if (!matches) {
    return {
      show: true,
      state: 'danger',
      message: t('analyseContentFocus.NOTFOUND', 'The focus keyword was not found in the content of this page.'),
    };
  }
  return {
    show: true,
    state: 'success',
    message: t('analyseContentFocus.FOUND', 'The focus keyword was found <strong>{{matches}}</strong> times in the Content of this page.', { matches: matches.length }),
  };
}

export default analyseContentFocus;
