<template>
  <v-container>
    <!-- <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>Blocks</v-toolbar-title>
    </v-toolbar> -->

    <v-card :loading="loading">
      <v-card-text>
        <client-only>
        <v-row>
          <v-col md="3" sm=6>
            <v-text-field @click="showFromDatePicker=true" readonly>
              {{ new Date(fromDate).toLocaleDateString() }}
            </v-text-field>
          </v-col>
          <v-col md="3" sm=6>
            <v-text-field @click="showToDatePicker=true" readonly>
              {{ new Date(toDate).toLocaleDateString() }}
            </v-text-field>
          </v-col>
          <v-col md="3" sm="6">
            <v-text-field v-model="blockNo" label="block"></v-text-field>
          </v-col>
          <v-col md=1 sm="6">
            <v-btn icon @click="doRefetch" elevation="0">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        </client-only>
      </v-card-text>
    </v-card>

    <client-only>
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalCount/limit)"
      ></v-pagination>
      <v-table :loading="loading">
        <thead>
          <tr>
            <th>Block</th>
            <th>Hash</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>
              <NuxtLink :to="`/block/${item.id}`">
              {{ item.id }}
              </NuxtLink>
            </td>
            <td>
              <nuxt-link :to="`https://polkadot.js.org/apps/?rpc=wss://sys.ibp.network/encointer-kusama#/explorer/query/${item.hash}`" target="_blank">
                  {{ formatHash(item.hash) }}
                  <sup>
                    <v-icon size="x-small">mdi-open-in-new</v-icon>
                  </sup>
                </nuxt-link>
            </td>
            <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </client-only>

    <v-dialog v-model="showFromDatePicker" max-width="500">
      <v-card max-width="400">
        <v-date-picker v-model="fromDate" :max="toDate"></v-date-picker>
        <template v-slot:actions>
          <v-btn color="primary" text @click="showFromDatePicker = false">Cancel</v-btn>
          <!-- <v-btn color="primary" text @click="showFromDatePicker = false">OK</v-btn> -->
        </template>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showToDatePicker" max-width="500">
      <v-card max-width="400">
        <v-date-picker v-model="toDate" :min="fromDate"></v-date-picker>
        <template v-slot:actions>
          <v-btn color="primary" text @click="showToDatePicker = false">Cancel</v-btn>
          <!-- <v-btn color="primary" text @click="showToDatePicker = false">OK</v-btn> -->
        </template>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'
import type { IBlock } from '../../global/types'
import { useBlockStore } from '../../stores/blockStore';

const QUERY_BLOCKS = gql`
query blocks($orderBy: [BlockOrderByInput!], $limit: Int!, $offset: Int!, $fromDate: DateTime!, $toDate: DateTime!) {
  blocksConnection(orderBy: chainId_ASC, where: {AND: {timestamp_gte: $fromDate}, timestamp_lte: $toDate}) {
    totalCount
  }
  blocks(orderBy: $orderBy, limit: $limit, offset: $offset, where: {AND: {timestamp_gte: $fromDate}, timestamp_lte: $toDate}) {
    id
    hash
    specVersion
    timestamp
  }
}
`

export default defineComponent({
  components: {
    // BlockList
  },
  setup () {
    // const route = useRoute()
    const router = useRouter()
    const store = useBlockStore()
    const blockNo = ref<string>('')
    // const dateRange = ref<Date[]>([])
    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)

    const fromDate = ref<Date>(store.startDate)
    const toDate = ref<Date>(store.endDate)
    const limit = ref<number>(store.limit)
    const offset = ref<number>((store.page-1)*store.limit)
    if(offset.value < 0) offset.value = 0
    const page = ref<number>(store.page)

    const list = ref<IBlock[]>([])
    const totalCount = ref<number>(0)

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_BLOCKS, {
      orderBy: 'id_DESC',
      limit: limit.value,
      offset: offset.value,
      fromDate: fromDate.value.toISOString(),
      toDate: toDate.value.toISOString()
    }, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      // console.debug('block/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      list.value = data.blocks
      totalCount.value = data.blocksConnection.totalCount
      const maxPage = Math.ceil(totalCount.value / limit.value)
      if(page.value > maxPage) {
        page.value = maxPage
        offset.value = (page.value-1) * limit.value
        if(offset.value < 0) offset.value = 0
      }
    })

    const doRefetch = () => {
      // if blockNo is set, redirect to /block/:blockNo
      if (blockNo.value) {
        // console.debug('doRefetch', blockNo.value)
        router.push({ path: `/block/${blockNo.value}` })
        return
      }
      // console.debug('doRefetch', fromDate.value, toDate.value)
      refetch({
        orderBy: 'id_DESC',
        limit: limit.value,
        offset: offset.value,
        fromDate: fromDate.value.toISOString(),
        toDate: toDate.value.toISOString()
      })
    }

    watch(fromDate, (value) => {
      // console.debug('watch', value)
      fromDate.value.setHours(0, 0, 0, 0)
      store.startDate = fromDate.value
      showFromDatePicker.value = false
    })
    watch(toDate, (value) => {
      // console.debug('watch', value)
      toDate.value.setHours(23, 59, 59, 999)
      store.endDate = toDate.value
      showToDatePicker.value = false
    })
    watch(() => page.value, (value) => {
      // console.debug('watch', value)
      store.page = value
      offset.value = (value-1) * limit.value
      if(offset.value < 0) offset.value = 0
      doRefetch()
    })

    const formatHash = (hash: string) => {
      return hash.slice(0, 6) + '...' + hash.slice(-6)
    }

    return {
      blockNo,
      fromDate,
      toDate,
      showFromDatePicker,
      showToDatePicker,
      doRefetch,
      list,
      formatHash,
      loading,
      page,
      limit,
      offset,
      totalCount,
    }
  }
})
</script>