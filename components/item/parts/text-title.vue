<template>
<p :class="['text-title', href && 'text-title--link']">
  <nuxt-link v-if="computedLinkType === 'router'" :to="href">
    <strong>{{label}}</strong>
  </nuxt-link>
  <a v-else-if="computedLinkType === 'a'" :href="href" :target="target">
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
    href: { props: String, default: null },
    target: { props: String, default: null },
  },
  computed: {
    computedLinkType()
    {
      return (this.href && /^http/.test(this.href)) ? 'a' : (this.href ? 'router' : null);
    },
  },
}
</script>

<style src="./text-title.scss" lang="scss" scoped/>
