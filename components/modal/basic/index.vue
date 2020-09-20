<template>
<transition name="modal-basic">
  <div
    v-if="visible"
    :class="[
      'modal-basic',
      center && `modal-basic--center`,
    ]"
    @click="$emit('close')">
    <div class="modal-basic__body" @click="(e) => e.stopPropagation()">
      <slot/>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'modal-basic',
  props: {
    visible: { type: Boolean, default: false, required: true },
    overflow: { type: Boolean, default: true }, // 스크롤바 사용유무
    center: { type: Boolean, default: true },
  },
  watch: {
    /**
     * visible
     *
     * @param {Boolean} newValue
     */
    visible: function(newValue)
    {
      if (!document || !this.overflow) return false;
      const $html = document.querySelector('html');
      if (newValue)
      {
        $html.classList.add('popup-modal-basic');
      }
      else
      {
        $html.classList.remove('popup-modal-basic');
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
@import "../../../assets/scss/mixins";
$self: '.modal-basic';
.modal-basic {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999999;
  overflow: auto;
  box-sizing: border-box;
  cursor: zoom-out;

  &__body {
    background: var(--color-bg);
    cursor: auto;
    min-height: 100vh;
    box-sizing: border-box;
  }
  &--center {
    overflow: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(#fff,.75);
    #{$self}__body {
      min-width: 480px;
      min-height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 30px rgba(#000,.2), 0 1px 5px rgba(#000,.1);
    }
  }

  // transition
  &-enter-active,
  &-leave-active {
    transition: opacity 200ms ease-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  @include dark-mode() {
    &--center {
      background-color: rgba(#000,.5);
    }
  }
}
</style>
