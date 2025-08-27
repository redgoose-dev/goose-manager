<template>
<article>
  <header class="page-header">
    <h1>Item</h1>
    <p>목록에서 사용하는 요소 컴포넌트들을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h1>Card</h1>
      <p>가로로 배치되는 스타일</p>
    </header>
    <div class="example">
      <Card
        href="/"
        image="https://goose.redgoose.me/file/b8vbig69ypgtpEPy/"
        title="card title"
        alt="card title"
        description="description message"
        :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
        :nav="[
          { label: 'Guide', href: `/guide/` },
          { label: 'GuideButton', href: `/guide/button/` },
          { label: 'discord', href: `https://discord.com/`, target: '_blank' },
          { label: 'function', click: callAlert },
        ]"
        :status="[
          { label: 'Before', value: 123 },
          { label: 'After', value: 45678 },
        ]"
        style="--item-height: 120px"/>
      <hr>
      <div class="grid grid--col-2">
        <Card
          href="/"
          title="card title"
          :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
          :nav="[
            { label: 'Guide', href: `/guide/` },
            { label: 'GuideButton', href: `/guide/button/` },
            { label: 'discord', href: `https://discord.com/`, target: '_blank' },
          ]"/>
        <Card
          title="wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
          description="wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
          alt="card title"
          :nav="[
            { label: 'Guide', href: `/guide/` },
          ]"/>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>Thumbnail</h1>
      <p>위아래로 배치되는 스타일</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center flex--v-start">
        <Thumbnail
          href="/"
          image="https://goose.redgoose.me/file/b8vbig69ypgtpEPy/"
          thumbnail-type="cover"
          title="card title"
          alt="card title"
          description="description message"
          :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
          :nav="[
            { label: 'Guide', href: `/guide/` },
            { label: 'GuideButton', href: `/guide/button/` },
            { label: 'discord', href: `https://discord.com/`, target: '_blank' },
          ]"
          :status="[
            { label: 'Apple', value: 432 },
            { label: 'Banana', value: 765 },
          ]"
          :style="[
            '--item-width: 240px',
            '--item-image-height: 150px',
          ]"/>
        <Thumbnail
          href="/"
          image="https://goose.redgoose.me/file/Sos15vBVG8zO9fUW/"
          thumbnail-type="cover"
          title="card title"
          alt="card title"
          :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
          :style="[
            '--item-width: 240px',
          ]"/>
      </div>
    </div>
  </section>

  <hr class="page-section-line">

  <header class="page-header">
    <h1>Items wrap</h1>
    <p>요소를 감싸는 컴포넌트</p>
  </header>

  <section class="page-section">
    <header>
      <h1>With card component</h1>
      <p>카드 스타일로 표현하기</p>
    </header>
    <div class="example">
      <p>theme - list</p>
      <Items theme="list">
        <Card
          v-for="_ in Array(2)"
          href="/"
          image="https://goose.redgoose.me/file/b8vbig69ypgtpEPy/"
          title="card title"
          alt="card title"
          :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
          :nav="[
            { label: 'Guide' },
            { label: 'GuideButton' },
            { label: 'Discord' },
          ]"/>
      </Items>
      <hr>
      <p>theme - card</p>
      <div class="items-card">
        <Items theme="card">
          <Card
            v-for="_ in Array(5)"
            href="/"
            image="https://goose.redgoose.me/file/b8vbig69ypgtpEPy/"
            title="card title"
            alt="card title"
            :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
            :nav="[
              { label: 'Guide' },
              { label: 'GuideButton' },
              { label: 'Discord' },
            ]"/>
        </Items>
      </div>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h1>With thumbnail component</h1>
      <p>썸네일 스타일로 표현하기</p>
    </header>
    <div class="example">
      <p>theme - thumbnail</p>
      <div class="items-thumbnail">
        <Items theme="thumbnail">
          <Thumbnail
            v-for="_ in Array(6)"
            href="/"
            image="https://goose.redgoose.me/file/b8vbig69ypgtpEPy/"
            thumbnail-type="cover"
            title="card title"
            alt="card title"
            :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
            :nav="[
              { label: 'Guide' },
              { label: 'GuideButton' },
              { label: 'Discord' },
            ]"/>
        </Items>
      </div>
    </div>
  </section>

  <header class="page-header">
    <h1>Hash tag</h1>
    <p>해시태그로 사용하는 컴포넌트</p>
  </header>

  <section class="page-section">
    <header>
      <h1>Basic</h1>
      <p>기본적으로 사용하는 모습</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center">
        <Tag label="basic"/>
        <Tag label="한글태그"/>
        <Tag label="click" :use-click="true"/>
        <Tag label="remove" :use-remove="true"/>
        <Tag label="click + remove" :use-click="true" :use-remove="true"/>
      </div>
    </div>
  </section>
  <section class="page-section">
    <header>
      <h1>Colors</h1>
      <p>컬러를 적용한 모습</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center">
        <Tag v-for="o in tagColors" :label="o" :color="o" :use-click="true" :use-remove="true"/>
      </div>
    </div>
  </section>
</article>
</template>

<script setup>
import { Items, Tag } from '../../components/item/index.js'
import Thumbnail from '../../components/item/thumbnail.vue'
import Card from '../../components/item/card.vue'

const tagColors = [ 'base', 'weak', 'blur', 'key', 'sub', 'code', 'success', 'error' ]

function callAlert()
{
  alert('call alert')
}
</script>

<style lang="scss" scoped>
@forward 'common';
.items-card {
  container-type: inline-size;
  .items {
    --items-column: 1;
    @container (min-width: 680px) {
      --items-column: 2;
    }
  }
}
.items-thumbnail {
  container-type: inline-size;
  .items {
    --items-column: 2;
    @container (min-width: 680px) {
      --items-column: 3;
    }
  }
}
</style>
