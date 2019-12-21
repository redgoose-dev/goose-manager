<template>
<article>
  <page-header module="users" title="Users / Add"/>
  <post ref="post" type="add"/>
</article>
</template>

<script>
export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'post': () => import('~/components/pages/users/post'),
  },
  mounted()
  {
    setTimeout(() => this.$refs.post.$refs.form.email.focus(), 200);
  },
}
</script>
