<template>
<span class="image-empty">
  <i class="material-icons">{{icon}}</i>
</span>
</template>

<script>
const icons = [
  'cloud_off',
  'donut_large',
  'fingerprint',
  'sync',
  'cloud',
  'wb_sunny',
  'directions_run',
  'map',
  'extension',
  'hearing',
  'hotel',
  'directions_bike',
];
export default {
  name: 'image-empty',
  data()
  {
    return {
      icon: icons[Math.floor(Math.random() * icons.length)],
    };
  },
}
</script>

<style lang="scss" scoped>
.image-empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  .material-icons {
    display: block;
    font-size: 40px;
    color: #fff;
  }
}
</style>
