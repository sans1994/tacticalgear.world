export const innerWidth = el => {
	let width = el.offsetWidth;
	let style = getComputedStyle(el);

	width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
	return width;
}

let lastId = 0;

export const UniqueComponentId = (prefix = 'pv_id_') => {
	lastId++;
	return `${prefix}${lastId}`;
}

export const width = el => {
	let width = el.offsetWidth;
	let style = getComputedStyle(el);

	width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
	return width;
}
export const getWindowScrollTop = () => {
	let doc = document.documentElement;
	return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
}

export const getWindowScrollLeft = () => {
	let doc = document.documentElement;
	return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
}

export const getOuterWidth = (el, margin) => {
	if (el) {
		let width = el.offsetWidth;

		if (margin) {
			let style = getComputedStyle(el);
			width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
		}

		return width;
	}
	else {
		return 0;
	}
}

export const getOuterHeight = (el, margin) => {
	if (el) {
		let height = el.offsetHeight;

		if (margin) {
			let style = getComputedStyle(el);
			height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
		}

		return height;
	}
	else {
		return 0;
	}
}

export const getClientHeight = (el, margin) => {
	if (el) {
		let height = el.clientHeight;

		if (margin) {
			let style = getComputedStyle(el);
			height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
		}

		return height;
	} else {
		return 0;
	}
}

export const getViewport = () => {
	let win = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		w = win.innerWidth || e.clientWidth || g.clientWidth,
		h = win.innerHeight || e.clientHeight || g.clientHeight;

	return {width: w, height: h};
}

export const getOffset = el => {
	let rect = el.getBoundingClientRect();

	return {
		top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
		left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
	};
}

export const index = el => {
	let children = el.parentNode.childNodes;
	let num = 0;
	for (let i = 0; i < children.length; i++) {
		if (children[i] === el) return num;
		if (children[i].nodeType === 1) num++;
	}
	return -1;
}

export const addMultipleClasses = (el, className) => {
	if (el.classList) {
		let styles = className.split(' ');
		for (let i = 0; i < styles.length; i++) {
			el.classList.add(styles[i]);
		}

	}
	else {
		let styles = className.split(' ');
		for (let i = 0; i < styles.length; i++) {
			el.className += ' ' + styles[i];
		}
	}
}

export const addClass = (el, className) => {
	if (el.classList)
		el.classList.add(className);
	else
		el.className += ' ' + className;
}

export const removeClass = (el, className) => {
	if (el.classList)
		el.classList.remove(className);
	else
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

export const hasClass = (el, className) => {
	if (el) {
		if (el.classList)
			return el.classList.contains(className);
		else
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	}

	return false;
}

export const find = (el, selector) => {
	return el.querySelectorAll(selector);
}

export const findSingle = (el, selector) => {
	return el.querySelector(selector);
}

export const getHeight = el => {
	let height = el.offsetHeight;
	let style = getComputedStyle(el);

	height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

	return height;
}

export const getWidth = el => {
	let width = el.offsetWidth;
	let style = getComputedStyle(el);

	width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

	return width;
}

export const absolutePosition = (el, target) => {
	let elementDimensions = el.offsetParent ? { width: el.offsetWidth, height: el.offsetHeight } : getHiddenElementDimensions(el)
	let elementOuterHeight = elementDimensions.height;
	let elementOuterWidth = elementDimensions.width;
	let targetOuterHeight = target.offsetHeight;
	let targetOuterWidth = target.offsetWidth;
	let targetOffset = target.getBoundingClientRect();
	let windowScrollTop = getWindowScrollTop();
	let windowScrollLeft = getWindowScrollLeft();
	let viewport = getViewport();
	let top, left;

	if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
		top = targetOffset.top + windowScrollTop - elementOuterHeight;
		el.style.transformOrigin = 'bottom';

		if (top < 0) {
			top = windowScrollTop;
		}
	}
	else {
		top = targetOuterHeight + targetOffset.top + windowScrollTop;
		el.style.transformOrigin = 'top';
	}

	if (targetOffset.left + elementOuterWidth > viewport.width)
		left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
	else
		left = targetOffset.left + windowScrollLeft;

	el.style.top = top + 'px';
	el.style.left = left + 'px';
}

