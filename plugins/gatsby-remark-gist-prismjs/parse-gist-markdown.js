const querystring = require("querystring");
const rangeParser = require("parse-numeric-range");

/**
 * Validates the query object is valid.
 *
 * @param {GistQuery} query the query to be validated.
 * @returns {boolean} true if the query is valid; false otherwise.
 */
function isValid(query) {
  if (query == null) return false;
  if (query.file == null && query.highlights == null) return false;

  return true;
}

/**
 * Builds the query object.
 * This methods looks for anything that is after ? or # in the gist: directive.
 * ? is interpreted as a query string.
 * # is interpreted as a filename.
 *
 * @param {string} value the value of the inlineCode block.
 * @returns {object} the query object.
 */
module.exports = function parseGistMarkdown(value) {
  const [gist, qs] = value.split(/[?#]/);

  const [inlineUsername, id] =
    gist.indexOf("/") > 0 ? gist.split("/") : [null, gist];

  // if there is no file, then return an empty object
  if (qs == null) return { highlights: [] };

  // if # is used, then force the query object
  const query = value.indexOf("#") > -1 ? { file: qs } : querystring.parse(qs);

  // validate the query
  if (!isValid(query)) {
    throw new Error("Malformed query. Check your 'gist:' imports");
  }

  // explode the highlights ranges, if any
  let highlights = [];

  if (typeof query.highlights === "string") {
    highlights = rangeParser.parse(query.highlights);
  } else if (Array.isArray(query.highlights)) {
    highlights = query.highlights;
  }

  return Object.assign({}, query, {
    highlights,
    inlineUsername,
    id,
  })
}
