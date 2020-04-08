export default function({ store, route, redirect }) {
  // Force redirect to 'search' page if route name unrecognised
  switch (route.name) {
    case 'history':
      return
    case 'search':
      return
  }
  return redirect({ name: 'search' })
}
