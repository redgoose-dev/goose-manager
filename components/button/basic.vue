<template>
<button
  v-if="type"
  :type="type"
  :title="title"
  :disabled="disabled"
  :class="classNames"
  :style="styles"
  @click="onClick">
  <span v-if="label">{{label}}</span>
  <i v-if="icon" :class="['material-icons', !label && 'solo']">{{icon}}</i>
</button>
<nuxt-link
  v-else-if="to"
  :to="to"
  :title="title"
  :class="classNames"
  :style="styles">
  <span v-if="label">{{label}}</span>
  <i v-if="icon" :class="['material-icons', !label && 'solo']">{{icon}}</i>
</nuxt-link>
<a
  v-else
  :href="href"
  :target="target"
  :title="title"
  :class="classNames"
  :style="styles"
  @click.prevent="onClick">
  <span v-if="label">{{label}}</span>
  <i v-if="icon" :class="['material-icons', !label && 'solo']">{{icon}}</i>
</a>
</template>

<script>
export default {
  props: {
    type: { type: String },
    label: { type: String, default: 'button' },
    href: { type: String },
    to: { type: String },
    target: { type: String },
    title: { type: String },
    disabled: { type: Boolean, default: false },
    size: { type: String }, // `small`, `large`
    color: { type: String }, // `key`, `gray`
    inline: { type: Boolean, default: false },
    rotateIcon: { type: Boolean, default: false },
    icon: { type: String },
    className: { type: String },
    styles: { type: [Object,Array] },
  },
  computed: {
    classNames()
    {
      return [
        'button-basic',
        this.size && `button-basic--size-${this.size}`,
        this.color && `button-basic--color-${this.color}`,
        this.inline && `button-basic--inline`,
        this.rotateIcon && `button-basic--rotate-icon`,
        this.className,
      ];
    },
  },
  methods: {
    onClick(e)
    {
      this.$emit('click', e);
    },
  },
};
</script>
<style src="./basic.scss" lang="scss" scoped/>
