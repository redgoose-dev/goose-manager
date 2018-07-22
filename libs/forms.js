/**
 * make form data
 *
 * @param {Object} obj
 * @return FormData
 */
export function formData(obj=null)
{
	if (!(obj && typeof obj === 'object')) return null;

	let data = new FormData();
	Object.keys(obj).forEach((o) => {
		data.append(o, obj[o]);
	});
	return data;
}

/**
 * check id
 * "숫자,영어,-_"만 서용할 수 있도록 검사한다.
 *
 * @param {String} str
 * @return {Boolean}
 */
export function checkId(str)
{
	const reg = /^[A-Za-z0-9_-]*$/;
	return reg.test(str);
}
