console.log('> chrome.devtools.panels', chrome.devtools.panels);
console.log(
  '> chrome.devtools.inspectedWindow',
  chrome.devtools.inspectedWindow,
);
console.log('> chrome.devtools.network', chrome.devtools.network);

/**
 * 在 devtools 里面增加自己的 panel
 */
chrome.devtools.panels.create(
  'My Panel',
  'assets/hello_extensions.png',
  // 这里要用绝对路径?
  'devtools/Panel.html',
  function (panel) {
    // code invoked on panel creation
  },
);

/**
 * 在 elements panel 上的侧边栏增加自己的 tab
 */
chrome.devtools.panels.elements.createSidebarPane(
  'My Sidebar',
  function (sidebar) {
    // sidebar initialization code here
    // sidebar.setPage('devtools/Panel.html');
    sidebar.setObject({ some_data: 'Some data to show' });
  },
);
