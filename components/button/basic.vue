<template>
<a
  v-if="href"
  :href="href"
  :target="target"
  :title="title"
  :class="classNames"
  :style="styles">
  <span class="button-basic__wrap">
    <icon v-if="iconLeft" :name="iconLeft" class="button-basic__icon left"/>
    <em v-if="$slots.default" class="button-basic__label"><slot/></em>
    <icon v-if="iconRight" :name="iconRight" class="button-basic__icon right"/>
  </span>
</a>
<nuxt-link
  v-else-if="to"
  :to="to"
  :title="title"
  :class="classNames"
  :style="styles">
  <span class="button-basic__wrap">
    <icon v-if="iconLeft" :name="iconLeft" class="button-basic__icon left"/>
    <em v-if="$slots.default" class="button-basic__label"><slot/></em>
    <icon v-if="iconRight" :name="iconRight" class="button-basic__icon right"/>
  </span>
</nuxt-link>
<label
  v-else-if="type === 'label'"
  :title="title"
  :class="classNames"
  :style="styles">
  <span class="button-basic__wrap">
    <icon v-if="iconLeft" :name="iconLeft" class="button-basic__icon left"/>
    <em v-if="$slots.default" class="button-basic__label"><slot/></em>
    <icon v-if="iconRight" :name="iconRight" class="button-basic__icon right"/>
  </span>
</label>
<button
  v-else
  :type="type"
  :title="title"
  :disabled="disabled"
  :class="classNames"
  :style="styles"
  @click="onClick">
  <span class="button-basic__wrap">
    <icon v-if="iconLeft" :name="iconLeft" class="button-basic__icon left"/>
    <em v-if="$slots.default" class="button-basic__label"><slot/></em>
    <icon v-if="iconRight" :name="iconRight" class="button-basic__icon right"/>
  </span>
</button>
</template>

<script>
export default {
  props: {
    type: { type: String, default: 'button' }, // button,submit,reset,label
    label: { type: String, default: null },
    href: { type: String },
    to: { type: String },
    target: { type: String },
    title: { type: String },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: null }, // small,large
    color: { type: String, default: null }, // key,gray
    inline: { type: Boolean, default: false },
    rotateIcon: { type: Boolean, default: false },
    iconLeft: { type: String, default: null },
    iconRight: { type: String, default: null },
    className: { type: String },
    styles: { type: [Object,Array] },
  },
  components: {
    'icon': () => import('~/components/icon'),
  },
  computed: {
    classNames()
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
