<template>
  <div>
    Redirecting
  </div>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    return redirect('/search')
  }
}
</script>
