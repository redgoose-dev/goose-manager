<template>
<article class="nest-selector">
  <h1 class="sr-only">둥지 선택하기</h1>
  <div v-if="_items.length > 0" class="index">
    <label v-for="o in _items">
      <Card
        :title="o.name"
        :description="o.description"
        class="nest-card">
        <template #after>
          <FormRadio
            :model-value="model"
            name="extra-nest"
            :id="`extra-nest-${o.srl}`"
            :value="Number(o.srl)"
            class="radio-unit"
            @update:model-value="onUpdate"/>
        </template>
      </Card>
    </label>
  </div>
  <div v-else>
    <Empty title="둥지가 없습니다."/>
  </div>
</article>
</template>

<script setup>
import { computed } from 'vue'
import { Card } from '@/components/item/index.js'
import { FormRadio } from '@/components/forms/index.js'
import { Empty } from '@/components/content/index.js'

const model = defineModel()
const props = defineProps({
  nestSrl: Number,
  items: { type: Array, default: [] },
})

const _items = computed(() => {
  if (!(props.items.length > 0)) return []
  return props.items.filter(o => (props.nestSrl !== o.srl))
})

function onUpdate(value)
{
  model.value = Number(value)
}
</script>

<style lang="scss" scoped>
.nest-selector {
  padding: 20px 10px;
}
.index {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.nest-card {
  align-items: center;
  user-select: none;
  &:not(:has(:checked)) {
    cursor: pointer;
  }
  .radio-unit {
    margin: 0 16px 0 0;
    pointer-events: none;
  }
}
</style>
