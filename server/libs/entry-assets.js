const args = process.argv.slice(2);

/**
 * is development
 *
 * @return {boolean}
 */
export function isDev()
{
  const idx = args.indexOf('--development');
  return (idx > -1);
}

/**
 * open server message
 *
 * @param {string} host
 * @param {number} port
 * @param {boolean} dev
 */
export function openServerMessage(host, port, dev)
{
  const assets = {
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    line: Array(40).fill('=').join(''),
    development: 'Development',
    production: 'Production',
  };
  const colorText = (message, color) => (`${assets[color]}${message}${assets.reset}`);
  console.log(assets.line);
  console.log(`| ${colorText(dev ? assets.development : assets.production, 'yellow')} server running at:`);
  console.log(`| >> Local: ${colorText(`http://localhost:${port}`, 'cyan')}`);
  console.log(assets.line);
}
