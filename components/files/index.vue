<template>
<article class="files-libs">
  <tab
    :tab="tab"
    :external="external"
    :use-post="computedUsePost"
    @click="onChangeTab"/>
  <div class="files-libs__body">
    <component
      v-bind:is="computedContentComponentName"
      :content-props="computedContentProps"
      @update-selected="updateSelected"/>
  </div>
  <nav class="files-libs__bottom">
    <div>
      <button-basic
        type="button"
        @click="onClickCancel">
        Cancel
      </button-basic>
    </div>
    <div>
      <button-basic
        type="button"
        color="key"
        :disabled="imagePaths.length <= 0"
        @click.stop="onClickInsert">
        Insert
      </button-basic>
    </div>
  </nav>
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
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    initTab: { type: String, default: 'local' }, // post,local,external
    target_srl: { type: Number, default: null },
    module: { type: String, default: null }, // articles,comments
    acceptFileType: { type: String, default: 'image/*' },
  },
  data()
  {
    let tab = this.initTab;
    const isPost = this.target_srl && (this.module === 'articles' || this.module === 'comments');
    if (this.initTab === 'post') tab = isPost ? this.initTab : 'local';
    return {
      tab,
      external: '', // external service name
      imagePaths: [],
    };
  },
  computed: {
    computedContentComponentName()
    {
      return `content-${this.tab}`;
    },
    computedContentProps()
    {
      switch (this.tab)
      {
        case 'post':
          return {
            target_srl: this.target_srl,
            module: this.module,
            acceptFileType: this.acceptFileType,
          };
        case 'local':
        default:
          // TODO: 필요한 값을 더 넣기
          return {
            acceptFileType: this.acceptFileType,
          };
        case 'external':
          return {
            mode: this.external,
          };
      }
    },
    computedUsePost()
    {
      return this.target_srl && (this.module === 'articles' || this.module === 'comments');
    },
  },
  methods: {
    onChangeTab(tab, external)
    {
      this.tab = tab;
      this.external = (tab === 'external') ? external : '';
    },
    onClickCancel()
    {
      this.$emit('cancel');
    },
    onClickInsert()
    {
      this.$emit('insert', this.imagePaths.map((o) => {
        switch (o.type.split('/')[0])
        {
          case 'image':
            return `![${o.name}](${this.$store.state.url_api}/${o.path})`;
          default:
            return `<a href="${this.$store.state.url_api}/${o.path}" target="_blank">${o.name}</a>`;
        }
      }));
    },
    updateSelected(srls, paths)
    {
      this.imagePaths = paths;
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
