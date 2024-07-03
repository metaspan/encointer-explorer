<template>
  <client-only>
  <v-container>
    <v-toolbar density="compact">
      <v-btn icon @click="goto('/block')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Block #{{ block.id }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn> -->
      <v-btn icon :to="`/block/${Number(block.id)-1}?tab=${tab}`">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon :to="`/block/${Number(block.id)+1}?tab=${tab}`">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card elevation="0">
      <!-- <v-card-title>Block: {{ block.id }}</v-card-title> -->
      <v-card-text>
        <v-table>
          <tbody>
            <tr>
              <td>Block</td>
              <td>{{ block.id }}</td>
            </tr>
            <tr>
              <td>Hash</td>
              <td>
                <nuxt-link :to="`https://polkadot.js.org/apps/?rpc=wss://sys.ibp.network/encointer-kusama#/explorer/query/${block.hash}`" target="_blank">
                  {{ formatHash(block.hash) }}
                  <sup>
                    <v-icon size="x-small">mdi-open-in-new</v-icon>
                  </sup>
                </nuxt-link>
              </td>
            </tr>
            <tr>
              <td>Spec Version</td>
              <td>{{ block.specVersion }}</td>
            </tr>
            <tr>
              <td>Timestamp</td>
              <td>{{ new Date(block.timestamp).toLocaleString() }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-tabs v-model="tab">
      <v-tab value="extrinsics">Extrinsics ({{ block.extrinsics?.length || 0 }})</v-tab>
      <v-tab value="events">Events ({{ block.events?.length || 0 }})</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" :transition="false">
      <v-tabs-window-item value="extrinsics" transition="out-in">
        <v-table>
          <thead><tr><th>ExtId</th>
            <!-- <th>Index</th> -->
            <th>Signer</th><th>Section</th><th>Method</th>Success<th></th></tr></thead>
          <tbody>
            <tr v-for="item in block.extrinsics">
              <td>
                <nuxt-link :to="`/extrinsic/${item.id}`">{{ formatId(item.id) }}</nuxt-link>
              </td>
              <!-- <td>{{ item.extrinsicHash }}</td> -->
              <!-- <td>{{ item.index }}</td> -->
              <td>
                <nuxt-link :to="`/account/${item.signer?.id}`">
                  {{ formatHash(item.signer?.id) || '' }}
                </nuxt-link>
              </td>
              <td>
                <nuxt-link :to="`/extrinsic/search?section=${item.section}`">
                  {{ item.section }}
                </nuxt-link>
              </td>
              <td>
                <nuxt-link :to="`/extrinsic/search?method=${item.method}`">
                  {{ item.method }}
                </nuxt-link>
              </td>
              <td>{{ item.success }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-tabs-window-item>
      <v-tabs-window-item value="events" transition="out-in">
        <v-table>
          <thead><tr><th>EvtId</th>
            <!-- <th>Index</th> -->
            <th>ExtId</th><th>Section</th><th>Method</th></tr></thead>
          <tbody>
            <tr v-for="item in block.events">
              <td>
                <NuxtLink :to="`/event/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
              </td>
              <!-- <td>{{ item.index }}</td> -->
              <td>
                <NuxtLink :to="`/extrinsic/${item.extrinsic?.id}`">
                  {{ formatId(item.extrinsic?.id) }}
                </NuxtLink>
              </td>
              <td>
                <!-- <nuxt-link :to="`/extrinsic/search?section=${item.section}`"> -->
                  {{ item.section }}
                <!-- </nuxt-link> -->
              </td>
              <td>
                <!-- <nuxt-link :to="`/extrinsic/search?method=${item.method}`"> -->
                  {{ item.method }}
                <!-- </nuxt-link> -->
              </td>
              <td>{{ item.success }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</client-only>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'

const QUERY_BLOCK = gql`
query blockById($id: String!) {
  blockById(id: $id) {
    # chainId
    id
    hash
    specVersion
    timestamp
    extrinsics {
      id
      extrinsicHash
      index
      signer {
        id
      }
      method
      section
      success
    }
    events(limit: 10) {
      id
      index
      extrinsic {
        id
      }
      method
      section
    }
  }
}
`
import type { IBlock } from '../../global/types'

export default defineComponent({
  setup () {
    const route = useRoute()
    // console.debug('block/[id].vue', route.params.id)
    const id = computed(() => route.params.id)
    const router = useRouter()
    const tab = ref('extrinsics')
    const block = ref<IBlock>({
      chainId: '',
      id: '',
      hash: '',
      timestamp: '',
      extrinsics: [],
    })

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_BLOCK, {
      chainId: 'encointer',
      id: id.value
    }, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      // console.debug('block/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      block.value = {...data.blockById ? data.blockById : { id: id.value }}
    })

    onBeforeMount(() => {
      // check if route.query.tab is set
      // console.debug('route.query', route.query)
      if (route.query.tab) {
        tab.value = route.query.tab.toString()
      }
    })

    const goto = (path: string) => {
      // console.debug('block/[id].vue: goto()', path)
      router.push({ path: path })
    }

    const formatId = (id: string) => {
      let blockNo = id.split('-')[0]
      blockNo = blockNo.replace(/^0+/, '')
      let index = id.split('-')[2]
      index = index.replace(/^0+/, '')
      if (index === '') index = '0'
      return `${blockNo}-${index}`
    }

    const formatHash = (hash: string) => {
      if (!hash) return ''
      return hash.slice(0, 6) + '...' + hash.slice(-6)
    }

    return {
      block,
      loading,
      tab,
      formatId,
      formatHash,
      goto
    }
  }
})
</script>