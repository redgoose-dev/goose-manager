<template/>

<script>
export default {
  name: 'page-logout',
  layout: 'blank',
  async mounted()
  {
    const { $store, $axios, $router } = this;
    const { authUser, url_app, path_root } = $store.state;
    // check user in store
    if (!authUser)
    {
      alert('You have already logged out.');
      location.href = `${path_root}/`;
    }
    try
    {
      // logout api
      await $axios.$post(`/auth/logout/`);
      // remove session
      await $axios.$post(`${url_app}/api/session-clear/`);
      // redirect home
      location.href = `${path_root}/`;
    }
    catch(e)
    {
      alert(e);
      $router.back();
    }
  }
};
</script>
