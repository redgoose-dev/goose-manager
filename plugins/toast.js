import Vue from 'vue';

class Toast {

	constructor(options)
	{
		// check client side
		if (!(window && document)) return;

		// set member values
		this.options = {
			message: 'toast message',
			speed: 400,
			delay: 4000,
			color: 'default',
			...options,
		};
		this.elementClassName = 'rg-toast';
		this.index = [];
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

		window.$toast = this;
	}

	add(message, speed, delay, color)
	{
		message = message || this.options.message;
		speed = speed || this.options.speed;
		delay = delay || this.options.delay;
		color = color || this.options.color;

		this.index.push({
			key: this.key,
			message,
			speed,
			delay,
			color,
		});

		// append content
		this.$index.insertAdjacentHTML(
			'beforeend',
			`<li>` +
			`${message}` +
			`</li>`
		);

		this.key += 1;
	}

	remove()
	{
		console.log('call remove toast')
	}
}

Vue.use(
	{
		install(Vue, options)
		{
			Vue.prototype.$toast = new Toast(options);
		}
	},
	{
		message: 'toast message',
		speed: 400,
		delay: 4000,
		color: 'default',
	}
);