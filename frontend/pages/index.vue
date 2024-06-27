<template>
  <div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'

export default defineComponent({
  setup() {
    // redirect to /block
    const router = useRouter()
    onBeforeMount(() => {
      router.push('/block')
    })
    return {
    }
  }
})
</script>