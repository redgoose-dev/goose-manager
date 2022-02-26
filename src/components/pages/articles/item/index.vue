<template>
<article class="article">
  <header class="article__header">
    <small>.header-small</small>
    <h1>.header-title</h1>
    <p>.header-description</p>
  </header>
  <div class="article__body">
    <div ref="$content" class="redgoose-body">
      .content
    </div>
  </div>
  <section class="files">
    <h1>Attachment files</h1>
    .files
  </section>
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
</article>
</template>

<script setup>
import { Controller } from '../../../forms/fieldset';
import ButtonBasic from '../../../button/basic.vue';

const props = defineProps({
  srl: { type: Number, required: true },
  nestSrl: Number,
});
console.log(props)
console.log(props)
</script>
