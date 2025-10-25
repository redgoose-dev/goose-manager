<template>
<figure class="img">
  <p v-if="error" class="error">
    <Icon name="ban"/>
  </p>
  <img
    v-else-if="_src"
    :src="_src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :draggable="props.draggable"
    loading="lazy"
    @error="onError"/>
  <p v-else class="empty">
    <Icon name="image"/>
  </p>
</figure>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { addQueryParams } from '../../libs/object.js'
import Icon from '../icon/index.vue'

const props = defineProps({
  src: String,
  alt: String,
  width: Number,
  height: Number,
  private: Boolean,
  draggable: Boolean,
})
const auth = inject('auth')
const error = ref(false)

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

function onError()
{
  error.value = true
}
</script>

<style src="./image.scss" lang="scss" scoped></style>
