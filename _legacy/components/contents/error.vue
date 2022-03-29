<template>
<div :class="[
  'error',
  size && `error--size-${size}`,
  frame && `error--frame`,
]">
  <div class="error__body">
    <p class="error__icon">
      <icon :name="computedIconName"/>
    </p>
    <p class="error__message">{{computedText}}</p>
  </div>
</div>
</template>

<script>
import * as messages from '~/libs/messages';
import icons from '~/components/icon/svg-index';

export default {
  name: 'error',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    type: { type: String, default: '' }, // empty
    icon: { type: String, default: '' }, // icon name
    message: { type: String, default: null },
    size: { type: String, default: '' }, // small,large
    frame: { type: Boolean, default: false },
  },
  computed: {
    computedText()
    {
      if (this.message) return this.message;

      switch(this.type)
      {
        case 'empty':
          return 'No results.';
        default:
          return messages.error.service;
      }
    },
    computedIconName()
    {
      if (this.icon) return this.icon;
      else return icons[Math.floor(Math.random() * icons.length)];
    }
  }
}
</script>

<style src="./error.scss" lang="scss" scoped/>
