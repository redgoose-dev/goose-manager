<template>
<article>
  <h1>Dashboard</h1>
  <pre>{{store.state}}</pre>
</article>
</template>

<script setup>
import axios from 'axios';
import store from '../../store';
</script>

<style src="./index.scss" lang="scss" scoped></style>
