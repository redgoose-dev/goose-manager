<template>
<section v-if="!loading" class="comments">
  <h1>.comments</h1>
  <ul>
    <li>.item</li>
  </ul>
  <p>.comments-body</p>
</section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getComments } from '../../../../structure/articles/comments';
import { err } from '../../../../libs/error';

const props = defineProps({
  articleSrl: { type: Number, required: true },
});
const index = ref([]);
const loading = ref(true);

onMounted(async () => {
  try
  {
    index.value = await getComments(props.articleSrl);
    loading.value = false;
    // TODO: 데이터가 나오면 작업 이어하기
  }
  catch (e)
  {
    loading.value = false;
    err(['components', 'pages', 'articles', 'item', 'comments.vue', 'onMounted()'], 'error', e.message);
  }
});
</script>

<style src="./comments.scss" lang="scss" scoped></style>
