const parseOptions = require(`./remark-prism/parse-options`)
const loadLanguageExtension = require(`./remark-prism/load-prism-language-extension`)
const highlightCode = require(`./remark-prism/highlight-code`)
const addLineNumbers = require(`./remark-prism/add-line-numbers`)
const commandLine = require(`./remark-prism/command-line`)




module.exports = async function (
  node,
  gistFile,
  {
    classPrefix = `language-`,
    inlineCodeMarker = null,
    aliases = {},
    noInlineHighlight = false,
    showLineNumbers: showLineNumbersGlobal = false,
    languageExtensions = [],
    prompt = {
      user: `root`,
      host: `localhost`,
      global: false,
    },
  } = options
) {

  const normalizeLanguage = lang => {
    const lower = lang.toLowerCase()
    return aliases[lower] || lower
  }

  const {
    language,
    content
  } = gistFile

  let {
    splitLanguage,
    highlightLines,
    showLineNumbersLocal,
    numberLinesStartAt,
    outputLines,
    promptUserLocal,
    promptHostLocal,
  } = parseOptions(language)
  const showLineNumbers = showLineNumbersLocal || showLineNumbersGlobal
  const promptUser = promptUserLocal || prompt.user
  const promptHost = promptHostLocal || prompt.host

   // PrismJS's theme styles are targeting pre[class*="language-"]
    // to apply its styles. We do the same here so that users
    // can apply a PrismJS theme and get the expected, ready-to-use
    // outcome without any additional CSS.
    //
    // @see https://github.com/PrismJS/prism/blob/1d5047df37aacc900f8270b1c6215028f6988eb1/themes/prism.css#L49-L54
    let languageName = `text`
    if (gistFile.language) {
      languageName = normalizeLanguage(language)
    }

    // Allow users to specify a custom class prefix to avoid breaking
    // line highlights if Prism is required by any other code.
    // This supports custom user styling without causing Prism to
    // re-process our already-highlighted markup.
    // @see https://github.com/gatsbyjs/gatsby/issues/1486
    const className = `${classPrefix}${languageName}`

    let numLinesStyle, numLinesClass, numLinesNumber
    numLinesStyle = numLinesClass = numLinesNumber = ``
    if (showLineNumbers) {
      numLinesStyle = ` style="counter-reset: linenumber ${numberLinesStartAt -
        1}"`
      numLinesClass = ` line-numbers`
      numLinesNumber = addLineNumbers(content)
    }

    // Replace the node with the markup we need to make
    // 100% width highlighted code lines work
    node.type = `html`

    let highlightClassName = `gatsby-highlight`
    if (highlightLines && highlightLines.length > 0)
      highlightClassName += ` has-highlighted-lines`

    const useCommandLine =
      [`bash`].includes(languageName) &&
      (prompt.global ||
        (outputLines && outputLines.length > 0) ||
        promptUserLocal ||
        promptHostLocal)

    // prettier-ignore
    node.value = ``
    + `<div class="${highlightClassName}" data-language="${languageName}">`
    +   `<pre${numLinesStyle} class="${className}${numLinesClass}">`
    +     `<code class="${className}">`
    +       `${useCommandLine ? commandLine(content, outputLines, promptUser, promptHost) : ``}`
    +       `${highlightCode(languageName, content, highlightLines, noInlineHighlight)}`
    +     `</code>`
    +     `${numLinesNumber}`
    +   `</pre>`
    + `</div>`

    return node
}
