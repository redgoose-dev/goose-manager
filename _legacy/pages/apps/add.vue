<template>
<article>
  <page-header module="apps" title="Apps / Add"/>
  <post ref="post" type="add"/>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/apps/post'),
  },
  mounted()
  {
    setTimeout(() => this.$refs.post.$refs.form.id.focus(), 200);
  },
}
</script>
