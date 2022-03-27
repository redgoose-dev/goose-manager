<template>
  <div>.content-external {{contentProps.mode}}</div>
</template>

<script>
export default {
  name: 'content-external',
  props: {
    contentProps: {
      mode: { type: String, default: null },
    },
  },
}
</script>
