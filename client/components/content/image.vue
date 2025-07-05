<template>
<figure class="img">
  <p v-if="error" class="error">
    <Icon name="circle-slash"/>
  </p>
  <img
    v-else-if="src"
    :src="src"
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { request } from '../../libs/api.js'
import Icon from '../icon/index.vue'

const props = defineProps({
  src: String,
  alt: { type: String, default: 'filename' },
  useFetch: Boolean,
  revoke: { type: Boolean, default: true },
  width: Number,
  height: Number,
})
const src = ref(null)
const error = ref(false)

onMounted(_fetch)
onBeforeUnmount(beforeUnmounted)
watch(() => props.src, _fetch)

async function _fetch()
{
  src.value = null
  if (!props.src)
  {
    error.value = true
    return
  }
  error.value = false
  if (props.src.startsWith('blob:'))
  {
    src.value = props.src
  }
  else if (props.useFetch)
  {
    try
    {
      const blob = await request(props.src, {
        responseType: 'blob',
      })
      if (!blob) throw true
      src.value = URL.createObjectURL(blob)
    }
    catch (e)
    {
      error.value = true
    }
  }
  else
  {
    src.value = props.src
  }
}

function beforeUnmounted()
{
  if (!props.revoke) return
  URL.revokeObjectURL(src.value)
}
</script>

<style src="./image.scss" lang="scss" scoped></style>