export const relativePosition = (el, target) => {
	let elementDimensions = el.offsetParent ? { width: el.offsetWidth, height: el.offsetHeight } : this.getHiddenElementDimensions(el);
	const targetHeight = target.offsetHeight;
	const targetOffset = target.getBoundingClientRect();
	const viewport = this.getViewport();
	let top, left;

	if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
		top = -1 * (elementDimensions.height);
		el.style.transformOrigin = 'bottom';
		if (targetOffset.top + top < 0) {
			top = -1 * targetOffset.top;
		}
	}
	else {
		top = targetHeight;
		el.style.transformOrigin = 'top';
	}

	if (elementDimensions.width > viewport.width) {
		// el wider then viewport and cannot fit on screen (align at left side of viewport)
		left = targetOffset.left * -1;
	}
	else if ((targetOffset.left + elementDimensions.width) > viewport.width) {
		// el wider then viewport but can be fit on screen (align at right side of viewport)
		left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
	}
	else {
		// el fits on screen (align with target)
		left = 0;
	}

	el.style.top = top + 'px';
	el.style.left = left + 'px';
}

export const getParents = (el, parents = []) => {
	return el['parentNode'] === null ? parents : this.getParents(el.parentNode, parents.concat([el.parentNode]));
}

export const getScrollableParents = el => {
	let scrollableParents = [];

	if (el) {
		let parents = this.getParents(el);
		const overflowRegex = /(auto|scroll)/;
		const overflowCheck = (node) => {
			let styleDeclaration = window['getComputedStyle'](node, null);
			return overflowRegex.test(styleDeclaration.getPropertyValue('overflow')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflowX')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflowY'));
		};

		for (let parent of parents) {
			let scrollSelectors = parent.nodeType === 1 && parent.dataset['scrollselectors'];
			if (scrollSelectors) {
				let selectors = scrollSelectors.split(',');
				for (let selector of selectors) {
					let el = this.findSingle(parent, selector);
					if (el && overflowCheck(el)) {
						scrollableParents.push(el);
					}
				}
			}

			if (parent.nodeType !== 9 && overflowCheck(parent)) {
				scrollableParents.push(parent);
			}
		}
	}

	return scrollableParents;
}

export const getHiddenElementOuterHeight = el => {
	el.style.visibility = 'hidden';
	el.style.display = 'block';
	let elementHeight = el.offsetHeight;
	el.style.display = 'none';
	el.style.visibility = 'visible';

	return elementHeight;
}

export const getHiddenElementOuterWidth = el => {
	el.style.visibility = 'hidden';
	el.style.display = 'block';
	let elementWidth = el.offsetWidth;
	el.style.display = 'none';
	el.style.visibility = 'visible';

	return elementWidth;
}

export const getHiddenElementDimensions = el => {
	let dimensions = {};
	el.style.visibility = 'hidden';
	el.style.display = 'block';
	dimensions.width = el.offsetWidth;
	dimensions.height = el.offsetHeight;
	el.style.display = 'none';
	el.style.visibility = 'visible';

	return dimensions;
}

export const fadeIn = (el, duration) => {
	el.style.opacity = 0;

	let last = +new Date(),
		opacity = 0;
	let tick = function () {
		opacity = +el.style.opacity + (new Date().getTime() - last) / duration;
		el.style.opacity = opacity;
		last = +new Date();

		if (+opacity < 1) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
		}
	};

	tick();
}

export const fadeOut = (el, ms) => {
	let opacity = 1,
		interval = 50,
		duration = ms,
		gap = interval / duration;

	let fading = setInterval(() => {
		opacity -= gap;

		if (opacity <= 0) {
			opacity = 0;
			clearInterval(fading);
		}

		el.style.opacity = opacity;
	}, interval);
}

export const getUserAgent = () => {
	return navigator.userAgent;
}

export const scrollInView = (container, item) => {
	let borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
	let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
	let paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
	let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
	let containerRect = container.getBoundingClientRect();
	let itemRect = item.getBoundingClientRect();
	let offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
	let scroll = container.scrollTop;
	let elementHeight = container.clientHeight;
	let itemHeight = this.getOuterHeight(item);

	if (offset < 0) {
		container.scrollTop = scroll + offset;
	}
	else if ((offset + itemHeight) > elementHeight) {
		container.scrollTop = scroll + offset - elementHeight + itemHeight;
	}
}

export const clearSelection = () => {
	if(window.getSelection) {
		if(window.getSelection().empty) {
			window.getSelection().empty();
		} else if(window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
			window.getSelection().removeAllRanges();
		}
	}
	else if(document['selection'] && document['selection'].empty) {
		try {
			document['selection'].empty();
		} catch(error) {
			//ignore IE bug
		}
	}
}

