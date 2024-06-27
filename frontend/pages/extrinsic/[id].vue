<template>
  <v-container>
    <v-toolbar density="compact">
      <v-btn icon @click="goto('/extrinsic')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Extrinsic #{{ formatId(extrinsic.id) }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn> -->
    </v-toolbar>
    <!-- {{ block }} -->

    <v-card elevation="0">
      <v-card-text>

        <v-table>
          <tbody>
            <tr>
              <td>Block</td>
              <td>
                <NuxtLink :to="`/block/${extrinsic.block?.id || 0}?tab=extrinsics`">{{ extrinsic.block?.id || 0 }}</NuxtLink>
                <!-- {{ extrinsic.block_id }} -->
              </td>
            </tr>
            <tr>
              <td>Section</td>
              <td>
                <nuxt-link :to="`/extrinsic/search?section=${extrinsic.section}`">
                  {{ extrinsic.section }}
                </nuxt-link>
              </td>
            </tr>
            <tr>
              <td>Method</td>
              <td>
                <nuxt-link :to="`/extrinsic/search?method=${extrinsic.method}`">
                {{ extrinsic.method }}
              </nuxt-link>
              </td>
            </tr>
            <tr>
              <td>Timestamp</td>
              <td>{{ extrinsic.timestamp }}</td>
            </tr>
            <tr>
              <td>Signer</td>
              <td>
                <nuxt-link :to="`/account/${extrinsic.signer?.id}`">
                  {{ formatHash(extrinsic.signer?.id) }}
                </nuxt-link>
              </td>
            </tr>
          </tbody>
        </v-table>
        <!-- <v-container>
          <v-col>
            <v-text-field label="Section" v-model="extrinsic.section" readonly></v-text-field>
            <v-text-field label="Method" v-model="extrinsic.method" readonly></v-text-field>
            <v-text-field label="Timestamp" v-model="extrinsic.timestamp" readonly></v-text-field>
          </v-col>
        </v-container> -->
      </v-card-text>
    </v-card>

    <v-tabs v-model="tab">
      <v-tab value="events">Events</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="events">
        <v-table>
          <tbody>
            <tr v-for="item in extrinsic.events">
              <td>
                <NuxtLink :to="`/event/${item.id}`">
                {{ formatId(item.id) }}
                </NuxtLink>
              </td>
              <!-- <td>{{ item.extrinsicHash }}</td> -->
              <td>{{ item.index }}</td>
              <td>{{ item.method }}</td>
              <td>{{ item.section }}</td>
              <td>{{ item.success }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'

const QUERY_EXTRINSIC = gql`
query extrinsics($id: String!) {
  extrinsicById(id: $id) {
    # chainId
    id
    # hash
    section
    method
    signer {
      id
    }
    block {
      id
      # hash
      # timestamp
    }
    timestamp
    events {
      id
      index
      method
      section
      data
    }
  }
}
`

import type { IExtrinsic } from '../../global/types';

export default defineComponent({
  components: {
    // Candidates
  },
  setup () {
    const route = useRoute()
    const router = useRouter()

    console.debug('extrinsic/[id].vue', route.params.id)
    const id = computed(() => route.params.id) // blockNo-index
    const blockNo = computed(() => id.value.split('-')[0])
    const index = computed(() => id.value.split('-')[1])

    const tab = ref('events')
    const extrinsic = ref<IExtrinsic>({
      chainId: '',
      id: '',
      block_id: BigInt(0),
      index: 0,
      extrinsicHash: '',
      section: '',
      method: '',
      timestamp: ''
    })

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_EXTRINSIC, {
        chainId: 'encointer',
        id: id.value
      }, {
        fetchPolicy: 'cache-and-network'
      })
      // if (result?.data?.Candidate) candidate.value = result.data.Candidate

      onResult((event: any) => {
        console.debug('extrinsic/[id].vue: setup(): onResult', event)
        const { loading, data, networkStatus } = event
        if (loading) return
        extrinsic.value = {...data.extrinsicById}
      })

    // const store = useStore()
    // const chainId = computed(() => store.chainId)

    onBeforeMount(() => {
      // check if route.query.tab is set
      console.debug('route.params', route.params)
      if (route.query.tab) {
        tab.value = route.query.tab.toString()
      }
    })

    const goto = (path: string) => {
      console.debug('extrinsic/[id].vue: goto()', path)
      router.push({ path: path })
    }

    const formatId = (id: string) => {
      let blockNo = id.split('-')[0] || '0'
      blockNo = blockNo.replace(/^0+/, '')
      let index = id.split('-')[2] || '0'
      index = index.replace(/^0+/, '')
      if (index === '') index = '0'
      return `${blockNo}-${index}`
    }

    // 1st 6 chars of the id ... and last 6 chars
    const formatHash = (id: string) => {
      if (!id) return ''
      return `${id.substr(0, 6)}...${id.substr(-6)}`      
    }

    return {
      extrinsic,
      loading,
      tab,
      formatId,
      formatHash,
      goto
    }
  }
})
</script>