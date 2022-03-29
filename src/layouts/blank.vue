<template>
<slot/>
</template>

<script setup>
import store from '../store';

// change theme
store.dispatch('changeTheme');
</script>
