<template>
<form class="filter">
  <h1>.filter</h1>
  <p>태그</p>
  <p>total</p>
  <p>날짜정렬(등록일,수정일)</p>
  <p>오름차순/내림차순</p>
  <p>키워드 검색</p>
  <p>재설정</p>
</form>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.filter {
  width: 200px;
  position: sticky;
  top: calc(var(--size-header-height) + 52px);
  background: red;
}
</style>
