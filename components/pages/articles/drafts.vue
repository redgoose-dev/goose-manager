<template>
<transition name="drafts">
	<article v-if="visible" @click="onClickContainer" class="drafts">
		<div class="drafts__wrap" @click="onClickWrap">
			<header class="drafts__header">
				<h1>Draft articles</h1>
				<p>임시 저장된 글과 첨부파일의 목록입니다. 사용하지 않는다면 꼭 삭제해주세요.</p>
			</header>
			<div class="drafts__body">
				<loading v-if="loading"/>
				<error type="error" v-else-if="error" :frame="false" :message="error"></error>
				<error type="empty" v-else-if="!index.length" :frame="false"></error>
				<ul v-else class="drafts__index">
					<li v-for="(item,key) in index">
						<div>
							<em>{{item.date}}</em>
							<strong v-if="item.description">{{item.description}}</strong>
							<p>
								<span v-if="item.title">{{item.title}}</span>
								<span v-if="item.content">{{item.content}}</span>
							</p>
						</div>
						<nav>
							<button
								type="button"
								title="attach content"
								@click="onAttach(key)"
								class="attach">
								<i class="material-icons">check</i>
							</button>
							<button
								type="button"
								title="Edit description"
								@click="onEditDescription(item.srl, key)"
								class="edit-description">
								<i class="material-icons">chat</i>
							</button>
							<button
								type="button"
								title="remove"
								@click="onRemove(item.srl, key)"
								class="remove">
								<i class="material-icons">delete</i>
							</button>
						</nav>
					</li>
				</ul>
			</div>
		</div>
	</article>
</transition>
</template>

<style src="./drafts.scss" lang="scss" scoped></style>
<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	components: {
		'Loading': () => import('~/components/etc/loading'),
		'Error': () => import('~/components/contents/error'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	computed: {
		index()
		{
			const contentLimit = 50;
			return this.datas.map((item, key) => {
				return {
					srl: item.srl,
					title: item.title,
					content: item.content.substring(0, contentLimit) + ((item.content.length > contentLimit) ? '...' : ''),
					description: item.description,
					date: dates.getFormatDate(item.regdate, true),
				};
			});
		}
	},
	data()
	{
		return {
			visible: false,
			loading: true,
			error: null,
			datas: null,
		};
	},
	methods: {
		onClickContainer()
		{
			this.close();
		},
		onClickWrap(e)
		{
			e.stopPropagation();
		},
		async onEditDescription(srl, key)
		{
			let originalDescription = this.datas[key].description;
			let description = prompt(messages.msg.inputDraftDescription, this.datas[key].description || '');
			if (description === null) return;
			if (!description)
			{
				this.$toast.add({
					color: 'error',
					message: 'Please enter your comment.'
				});
				return;
			}

			this.datas[key].description = description;

			try
			{
				const res = await this.$axios.$post(`/drafts/${srl}/edit`, { description });
				if (!res.success) throw res.message;
				this.$toast.add({
					color: 'success',
					message: 'Success change description',
				});
			}
			catch(e)
			{
				this.$toast.add({ message: 'Failed edit description', color: 'error' });
				this.datas[key].description = originalDescription;
			}
		},
		onAttach(key)
		{
			if (!confirm(messages.msg.confirmUsingDraft)) return;
			let item = this.datas[key];
			this.$emit('attach', {
				srl: item.srl,
				title: item.title,
				content: item.content,
			});
			this.close();
		},
		async onRemove(srl, key)
		{
			if (!confirm(messages.msg.confirmRemove)) return;

			try
			{
				const res = await this.$axios.$post(`/drafts/${srl}/delete`);
				if (!res.success) throw res.message;
				this.datas.splice(key, 1);
				this.$toast.add({
					color: 'success',
					message: 'Success remove draft',
				});
			}
			catch(e)
			{
				this.$toast.add({ message: 'Failed remove draft', color: 'error' });
			}
		},
		async open()
		{
			document.querySelector('html').classList.add('rg-mode-popup');
			this.visible = true;

			try
			{
				const res = await this.$axios.$get('/drafts?order=srl&sort=desc');
				if (!res.success) throw res.message;
				this.datas = res.data.index || [];
				this.loading = false;
				this.error = null;
			}
			catch (e)
			{
				this.loading = false;
				this.error = (typeof e === 'string') ? e : messages.error.service;
			}
		},
		close()
		{
			document.querySelector('html').classList.remove('rg-mode-popup');
			this.visible = false;
			this.loading = true;
			this.error = false;
			this.datas = null;
		},
	},
}
</script>
