<template>
<article class="empty">
  <div class="empty__wrap">
    <figure class="empty__icon">
      <Icon :name="props.icon"/>
    </figure>
    <h1 class="empty__title">
      {{props.title}}
    </h1>
    <p v-if="props.message" class="empty__message">
      {{props.message}}
    </p>
  </div>
</article>
</template>

<script setup>
import Icon from '../icon/index.vue'

const props = defineProps({
  title: { type: String, required: true },
  message: String,
  icon: { type: String, default: 'bird' },
})
</script>

<style src="./empty.scss" lang="scss" scoped></style>
