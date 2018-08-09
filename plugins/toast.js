import Vue from 'vue';
import * as util from '~/libs/util';

const defaultOptions = {
	message: 'toast message',
	speed: 500,
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

	static async open(el, speed, delay)
	{
		await util.sleep(10);
		el.style.transitionDuration = `${speed}ms`;
		el.classList.add('rg-toast__item-show');
		if (delay > 100)
		{
			await util.sleep(speed + delay);
			return parseInt(el.dataset.key);
		}
		else
		{
			return null;
		}
	}

	static async close(el, speed)
	{
		el.style.transitionDuration = `${speed}ms`;
		el.classList.remove('rg-toast__item-show');
		await util.sleep(speed);
		return el;
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
		// set values
		op.message = op.message || this.options.message;
		op.color = op.color || this.options.color;
		op.speed = op.speed || this.options.speed;
		op.delay = op.delay || this.options.delay;
		op.icon = op.icon || null;

		// set element
		let $li = htmlToElement(`<li class="rg-toast__item" data-key="${this.key}">` +
			(op.icon ? `<i class="material-icons">${op.icon}</i>` : '') +
			`<span>${op.message}</span>` +
			`</li>`);

		// set color
		if (op.color)
		{
			$li.classList.add(`rg-toast__item-${op.color}`);
		}

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

		// open item
		this.constructor.open($li, op.speed, op.delay).then((k) => {
			this.remove(k);
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
		this.constructor.close(el, speed).then((el) => this.$index.removeChild(el));
	}
}

Vue.use({
	install(Vue, options)
	{
		Vue.prototype.$toast = new Toast(options);
	}
});