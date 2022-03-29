<template>
<div :class="[ 'thumbnail', selected && 'thumbnail--selected']">
  <button
    type="button"
    class="thumbnail__button"
    @click.prevent="$emit('click', $event)">
    <img v-if="computedType === 'image'" :src="computedImage" :alt="filename">
    <span v-else>
      <icon :name="computedType"/>
      <em>{{filename}}</em>
    </span>
  </button>
  <div v-if="context && context.length" ref="context" class="context">
    <button type="button" class="context__button">
      <icon name="menu"/>
    </button>
    <ul class="context__menu">
      <li v-for="(o,k) in context">
        <button
          type="button"
          :data-key="componentKey"
          :class="[`color--${o.color}`]"
          @click="o.click">
          {{o.label}}
        </button>
      </li>
    </ul>
  </div>
  <ul v-if="badge && badge.length" class="badge">
    <li v-for="o in badge">
      <icon :name="o"/>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'thumbnail-item',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    componentKey: { type: Number, default: null },
    img: { type: String, default: null },
    filename: { type: String, default: null },
    type: { type: String, default: null },
    selected: { type: Boolean, default: false },
    badge: { type: Array, default: [] },
    context: { type: Array, default: [] },
  },
  computed: {
    computedImage()
    {
      const { $store, img } = this;
      return `${$store.state.url_api}/${img}`;
    },
    computedType()
    {
      if (!this.type) return '';
      const type = this.type.split('/')[0];
      switch (type)
      {
        case 'image':
          return 'image';
        default:
          return 'file';
      }
    },
  },
  methods: {},
}
</script>

<style src="./thumbnails-item.scss" lang="scss" scoped/>
