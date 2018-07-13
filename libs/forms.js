
export function formData(obj=null)
{
	if (!(obj && typeof obj === 'object')) return;

	let data = new FormData();
	Object.keys(obj).forEach((o) => {
		data.append(o, obj[o]);
	});
	return data;
}