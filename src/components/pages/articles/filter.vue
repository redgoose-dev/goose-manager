<template>
<form class="filter" @submit.prevent="">
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
          size="small"
          v-model="filter.type"
          :options="[
            { label: 'all', value: 'all' },
            { label: 'public', value: 'public' },
            { label: 'private', value: 'private' },
          ]"
          :placeholder="null"
          @update:modelValue="onUpdate('type', $event)"/>
      </div>
      <div class="filter__field sort">
        <label for="filter_order">Sort</label>
        <Select
          id="filter_order"
          name="filter_order"
          size="small"
          v-model="filter.order"
          :options="[
            { label: 'srl', value: 'srl' },
            { label: 'order', value: 'order' },
          ]"
          :placeholder="null"
          @update:modelValue="onUpdate('order', $event)"/>
        <Select
          id="filter_sort"
          name="filter_sort"
          size="small"
          v-model="filter.sort"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"
          :placeholder="null"
          @update:modelValue="onUpdate('sort', $event)"/>
      </div>
      <div class="filter__field theme">
        <label for="filter_theme">Theme</label>
        <Select
          id="filter_theme"
          name="filter_theme"
          size="small"
          v-model="filter.theme"
          :options="[
            { label: 'List', value: 'list' },
            { label: 'Card', value: 'card' },
            { label: 'Thumbnail', value: 'thumbnail' },
            { label: 'Brick', value: 'brick' },
          ]"
          :placeholder="null"
          @update:modelValue="onUpdate('theme', $event)"/>
      </div>
      <div class="filter__field keyword">
        <label for="filter_keyword">Keyword</label>
        <Keyword
          ref="$keyword"
          v-model="keyword"
          size="small"
          :maxlength="20"
          placeholder="keyword"
          @clear="keyword = ''"
          @submit="onUpdate('keyword', $event)"/>
      </div>
    </div>
  </fieldset>
</form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../../store';
import { serialize, printf } from '../../../libs/string';
import { withCommas } from '../../../libs/number';
import { message } from '../../../message';
import { savePreference } from '../../../preference';
import { Select, Keyword } from '../../forms';

const $keyword = ref();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  total: Number,
  loading: Boolean,
});
const emits = defineEmits([ 'update' ]);
const { filter } = store.state.preference.articles;
const keyword = ref(route.query.q);
const keywordMinlength = 3;
const total = computed(() => withCommas(props.total));

function onUpdate(key, value)
{
  let param;
  switch (key)
  {
    case 'type':
    case 'order':
    case 'sort':
    case 'theme':
      savePreference();
      emits('update');
      break;
    case 'keyword':
      if (keyword.value.length > 0 && keyword.value.length < keywordMinlength)
      {
        alert(printf(message.error.keywordMinlength, String(keywordMinlength)));
        $keyword.value.$input.focus();
        return;
      }
      param = {
        ...route.query,
        q: keyword.value || undefined,
        page: undefined,
      };
      router.push(`./${serialize(param, true)}`).then();
      break;
  }
}
</script>

<style src="./filter.scss" lang="scss" scoped></style>
