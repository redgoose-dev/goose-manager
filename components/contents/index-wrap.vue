<template>
<div :class="['index', type && `index--${type}`]">
  <slot/>
</div>
</template>

<script>
export default {
  name: 'index-wrap',
  props: {
    type: { type: String, default: null }, // grid,brick
  },
}
</script>

<style src="./index-wrap.scss" lang="scss" scoped/>
