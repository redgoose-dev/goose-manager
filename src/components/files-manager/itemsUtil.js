export function createMarkdownItems(src)
{
  return src.map(item => {
    if (/^image/.test(item.type))
    {
      return `![${item.name}](${item.path})`
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`
    }
  })
}

export function createHtmlItems(src)
{
  return src.map(item => {
    if (/^image/.test(item.type))
    {
      return `<p><img src="${item.path}" loading="lazy" alt="${item.name}"/></p>`
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`
    }
  })
}
