<template>
  <v-container>

    <v-toolbar>
      <v-toolbar-title>Event: {{ formatId(eevent.id) }}</v-toolbar-title>
    </v-toolbar>

    <!-- {{ eevent }} -->
    <v-card elevation="0">
      <v-card-text>

        <v-table>
          <tbody>
            <tr>
              <td>Timestamp</td>
              <td>{{ eevent.timestamp }}</td>
            </tr>
            <tr>
              <td>Block</td>
              <td>
                <NuxtLink :to="`/block/${eevent.block?.id}?tab=events`">{{ eevent.block?.id }}</NuxtLink>
                <!-- {{ eevent.block?.id }} -->
              </td>
            </tr>
            <tr>
              <td>Extrinsic</td>
              <td>
                <NuxtLink :to="`/extrinsic/${eevent.extrinsic?.id}`">{{ formatId(eevent.extrinsic?.id) }}</NuxtLink>
                <!-- {{ eevent.extrinsic?.id }} -->
              </td>
            </tr>
            <tr>
              <td>Section</td>
              <td>{{ eevent.section }}</td>
            </tr>
            <tr>
              <td>Method</td>
              <td>{{ eevent.method }}</td>
            </tr>
            <tr>
              <td>Data</td>
              <td><pre>{{ parsedData }}</pre></td>
            </tr>
          </tbody>
        </v-table>

        <!-- <v-container>
          <v-col>

            <div label="Timestamp">{{ eevent.timestamp }}</div>
            <v-text-field label="Extrinsic" v-model="eevent.extrinsic.id" readonly></v-text-field>
            <v-text-field label="Section" v-model="eevent.section" readonly></v-text-field>
            <v-text-field label="Method" v-model="eevent.method" readonly></v-text-field>
          </v-col>
        </v-container> -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'

const QUERY_EVENT = gql`
query eventById($id: String!) {
  eventById(id: $id) {
    # chainId
    id
    # hash
    # specVersion
    method
    section
    timestamp
    data
    block {
      id
    }
    extrinsic {
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

import type { IExtrinsic, IEvent } from '../../global/types.js'

export default defineComponent({
  components: {
    // Candidates
  },
  setup () {
    const route = useRoute()
    console.debug('block/[id].vue', route.params.id)
    const id = computed(() => route.params.id)
    const router = useRouter()
    const tab = ref('extrinsics')

    const eevent = ref<IEvent>({
      chainId: '',
      block_id: BigInt(0),
      index: 0,
      event_id: '',
      extrinsic: {} as IExtrinsic,
      id: '',
      section: '',
      method: '',
      timestamp: '',
      data: ''
    })
    const parsedData = ref(null); // JSON.parse(eevent.data)

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_EVENT, {
      chainId: 'encointer',
      id: id.value
    }, {
      fetchPolicy: 'cache-and-network'
    })
    // if (result?.data?.Candidate) candidate.value = result.data.Candidate

    onResult((event: any) => {
      console.debug('block/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      eevent.value = {...data.eventById}
      const example = 
      [
        "{\"geohash\":\"0x6b79676368\",\"digest\":\"0xb9d21492\"}",
        "{\"__kind\":\"Reputable\"}",
        "0x12e6d90f7bff8a20d62e8d1edbca067f7e821a1b8948026829a1732d5ed34455"
      ]
      console.debug('parsedData', eevent.value.data.replace(/\\/g, ''))
      // replace \ with '' and parse JSON
      parsedData.value = JSON.parse(eevent.value.data.replace(/\\/g, ''))
    })

    // const store = useStore()
    // const chainId = computed(() => store.chainId)

    onBeforeMount(() => {
      // check if route.query.tab is set
      console.debug('route.query', route.query)
      if (route.query.tab) {
        tab.value = route.query.tab.toString()
      }
    })

    const goto = (path: string) => {
      console.debug('block/[id].vue: goto()', path)
      router.push({ path: path })
    }

    const formatId = (id: string = '') => {
      console.debug('formatId', id)
      let blockNo = id.split('-')[0] || '0'
      blockNo = blockNo.replace(/^0+/, '')
      let index = id.split('-')[2] || '0'
      index = index.replace(/^0+/, '')
      if (index === '') index = '0'
      return `${blockNo}-${index}`
    }

    return {
      eevent,
      loading,
      tab,
      formatId,
      goto,
      parsedData
    }
  }
})
</script>