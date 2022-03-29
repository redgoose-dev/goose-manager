<template>
  <button v-if="disabled" type="button" :disabled="true">
    <slot/>
  </button>
  <nuxt-link v-else-if="buttonType === 'nuxt-link'" :to="link">
    <slot/>
  </nuxt-link>
  <a v-else-if="buttonType === 'href'" :href="link" :target="target">
    <slot/>
  </a>
  <button v-else type="button" @click="$emit('click')">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'item-button',
  props: {
    buttonType: { type: String, default: '' }, // nuxt-link,href,button
    link: { type: String, default: null },
    target: { type: String, default: null },
    disabled: { type: Boolean, default: false },
  },
}
</script>
