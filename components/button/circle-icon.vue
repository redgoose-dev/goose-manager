<template>
<button
  v-if="type"
  :type="type"
  :title="title"
  :disabled="disabled"
  :class="classNames"
  @click="onClick">
  <span>
    <i class="material-icons">{{name}}</i>
  </span>
</button>
<nuxt-link v-else-if="to" :to="to" :title="title" :class="classNames">
  <span>
    <i class="material-icons">{{name}}</i>
  </span>
</nuxt-link>
<a v-else :href="href" :target="target" :title="title" :class="classNames">
  <span>
    <i class="material-icons">{{name}}</i>
  </span>
</a>
</template>

<script>
export default {
  props: {
    type: { type: String },
    to: { type: String },
    href: { type: String },
    target: { type: String },
    title: { type: String },
    name: { type: String, default: 'settings' },
    disabled: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    size: { type: String }, // `small`, `large`
    color: { type: String }, // `key`, `gray`
    center: { type: Boolean, default: false },
    className: { type: String },
  },

  computed: {
    classNames: function()
    {
      return [
        'button-circle-icon',
        this.size && `button-circle-icon--size-${this.size}`,
        this.color && `button-circle-icon--color-${this.color}`,
        this.inline && `button-circle-icon--inline`,
        this.center && `button-circle-icon--center`,
        this.className,
      ];
    }
  },

  methods: {
    onClick: function(e)
    {
      this.$emit('onClick', e);
    }
  }
}
</script>

<style src="./circle-icon.scss" lang="scss" scoped/>