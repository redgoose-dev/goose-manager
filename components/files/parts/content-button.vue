<template>
<form v-if="type === 'file'" :class="computedClassName">
  <input
    type="file"
    :multiple="multiple"
    :accept="accept"
    :disabled="disabled"
    class="files-content-button__input"
    @change="onChangeFile">
  <span class="files-content-button__wrap">
    <icon v-if="icon" :name="icon" class="files-content-button__icon"/>
    <em class="files-content-button__label">{{label}}</em>
  </span>
</form>
<button v-else :type="type" :disabled="disabled" :class="computedClassName" @click="$emit('click')">
  <span class="files-content-button__wrap">
    <icon v-if="icon" :name="icon" class="files-content-button__icon"/>
    <em class="files-content-button__label">{{label}}</em>
  </span>
</button>
</template>

<script>
export default {
  name: 'content-button',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    type: { type: String, default: 'button' }, // file,button
    label: { type: String, default: 'label' },
    icon: { type: String, default: null },
    accept: { type: String, default: 'image/*' },
    multiple: { type: Boolean, default: true },
    color: { type: String, default: null },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    computedClassName()
    {
      return [
        'files-content-button',
        this.color && `files-content-button--color-${this.color}`,
        this.disabled && `files-content-button--disabled`,
      ];
    },
  },
  methods: {
    onChangeFile(e)
    {
      const { files } = e.target;
      this.$emit('change', files);
    },
  },
}
</script>

<style src="./content-button.scss" lang="scss" scoped/>
