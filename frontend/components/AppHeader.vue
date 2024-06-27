<template>
 <v-toolbar color="toolbar">
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <!-- <v-spacer></v-spacer> -->
    <v-toolbar-items>
      <v-btn to="/block" class="text-none">Block</v-btn>
      <v-btn to="/account" class="text-none">Account</v-btn>
      <v-btn to="/extrinsic" class="text-none">Extrinsic</v-btn>
      <v-btn to="/event" class="text-none">Event</v-btn>

      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
    </v-toolbar-items>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'

export default defineComponent({
  name: 'AppHeader',
  setup () {
    const appConfig = useAppConfig()
    const title = ref(appConfig.title)
    return {
      title,
    }
  }
})

</script>
