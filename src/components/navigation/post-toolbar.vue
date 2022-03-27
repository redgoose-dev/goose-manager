<template>
<ToolbarWrap>
  <template #left>
    <ToolbarGroup>
      <ToolbarItem
        type="dropdown"
        title="Add elements"
        icon="box"
        :context="[
          {
            label: 'Empty space',
            click: () => onClickToolbarItem('insert-space'),
          },
          {
            label: 'Iframe',
            click: () => onClickToolbarItem('insert-iframe'),
          },
          {
            label: 'Picture',
            click: () => onClickToolbarItem('insert-picture'),
          },
        ]"/>
      <ToolbarItem
        type="dropdown"
        title="Add layout assets"
        icon="grid"
        :context="[
          {
            label: 'Grid group',
            click: () => onClickToolbarItem('insert-grid-group'),
          },
          {
            label: 'Grid image',
            click: () => onClickToolbarItem('insert-grid-item'),
          },
        ]"/>
    </ToolbarGroup>
    <ToolbarGroup>
      <ToolbarItem
        type="dropdown"
        title="Guides"
        icon="book"
        :context="[
          {
            label: '존 그루버 마크다운 페이지 번역',
            href: 'https://nolboo.kim/blog/2013/09/07/john-gruber-markdown/',
            target: '_blank',
          },
          {
            label: '마크다운 사용법',
            href: 'https://gist.github.com/ihoneymon/652be052a0727ad59601',
            target: '_blank',
          },
        ]"/>
    </ToolbarGroup>
  </template>
  <template #right>
    <ToolbarGroup>
      <ToolbarItem
        type="button"
        title="Open file manager"
        label="Files"
        icon="archive"
        color="key"
        @click="onClickToolbarItem('open-file-manager')"/>
      <ToolbarItem
        type="button"
        title="Open preview"
        label="Preview"
        icon="eye"
        @click="onClickToolbarItem('preview')"/>
    </ToolbarGroup>
  </template>
</ToolbarWrap>
</template>

<script setup>
import { ToolbarWrap, ToolbarGroup, ToolbarItem } from './toolbar';

const emits = defineEmits([ 'select-item' ]);

function onClickToolbarItem(code)
{
  emits('select-item', code);
}
</script>
