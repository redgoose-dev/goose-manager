<template>
<nav class="nav-bottom">
  <dl class="nav-bottom__wrap">
    <dt class="nav-bottom__item nav-bottom__left">
      <slot name="left"/>
    </dt>
    <dd class="nav-bottom__item nav-bottom__right">
      <slot name="right"/>
    </dd>
  </dl>
</nav>
</template>

<script>
export default {
  name: 'nav-bottom',
}
</script>
<style src="./nav-bottom.scss" lang="scss" scoped/>