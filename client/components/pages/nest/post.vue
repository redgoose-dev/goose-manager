<template>
<form ref="$root" @submit.prevent="onSubmit">
  nest/post.vue
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import {} from '../../../libs/api.js'
import { Fieldset, Field, Help } from '../../forms/fieldset/index.js'

const router = useRouter()
const error = inject('error')
const toast = inject('toast')
const $root = ref()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const state = reactive({
  loading: true,
  processing: false,
  apps: [],
})
const forms = reactive({})

onMounted(async () => {
  try
  {
    //
  }
  catch (e)
  {
    //
  }
  finally
  {
    //
  }
})

async function onSubmit()
{}
</script>

<style src="./post.scss" lang="scss" scoped></style>
