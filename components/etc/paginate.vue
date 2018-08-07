<template>
	<nav :class="className">
		<a
			v-if="firstLastButton"
			@click="selectFirstPage()"
			:class="[ firstPageSelected() && 'disabled' ]">
			First
		</a>
		<a
			v-if="!(hidePrevNext && firstPageSelected())"
			@click="prevPage()"
			:class="[ firstPageSelected() && 'disabled' ]">
			Prev
		</a>

		<template v-for="page in pages">
			<span v-if="page.breakView" :class="[ page.disabled && 'disabled' ]">
				<slot name="breakViewContent">…</slot>
			</span>
			<span v-else-if="page.disabled" :class="[ page.selected && 'active', 'disabled' ]">
				{{ page.content }}
			</span>
			<a v-else @click="handlePageSelected(page.index + 1)" :class="[ page.selected && 'active' ]">
				{{ page.content }}
			</a>
		</template>

		<a
			v-if="!(hidePrevNext && lastPageSelected())"
			@click="nextPage()"
			:class="[ lastPageSelected() && 'disabled' ]">
			Next
		</a>
		<a
			v-if="firstLastButton"
			@click="selectLastPage()"
			:class="[ lastPageSelected() && 'disabled' ]">
			Last
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
		pageRange: { type: Number, default: 3 },
		marginPages: { type: Number, default: 1 },
		firstLastButton: { type: Boolean, default: false },
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