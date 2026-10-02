import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import DOMContextProvider, { DOMContext } from 'Components/DOMContext';
import { SERP, Analysis, AI } from 'Components/Tabs';
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import '../i18n';
import { useTranslation } from 'react-i18next';

/**
 * Inner component so we can read DOMContext for the AI tab.
 */
const SEOAnalysisFieldInner = ({
  link, rootUrl, keyword, pageId, currentTitle, showAiTab, openTab, handleTabClick, t,
}) => (
  <>
    <Nav tabs>
      <NavItem>
        <NavLink
          className={classnames({ active: openTab === '1' })}
          onClick={() => handleTabClick('1')}
        >
          {t('tabs.ANALYSIS', 'Analysis')}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: openTab === '3' })}
          onClick={() => handleTabClick('3')}
        >
          {t('tabs.SERP', 'SERP')}
        </NavLink>
      </NavItem>
      {showAiTab && (
      <NavItem>
        <NavLink
          className={classnames({ active: openTab === 'ai' })}
          onClick={() => handleTabClick('ai')}
        >
          {t('tabs.AI', 'AI Suggest')}
        </NavLink>
      </NavItem>
      )}
    </Nav>
    {openTab === '1' && <Analysis link={link} keyword={keyword} rootUrl={rootUrl} />}
    {openTab === '3' && <SERP link={link} keyword={keyword} rootUrl={rootUrl} />}
    {showAiTab && openTab === 'ai' && (
    <AI pageId={pageId} currentTitle={currentTitle} />
    )}
  </>
);

const SEOAnalysisField = (props) => {
  const {
    link, rootUrl, keyword, pageId, currentTitle, showAiTab,
  } = props;
  const [openTab, setOpenTab] = useState('1');
  const { t } = useTranslation();
  const handleTabClick = (newTab) => setOpenTab(newTab);

  return (
    <div className="bg-white shadow-sm px-3 pb-3 rounded border-secondary" style={{ position: 'relative' }}>
      <DOMContextProvider link={link}>
        <SEOAnalysisFieldInner
          link={link}
          rootUrl={rootUrl}
          keyword={keyword}
          pageId={pageId}
          currentTitle={currentTitle}
          showAiTab={showAiTab}
          openTab={openTab}
          handleTabClick={handleTabClick}
          t={t}
        />
      </DOMContextProvider>
    </div>
  );
};

SEOAnalysisField.defaultProps = {
  link: '',
  rootUrl: '',
  keyword: '',
  pageId: 0,
  currentTitle: '',
  showAiTab: true,
  data: {},
};

SEOAnalysisField.propTypes = {
  link: PropTypes.string,
  rootUrl: PropTypes.string,
  keyword: PropTypes.string,
  pageId: PropTypes.number,
  currentTitle: PropTypes.string,
  showAiTab: PropTypes.bool,
  data: PropTypes.shape({}),
};

SEOAnalysisFieldInner.defaultProps = {
  currentTitle: '',
  pageId: 0,
  showAiTab: true,
};

SEOAnalysisFieldInner.propTypes = {
  link: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  pageId: PropTypes.number,
  currentTitle: PropTypes.string,
  showAiTab: PropTypes.bool,
  openTab: PropTypes.string.isRequired,
  handleTabClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default SEOAnalysisField;
