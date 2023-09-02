<template>
<article>
  <header class="page-header">
    <h1>Item</h1>
    <p>목록에서 사용하는 요소 컴포넌트들을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h2>Card</h2>
      <p>가로로 배치되는 스타일</p>
    </header>
    <div class="example">
      <Card
        href="/"
        image="https://goose.redgoose.me/data/upload/original/202107/rg-20190626-000027.jpg"
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
      <h2>Thumbnail</h2>
      <p>위아래로 배치되는 스타일</p>
    </header>
    <div class="example">
      <div class="flex flex--h-center flex--v-start">
        <Thumbnail
          href="/"
          image="https://goose.redgoose.me/data/upload/original/202107/rg-20190626-000027.jpg"
          title="card title"
          alt="card title"
          description="description message"
          :meta="[ 'Public', '0000-00-00', 'hit:234' ]"
          :nav="[
            { label: 'Guide', href: `/guide/` },
            { label: 'GuideButton', href: `/guide/button/` },
            { label: 'discord', href: `https://discord.com/`, target: '_blank' },
          ]"
          :style="[
            '--item-width: 240px',
            '--item-image-height: 150px',
          ]"/>
        <Thumbnail
          href="/"
          image="https://goose.redgoose.me/data/upload/original/202107/rg-20210521-000009.jpg"
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
      <h2>With card component</h2>
      <p>카드 스타일로 표현하기</p>
    </header>
    <div class="example">
      <p>theme - list</p>
      <Items theme="list">
        <Card
          v-for="_ in Array(2)"
          href="/"
          image="https://goose.redgoose.me/data/upload/original/202107/rg-20190626-000027.jpg"
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
      <Items theme="card">
        <Card
          v-for="_ in Array(5)"
          href="/"
          image="https://goose.redgoose.me/data/upload/original/202107/rg-20190626-000027.jpg"
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
  </section>

  <section class="page-section">
    <header>
      <h2>With thumbnail component</h2>
      <p>썸네일 스타일로 표현하기</p>
    </header>
    <div class="example">
      <Items theme="thumbnail">
        <Thumbnail
          v-for="_ in Array(6)"
          href="/"
          image="https://goose.redgoose.me/data/upload/original/202107/rg-20190626-000027.jpg"
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
  </section>

  <section class="page-section">
    <header>
      <h2>Brick style</h2>
      <p>쌓이는 모습으로 표현하기</p>
    </header>
    <div class="example">
      <Items theme="brick">
        <Thumbnail
          v-for="(o,k) in images"
          href="/"
          :image="o"
          :title="`card title-${k}`"
          alt="card title"
          :meta="[ 'Public', '0000-00-00', 'hit:234' ]"/>
      </Items>
    </div>
  </section>
</article>
</template>

<script setup>
import { images } from './resource'
import { Card, Thumbnail, Items } from '../../components/item'

function callAlert()
{
  alert('call alert')
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
