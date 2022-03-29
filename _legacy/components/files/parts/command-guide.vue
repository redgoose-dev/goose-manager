<template>
<article class="command-guide" @click="$emit('close')">
  <div class="command-guide__wrap" @click.stop="">
    <h2>Command guide</h2>
    <ul>
      <li>
        <p class="shortcut">
          <code>ESC</code>
        </p>
        <p class="description">close window</p>
      </li>
      <li>
        <p class="shortcut">
          <code>Ctrl</code> or <code>Cmd</code> + <code>A</code>
        </p>
        <p class="description">Select all items</p>
      </li>
      <li>
        <p class="shortcut">
          <code>Ctrl</code> or <code>Cmd</code> + <code>Enter</code>
        </p>
        <p class="description">Insert the selected item into the editor</p>
      </li>
      <li>
        <p class="shortcut">
          <code>Shift</code> + <code>Tab</code>
        </p>
        <p class="description">Change next tab</p>
      </li>
    </ul>
    <nav>
      <div>
        <button-basic color="key" @click="$emit('close')">Close</button-basic>
      </div>
    </nav>
  </div>
</article>
</template>

<script>
export default {
  name: 'command-guide',
  components: {
    'button-basic': () => import('~/components/button/basic'),
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
@import "../../../assets/scss/mixins";

.command-guide {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba($color-bg,.9);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  &__wrap {
    width: 400px;
    background: #fff;
    cursor: auto;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0,0,0,.4);
    box-sizing: border-box;
    padding: 30px;
    user-select: none;
  }
  h2 {
    margin: 0;
    font-family: $font-eng-circular;
    font-size: 24px;
    letter-spacing: -1px;
    line-height: 1;
  }
  ul {
    margin: 20px 0 0;
    padding: 0;
    list-style: none;
    li {
      margin: 8px 0;
      padding: 16px;
      background-color: var(--color-content-bg);
      border-radius: 4px;
      box-sizing: border-box;
    }
    p {
      margin: 0;
      font-family: $font-eng;
      &:nth-child(n+2) {
        margin-top: 5px;
      }
    }
    code {
      font-size: 90%;
      display: inline-block;
      box-sizing: border-box;
      padding: 6px 8px;
      background-color: var(--color-blur);
      border-radius: 4px;
      color: #fff;
      line-height: 1;
      font-weight: 600;
      font-family: var(--font-eng);
    }
    .shortcut {
      color: #000;
      font-size: 14px;
    }
    .description {
      font-size: 12px;
    }
  }
  nav {
    margin: 30px 0 0;
  }

  @include dark-mode() {
    background: rgba($color-dark-bg,.75);
    &__wrap {
      background: $color-dark-bg;
      box-shadow: 0 0 30px rgba(0,0,0,.5);
    }
    h2 {
      color: #fff;
    }
    ul {
      code {
        color: #fff;
        background-color: $color-base;
      }
      .shortcut {
        color: #fff;
      }
    }
  }
}
</style>
