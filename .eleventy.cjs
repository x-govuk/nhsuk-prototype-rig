module.exports = function (eleventyConfig) {
  const url = process.env.GITHUB_ACTIONS
    ? 'https://x-govuk.github.io/nhsuk-prototype-rig/'
    : '/'
  const pathPrefix = process.env.GITHUB_ACTIONS
    ? '/nhsuk-prototype-rig'
    : '/'

  // Plugins
  eleventyConfig.addPlugin(require('govuk-eleventy-plugin'), {
    brandColour: '#28a',
    fontFamily: 'system-ui, sans-serif',
    icons: {
      mask: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-mask-icon.svg?raw=true',
      shortcut: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-favicon.ico',
      touch: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-apple-touch-icon.png'
    },
    opengraphImageUrl: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-opengraph-image.png',
    homeKey: 'GOV.UK Prototype Rig',
    parentSite: {
      url: 'https://x-govuk.github.io/#shared-projects',
      name: 'X-GOVUK shared projects'
    },
    pathPrefix,
    url,
    header: {
      organisationLogo: 'x-govuk',
      organisationName: 'X-GOVUK',
      productName: 'Prototype Rig',
      search: {
        indexPath: '/search.json',
        sitemapPath: '/sitemap'
      }
    },
    footer: {
      contentLicence: {
        html: 'Licensed under the <a class="nhsuk-footer__link" href="https://github.com/x-govuk/govuk-eleventy-plugin/blob/main/LICENSE.txt">MIT Licence</a>, except where otherwise stated'
      },
      copyright: {
        text: '© X-GOVUK'
      }
    }
  })

  // Pass through
  eleventyConfig.addPassthroughCopy('./docs/assets')

  // Config
  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      layouts: '../node_modules/govuk-eleventy-plugin/layouts'
    },
    pathPrefix
  }
}
