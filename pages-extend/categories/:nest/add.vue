<template>
<article>
  <page-header module="categories" title="Categories / Add"/>
  <post ref="post" type="add" :nest_srl="nest_srl"/>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/categories/post'),
  },
  validate(cox)
  {
    return cox.params.nest && /^\d+$/.test(cox.params.nest);
  },
  data()
  {
    return {
      nest_srl: parseInt(this.$route.params.nest)
    };
  },
  mounted()
  {
    setTimeout(() => this.$refs.post.$refs.form.name.focus(), 200);
  },
}
</script>
