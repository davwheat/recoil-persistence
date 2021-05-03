/**
 * Determines if the page is being rendered as part of Gatsby's static site generation (SSG).
 */
function isSSR() {
  return typeof window === 'undefined'
}
