<template>
<keep-alive v-if="iconComponent && typeof iconComponent === 'function'">
  <component v-bind:is="iconComponent" :class="{}" :style="{}"/>
</keep-alive>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: { type: String, default: null },
  },
  computed: {
    iconComponent()
    {
      if (!this.name) return null;
      return () => import(`./src/${this.name}`);
    },
  },
}
</script>
