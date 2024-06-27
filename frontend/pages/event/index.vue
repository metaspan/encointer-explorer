<template>
  <v-container>
    <!-- <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>Events</v-toolbar-title>
    </v-toolbar> -->

    <v-card :loading="loading">
      <v-card-text>
        <client-only>
        <v-row>
          <v-col md="3" sm=6>
            <v-text-field @click="showFromDatePicker=true" readonly>
              <template v-slot:default>
                {{ fromDate.toLocaleDateString() }}
              </template>
            </v-text-field>
          </v-col>
          <v-col md="3" sm=6>
            <v-text-field @click="showToDatePicker=true" readonly>
              <template v-slot:default>
                {{ toDate.toLocaleDateString() }}
              </template>
            </v-text-field>
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
      <v-table>
        <tbody>
          <tr>
            <th>Event</th>
            <th>Block</th>
            <th>Section</th>
            <th>Method</th>
            <th>Timestamp</th>
          </tr>
          <tr v-for="item in list" :key="item.id">
            <td>
              <NuxtLink :to="`/event/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
            </td>
            <td>
              <NuxtLink :to="`/block/${item.block?.id}`">{{ item.block?.id }}</NuxtLink>
            </td>
            <td>{{ item.section }}</td>
            <td>{{ item.method }}</td>
            <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>

    <!-- <v-list>
      <v-list-item v-for="item in list">
        <NuxtLink :to="`/event/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
      </v-list-item>
    </v-list> -->
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
import { useEventStore } from '~/stores/eventStore';
import { formatId } from '~/global/utils';

// import { IEvent } from '../../global/types'
interface IEvent {
  id: string
  section: string
  method: string
  specVersion: string
  timestamp: string
}

const QUERY_EVENTS = gql`
query events($orderBy: [EventOrderByInput!], $offset: Int!, $limit: Int!, $fromDate: DateTime!, $toDate: DateTime!) {
  eventsConnection(orderBy: chainId_ASC, where: {AND: {timestamp_gte: $fromDate}, timestamp_lte: $toDate}) {
    totalCount
  }
  events(orderBy: $orderBy, offset: $offset, limit: $limit, where: {AND: {timestamp_gte: $fromDate}, timestamp_lte: $toDate}) {
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
  components: {},
  setup () {
    const store = useEventStore()
    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)

    const fromDate = ref<Date>(store.startDate)
    const toDate = ref<Date>(store.endDate)
    const limit = ref<number>(store.limit)
    const offset = ref<number>((store.page-1)*store.limit)
    if(offset.value < 0) offset.value = 0
    const page = ref<number>(store.page)
    const totalCount = ref<number>(0)

    const list = ref<IEvent[]>([])

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_EVENTS, {
      fromDate: fromDate.value.toISOString(),
      toDate: toDate.value.toISOString(),
      orderBy: 'id_DESC',
      offset: offset.value,
      limit: limit.value,
    }, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      console.debug('event/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      // block.value = {...data.blockById}
      list.value = data.events
      totalCount.value = data.eventsConnection.totalCount
      const maxPage = Math.ceil(totalCount.value / limit.value)
      if(page.value > maxPage) {
        page.value = maxPage
        offset.value = (page.value-1) * limit.value
      }
    })

    const doRefetch = () => {
      console.debug('doRefetch', fromDate.value, toDate.value)
      refetch({
        fromDate: fromDate.value.toISOString(),
        toDate: toDate.value.toISOString(),
        orderBy: 'id_DESC',
        offset: offset.value,
        limit: limit.value,
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
      console.debug('watch', value)
      store.page = value
      offset.value = (value-1) * limit.value
      if(offset.value < 0) offset.value = 0
      doRefetch()
    })

    onBeforeMount(() => {
      doRefetch()
    })

    return {
      fromDate,
      toDate,
      showFromDatePicker,
      showToDatePicker,
      doRefetch,
      list,
      formatId,
      page,
      totalCount,
      limit,
      loading
    }
  }
})
</script>