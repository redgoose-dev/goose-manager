<template>
<article class="login">
  <div class="login__wrap">
    <header>
      <h1 class="login__title">{{title}}</h1>
      <h2 class="login__description">{{description}}</h2>
    </header>
    <form class="login__body" @submit.prevent="onSubmit">
      <fieldset>
        <legend>login fields</legend>
        <div class="login-field login-field--id">
          <p class="login-field__label">
            <label for="email">E-Mail</label>
          </p>
          <div class="login-field__body">
            <input
              type="email"
              name="email"
              id="email"
              v-model="forms.email"
              maxlength="30"
              placeholder="name@address.com"
              required/>
            <i/>
          </div>
        </div>
        <div class="login-field login-field--password">
          <p class="login-field__label">
            <label for="password">Password</label>
          </p>
          <div class="login-field__body">
            <input
              type="password"
              name="password"
              id="password"
              v-model="forms.password"
              maxlength="30"
              placeholder="Please input password"
              required/>
            <i/>
          </div>
        </div>
        <div class="login-field login-field--save">
          <label class="login-save-auth">
            <FormCheckbox
              name="save_auth"
              v-model="forms.save"
              size="small"/>
            <span>Keep me signed in.</span>
          </label>
        </div>
      </fieldset>
      <nav class="login__nav">
        <ButtonBasic
          type="submit"
          :icon-right="processing ? 'loader' : 'power'"
          :rotate-icon="processing"
          size="large"
          color="key"
          :disabled="processing">
          Sign in
        </ButtonBasic>
      </nav>
    </form>
  </div>
</article>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { $fetch } from 'ohmyfetch'
import { authStore } from '../../store/auth'
import { preferenceStore } from '../../store/preference'
import { toast } from '../../modules/toast'
import { err } from '../../libs/error'
import { getPath } from '../../libs/string'
import FormCheckbox from '../../components/forms/checkbox.vue'
import { ButtonBasic } from '../../components/button'

interface Forms {
  email: string
  password: string
  save: boolean
}

const router = useRouter()
const auth = authStore()
const loading = ref<boolean>(false)
const title = ref<string>(TITLE || 'manager')
const description = ref<string>(DESCRIPTION || 'manager description')
const processing = ref<boolean>(false)
const forms = reactive<Forms>({
  email: '',
  password: '',
  save: true,
})

async function onSubmit(): Promise<void>
{
  try
  {
    // on loading
    loading.value = true
    // request api
    const { success, message, data } = await $fetch(getPath(`${BASE_URL}/local/login/`), {
      method: 'post',
      responseType: 'json',
      body: {
        email: forms.email,
        password: forms.password,
        save: forms.save,
      },
    })
    // check and set values
    if (!success) throw new Error(message)
    // setup service
    const { user, token } = data
    if (!(user && token)) throw new Error('not user or token')
    // setup store
    const preference = preferenceStore()
    auth.setup(token, user)
    await preference.setup()
    // off loading
    loading.value = false
    // redirect url
    await router.replace('/')
  }
  catch(e: any)
  {
    err(['/pages/auth/login.vue', 'onSubmit()'], 'error', e.message)
    loading.value = false
    toast.add('Failed login.', 'error')
  }
}
</script>

<style src="./login.scss" lang="scss" scoped></style>
