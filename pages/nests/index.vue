<template>
<article>
	<page-header module="nests"/>

	<nav class="rg-nav">
		<button-basic label="Add nest" to="/nests/add" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';
import * as messages from '../../libs/messages';
import * as dates from '../../libs/dates';
import * as object from '../../libs/object';

export default {
	components: {
		PageHeader,
		ButtonBasic,
	},
	async asyncData(cox)
	{
		try
		{
			// get apps
			let apps = await cox.$axios.$get('/apps');
			if (!apps.success) throw 'Failed get apps';
			apps = apps.data.index;
			// get nests
			let seqs = apps.map((o) => cox.$axios.$get(`/nests?app=${o.srl}&unlimit=1`));
			seqs.push(cox.$axios.$get(`/nests?app=NULL&unlimit=1`));
			let nests = await Promise.all(seqs);
			// merge apps and nests
			let tree = [];
			apps.forEach((o, k) => {
				let res = {
					srl: parseInt(o.srl),
					id: o.id,
					name: o.name,
				};
				if (nests[k].data)
				{
					res.nests = nests[k].data.index;
				}
				else
				{
					res.nests = [];
				}
				tree.push(res);
			});
			// get no app data
			if (nests[nests.length-1].data);
			{
				tree.push({
					srl: null,
					id: null,
					name: 'no app',
					nests: nests[nests.length-1].data ? nests[nests.length-1].data.index : []
				});
			}
			console.log('========');
			console.log(tree);

			// TODO: 대충 데이터를 만들었는데 요청이 너무많이 일어남.
			// TODO: 그래서 커스텀화한 전용 API를 만들기로 결정했음.
			// TODO: 주소는 `/custom/manager-nests`으로..
			// TODO: api 먼저 제작해야함.

			// let keys = object.getObjectValueToArray(apps, 'srl');
			//console.log(object.arrayToObject(apps));
			// console.log(keys);

			// let res = await cox.$axios.$get('/nests?order=srl&sort=desc');
			// if (!(res && res.success)) throw messages.service.noItem;
			// let nests = Object.assign([], res.data.index);
			// let tree = object.arrayToObject(nests, 'app_srl', (o) => {
			// 	o.regdate = dates.getFormatDate(o.regdate, false);
			// 	return o;
			// });

			//console.log(Object.keys(tree));

			return {
				index: []
			};
		}
		catch(e)
		{
			console.error(e)
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>