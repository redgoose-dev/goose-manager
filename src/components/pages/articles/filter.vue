<template>
<form class="filter" @submit.prevent="onSubmit">
  <fieldset :disabled="props.loading">
    <legend>filter of articles</legend>
    <div class="filter__fields">
      <p class="total">
        <span>Total</span>
        <em>{{total}}</em>
      </p>
      <hr class="filter__line">
      <div class="filter__field type">
        <label for="filter_type">Type</label>
        <Select
          id="filter_type"
          name="filter_type"
          v-model="forms.type"
          :options="[
            { label: 'all', value: 'all' },
            { label: 'public', value: 'public' },
            { label: 'private', value: 'private' },
          ]"
          :placeholder="null"
          size="small"/>
      </div>
      <div class="filter__field sort">
        <label for="filter_order">Sort</label>
        <Select
          id="filter_order"
          name="filter_order"
          v-model="forms.order"
          :options="[
            { label: 'srl', value: 'srl' },
            { label: 'order', value: 'order' },
          ]"
          :placeholder="null"
          size="small"/>
        <Select
          id="filter_sort"
          name="filter_sort"
          v-model="forms.sort"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"
          :placeholder="null"
          size="small"/>
      </div>
      <div class="filter__field theme">
        <label for="filter_theme">Theme</label>
        <Select
          id="filter_theme"
          name="filter_theme"
          v-model="forms.theme"
          :options="[
            { label: 'List', value: 'list' },
            { label: 'Card', value: 'card' },
            { label: 'Thumbnail', value: 'thumbnail' },
            { label: 'Brick', value: 'brick' },
          ]"
          :placeholder="null"
          size="small"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter_keyword">Keyword</label>
        <Keyword
          ref="$keyword"
          v-model="forms.keyword"
          :minlength="3"
          :maxlength="20"
          placeholder="keyword text"
          size="small"
          :use-clear="true"
          @clear="forms.keyword = ''"
          @submit="onSubmit"/>
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
import { ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../../store';
import { withCommas } from '../../../libs/number';
import { savePreference } from '../../../preference';
import { Select, Keyword } from '../../forms';
import ButtonBasic from '../../button/basic.vue';

const $keyword = ref();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  total: Number,
  loading: Boolean,
});
const emits = defineEmits([ 'update' ]);
const { filter } = store.state.preference.articles;
const forms = reactive({
  type: filter.type || '',
  order: filter.order || '',
  sort: filter.sort || 'desc',
  theme: filter.theme || 'card',
  keyword: filter.keyword || '',
});
const keyword = ref(route.query.q);
const total = computed(() => withCommas(props.total));

function onReset()
{
  forms.type = filter.type = 'all';
  forms.order = filter.order = 'srl';
  forms.sort = filter.sort = 'desc';
  forms.theme = filter.theme = 'card';
  forms.keyword = filter.keyword = '';
  savePreference();
  emits('update');
}

function onSubmit()
{
  filter.type = forms.type;
  filter.order = forms.order;
  filter.sort = forms.sort;
  filter.theme = forms.theme;
  filter.keyword = forms.keyword;
  savePreference();
  emits('update');
}
</script>

<style src="./filter.scss" lang="scss" scoped></style>
