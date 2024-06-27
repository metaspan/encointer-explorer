<template>
  <NuxtLayout>
    <v-app :dark="dark">
       <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, onBeforeMount, onMounted } from 'vue'
import { useTheme } from "vuetify"
import { useStore } from './stores';

const production = process.env.NODE_ENV === 'production'

export default defineComponent({
  setup() {
    const runtimeConfig = useRuntimeConfig()
    useHead({
      // titleTemplate: () => {
      //   return production 
      //     ? `Encointer Explorer`
      //     : `Encointer Explorer (dev)`
      // }
      titleTemplate: runtimeConfig.title || 'Encointer Explorer DEV',
    })

    const theme = useTheme()
    const store = useStore()
    const dark = computed(() => store.dark)
    const matcher = ref()

    const onDark = (evt: any) => {
      // console.debug('onDark', evt)
      theme.global.name.value = evt.matches ? 'dark' : 'light'
    }

    onMounted(async () => {
      console.debug('app.vue: mounted')
      matcher.value = window.matchMedia('(prefers-color-scheme: dark)')
      // set the initial state from the matcher  await this.onDark(this.matcher)
      matcher.value.addListener(onDark)
      onDark(matcher.value)
      store.init()
      // appLoading.value = false
    })
    
    return {
      dark
    }
  }
})
</script>

<style>
body {
  font-family: "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
/* remove underline in links */
a {
  /* color: rgb(0, 0, 204); */
  color: inherit;
  font-weight: bolder;
  text-decoration: none;
}
</style>
