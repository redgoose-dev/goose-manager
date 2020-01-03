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
    <button-basic color="key" :inline="true" @click="$router.back()">Go to back</button-basic>
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
