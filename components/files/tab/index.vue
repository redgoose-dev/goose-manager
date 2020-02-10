<template>
<nav class="files-tab">
  <div class="files-tab__wrap">
    <div v-if="usePost" class="files-tab__item">
      <button
        type="button"
        :disabled="tab === 'post'"
        class="files-tab__button"
        @click="$emit('click', 'post')">
        <em>Post</em>
      </button>
    </div>
    <div class="files-tab__item">
      <button
        type="button"
        :disabled="tab === 'local'"
        class="files-tab__button"
        @click="$emit('click', 'local')">
        <em>Local</em>
      </button>
    </div>
    <div class="files-tab__item">
      <div class="dropdown">
        <button
          :disabled="tab === 'external'"
          class="files-tab__button dropdown__button">
          <em>External service</em>
          <icon name="chevron-down"/>
        </button>
        <div class="dropdown__context">
          <ul>
            <li>
              <button
                type="button"
                :disabled="external === '#1'"
                @click="$emit('click', 'external', '#1')">
                external service #1
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="external === '#2'"
                @click="$emit('click', 'external', '#2')">
                external service #2
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    tab: { type: String, default: 'article' }, // post,local,external
    external: { type: String, default: null },
    usePost: { type: Boolean, default: false },
  },
  data()
  {
    return {};
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
