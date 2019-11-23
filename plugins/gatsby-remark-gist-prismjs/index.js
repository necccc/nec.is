const visit = require("async-unist-util-visit");
const parseGistMarkdown = require("./parse-gist-markdown")
const fetchGist  = require('./fetch-gist')
const toPrismCodeBlock = require('./to-prism-codeblock')
const loadLanguageExtension = require("./remark-prism/load-prism-language-extension")

module.exports = async ({ markdownAST, cache: { cache } }, pluginOptions) => {

  loadLanguageExtension(pluginOptions.languageExtensions || [])

  return await visit(markdownAST, "inlineCode", async node => {
    if (!node.value.startsWith("gist:")) return;

    const gist = parseGistMarkdown(node.value.substring(5));
    const gistData = await fetchGist(gist, pluginOptions, cache)

    const gistFile = gistData.files[gist.file]

    await toPrismCodeBlock(node, gistFile, pluginOptions)

    return markdownAST
  })
}
