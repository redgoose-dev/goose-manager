<template>
<article class="labs">
  <page-header title="Labs" description="개발에 필요한 실험적인 공간"/>

  <nav class="labs-tab">
    <nuxt-link to="/labs/">Home</nuxt-link>
    <nuxt-link to="/labs/button/">Button</nuxt-link>
    <nuxt-link to="/labs/forms/">Forms</nuxt-link>
    <nuxt-link to="/labs/fieldset/">Fieldset</nuxt-link>
    <nuxt-link to="/labs/icons/">Icons</nuxt-link>
    <nuxt-link to="/labs/colors/">Colors</nuxt-link>
    <nuxt-link to="/labs/etc/">etc</nuxt-link>
  </nav>

  <div class="labs__body">
    <nuxt-child/>
  </div>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
