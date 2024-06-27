<template>
   <v-toolbar color="toolbar">
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <!-- <v-spacer></v-spacer> -->
    <v-toolbar-items>
      <v-btn to="/block" class="text-none">Block</v-btn>
      <v-btn to="/account" class="text-none">Account</v-btn>
      <v-btn to="/extrinsic" class="text-none">Extrinsic</v-btn>
      <v-btn to="/event" class="text-none">Event</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn class="text-none" v-tooltip:start.warning="indexingStalled ? 'warning: indexing stalled': ''" :color="indexingStalled ? 'warning': ''"
      :to="`/block/${blockNo}`">
      idx:{{ blockNo }}
    </v-btn>
    <v-btn>
      <a href="https://github.com/metaspan/encointer-explorer" target="_blank">
        <v-icon>mdi-github</v-icon>
      </a>       
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'

const QUERY_BLOCK_HEIGHT = gql`
query {
  blocks(limit: 1, orderBy: id_DESC) {
    id
  }
}
`

export default defineComponent({
  name: 'AppHeader',
  setup () {
    const store = useStore()
    const appConfig = useAppConfig()
    const title = ref(appConfig.title)
    const blockNo = computed(() => store.blockNo)
    const indexingStalled = ref(false)
    let interval: any = null

    const { loading, error, refetch, onResult } = useQuery(QUERY_BLOCK_HEIGHT, {}, {
      fetchPolicy: 'cache-and-network'
    })

    var debouncing = false

    onResult((event: any) => {
      // console.debug('block/[id].vue: setup(): onResult', event);
      const { loading, data, networkStatus } = event
      if (loading) return
      if (debouncing) return // for some reason, onResult is called twice for each interval.
      debouncing = true
      setTimeout(() => { debouncing = false }, 1000)
      if (Number(data.blocks[0].id) <= store.blockNo) {
        console.warn('indexing stalled at', store.blockNo, '?')
        indexingStalled.value = true
      } else {
        indexingStalled.value = false
      }
      store.blockNo = data.blocks[0].id
    })

    const doRefetch = () => {
      refetch()
    }

    onBeforeMount(() => {
      doRefetch()
      interval = setInterval(() => {
        doRefetch()
      }, 30_000)
    })

    onBeforeUnmount(() => {
      // console.debug('onBeforeUnmount, clearing interval', interval)
      if (interval) clearInterval(interval)
    })

    return {
      title,
      blockNo,
      indexingStalled
    }
  }
})
</script>
