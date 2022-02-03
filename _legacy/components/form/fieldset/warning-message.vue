<template>
<div class="warning-message">
  <div class="warning-message__body">
    <slot/>
  </div>
</div>
</template>

<script>
export default {
  name: 'warning-message',

}
</script>

<style src="./warning-message.scss" lang="scss" scoped/>
