import Vue from 'vue';
import * as util from '~/libs/util';

const defaultOptions = {
	message: 'toast message',
	speed: 400,
	delay: 3000,
	color: null, // success,error
	max: 5,
};

/**
 * convert html to element
 * https://stackoverflow.com/a/494348
 *
 * @param {String} str
 * @return {Node}
 */
function htmlToElement(str)
{
	let div = document.createElement('div');
	div.innerHTML = str.trim();
	return div.firstChild;
}

class Toast {

	static transitionEnd(dom, type)
	{
		return new Promise(function(resolve) {
			if (!dom) return;
			let event = {};

			switch (type)
			{
				case 'animation':
					event.base = 'animationend';
					event.webkit = 'webkitAnimationEnd';
					break;
				default:
					event.base = 'transitionend';
					event.webkit = 'webkitTransitionEnd';
					break;
			}

			function callback(e)
			{
				dom.removeEventListener(event.base, callback);
				dom.removeEventListener(event.webkit, callback);
				resolve(e);
			}

			dom.addEventListener(event.base, callback);
			dom.addEventListener(event.webkit, callback);
		});
	}

	constructor(options)
	{
		// check client side
		if (!(window && document)) return;

		// set member values
		this.options = {
			...defaultOptions,
			...options,
		};
		this.elementClassName = 'rg-toast';
		this.index = {};
		this.key = 0;

		// check container element
		if (document.querySelector(`.${this.elementClassName}`)) return;

		// set elements
		this.$container = document.createElement('div');
		this.$index = document.createElement('ul');
		this.$container.classList.add(this.elementClassName);
		this.$container.appendChild(this.$index);

		// append dom
		document.body.appendChild(this.$container);
	}

	/**
	 * add toast
	 *
	 * @param {Object} op
	 */
	add(op)
	{
		if (typeof op === 'string') op = { message: op };

		// set values
		op.message = op.message || this.options.message;
		op.color = op.color || this.options.color;
		op.speed = (op.speed === null || op.speed === undefined) ? this.options.speed : op.speed;
		op.speed = (op.speed === 0) ? 100 : op.speed;
		op.delay = (op.delay === null || op.delay === undefined) ? this.options.delay : op.delay;
		op.icon = op.icon || null;

		// set element
		let $li = htmlToElement(`<li class="rg-toast__item">` +
			`<div class="rg-toast__item-body">` +
			(op.icon ? `<i class="material-icons">${op.icon}</i>` : '') +
			`<span class="rg-toast__message">${op.message}</span>` +
			`</div>` +
			`<i class="rg-toast__progress"></i>` +
			`</li>`);

		// set data
		$li.dataset.key = this.key;
		$li.dataset.speed = op.speed;
		$li.dataset.delay = op.delay;

		// set color
		if (op.color) $li.classList.add(op.color);

		// set event
		$li.addEventListener('click', (e) => {
			this.remove(parseInt(e.currentTarget.dataset.key));
		});

		// push item
		this.index[this.key] = {
			el: $li,
			message: op.message,
			speed: op.speed,
			delay: op.delay,
			color: op.color,
			icon: op.icon,
		};

		// update key for next toast
		this.key += 1;

		// append content
		this.$index.insertBefore($li, this.$index.firstChild);

		// toast 갯수가 특정갯수가 넘어가면 오래된것부터 삭제한다.
		if (this.options.max < Object.keys(this.index).length)
		{
			let removeItems = Object.keys(this.index).reverse().slice(this.options.max, Object.keys(this.index).length);
			removeItems.forEach((n) => this.remove(n));
		}

		// animation play
		util.sleep(20).then((param, timer) => {
			//console.log(timer);
			$li.style.transitionDuration = `${op.speed}ms`;
			$li.classList.add('rg-toast__item-show');

			// check delay (delay값이 20보다 작으면 항상 떠있도록..)
			if (op.delay < 20) return null;

			this.constructor.transitionEnd($li, null).then((e) => {
				// 브라우저에 따라 대기방식이 달라진다.
				if (util.browser() === 'chrome' || util.browser() === 'firefox')
				{
					let progress = e.target.querySelector('.rg-toast__progress');
					progress.style.animationDuration = `${e.target.dataset.delay}ms`;
					progress.classList.add('play');
					this.constructor.transitionEnd(progress, 'animation').then((e) => {
						this.remove(e.target.parentNode.dataset.key);
					});
				}
				else
				{
					util.sleep(parseInt(e.target.dataset.delay), Number(e.target.dataset.key)).then((n) => {
						this.remove(n);
					});
				}
			});
		});
	}

	/**
	 * remove
	 */
	remove(key)
	{
		// check
		if (key === null) return;
		if (!this.index[key]) return;

		// set values
		let el = this.index[key].el;
		let speed = this.index[key].speed;

		// remove item from index
		delete this.index[key];

		// close animation
		el.style.transitionDuration = `${speed}ms`;
		el.classList.remove('rg-toast__item-show');

		this.constructor.transitionEnd(el, null).then((e) => {
			this.$index.removeChild(e.target); // remove item
		});
	}
}

Vue.use({
	install(Vue, options)
	{
		Vue.prototype.$toast = new Toast(options);
	}
});