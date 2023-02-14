<template>
<ul v-if="items.length > 0" class="verify-items">
  <li
    v-for="(o,k) in items"
    class="verify-item">
    <figure class="verify-item__asset">
      <a :href="o.src" target="_blank">
        <img
          v-if="o.typeName === 'image'"
          :src="o.src"
          :alt="o.name"
          loading="lazy"/>
        <span v-else title="o.name">
          <Icons name="file"/>
        </span>
      </a>
    </figure>
    <div class="verify-item__body">
      <h4>{{o.name}}</h4>
      <p>
        <span>{{o.type}}</span>
        <span>{{o.size}}</span>
      </p>
    </div>
    <nav class="verify-item__nav">
      <button
        type="button"
        title="삭제"
        @click="onClickRemoveItem(k)">
        <Icons name="trash-2"/>
      </button>
    </nav>
  </li>
</ul>
<div v-else class="verify-empty">
  <p>등록된 파일이 없습니다.</p>
</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getByte } from '../../../libs/string'
import type { VerifyItem } from './types'
import Icons from '../../icons/index.vue'

const props = defineProps<{
  src: VerifyItem[]
}>()
const emits = defineEmits([ 'remove-item' ])
const checks = ref<{ [key: number]: boolean }>((() => {
  let checks: { [key: number]: boolean } = {}
  if (props.src.length > 0)
  {
    for (let i: number = 0; i < props.src.length; i++)
    {
      checks[i] = true
    }
  }
  return checks
})())
const items = computed<any[]>(() => {
  if (!(props.src.length > 0)) return []
  return props.src.map(o => {
    return {
      src: URL.createObjectURL(o.blob),
      name: o.name,
      size: getByte(o.blob.size),
      type: o.type,
      typeName: o.type.split('/')[0],
    }
  })
})

function onClickRemoveItem(idx: number): void
{
  emits('remove-item', idx)
}
</script>

<style src="./items.scss" lang="scss" scoped></style>
