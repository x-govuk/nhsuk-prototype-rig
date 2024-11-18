/**
 * Output local data
 *
 * @param {object} data - Data to inspect
 * @returns {string} Returns HTML with data rendered inside a <pre> element
 */
export function inspect(data) {
  const { filters } = this.ctx.settings.nunjucksEnv
  const json = JSON.stringify(data, null, 2)
  return filters.safe(`<pre>${json}</pre>`)
}
