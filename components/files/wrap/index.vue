<template>
<div class="files-wrap">
  <div class="files-wrap__wrap">
    <slot/>
  </div>
</div>
</template>

<script>
export default {
  name: 'files-wrap',
  mounted()
  {
    document.querySelector('html').classList.add('rg-mode-popup');
  },
  destroyed()
  {
    document.querySelector('html').classList.remove('rg-mode-popup');
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
