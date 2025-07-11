<template>
<figure class="img">
  <img
    v-if="_src"
    :src="_src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :draggable="false"
    loading="lazy"/>
  <p v-else class="empty">
    <Icon name="image"/>
  </p>
</figure>
</template>

<script setup>
import { computed, inject } from 'vue'
import { addQueryParams } from '../../libs/object.js'
import Icon from '../icon/index.vue'

const props = defineProps({
  src: String,
  alt: { type: String, default: 'filename' },
  width: Number,
  height: Number,
  private: Boolean,
})
const auth = inject('auth')

const _src = computed(() => {
  if (!props.src)
  {
    return null
  }
  else if (props.src.startsWith('blob:'))
  {
    return props.src
  }
  else if (props.src.startsWith('/file/'))
  {
    if (props.private)
    {
      return addQueryParams(`${auth.apiUrl}${props.src}`, '_a', auth.token)
    }
    else
    {
      return `${auth.apiUrl}${props.src}`
    }
  }
  else
  {
    return props.src
  }
})
</script>

<style src="./image.scss" lang="scss" scoped></style>
