<template>
  <div>
    test
  </div>
</template>

<script lang="ts" setup>
import { useSession } from 'vue-clerk';


useAsyncData(async() => {
  const { session } = useSession()
  const currentUserId = session.value?.user.id

  if (currentUserId) {
    const profileData = await $fetch(`/api/authors/${currentUserId}`)

    console.log(profileData)
  }
})
</script>

<style>

</style>