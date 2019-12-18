<template>
<article>
  <page-header title="Labs" description="개발에 필요한 실험적인 공간"/>

  <nav>
    <nuxt-link to="/labs/ui/">UI</nuxt-link>
    <nuxt-link to="/labs/icons/">icons</nuxt-link>
  </nav>

  <div>
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
