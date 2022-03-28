import * as storage from '../libs/storage';
import * as util from '../libs/util';

export function changeTheme(context, value)
{
  if (value) context.state.header.theme = value;
  storage.set('header', { theme: context.state.header.theme });
  util.changeTheme(context.state.header.theme);
}
