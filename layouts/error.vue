<template>
<article class="error">
  <figure>
    <img src="/images/img-error@2x.png" alt="service error"/>
  </figure>
  <h1 class="title">
    <img src="/images/txt-error.svg" :alt="`Service error / ${error.statusCode}`"/>
  </h1>
  <p class="description">
    {{error.message}}
  </p>
  <nav class="nav">
    <button-basic
      label="Go to back"
      @click="$router.back()"
      color="key"
      :inline="true"/>
  </nav>
</article>
</template>

<script>
export default {
  components: {
    'button-basic': () => import('~/components/button/basic'),
  },
  props: [ 'error' ],
}
</script>
<style src="./error.scss" lang="scss" scoped/>