export const calculateScrollbarWidth = () => {
	if(this.calculatedScrollbarWidth != null)
		return this.calculatedScrollbarWidth;

	let scrollDiv = document.createElement("div");
	scrollDiv.className = "p-scrollbar-measure";
	document.body.appendChild(scrollDiv);

	let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);

	this.calculatedScrollbarWidth = scrollbarWidth;

	return scrollbarWidth;
}

export const getBrowser = () => {
	if(!this.browser) {
		let matched = this.resolveUserAgent();
		this.browser = {};

		if (matched.browser) {
			this.browser[matched.browser] = true;
			this.browser['version'] = matched.version;
		}

		if (this.browser['chrome']) {
			this.browser['webkit'] = true;
		} else if (this.browser['webkit']) {
			this.browser['safari'] = true;
		}
	}

	return this.browser;
}

export const resolveUserAgent = () => {
	let ua = navigator.userAgent.toLowerCase();
	let match = /(chrome)[ ]([\w.]+)/.exec(ua) ||
		/(webkit)[ ]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) ||
		/(msie) ([\w.]+)/.exec(ua) ||
		(ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
		[];

	return {
		browser: match[1] || "",
		version: match[2] || "0"
	};
}

export const isVisible = el => {
	return el.offsetParent != null;
}

export const invokeElementMethod = (el, methodName, args) => {
	(el)[methodName].apply(el, args);
}

