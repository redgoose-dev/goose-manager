// ignore path list
const ignorePath = [
  'labs',
  'labs-index-ui',
  'labs-index-icons',
];

export default function(cox)
{
  const { store, redirect, route, isDev } = cox;
  const { preference } = store.state;

  // print current route
  if (preference.debug.route)
  {
    console.warn(`REDIRECT TO: ${route.name} :: ${route.path}`);
  }

  // check auth
  if (store.state.authUser)
  {
    // check ignore path on development
    if (!isDev && ignorePath.indexOf(route.name) > -1)
    {
      redirect('/');
    }
  }
  else
  {
    redirect('/auth/login');
  }
}
