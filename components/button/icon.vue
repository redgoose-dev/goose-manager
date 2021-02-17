<template>
<a
  v-if="computedType === 'a'"
  :title="title"
  :href="href"
  :target="target"
  :class="computedClass">
  <icon :name="iconName" class="button-icon__unit"/>
</a>
<nuxt-link
  v-else-if="computedType === 'router'"
  :title="title"
  :to="href"
  :class="computedClass">
  <icon :name="iconName" class="button-icon__unit"/>
</nuxt-link>
<button
  v-else
  :type="computedType"
  :title="title"
  :class="computedClass"
  @click="$emit('click')">
  <icon :name="iconName" class="button-icon__unit"/>
</button>
</template>

<script>
export default {
  name: 'button-icon',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    iconName: { type: String, default: 'menu' },
    href: { type: String },
    target: { type: String },
    title: { type: String },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    computedType()
    {
      if (this.href)
      {
        return /^http/.test(this.href) ? 'a' : 'router';
      }
      switch (this.type)
      {
        case 'reset':
        case 'submit':
          return this.type;
        case 'button':
        default:
          return 'button';
      }
    },
    computedClass()
    {
      return [
        'button-icon',
        (this.computedType === 'a' || this.computedType === 'router') && 'button-icon--link',
        this.disabled && 'button-icon--disabled',
      ];
    }
  },
}
</script>

<style src="./icon.scss" lang="scss" scoped></style>
