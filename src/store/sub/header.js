import * as storage from '../../libs/storage';

/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} SHORT_NAME */

const defaults = {
  title: TITLE || 'Goose Manager',
  description: DESCRIPTION || '',
  shortName: SHORT_NAME || 'GOOSE',
  theme: 'system',
};

export function getHeader()
{
  return {
    ...defaults,
    ...storage.get('header'),
  };
}