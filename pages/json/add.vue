<template>
<article>
  <page-header module="json" title="Add JSON"/>
  <post ref="post" type="add"/>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/json/post'),
  },
  mounted()
  {
    setTimeout(() => this.$refs.post.$refs.form.name.focus(), 200);
  }
}
</script>