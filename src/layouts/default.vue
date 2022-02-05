<template>
<div class="layout">
  <header>
    <h1>header</h1>
    <nav>
      <router-link to="/">home</router-link>
      <router-link v-if="!store.state.user" to="/auth/login/">login</router-link>
      <button v-else type="button" @click="onClickLogout">logout</button>
      <router-link to="/dsnfiogsdngdsg/">qweqweqwe</router-link>
    </nav>
    <pre>{{store.state}}</pre>
  </header>
  <div class="container">
    <slot/>
  </div>
  <footer>.footer</footer>
</div>
</template>

<script setup>
import axios from 'axios';
import store from '../store';
import { logout } from '../router/auth';

async function onClickLogout()
{
  if (!confirm('정말 로그아웃 할까요?')) return;
  await logout();
}
</script>

<style></style>
