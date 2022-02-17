<template>
<i class="mark">mark</i>
</template>

<style lang="scss" scoped>
.mark {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  width: var(--mark-size, 24px);
  height: var(--mark-size, 24px);
  font-size: 0;
  pointer-events: none;
  border-top-right-radius: var(--mark-radius, 2px);
  overflow: hidden;
  &:after {
    content: '';
    position: relative;
    left: -50%;
    top: -50%;
    display: block;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    transform: translate(100%, 0%) rotateZ(45deg);
    background: var(--mark-color, var(--color-key));
  }
}
</style>
