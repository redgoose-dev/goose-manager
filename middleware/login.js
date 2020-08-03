export default function(context)
{
  const { store, req, redirect } = context;
  // check token
  if (store.state.authUser)
  {
    redirect(`${store.state.path_root}/`);
  }
}
