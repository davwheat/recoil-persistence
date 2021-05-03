/**
 * Determines if the page is being rendered as part of Gatsby's static site generation (SSG).
 *
 * @internal
 */
export default function isSSR() {
    return typeof window === 'undefined';
}
