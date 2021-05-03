"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Determines if the page is being rendered as part of Gatsby's static site generation (SSG).
 *
 * @internal
 */
function isSSR() {
    return typeof window === 'undefined';
}
exports.default = isSSR;
