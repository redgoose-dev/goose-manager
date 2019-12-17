<template>
<p class="text-title">
  <nuxt-link v-if="!!link" :to="link">
    <strong>{{label}}</strong>
  </nuxt-link>
  <a v-else-if="href" :href="href" :target="target">
    <strong>{{label}}</strong>
  </a>
  <strong v-else>{{label}}</strong>
</p>
</template>

<script>
export default {
  name: 'text-title',
  props: {
    label: { props: String, default: '' },
    link: { props: String, default: null },
    href: { props: String, default: null },
    target: { props: String, default: null },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";

.text-title {
  display: block;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .875rem;
  line-height: 1.4;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>