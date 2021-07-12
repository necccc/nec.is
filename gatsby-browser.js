/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

 // https://www.gatsbyjs.org/packages/gatsby-remark-custom-blocks/?=remark
//require("prismjs/themes/prism.css")
// require("prismjs/plugins/line-numbers/prism-line-numbers.css")
// require("prismjs/plugins/command-line/prism-command-line.css")

import "@fontsource/libre-franklin/300.css"
import "@fontsource/libre-franklin/500.css"
import "@fontsource/libre-baskerville/400.css"
import "@fontsource/libre-baskerville/700.css"

const REM = parseInt(window.getComputedStyle(window.document.documentElement)['font-size'], 10);

const getHeaderSkew = function (headerHeight, pageWidth) {
	let aa = headerHeight - window.scrollY - (4 * REM);
	let a = headerHeight - (headerHeight * 0.6);

	if (aa > a) {
		aa = a;
	}

	const skew = -1 * (Math.asin( 1 / (Math.sqrt(Math.pow(aa, 2) + Math.pow(pageWidth, 2)) / aa ))) * (180 / Math.PI);

	return skew >= 0 ? 0 : skew
}

const getHeaderScrollRatio = (headerHeight) => {
	const ratio  = (headerHeight - window.scrollY) / headerHeight

	if (ratio < 0) return 0;

	return ratio
}

const setHeader = () => {
	const header = window.document.querySelector('header');

	if (!header) return;

	const pageWidth = window.document.body.clientWidth;

	const headerHeight = header.clientHeight;
	const headerSkew = getHeaderSkew(headerHeight, pageWidth)

	window.document.documentElement.style.setProperty(`--headerHeight`, headerHeight + 'px');
	window.document.documentElement.style.setProperty(`--headerSkew`, headerSkew + 'deg');
	window.document.documentElement.style.setProperty(`--headerScrollRatio`, getHeaderScrollRatio(headerHeight));

	if (headerSkew >= 0) {
		header.style.setProperty(`--headerPosition`, 'fixed');
		header.style.setProperty(`--headerTop`, `-${headerHeight}px`);
	} else {
		header.style.setProperty(`--headerPosition`, 'absolute');
		header.style.setProperty(`--headerTop`, '-4rem');
	}
}

const onScroll = function () {
	window.document.documentElement.style.setProperty(`--scrollTop`, window.scrollY + 'px');
	setHeader()
}

export const onInitialClientRender = () => {
	// Test via a getter in the options object to see if the passive property is accessed
	window.supportsPassiveScroll = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function() {
				window.supportsPassiveScroll = true;
				return true
			}
		});
		window.addEventListener("testPassive", null, opts);
		window.removeEventListener("testPassive", null, opts);
	} catch (e) {}

	onScroll();
    window.document.addEventListener('scroll', onScroll, window.supportsPassiveScroll ? { passive: true } : false);
}

export const onRouteUpdate = ({ location, prevLocation }) => {
	onScroll();
}
