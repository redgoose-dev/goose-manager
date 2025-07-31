const { spawn } = Bun

export const DOCKER_IMAGE = 'redgoose/goose-manager'
// export const SSH_HOST = 'goose@redgoose.me'

export async function run(cmd)
{
  const proc = spawn({
    cmd,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  await proc.exited
}
