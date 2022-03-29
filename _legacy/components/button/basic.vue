<template>
<a
  v-if="computedType === 'a'"
  :href="href"
  :target="target"
  :title="title"
  :class="computedClass"
  :style="styles">
  <button-body :icon-left="iconLeft" :icon-right="iconRight">
    <slot/>
  </button-body>
</a>
<nuxt-link
  v-else-if="computedType === 'router'"
  :to="href"
  :title="title"
  :class="computedClass"
  :style="styles">
  <button-body :icon-left="iconLeft" :icon-right="iconRight">
    <slot/>
  </button-body>
</nuxt-link>
<label
  v-else-if="computedType === 'label'"
  :title="title"
  :class="computedClass"
  :style="styles">
  <button-body :icon-left="iconLeft" :icon-right="iconRight">
    <slot/>
  </button-body>
</label>
<button
  v-else
  :type="type"
  :title="title"
  :disabled="disabled"
  :class="computedClass"
  :style="styles"
  @click="$emit('click', $event)">
  <button-body :icon-left="iconLeft" :icon-right="iconRight">
    <slot/>
  </button-body>
</button>
</template>

<script>
export default {
  name: 'button-basic',
  props: {
    type: { type: String, default: 'button' }, // label,button,submit,reset
    label: { type: String, default: null },
    href: { type: String },
    target: { type: String },
    title: { type: String },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: null }, // mini,small,large
    color: { type: String, default: null }, // key,gray
    inline: { type: Boolean, default: false },
    rotateIcon: { type: Boolean, default: false },
    iconLeft: { type: String, default: null },
    iconRight: { type: String, default: null },
    className: { type: String },
    styles: { type: [Object,Array] },
  },
  components: {
    'button-body': () => import('./body'),
  },
  computed: {
    computedClass()
    {
      return [
        'button-basic',
        this.size && `button-basic--size-${this.size}`,
        this.color && `button-basic--color-${this.color}`,
        this.inline && `button-basic--inline`,
        this.rotateIcon && `button-basic--animation`,
        this.className,
      ];
    },
    computedType()
    {
      if (this.href)
      {
        return /^http/.test(this.href) ? 'a' : 'router';
      }
      else
      {
        return this.type || null;
      }
    },
  },
};
</script>

<style src="./basic.scss" lang="scss" scoped/>