export const getFocusableElements = el => {
	let focusableElements = this.find(el, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
			[href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
			input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
			textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
			[contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])`
	);

	let visibleFocusableElements = [];
	for (let focusableElement of focusableElements) {
		if (getComputedStyle(focusableElement).display !== "none" && getComputedStyle(focusableElement).visibility !== "hidden")
			visibleFocusableElements.push(focusableElement);
	}

	return visibleFocusableElements;
}

export const getFirstFocusableElement = (el) => {
	const focusableElements = this.getFocusableElements(el);
	return focusableElements.length > 0 ? focusableElements[0] : null;
}

export const isClickable = el => {
	const targetNode = el.nodeName;
	const parentNode = el.parentElement && el.parentElement.nodeName;

	return (targetNode === 'INPUT' || targetNode === 'BUTTON' || targetNode === 'A' ||
		parentNode === 'INPUT' || parentNode === 'BUTTON' || parentNode === 'A' ||
		this.hasClass(el, 'p-button') || this.hasClass(el.parentElement, 'p-button') ||
		this.hasClass(el.parentElement, 'p-checkbox') || this.hasClass(el.parentElement, 'p-radiobutton')
	);
}

export const applyStyle = (el, style) => {
	if (typeof style === 'string') {
		el.style.cssText = this.style;
	}
	else {
		for (let prop in this.style) {
			el.style[prop] = style[prop];
		}
	}
}

export const isIOS = () => {
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
}

export const isAndroid = () => {
	return /(android)/i.test(navigator.userAgent);
}

export const isTouchDevice = () => {
	return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

export const exportCSV = (csv, filename) => {
	let blob = new Blob([csv], {
		type: 'application/csv;charset=utf-8;'
	});

	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, filename + '.csv');
	}
	else {
		let link = document.createElement("a");
		if (link.download !== undefined) {
			link.setAttribute('href', URL.createObjectURL(blob));
			link.setAttribute('download', filename + '.csv');
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
		else {
			csv = 'data:text/csv;charset=utf-8,' + csv;
			window.open(encodeURI(csv));
		}
	}
}

export const isBrowserTabFocused = () => !document.hidden

export const getDaysDiffBetweenDates = (dateInitial, dateFinal) => (dateFinal - dateInitial) / (1000 * 3600 * 24)

export const getURLParameters = url => (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {})

export const copyToClipboard = str => {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	const selected =
		document.getSelection().rangeCount > 0
			? document.getSelection().getRangeAt(0)
			: false;
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
	if (selected) {
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(selected);
	}
}

export const addMultipleListeners = (el, types, listener, options, useCapture) => {
	types.forEach(type =>
		el.addEventListener(type, listener, options, useCapture)
	);
}

export const removeEventListenerAll = (
	targets,
	type,
	listener,
	options,
	useCapture
) => {
	targets.forEach(target =>
		target.removeEventListener(type, listener, options, useCapture)
	);
}

export const hexToRGB = hex => {
	let alpha = false,
		h = hex.slice(hex.startsWith('#') ? 1 : 0);
	if (h.length === 3) h = [...h].map(x => x + x).join('');
	else if (h.length === 8) alpha = true;
	h = parseInt(h, 16);
	return (
		'rgb' +
		(alpha ? 'a' : '') +
		'(' +
		(h >>> (alpha ? 24 : 16)) +
		', ' +
		((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
		', ' +
		((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
		(alpha ? `, ${h & 0x000000ff}` : '') +
		')'
	);
}

export const RGBToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')

export const countWeekDaysBetween = (startDate, endDate) =>
	Array
		.from({ length: (endDate - startDate) / (1000 * 3600 * 24) })
		.reduce(count => {
			if (startDate.getDay() % 6 !== 0) count++;
			startDate = new Date(startDate.setDate(startDate.getDate() + 1));
			return count;
		}, 0);

export const differenceBy = (a, b, fn) => {
	const s = new Set(b.map(fn));
	return a.map(fn).filter(el => !s.has(el));
}

export const formToObject = form =>
	Array.from(new FormData(form)).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: value
		}),
		{}
	)

export const intersectionBy = (a, b, fn) => {
	const s = new Set(b.map(fn));
	return [...new Set(a)].filter(x => s.has(fn(x)));
}

export const UUIDGeneratorBrowser = () =>
	([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);

export const addMinutesToDate = (date, n) => {
	const d = new Date(date);
	d.setTime(d.getTime() + n * 60000);
	return d.toISOString().split('.')[0].replace('T',' ');
}

export const dateRangeGenerator = function* (start, end, step = 1) {
	let d = start;
	while (d < end) {
		yield new Date(d);
		d.setDate(d.getDate() + step);
	}
}

export const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf())

export const filterUniqueBy = (arr, fn) => arr.filter((v, i) => arr.some((x, j) => (i !== j) === fn(v, x, i, j)))

export const mergeSortedArrays = (a, b) => {
	const _a = [...a],
		_b = [...b];
	return Array.from({ length: _a.length + _b.length }, () => {
		if (!_a.length) return _b.shift();
		else if (!_b.length) return _a.shift();
		else return _a[0] > _b[0] ? _b.shift() : _a.shift();
	});
}

export const onScrollStop = callback => {
	let isScrolling;
	window.addEventListener(
		'scroll',
		() => {
			clearTimeout(isScrolling);
			isScrolling = setTimeout(() => {
				callback();
			}, 150);
		},
		false
	);
}

export const getBaseURL = url => url.replace(/[?#].*$/, '')

export const httpsRedirect = () => {
	if (location.protocol !== 'https:')
		location.replace('https://' + location.href.split('//')[1]);
}

export const addStyles = (el, styles) => Object.assign(el.style, styles)

export const dayName = (date, locale) => date.toLocaleDateString(locale, { weekday: 'long' })

export const htmlEntityDecode = string => {
	let e = document.createElement('div');
	e.innerHTML = string;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export const getTimestamp = (date = new Date()) => Math.floor(date.getTime() / 1000)

export const detectLanguage = (defaultLang = 'en-US') =>
	navigator.language ||
	(Array.isArray(navigator.languages) && navigator.languages[0]) ||
	defaultLang;

export const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1)

export const toCurrency = (n, curr, LanguageFormat = undefined) =>
	Intl.NumberFormat(LanguageFormat, {
		style: 'currency',
		currency: curr,
	}).format(n);

export const detectDeviceType = () =>
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
		? 'Mobile'
		: 'Desktop';

export const isUrlSameOrigin = (origin, destination) => origin.protocol === destination.protocol && origin.host === destination.host

export const touchSupported = () => ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)

export function isWebpSupported() {
	return new Promise((resolve) => {
		const image = new Image()
		image.onerror = () => resolve(false)
		image.onload = () => resolve(image.width === 1)
		image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
	}).catch(() => false)
}

export function isVueComponent(c) {
	return c && c._isVue
}


export const isMobile = {
	Android: function () {
		return (
			typeof window !== 'undefined' &&
			window.navigator.userAgent.match(/Android/i)
		)
	},
	BlackBerry: function () {
		return (
			typeof window !== 'undefined' &&
			window.navigator.userAgent.match(/BlackBerry/i)
		)
	},
	iOS: function () {
		return (
			typeof window !== 'undefined' &&
			(window.navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
				(window.navigator.platform === 'MacIntel' &&
					window.navigator.maxTouchPoints > 1))
		)
	},
	Opera: function () {
		return (
			typeof window !== 'undefined' &&
			window.navigator.userAgent.match(/Opera Mini/i)
		)
	},
	Windows: function () {
		return (
			typeof window !== 'undefined' &&
			window.navigator.userAgent.match(/IEMobile/i)
		)
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		)
	}
}
