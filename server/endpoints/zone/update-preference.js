import { getPreferenceData } from './get-preference.js'

const { VITE_BASE_PATH } = Bun.env
const path = `${VITE_BASE_PATH}/data/preference.json`

export default async function updatePreference(req)
{
  try
  {
    const data = await req.json()
    const originalData = await getPreferenceData()
    const merged = {
      ...originalData,
      ...data,
    }
    await Bun.write(path, JSON.stringify(merged, null, 2))
    return new Response('Successfully updated preference.')
  }
  catch (e)
  {
    return new Response('Failed to update preference.', { status: 500 })
  }
}
