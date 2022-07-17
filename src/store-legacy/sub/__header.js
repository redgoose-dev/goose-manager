import * as storage from '../../libs/storage';

/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} SHORT_NAME */

// TODO: 이부분은 구조를 조정해야할 필요가 있다.

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
