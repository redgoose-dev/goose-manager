<template>
<article :class="[ 'log-summary', `state--${_state.mode}` ]">
  <div class="body">
    <div class="metric">
      <span class="metric__label">전체 로그</span>
      <router-link to="/log/" class="metric__value">{{props.data.total}}</router-link>
    </div>
    <div :class="[ 'metric', props.data.error > 0 && 'metric--error' ]">
      <span class="metric__label">오류</span>
      <router-link to="/log/?level=ERROR" class="metric__value">{{props.data.error}}<small>건</small></router-link>
    </div>
    <div :class="[ 'metric', props.data.warning > 0 && 'metric--warning' ]">
      <span class="metric__label">경고</span>
      <router-link to="/log/?level=WARNING" class="metric__value">{{props.data.warning}}<small>건</small></router-link>
    </div>
    <div class="performance">
      <div class="metric">
        <span class="metric__label">평균 처리시간</span>
        <strong class="metric__value">{{props.data.averageDuration}}</strong>
      </div>
      <div class="metric">
        <span class="metric__label">최대 처리시간</span>
        <strong class="metric__value">{{props.data.maxDuration}}</strong>
      </div>
    </div>
    <div class="state">
      <figure>
        <Icon :name="_state.icon"/>
      </figure>
      <div>
        <router-link to="/log/?level=ERROR">{{_state.message}}</router-link>
        <small v-if="props.data.latestErrorAt">최근 오류 / {{props.data.latestErrorAt}}</small>
      </div>
    </div>
  </div>
  <p v-if="props.data.period" class="period">
    {{props.data.period}} · {{props.data.intervalLabel}}
  </p>
</article>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '@/components/icon/index.vue'

const props = defineProps({
  data: { type: Object, required: true },
})

const _state = computed(() => {
  if (props.data.error > 0)
  {
    return {
      mode: 'error',
      icon: 'server-crash',
      message: `최근 오류 ${props.data.error}건 발생`,
    }
  }
  if (props.data.warning > 0)
  {
    return {
      mode: 'warning',
      icon: 'bug',
      message: `최근 경고 ${props.data.warning}건 발생`,
    }
  }
  return {
    mode: 'success',
    icon: 'check',
    message: '최근 오류가 없습니다.',
  }
})
</script>

<style src="./log.scss" lang="scss" scoped></style>
