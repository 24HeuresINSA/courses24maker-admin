<template>
  <span class="p-2" :message="message">{{ message }}</span>
</template>

<script>
  export default {
    name: 'notification-template',
    props: {
        message: String
    }
  }
</script>
