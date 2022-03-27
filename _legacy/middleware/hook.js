// ignore path list
const ignorePath = [];

export default function(context)
{
  const { store, redirect, route, isDev } = context;
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
      redirect(`${store.state.path_static}/`);
    }
  }
  else if (route.name !== 'auth-login')
  {
    redirect(`${store.state.path_root}/auth/login/`);
  }
}
