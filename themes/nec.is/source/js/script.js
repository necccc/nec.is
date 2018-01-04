(function () {

    const rem = parseInt(window.getComputedStyle(document.documentElement)['font-size'], 10);
    const headerHeight = document.querySelector('header').clientHeight;
    const pageWidth = document.body.clientWidth;

    const getHeaderSkew = function () {
        let aa = headerHeight - window.scrollY - (4 * rem);
        let a = headerHeight - (headerHeight * 0.6);
        if (aa > a) {
            aa = a;
        }
        return -1 * (Math.asin( 1 / (Math.sqrt(Math.pow(aa, 2) + Math.pow(pageWidth, 2)) / aa ))) * (180 / Math.PI);
    }

    const getFooterSkew = function () {
        let k = window.scrollY + document.documentElement.clientHeight - document.querySelector('main').offsetHeight
        let footerHeight = document.querySelector('footer').offsetHeight;
        let aa = footerHeight - (footerHeight - k);

        if (k < 0 || aa < 0) {
            return 0;
        }

        if (aa >= 6 * rem) {
            aa = 6 * rem;
        }

        return (Math.asin( 1 / (Math.sqrt(Math.pow(aa, 2) + Math.pow(pageWidth, 2)) / aa ))) * (180 / Math.PI);
    }

    const addHeaderShrink = function () {
        if (!document.querySelector('.header--shrink')) {
            const body = document.querySelector('body')
            body.className += 'header--shrink ';

            document.querySelector('header input').checked = false;
        }
    }

    const removeHeaderShrink = function () {
        const body = document.querySelector('body')
        const cl = body.className;
        body.className = cl.replace(/header--shrink/g, '');
        document.querySelector('header input').checked = false;
    }

    const onScroll = function () {
        const startTreshold = window.scrollY - (headerHeight - (headerHeight * 0.6)) >= 0;
        const endTreshold = (headerHeight - window.scrollY - (4 * rem)) < 0;

        if (startTreshold && !endTreshold) {
            window.requestAnimationFrame(() => {
                removeHeaderShrink()
                document.documentElement.style.setProperty(`--headerSkew`, getHeaderSkew() + 'deg');
            })
        } else if (endTreshold) {
            window.requestAnimationFrame(() => {
                addHeaderShrink();
            })
        } else if (window.scrollY === 0) {
            removeHeaderShrink()
            document.documentElement.style.setProperty(`--headerSkew`, getHeaderSkew() + 'deg');
        }

        document.documentElement.style.setProperty(`--footerSkew`, getFooterSkew() + 'deg');
    }

    const init = function () {
        let menuHeight = headerHeight;

        if (16 * rem >= headerHeight) {
            menuHeight = 20 * rem;
        }

        document.documentElement.style.setProperty(`--headerHeight`, headerHeight + 'px');
        document.documentElement.style.setProperty(`--menuHeight`, menuHeight + 'px');
        document.documentElement.style.setProperty(`--headerSkew`, getHeaderSkew() + 'deg');
    }


    init();

    window.onresize = function () {
        window.requestAnimationFrame(function () {
            document.documentElement.style.setProperty(`--headerSkew`, getHeaderSkew() + 'deg');
        })
    }

    onScroll();
    document.onscroll = onScroll;



}())