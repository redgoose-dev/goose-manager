// ignore path list
const ignorePath = [
  'labs-icons',
  'labs-ui',
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
    if (!isDev && route.name.indexOf(ignorePath))
    {
      redirect('/');
    }
  }
  else
  {
    redirect('/auth/login');
  }
}
