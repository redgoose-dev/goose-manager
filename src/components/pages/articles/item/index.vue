<template>
<article v-if="!loading" class="article">
  <header class="article__header">
    <small>
      <span v-if="data.nest.name">{{data.nest.name}}</span>
      <span v-if="data.article.categoryName">{{data.article.categoryName}}</span>
    </small>
    <h1>{{data.article.title}}</h1>
    <p>
      <span>{{data.article.type}}</span>
      <span>regdate: {{data.article.regdate}}</span>
      <span v-if="data.article.order">order: {{data.article.order}}</span>
      <span>hit: {{data.article.hit}}</span>
      <span>star: {{data.article.star}}</span>
    </p>
  </header>
  <div class="article__body">
    <!-- TODO: redgoose-body--dark -->
    <div ref="$content" v-html="data.article.content" class="redgoose-body"/>
  </div>
  <Files
    v-if="data.files?.length > 0"
    :items="data.files"
    class="article__files"/>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="list">
        Index
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic v-if="props.nestSrl" href="../create/" color="key" icon-left="plus">
        Create
      </ButtonBasic>
      <ButtonBasic href="./change-nest/">
        Change nest
      </ButtonBasic>
      <ButtonBasic href="./edit/" color="weak" icon-left="edit-3">
        Edit
      </ButtonBasic>
      <ButtonBasic href="./delete/" color="error" icon-left="trash">
        Delete
      </ButtonBasic>
    </template>
  </Controller>
  <Comments
    v-if="useComments"
    :article-srl="props.srl"
    class="article__comments"/>
  <teleport to="#modals">
  </teleport>
</article>
<Loading v-else class="loading"/>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import getData from '../../../../structure/articles/item';
import { err } from '../../../../libs/error';
import Loading from '../../../etc/loading.vue';
import { Controller } from '../../../forms/fieldset';
import ButtonBasic from '../../../button/basic.vue';
import Files from './files.vue';
import Comments from './comments.vue';

const router = useRouter();
const route = useRoute();
const props = defineProps({
  srl: { type: Number, required: true },
  nestSrl: Number,
});
const data = reactive({
  article: undefined,
  nest: undefined,
  files: undefined,
});
const loading = ref(true);
const previewImage = ref(null);
const useComments = computed(() => (Number(data.nest.json.useComment) === 1));

// watches
watch(() => previewImage.value, image => {
  //
});

onMounted(async () => {
  try
  {
    let { article, nest, files } = await getData(Number(route.params.articleSrl));
    data.article = article;
    data.nest = nest;
    data.files = files;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'item', 'index.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    throw new Error();
  }
});
</script>

<style src="./index.scss" lang="scss" scoped></style>