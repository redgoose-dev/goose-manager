<template>
<article>
  <PageHeader module="preference"/>
  <div class="preference">
    <aside>
      <SideMenu/>
    </aside>
    <router-view/>
  </div>
</article>
</template>

<script setup>
import PageHeader from '../../components/header/page.vue'
import SideMenu from '../../components/pages/preference/side-menu.vue'

// TODO: <SideMenu/> 컴포넌트 아래에 아이콘 목록보기 버튼을 누르면 아이콘 목록이 모달로 나오면 어떨까..
</script>

<style lang="scss" scoped>
.preference {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 0 40px;
  > aside {
    position: relative;
  }
}
</style>
