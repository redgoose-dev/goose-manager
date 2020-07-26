<template/>

<script>
export default {
  name: 'page-logout',
  layout: 'blank',
  async mounted()
  {
    const { $store, $axios, $router } = this;
    // check user in store
    if (!$store.state.authUser)
    {
      alert('You have already logged out.');
      location.href = '/';
    }
    try
    {
      // logout api
      await $axios.$post(`/auth/logout/`);
      // remove session
      await $axios.$post(`${$store.state.url_app}/api/session-clear/`);
      // redirect home
      location.href = '/';
    }
    catch(e)
    {
      alert(e);
      $router.go(-1);
    }
  }
};
</script>
