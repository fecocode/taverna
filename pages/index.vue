<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const modalsStore = useModalsStore()

const { action } = route.query

function removeActionParam() {
  const query = { ...route.query };
  delete query.action;
  router.push({ query });
};

const isSignInModalOpen = computed(() => modalsStore.isSignInModalOpen)
const isSignUpModalOpen = computed(() => modalsStore.isSignUpModalOpen)

onMounted(() => {
  if (action) {
    switch (action){
      case 'sign-in':
        modalsStore.openSignInModal()
        break;
      case 'sign-up':
        modalsStore.openSignUpModal()
        break;
    }
  }
})

watch(isSignInModalOpen, (isOpen) => {
  if (!isOpen && action === 'sign-in') {
    removeActionParam()
  }
})

watch(isSignUpModalOpen, (isOpen) => {
  if (!isOpen && action === 'sign-up') {
    removeActionParam()
  }
})
</script>

<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="posts-wrapper">
      <AppNewPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
    </div>
  </AppScrollbarWrapper>
</template>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.posts-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}
</style>