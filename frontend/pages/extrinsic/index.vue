<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Extrinsics</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <client-only>
      <v-table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Block</th>
            <th>Section</th>
            <th>Method</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>
              <NuxtLink :to="`/extrinsic/${item.id}`">
              {{ formatId(item.id) }}
              </NuxtLink>
            </td>
            <td>
              <NuxtLink :to="`/block/${item.block?.id}`">
              {{ item.block?.id }}
              </NuxtLink>
            </td>
            <td>
              <nuxt-link :to="`/extrinsic/search?section=${item.section}`">
              {{ item.section }}
            </nuxt-link>
            </td>
            <td>
              <nuxt-link :to="`/extrinsic/search?method=${item.section}`">
                {{ item.method }}
              </nuxt-link>
            </td>
            <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </client-only>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'
import ClickToCopy from '../../components/ClickToCopy.vue';
import type { IExtrinsic } from '../../global/types'

const QUERY_EXTRINSICS = gql`
query extrinsics($orderBy: [ExtrinsicOrderByInput!], $limit: Int!, $offset: Int!, $fromDate: DateTime!, $toDate: DateTime!) {
  extrinsics(orderBy: $orderBy, limit: $limit, offset: $offset, where: {AND: {timestamp_gte: $fromDate}, timestamp_lte: $toDate}) {
    id
    section
    method
    timestamp
    block {
      id
    }
  }
}
`

export default defineComponent({
  components: {
    ClickToCopy
  },
  setup () {
    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)
    // start of the day
    const fromDate = ref<Date>(new Date(new Date('2024-04-01T00:00:00Z').setHours(0, 0, 0, 0)))
    // end of the day
    const toDate = ref<Date>(new Date(new Date().setHours(23, 59, 59, 999)))
    const list = ref<IExtrinsic[]>([])

    let doRefetch: any

    onBeforeMount(() => {
      var { loading, error, refetch, onResult }: any = useQuery(QUERY_EXTRINSICS, {
        fromDate: fromDate.value.toISOString(),
        toDate: toDate.value.toISOString(),
        orderBy: 'id_DESC',
        offset: 0,
        limit: 25,
      }, {
        fetchPolicy: 'cache-and-network'
      })

      onResult((event: any) => {
        console.debug('event/[id].vue: setup(): onResult', event)
        const { loading, data, networkStatus } = event
        if (loading) return
        // block.value = {...data.blockById}
        list.value = data.extrinsics
      })

      doRefetch = () => {
        console.debug('doRefetch', fromDate.value, toDate.value)
        refetch({
          fromDate: fromDate.value.toISOString(),
          toDate: toDate.value.toISOString(),
          orderBy: 'id_DESC',
          offset: 0,
          limit: 25,
        })
      }
    })
    watch(fromDate, (value) => {
      console.debug('watch', value)
      fromDate.value.setHours(0, 0, 0, 0)
      showFromDatePicker.value = false
    })
    watch(toDate, (value) => {
      console.debug('watch', value)
      toDate.value.setHours(23, 59, 59, 999)
      showToDatePicker.value = false
    })

    const formatId = (id: string) => {
      let blockNo = id.split('-')[0] || '0'
      blockNo = blockNo.replace(/^0+/, '')
      let index = id.split('-')[2] || '0'
      index = index.replace(/^0+/, '')
      if(index === '') index = '0'
      return `${blockNo}-${index}`
    }

    // 1st 6 chars of the id ... and last 6 chars
    const formatHash = (id: string) => {
      return `${id.substr(0, 6)}...${id.substr(-6)}`      
    }

    return {
      fromDate,
      toDate,
      showFromDatePicker,
      showToDatePicker,
      doRefetch,
      list,
      formatId
    }
  }
})
</script>