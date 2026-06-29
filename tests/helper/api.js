import { $fetch } from 'ofetch'

const { API_URL, API_TEST_TOKEN } = Bun.env

export async function request(url, options = {})
{
  return await $fetch(url, {
    baseURL: API_URL,
    ...options,
    headers: {
      ...(options.headers ?? {}),
      'Authorization': API_TEST_TOKEN,
    },
  })
}
