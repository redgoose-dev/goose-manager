<template>
<article
  :class="['files-libs', full && 'files-libs--full']">
  <tab
    :tab="tab"
    :external="externalName"
    :show="{ post: !!post, local: !!local }"
    :full="full"
    class="files-libs__header"
    @click="onChangeTab"
    @close="$emit('close')"/>
  <div v-if="computedProps" class="files-libs__body">
    <component
      :is="computedContentComponentName"
      v-bind="computedProps"
      :full="full"
      @custom-event="customEvent"/>
  </div>
  <div v-else class="files-libs__empty">
    <div>
      <icon name="alert-circle"/>
      <p>no data</p>
    </div>
  </div>
</article>
</template>

<script>
export default {
  name: 'files-libs',
  components: {
    'tab': () => import('./tab'),
    'content-post': () => import('./content-post'),
    'content-local': () => import('./content-local'),
    'content-external': () => import('./content-external'),
    'icon': () => import('~/components/icon'),
  },
  props: {
    initTab: { type: String, default: '' }, // post,local,external
    initExternal: { type: String, default: '' },
    post: {
      module: { type: String, default: 'articles' }, // articles,comments
      target_srl: { type: Number, default: null },
      croppie: {},
      thumbnail: {},
    },
    local: {
      dir: { type: String, default: 'assets' },
    },
    external: {},
    acceptFileType: { type: String, default: 'image/*' },
    full: { type: Boolean, default: false },
  },
  data()
  {
    let tab = this.initTab;
    if (this.post)
    {
      const isPost = this.post.target_srl && (this.post.module === 'articles' || this.post.module === 'comments');
      if (this.initTab === 'post') tab = isPost ? this.initTab : 'local';
    }
    return {
      tab,
      externalName: this.initExternal, // external service name
    };
  },
  computed: {
    computedContentComponentName()
    {
      return `content-${this.tab}`;
    },
    computedProps()
    {
      switch (this.tab)
      {
        case 'post':
          return {
            ...this.post,
            acceptFileType: this.acceptFileType,
          };
        case 'local':
          return {
            ...this.local,
            acceptFileType: this.acceptFileType,
          };
        case 'external':
          return {
            ...this.external,
          };
        default:
          return null;
      }
    },
  },
  methods: {
    onChangeTab(tab, external)
    {
      this.tab = tab;
      this.externalName = (tab === 'external') ? external : '';
    },
    customEvent(code, value)
    {
      switch (code)
      {
        case 'close':
          this.$emit('close');
          break;
        case 'insert-text':
          this.$emit('insert', value.map((o) => {
            if (/^image/.test(o.type))
            {
              return `![${o.name}](${this.$store.state.url_api}/${o.path})`;
            }
            else
            {
              return `<a href="${this.$store.state.url_api}/${o.path}" target="_blank">${o.name}</a>`;
            }
          }));
          break;
        case 'update-thumbnail-editor':
          this.$emit('update-thumbnail', value);
          break;
      }
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
