<template>
<form class="filter" @submit.prevent="onSubmit">
  <fieldset :disabled="props.loading">
    <legend>filter of checklist</legend>
    <div class="filter__fields">
      <p class="total">
        <span>Total</span>
        <em>{{total}}</em>
      </p>
      <hr class="filter__line">
      <div class="filter__field range">
        <label for="filter-range">Date range</label>
        <Input
          name="filter-range"
          id="filter-range"
          v-model="forms.dateStart"
          type="date"
          size="small"/>
        <Input
          v-model="forms.dateEnd"
          type="date"
          size="small"/>
      </div>
      <div class="filter__field sort">
        <label for="filter-sort">Sort</label>
        <Select
          name="filter-sort"
          id="filter-sort"
          v-model="forms.sort"
          size="small"
          :placeholder="null"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter-keyword">Keyword</label>
        <Keyword
          name="filter-keyword"
          id="filter-keyword"
          v-model="forms.keyword"
          placeholder="keyword text"
          :use-clear="true"
          :minlength="3"
          :maxlength="20"
          @clear="forms.keyword = ''"/>
      </div>
    </div>
  </fieldset>
  <nav class="filter__nav">
    <ButtonBasic
      type="button"
      size="small"
      icon-left="rotate-ccw"
      :disabled="props.loading"
      @click="onReset">
      Reset
    </ButtonBasic>
    <ButtonBasic
      type="submit"
      color="key"
      size="small"
      icon-left="check"
      :disabled="props.loading">
      Update filter
    </ButtonBasic>
  </nav>
</form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../../store';
import { withCommas } from '../../../libs/number';
import { savePreference } from '../../../preference';
import { Select, Keyword, Input } from '../../forms';
import ButtonBasic from '../../button/basic.vue';

const $keyword = ref();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  total: Number,
  loading: Boolean,
});
const emits = defineEmits([ 'update' ]);
const { filter } = store.state.preference.checklist;
const forms = reactive({
  dateStart: filter.dateStart || '',
  dateEnd: filter.dateEnd || '',
  sort: filter.sort || 'desc',
  keyword: filter.keyword || '',
});
const total = computed(() => withCommas(props.total));

function onReset()
{
  forms.dateStart = filter.dateStart = '';
  forms.dateEnd = filter.dateEnd = '';
  forms.sort = filter.sort = 'desc';
  forms.keyword = filter.keyword = '';
  savePreference();
  emits('update');
}

function onSubmit()
{
  filter.dateStart = forms.dateStart;
  filter.dateEnd = forms.dateEnd;
  filter.sort = forms.sort;
  filter.keyword = forms.keyword;
  savePreference();
  emits('update');
}
</script>

<style src="./filter.scss" lang="scss" scoped></style>
