<template>
<article class="error">
  <figure class="image">
    <icon :name="icon"/>
  </figure>
  <h1 class="title">
    Service error / {{error.statusCode}}
  </h1>
  <p class="description">
    {{error.message}}
  </p>
  <nav class="nav">
    <button-basic type="button" :inline="true" size="large" @click="$router.back()">
      {{message.back}}
    </button-basic>
  </nav>
</article>
</template>

<script>
import icons from '~/components/icon/svg-index';
import * as messages from '~/libs/messages';

export default {
  components: {
    'button-basic': () => import('~/components/button/basic'),
    'icon': () => import('~/components/icon'),
  },
  props: [ 'error' ],
  created()
  {
    this.icon = icons[Math.floor(Math.random() * icons.length)];
    this.message = {
      back: messages.keyword.goBack,
    };
  },
}
</script>
<style src="./error.scss" lang="scss" scoped/>
