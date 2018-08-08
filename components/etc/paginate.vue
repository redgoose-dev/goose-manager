<template>
	<nav :class="className">
		<a
			v-if="firstLastButton"
			@click="selectFirstPage()"
			title="First"
			:class="[ firstPageSelected() && 'disabled' ]">
			<i class="material-icons">first_page</i>
		</a>
		<a
			v-if="!(hidePrevNext && firstPageSelected())"
			@click="prevPage()"
			title="Prev"
			:class="[ firstPageSelected() && 'disabled' ]">
			<i class="material-icons">chevron_left</i>
		</a>

		<template v-for="page in pages">
			<span v-if="page.breakView" :class="[ 'dots' ]">
				<em>…</em>
			</span>
			<span v-else-if="page.disabled" :class="[ page.selected && 'active', 'disabled' ]">
				<em>{{ page.content }}</em>
			</span>
			<a v-else @click="handlePageSelected(page.index + 1)" :class="[ page.selected && 'active' ]">
				<em>{{ page.content }}</em>
			</a>
		</template>

		<a
			v-if="!(hidePrevNext && lastPageSelected())"
			@click="nextPage()"
			title="Next"
			:class="[ lastPageSelected() && 'disabled' ]">
			<i class="material-icons">chevron_right</i>
		</a>
		<a
			v-if="firstLastButton"
			@click="selectLastPage()"
			title="Last"
			:class="[ lastPageSelected() && 'disabled' ]">
			<i class="material-icons">last_page</i>
		</a>
	</nav>
</template>

<script>
// original repo: https://github.com/lokyoung/vuejs-paginate

export default {
	props: {
		value: { type: Number, default: 1 },
		url: { type: String, required: true },
		pageCount: { type: Number, required: true },
		forcePage: { type: Number },
		pageRange: { type: Number, default: 4 },
		marginPages: { type: Number, default: 1 },
		firstLastButton: { type: Boolean, default: true },
		hidePrevNext: { type: Boolean, default: false },
		className: { type: String, default: 'rg-paginate' },
	},
	beforeUpdate() {
		if (this.forcePage === undefined) return;
		if (this.forcePage !== this.selected) this.selected = this.forcePage;
	},
	computed: {
		selected: function()
		{
			return this.value;
		},
		pages: function ()
		{
			let items = {};
			if (this.pageCount <= this.pageRange)
			{
				for (let index = 0; index < this.pageCount; index++)
				{
					items[index] = {
						index: index,
						content: index + 1,
						selected: index === (this.selected - 1)
					};
				}
			}
			else
			{
				const halfPageRange = Math.floor(this.pageRange / 2);
				let setPageItem = index => {
					items[index] = {
						index: index,
						content: index + 1,
						selected: index === (this.selected - 1)
					};
				};
				let setBreakView = index => {
					items[index] = {
						disabled: true,
						breakView: true
					};
				};

				// 1st - loop thru low end of margin pages
				for (let i = 0; i < this.marginPages; i++)
				{
					setPageItem(i);
				}

				// 2nd - loop thru selected range
				let selectedRangeLow = 0;
				if (this.selected - halfPageRange > 0)
				{
					selectedRangeLow = this.selected - 1 - halfPageRange;
				}

				let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
				if (selectedRangeHigh >= this.pageCount)
				{
					selectedRangeHigh = this.pageCount - 1;
					selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
				}

				for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++)
				{
					setPageItem(i);
				}

				// Check if there is breakView in the left of selected range
				if (selectedRangeLow > this.marginPages) {
					setBreakView(selectedRangeLow - 1)
				}

				// Check if there is breakView in the right of selected range
				if (selectedRangeHigh + 1 < this.pageCount - this.marginPages)
				{
					setBreakView(selectedRangeHigh + 1)
				}

				// 3rd - loop thru high end of margin pages
				for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--)
				{
					setPageItem(i);
				}
			}
			return items
		}
	},
	methods: {
		handlePageSelected(selected)
		{
			if (this.selected === selected) return;
			this.$emit('input', selected);
		},
		prevPage()
		{
			if (this.selected <= 1) return;
			this.$emit('input', this.selected - 1);
		},
		nextPage() {
			if (this.selected >= this.pageCount) return;
			this.$emit('input', this.selected + 1);
		},
		firstPageSelected()
		{
			return this.selected === 1;
		},
		lastPageSelected()
		{
			return (this.selected === this.pageCount) || (this.pageCount === 0);
		},
		selectFirstPage()
		{
			if (this.selected <= 1) return;
			this.$emit('input', 1);
		},
		selectLastPage()
		{
			if (this.selected >= this.pageCount) return;
			this.$emit('input', this.pageCount);
		}
	}
}
</script>