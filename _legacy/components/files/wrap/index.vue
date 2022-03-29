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
    document.querySelector('html').classList.add('popup-modal-basic');
  },
  destroyed()
  {
    document.querySelector('html').classList.remove('popup-modal-basic');
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
