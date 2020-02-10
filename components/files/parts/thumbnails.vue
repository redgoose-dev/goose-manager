<template>
<div class="thumbnails">
  <ul v-if="index && index.length" class="thumbnails__wrap">
    <li v-for="(item,key) in index" @click.stop="">
      <div>
        <thumbnail-item
          v-if="item.complete"
          :component-key="key"
          :srl="parseInt(item.srl)"
          :img="item.path"
          :filename="item.name"
          :type="item.type"
          :selected="selected[key]"
          :context="context"
          @click="(e) => onClickItem(key, e)"/>
        <thumbnail-loading v-else :percent="item.percent"/>
      </div>
    </li>
  </ul>
  <div v-else class="thumbnails__empty">
    <div>
      <icon name="paperclip"/>
      <p>There are no attachments.</p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'thumbnails',
  components: {
    'thumbnail-item': () => import('./thumbnails-item'),
    'thumbnail-loading': () => import('./thumbnails-loading'),
    'icon': () => import('~/components/icon'),
  },
  props: {
    index: { type: Array, default: [] },
    context: { type: Array, default: [] },
  },
  created()
  {
    this.eventName = 'files-thumbnails';
  },
  data()
  {
    return {
      selected: [],
      lastSelectedKey: 0,
    };
  },
  mounted()
  {
    window.on(`click.${this.eventName}`, () => this.onClickBackground());
  },
  beforeDestroy()
  {
    window.off(`click.${this.eventName}`);
  },
  methods: {
    onClickItem(key, e)
    {
      let newSelected = Object.assign([], this.selected);
      let newSelectedItem = null;
      if (e.ctrlKey || e.metaKey)
      {
        newSelectedItem = !this.selected[key];
        newSelected[key] = newSelectedItem;
        this.lastSelectedKey = newSelected[key] ? key : 0;
      }
      else if (e.shiftKey)
      {
        let range = [
          Math.min(this.lastSelectedKey, key),
          Math.max(this.lastSelectedKey, key)
        ];
        newSelected = Array(newSelected.length).fill(false);
        newSelected = newSelected.map((item,key) => {
          return (range[0] <= key && range[1] >= key);
        });
      }
      else
      {
        newSelectedItem = !this.selected[key];
        newSelected = Array(newSelected.length).fill(false);
        newSelected[key] = newSelectedItem;
        this.lastSelectedKey = newSelected[key] ? key : 0;
      }
      this.selected = newSelected;
      this.changeSelected();
    },
    onClickBackground()
    {
      let newSelected = Object.assign([], this.selected);
      newSelected = Array(this.index.length).fill(false);
      this.selected = newSelected;
      this.lastSelectedKey = 0;
      this.changeSelected();
    },
    /**
     * change selected
     * 선택이 변경되어 상위 컴포넌트로 올린다.
     */
    changeSelected()
    {
      let srls = [];
      let paths = [];
      this.selected.forEach((o,k) => {
        if (o && this.index[k])
        {
          // `path`값 추가
          paths.push({
            name: this.index[k].name,
            path: this.index[k].path,
            type: this.index[k].type,
          });
          // `srl`값 추가
          srls.push(this.index[k].srl);
        }
      });
      this.$emit('change-selected', srls, paths);
    },
    selectAll(sw)
    {
      let newSelected = Object.assign([], this.selected);
      if (sw === undefined)
      {
        let isSelected = false;
        newSelected.forEach((o) => {
          if (o) isSelected = true;
        });
        newSelected = Array(this.index.length).fill(false);
        newSelected = newSelected.map((o) => {
          return !isSelected;
        });
      }
      else
      {
        newSelected = Array(this.index.length).fill(false);
        newSelected = newSelected.map((o) => {
          return sw;
        });
      }
      this.selected = newSelected;
      this.changeSelected();
    },
    resetSelect()
    {
      this.lastSelectedKey = 0;
      this.selected = Array(this.index.length).fill(false);
    },
  },
}
</script>

<style src="./thumbnails.scss" lang="scss" scoped/>
