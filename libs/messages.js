/**
 * printf
 *
 * @param {String} str
 * @param {String} values
 * @return {String}
 */
export function printf(str, ...values)
{
	for (let i = 0; i < values.length; i++)
	{
		let pattern = `\\{${i}\\}`;
		let replace = new RegExp(pattern, 'g');
		str = str.replace(replace, values[i]);
	}
	return str;
}


export const service = {
	noItem: 'No item',
};

export const error = {
	service: 'Service error',
	id: 'Please enter only alphanumeric characters `-` and `_`.',
	noValue: `There is no value for '{0}'.`
};