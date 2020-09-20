<template>
<nav class="toolbar">
  <div class="toolbar__wrap">
    <div class="toolbar__side">
      <div class="toolbar__group">
        <div class="toolbar__group-item">
          <button
            type="button"
            title="space"
            data-key="insert-space"
            class="toolbar__button"
            @click="onClickItem">
            <icon name="git-commit"/>
          </button>
        </div>
        <div class="toolbar__group-item">
          <button
            type="button"
            title="iframe"
            data-key="insert-iframe"
            class="toolbar__button on"
            @click="onClickItem">
            <icon name="video"/>
          </button>
        </div>
        <div class="toolbar__group-item dropdown">
          <div title="grid image" class="toolbar__button">
            <icon name="grid"/>
          </div>
          <div class="dropdown__children">
            <ul>
              <li>
                <button
                  type="button"
                  data-key="insert-grid-group"
                  @click="onClickItem">
                  Grid group
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-key="insert-grid-item"
                  @click="onClickItem">
                  Grid image
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="toolbar__group">
        <div class="toolbar__group-item dropdown">
          <div title="guide" class="toolbar__button">
            <icon name="book"/>
          </div>
          <div class="dropdown__children">
            <ul>
              <li>
                <a href="https://nolboo.kim/blog/2013/09/07/john-gruber-markdown/" target="_blank">
                  존 그루버 마크다운 페이지 번역
                </a>
              </li>
              <li>
                <a href="https://gist.github.com/ihoneymon/652be052a0727ad59601" target="_blank">
                  마크다운 사용법
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="toolbar__side">
      <div class="toolbar__group">
        <div class="toolbar__group-item">
          <button
            type="button"
            title="open file manager"
            data-key="open-file-manager"
            class="toolbar__button color--key"
            @click="onClickItem">
            <span>
              <icon name="archive"/>
              <em>Files</em>
            </span>
          </button>
        </div>
        <div class="toolbar__group-item">
          <button
            type="button"
            title="preview"
            data-key="preview"
            class="toolbar__button"
            @click="onClickItem">
            <span>
              <icon name="eye"/>
              <em>Preview</em>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'editor-toolbar',
  props: {},
  components: {
    'icon': () => import('~/components/icon'),
  },
  methods: {
    onClickItem(e)
    {
      this.$emit('click-item', e.currentTarget.dataset.key);
    },
  },
}
</script>

<style src="./editor-toolbar.scss" lang="scss" scoped/>
