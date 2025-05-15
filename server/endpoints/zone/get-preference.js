const { VITE_BASE_PATH } = Bun.env
const path = `${VITE_BASE_PATH}/data/preference.json`

export default async function getPreference()
{
  try
  {
    const preference = await getPreferenceData()
    return Response.json({
      message: 'get preference',
      data: preference,
    })
  }
  catch(e)
  {
    return Response.json({
      message: 'Error get preference.',
    }, { status: 500 })
  }
}

/**
 * get preference data
 * @return {Promise<object>}
 */
export async function getPreferenceData()
{
  const file = Bun.file(path)
  if (await file.exists())
  {
    return await file.json()
  }
  else
  {
    const { defaultPreference } = await import('../../libs/defaults.js')
    await Bun.write(path, JSON.stringify(defaultPreference, null, 2))
    return defaultPreference
  }
}
