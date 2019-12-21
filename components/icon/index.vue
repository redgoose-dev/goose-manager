<template>
<svg :width="size" :height="size" :stroke-width="strokeWidth" :color="color">
  <use :xlink:href="`/icons/${name}.svg#icon_${name}`"/>
</svg>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: { type: String, default: null },
    size: { type: Number, default: 24 },
    strokeWidth: { type: Number, default: 2 },
    color: { type: String, default: '' },
  },
}
</script>
