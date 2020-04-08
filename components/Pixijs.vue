<template>
  <div>
    {{ search }}
  </div>
</template>

<script>
export default {
  props: {
    // Instance of the search object
    search: {
      type: Object,
      default: () => null
    }
  }
}
</script>
