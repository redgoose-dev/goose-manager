<template>
<nav class="toolbar">
  <div class="toolbar__column">
    <div class="group">
      <div class="toolbar-item dropdown">
        <button type="button" title="Add elements" class="toolbar-item__button">
          <Icon name="box"/>
        </button>
        <div class="toolbar-item__children">
          <ul>
            <li>
              <button type="button" @click="onClickItem('insert-space')">
                Empty space
              </button>
            </li>
            <li>
              <button type="button" @click="onClickItem('insert-iframe')">
                Iframe
              </button>
            </li>
            <li>
              <button type="button" @click="onClickItem('insert-picture')">
                Picture
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="toolbar-item dropdown">
        <button type="button" title="Add layout assets" class="toolbar-item__button">
          <Icon name="grid"/>
        </button>
        <div class="toolbar-item__children">
          <ul>
            <li>
              <button type="button" @click="onClickItem('insert-grid-group')">
                Grid group
              </button>
            </li>
            <li>
              <button type="button" @click="onClickItem('insert-grid-item')">
                Grid image
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="group">
      <div class="toolbar-item dropdown">
        <button type="button" title="Guides" class="toolbar-item__button">
          <Icon name="book"/>
        </button>
        <div class="toolbar-item__children">
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
  <div class="toolbar__column">
    <div class="group">
      <div class="toolbar-item">
        <button
          type="button"
          title="Open file manager"
          class="toolbar-item__button color--key"
          @click="onClickItem('open-file-manager')">
          <span>
            <Icon name="archive"/>
            <em>Files</em>
          </span>
        </button>
      </div>
      <div class="toolbar-item">
        <button
          type="button"
          title="Open preview"
          class="toolbar-item__button"
          @click="onClickItem('preview')">
          <span>
            <Icon name="eye"/>
            <em>Preview</em>
          </span>
        </button>
      </div>
    </div>
  </div>
</nav>
</template>

<script setup>
import Icon from '../../../icons/index.vue';

const emits = defineEmits([ 'select-item' ]);

function onClickItem(key)
{
  emits('select-item', key);
}
</script>

<style src="./toolbar.scss" lang="scss" scoped></style>
