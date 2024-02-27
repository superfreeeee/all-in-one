console.log('load sw-omnibox.js');

/**
 * storage.local 使用本地存储
 */
// Save default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  console.log('> onInstalled', reason);
  if (reason === 'install') {
    chrome.storage.local.set({
      apiSuggestions: ['tabs', 'storage', 'scripting'],
    });
  }
});

const URL_CHROME_EXTENSIONS_DOC =
  'https://developer.chrome.com/docs/extensions/reference/';
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

/**
 * 地址栏输入 keyword 可以唤起 manifest 中定义的 omnibox
 * 唤起 omnibox 后事件
 */
// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  console.log('> onInputChanged', { input });

  await chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a Chrome API or choose from past searches',
  });

  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
  console.log('> apiSuggestions', apiSuggestions);

  /**
   * 搜索推荐 = { content, description }
   * content 为具体值
   */
  const suggestions = apiSuggestions.map((api) => {
    return { content: api, description: `Open chrome.${api} API` };
  });
  suggest(suggestions);
});

/**
 * 确定输入后
 */
// Open the reference page of the chosen API
chrome.omnibox.onInputEntered.addListener((input) => {
  console.log('> onInputEntered', { input });

  chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input });
  // Save the latest keyword
  updateHistory(input);
});

/**
 * 保留最新的四个 suggestions
 */
async function updateHistory(input) {
  const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
  apiSuggestions.unshift(input);
  apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  return chrome.storage.local.set({ apiSuggestions });
}
