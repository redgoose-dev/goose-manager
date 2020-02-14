<template>
<nav :class="['files-tab', full && 'files-tab--full']">
  <div class="files-tab__wrap">
    <div>
      <div v-if="show.post" class="files-tab__item">
        <button
          type="button"
          :disabled="tab === 'post'"
          class="files-tab__button"
          @click="$emit('click', 'post')">
          <icon name="archive"/>
          <em>Post</em>
        </button>
      </div>
      <div v-if="show.local" class="files-tab__item">
        <button
          type="button"
          :disabled="tab === 'local'"
          class="files-tab__button"
          @click="$emit('click', 'local')">
          <icon name="folder"/>
          <em>Local</em>
        </button>
      </div>
      <div v-if="false" class="files-tab__item">
        <div class="dropdown">
          <button
            :disabled="tab === 'external'"
            class="files-tab__button dropdown__button">
            <icon name="cloud"/>
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
    <div>
      <div v-if="full" class="files-tab__item">
        <button
          type="button"
          class="files-tab__button only-icon"
          @click="$emit('close')">
          <icon name="x"/>
        </button>
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
    show: { type: Object },
    full: { type: Boolean, default: false },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
