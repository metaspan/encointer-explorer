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
    <v-btn class="text-none" v-tooltip:start.warning="indexingStalled ? 'warning: indexing stalled': ''" :color="indexingStalled ? 'warning': ''">
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

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_BLOCK_HEIGHT, {}, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      // console.debug('block/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      if (data.blocks[0].id <= store.blockNo) {
        console.warn('indexing stalled at', store.blockNo, '?')
        indexingStalled.value = true
      } else {
        indexingStalled.value = false
      }
      store.blockNo = data.blocks[0].id
    })

    const doRefetch = () => {
      // console.debug('doRefetch', fromDate.value, toDate.value)
      refetch()
    }

    // refetch every 30 seconds
    onBeforeMount(() => {
      interval = setInterval(() => {
        doRefetch()
      }, 30_000)
      return () => clearInterval(interval)
    })

    onBeforeUnmount(() => {
      // console.debug('onBeforeUnmount')
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
