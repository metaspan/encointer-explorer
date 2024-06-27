<template>
  <client-only>
  <v-container>
    <v-toolbar density="compact">
      <v-btn icon @click="goto('/account')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Account #{{ formatHash(account.id) }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card elevation="0">
      <!-- <v-card-title>Block: {{ block.id }}</v-card-title> -->
      <v-card-text>
        <v-table>
          <tbody>
            <tr>
              <td>Account</td>
              <td>
                {{ account.id }}
                <click-to-copy display="" :text="account.id">
                  &nbsp;<sup icon>
                  <v-icon size="small">mdi-content-copy</v-icon>
                </sup>
                </click-to-copy>
              </td>
            </tr>
            <!-- <tr>
              <td>Hash</td>
              <td>
                <nuxt-link :to="`https://polkadot.js.org/apps/?rpc=wss://sys.ibp.network/encointer-kusama#/explorer/query/${block.hash}`" target="_blank">
                  {{ block.hash }}
                </nuxt-link>
              </td>
            </tr> -->
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-tabs v-model="tab">
      <!-- <v-tab value="tranfers">Transfers</v-tab> -->
      <v-tab value="extrinsics">Extrinsics</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="extrinsics">
        <v-table>
          <thead>
            <tr>
              <th>ExtId</th>
              <!-- <th>Signer</th> -->
              <th>Section</th>
              <th>Method</th>
              <th>Success</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in account.extrinsics">
              <td>
                <nuxt-link :to="`/extrinsic/${item.id}`">{{ formatId(item.id) }}</nuxt-link>
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
      <!-- <v-tabs-window-item value="events">
        <v-table>
          <thead><tr><th>EvtId</th>
            <th>ExtId</th><th>Section</th><th>Method</th></tr></thead>
          <tbody>
            <tr v-for="item in block.events">
              <td>
                <NuxtLink :to="`/event/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
              </td>
              <td>
                <NuxtLink :to="`/extrinsic/${item.extrinsic?.id}`">
                  {{ formatId(item.extrinsic?.id) }}
                </NuxtLink>
              </td>
              <td>{{ item.method }}</td>
              <td>{{ item.section }}</td>
              <td>{{ item.success }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-tabs-window-item> -->
    </v-tabs-window>
  </v-container>
</client-only>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'
import ClickToCopy from '../../components/ClickToCopy.vue';

const QUERY_ACCOUNT = gql`
query accountById($id: String!) {
  accountById(id: $id) {
    # chainId
    id
    # hash
    extrinsics(limit: 25) {
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
  }
}
`
import type { IAccount } from '../../global/types'

export default defineComponent({
  components: {
    ClickToCopy
  },
  setup () {
    const route = useRoute()
    // console.debug('block/[id].vue', route.params.id)
    const id = computed(() => route.params.id)
    const router = useRouter()
    const tab = ref('extrinsics')
    const account = ref<IAccount>({
      id: '',
    })

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_ACCOUNT, {
      // chainId: 'encointer',
      id: id.value
    }, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      // console.debug('block/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      account.value = {...data.accountById ? data.accountById : { id: id.value }}
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

    // 1st 6 chars of the id ... and last 6 chars
    const formatHash = (id: string) => {
      return `${id.substr(0, 6)}...${id.substr(-6)}`      
    }

    return {
      account,
      loading,
      tab,
      formatId,
      formatHash,
      goto
    }
  }
})
</script>