interface FileItem {
  name: string
  type: string
  path: string
}

function arrayToTextForReturn(src: string[]): string
{
  return src.join('\n\n') + `\n`;
}

export function createMarkdownItems(src: FileItem[]): string
{
  let str = src.map(item => {
    if (/^image/.test(item.type))
    {
      return `![${item.name}](${item.path})`;
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`;
    }
  });
  return arrayToTextForReturn(str);
}

export function createHtmlItems(src: FileItem[]): string
{
  let str = src.map(item => {
    if (/^image/.test(item.type))
    {
      return `<p><img src="${item.path}" alt="${item.name}"/></p>`;
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`;
    }
  });
  return arrayToTextForReturn(str);
}

export function createAddressItems(src: { path: string }[]): string
{
  return arrayToTextForReturn(src.map(o => (o.path)));
}
