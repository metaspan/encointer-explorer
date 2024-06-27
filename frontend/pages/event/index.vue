<template>
  <v-container>
    <v-toolbar density="compact">
      <v-toolbar-title>Events</v-toolbar-title>
      <!-- <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn> -->
    </v-toolbar>

    <v-card>
      <!-- <v-card-title>Search</v-card-title> -->
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
          <v-col md="3" sm="6">
            <v-text-field v-model="blockNo" label="block"></v-text-field>
          </v-col>
          <v-col md=1 sm="6">
            <v-btn size="small" @click="doRefetch">Search</v-btn>
          </v-col>
        </v-row>
        </client-only>
      </v-card-text>
    </v-card>

    <client-only>
      <v-table>
        <tbody>
          <tr>
            <th>Block</th>
            <th>Id</th>
            <th>Section</th>
            <th>Method</th>
            <th>Timestamp</th>
          </tr>
          <tr v-for="item in list" :key="item.id">
            <td>
              <NuxtLink :to="`/block/${item.block?.id}`">{{ item.block?.id }}</NuxtLink>
            </td>
            <td>
              <NuxtLink :to="`/event/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
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


// import { IEvent } from '../../global/types'
interface IEvent {
  id: string
  section: string
  method: string
  specVersion: string
  timestamp: string
}

const QUERY_EVENTS = gql`
query events($orderBy: [EventOrderByInput!], $limit: Int!, $fromDate: DateTime!, $toDate: DateTime!) {
  events(orderBy: $orderBy, limit: $limit, where: {AND: {timestamp_gte: $fromDate}, timestamp_lte: $toDate}) {
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
    // const route = useRoute()
    // const router = useRouter()
    // const store = useStore()
    const blockNo = ref<string>('')
    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)
    // start of the day
    const fromDate = ref<Date>(new Date(new Date('2024-04-01T00:00:00Z').setHours(0, 0, 0, 0)))
    // end of the day
    const toDate = ref<Date>(new Date(new Date().setHours(23, 59, 59, 999)))
    const list = ref<IEvent[]>([])

    let doRefetch: any

    onBeforeMount(() => {
      var { loading, error, refetch, onResult }: any = useQuery(QUERY_EVENTS, {
        orderBy: 'id_DESC',
        limit: 25,
        fromDate: fromDate.value.toISOString(),
        toDate: toDate.value.toISOString()
      }, {
        fetchPolicy: 'cache-and-network'
      })

      onResult((event: any) => {
        console.debug('event/[id].vue: setup(): onResult', event)
        const { loading, data, networkStatus } = event
        if (loading) return
        // block.value = {...data.blockById}
        list.value = data.events
      })

      doRefetch = () => {
        console.debug('doRefetch', fromDate.value, toDate.value)
        refetch({
          orderBy: 'id_DESC',
          limit: 25,
          fromDate: fromDate.value.toISOString(),
          toDate: toDate.value.toISOString()
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
      return `${blockNo}_${index}`
    }

    return {
      blockNo,
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