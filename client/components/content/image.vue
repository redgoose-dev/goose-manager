<template>
<figure class="img">
  <p v-if="error">
    <Icon name="circle-slash"/>
  </p>
  <img
    v-else-if="src"
    :src="src"
    :alt="props.alt"
    :draggable="false"
    loading="lazy"/>
  <figcaption v-else>
    <Icon name="image"/>
  </figcaption>
</figure>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { request } from '../../libs/api.js'
import Icon from '../icon/index.vue'

const props = defineProps({
  src: String,
  alt: { type: String, default: 'filename' },
  useFetch: Boolean,
  revoke: { type: Boolean, default: true },
})
const src = ref(null)
const error = ref(false)

onMounted(_fetch)
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
    if (props.revoke)
    {
      setTimeout(() => URL.revokeObjectURL(src.value), 100)
    }
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
      if (props.revoke)
      {
        setTimeout(() => URL.revokeObjectURL(src.value), 100)
      }
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
</script>

<style src="./image.scss" lang="scss" scoped></style>
