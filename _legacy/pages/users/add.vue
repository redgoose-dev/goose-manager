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
  validate({ store, error })
  {
    if (!store.state.authUser.admin)
    {
      error({
        statusCode: 401,
        message: 'You do not have permission.',
      });
    }
    return true;
  },
  mounted()
  {
    setTimeout(() => this.$refs.post.$refs.form.email.focus(), 200);
  },
}
</script>
