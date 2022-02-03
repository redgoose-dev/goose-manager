<template>
<article :class="['files-libs', full && 'files-libs--full']">
  <tab
    :tab="tab"
    :external="externalName"
    :show="computedShowTab"
    :full="full"
    class="files-libs__header"
    @click="onChangeTab"
    @open-command-guide="controlCommandGuide(true)"
    @close="$emit('close')"/>
  <div v-if="computedProps" class="files-libs__body">
    <component
      ref="body"
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
  <command-guide v-if="showCommandGuide" @close="controlCommandGuide(false)"/>
</article>
</template>

<script>
const tab = [ 'post', 'local' ];

export default {
  name: 'files-libs',
  components: {
    'tab': () => import('./tab'),
    'content-post': () => import('./content-post'),
    'content-local': () => import('./content-local'),
    'content-external': () => import('./content-external'),
    'icon': () => import('~/components/icon'),
    'command-guide': () => import('~/components/files/parts/command-guide'),
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
      window: [],
      showCommandGuide: false,
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
    computedShowTab()
    {
      let showPost = false;
      if (this.post && this.post.module && this.post.target_srl)
      {
        if (this.post.module === 'articles' || this.post.module === 'comments')
        {
          showPost = true;
        }
      }
      return {
        post: showPost,
        local: !!this.local,
        external: false,
      };
    },
  },
  mounted()
  {
    window.on('keyup.files-libs', (e) => this.initialShortCut(e, 'keyup'));
    window.on('keydown.files-libs', (e) => this.initialShortCut(e, 'keydown'));
  },
  destroyed()
  {
    window.off('keyup.files-libs');
    window.off('keydown.files-libs');
  },
  methods: {
    onChangeTab(tab, external)
    {
      this.tab = tab;
      this.externalName = (tab === 'external') ? external : '';
    },
    customEvent(code, value, value2)
    {
      switch (code)
      {
        case 'close':
          this.$emit('close');
          break;
        case 'insert-text':
          this.$emit('insert', value.map(o => {
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
        case 'insert-html':
          this.$emit('insert', value.map(o => {
            if (/^image/.test(o.type))
            {
              return `<p><img src="${this.$store.state.url_api}/${o.path}" alt="${o.name}"/></p>`;
            }
            else
            {
              return `<p><a href="${this.$store.state.url_api}/${o.path}" target="_blank">${o.name}</a></p>`;
            }
          }));
          break;
        case 'insert-address':
          this.$emit('insert', value.map(o => (`${this.$store.state.url_api}/${o.path}`)));
          break;
        case 'update-thumbnail-editor':
          this.$emit('update-thumbnail', value, value2);
          break;
        case 'window':
          switch (value.action)
          {
            case "open":
              this.window.push(value.code);
              break;
            case "close":
              this.window.pop();
              break;
          }
          break;
      }
    },
    onPushKeyEsc()
    {
      const $body = this.$refs.body;
      switch (this.window[this.window.length-1])
      {
        case 'preview-thumbnail':
          $body.closeSubWindow('preview-thumbnail');
          break;
        case 'thumbnail-editor':
          $body.closeSubWindow('thumbnail-editor');
          break;
        case 'command-guide':
          this.controlCommandGuide(false);
          break;
        default:
          this.$emit('close');
          break;
      }
    },
    insertSelectedItems()
    {
      if (!(this.$refs.body && this.$refs.body.selected)) return;
      if (this.$refs.body.selected.length <= 0) return;
      this.customEvent('insert-text', this.$refs.body.selected);
    },
    controlCommandGuide(sw)
    {
      if (sw)
      {
        this.customEvent('window', { action: 'open', code: 'command-guide' });
        this.showCommandGuide = true;
      }
      else
      {
        this.customEvent('window', { action: 'close' });
        this.showCommandGuide = false;
      }
    },
    initialShortCut(e, type)
    {
      switch (type)
      {
        case 'keyup':
          if (e.key === 'Escape') this.onPushKeyEsc();
          if (e.key === 'Tab')
          {
            let idx = tab.indexOf(this.tab);
            idx = idx + 1;
            if (idx >= tab.length) idx = 0;
            this.tab = tab[idx];
          }
          break;
        case 'keydown':
          if (e.metaKey || e.ctrlKey)
          {
            switch (e.key)
            {
              case 'Enter':
                this.insertSelectedItems();
                break;
              case 'a':
                if (this.$refs.body && this.$refs.body.onClickSelectAll)
                {
                  this.$refs.body.onClickSelectAll();
                }
                break;
            }
          }
          break;
      }
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
