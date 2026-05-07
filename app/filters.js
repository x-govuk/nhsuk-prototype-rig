/**
 * Prototype specific filters for use in Nunjucks templates.
 *
 * You can override Prototype Rig filters by creating filter methods
 * with the same name. You can delete this file if you don’t need your
 * own filters.
 *
 * @returns {object} Filters
 */
export default () => {
  const filters = {}

  /**
   * Add your methods to the filters object below this comment block
   *
   * @see {@link https://mozilla.github.io/nunjucks/api#custom-filters}
   * @example
   * filters.sayHello = function (name) {
   *   return `Hello, ${name}!`
   * }
   *
   * Which in your templates would be used as:
   *
   * {{ "World" | sayHello }} => Hello, World!
   */

  // Keep the following line to return your filters to the app
  return filters
}
