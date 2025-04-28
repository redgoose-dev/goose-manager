<template>
<article class="empty">
  <div class="empty__wrap">
    <figure class="empty__icon">
      <Icon :name="iconName"/>
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
import { iconRandomPick } from '../icons/assets'
import Icon from '../icons/index.vue'

const props = defineProps({
  title: { type: String, required: true },
  message: String,
})
const iconName = iconRandomPick()
</script>

<style src="./empty.scss" lang="scss" scoped></style>
