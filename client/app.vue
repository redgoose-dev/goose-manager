<template>
<article>
  <h1>Welcome to the App</h1>
  <p>This is a simple Vue.js application.</p>
  <pre>{{data}}</pre>
  <footer>
    <p>&copy; 2023 My Application</p>
  </footer>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref()

onMounted(async () => {
  const res = await fetch('http://localhost:7777', {})
  if (res.ok)
  {
    data.value = await res.json()
  }
})
</script>
