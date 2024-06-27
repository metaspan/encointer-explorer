<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>Extrinsics</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card>
      <v-card-text>
        <client-only>
        <v-row>
          <v-col md="3" sm=6>
            <v-text-field @click="showFromDatePicker=true" label="fromDate" readonly>
              {{ new Date(fromDate).toLocaleDateString() }}
            </v-text-field>
          </v-col>
          <v-col md="3" sm=6>
            <v-text-field @click="showToDatePicker=true" readonly>
              {{ new Date(toDate).toLocaleDateString() }}
            </v-text-field>
          </v-col>
          <v-col md="3" sm="6">
            <v-text-field v-model="section" label="section"></v-text-field>
          </v-col>
          <v-col md="3" sm="6">
            <v-text-field v-model="method" label="method"></v-text-field>
          </v-col>
          <v-col md=1 sm="6">
            <v-btn @click="doRefetch()">Search</v-btn>
          </v-col>
        </v-row>
        </client-only>
      </v-card-text>
    </v-card>

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
            <td @click="setQuery({section: item.section})">
              <!-- <nuxt-link :to="`/extrinsic/search?section=${item.section}`"> -->
              {{ item.section }}
            <!-- </nuxt-link> -->
            </td>
            <td @click="setQuery({method: item.method})">
              <!-- <nuxt-link :to="`/extrinsic/search?method=${item.method}`"> -->
                {{ item.method }}
              <!-- </nuxt-link> -->
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
        </template>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="showToDatePicker" max-width="500">
      <v-card max-width="400">
        <v-date-picker v-model="toDate" :min="fromDate"></v-date-picker>
        <template v-slot:actions>
          <v-btn color="primary" text @click="showToDatePicker = false">Cancel</v-btn>
        </template>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'
import { useBlockStore } from '../../stores/blockStore';
import type { IExtrinsic } from '../../global/types';
import { formatHash, formatId } from '../../global/utils';

const QUERY_EXTRINSICS = gql`
query MyQuery($fromDate: DateTime!, $toDate: DateTime!, $offset: Int, $limit: Int, $section: String!, $method: String!) {
  extrinsics(
    offset: $offset, 
    limit: $limit, 
    where: {
      AND: [
        {AND: [{timestamp_gte: $fromDate}, {timestamp_lte: $toDate}]},
        {OR: [{section_eq: $section}, {method_eq: $method}]}
      ]
    }, 
    orderBy: id_DESC
  ) {
    id
    section
    method
    signer {
      id
    }
    block {
      id
    }
    timestamp
  }
}
`

export default defineComponent({
  components: {
    // BlockList
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useBlockStore()
    const fromDate = ref<Date>(store.startDate)
    const toDate = ref<Date>(store.endDate)

    const field = ref('')
    const value = ref('')
    const section = ref('')
    const method = ref('')
    const list = ref<IExtrinsic[]>([])
    // var doRefetch: any = () => { console.warn('not implemented') }

    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_EXTRINSICS, {
      fromDate: fromDate.value.toISOString(),
      toDate: toDate.value.toISOString(),
      section: section.value,
      method: method.value,
      orderBy: 'id_DESC',
      offset: 0,
      limit: 25,
    }, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      console.debug('extrinsic/search.vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      // block.value = {...data.blockById}
      list.value = data.extrinsics
    })

    const doRefetch = () => {
      console.debug('doRefetch', fromDate.value, toDate.value)
      refetch({
        fromDate: fromDate.value.toISOString(),
        toDate: toDate.value.toISOString(),
        section: section.value,
        method: method.value,
        orderBy: 'id_DESC',
        offset: 0,
        limit: 25,
      })
    }

    onBeforeMount(() => {
      // get section | method from query params
      section.value = route.query.section || ''
      method.value = route.query.method || ''

      // console.debug('doRefetch', doRefetch)
      doRefetch()
    })

    const setQuery = (query: Record<string, string>) => {
      console.debug('setQuery', query)
      if (query.section) {
        section.value = query.section
      }
      if (query.method) {
        method.value = query.method
      }
      doRefetch()
    }

    watch(fromDate, (value) => {
      console.debug('watch', value)
      fromDate.value.setHours(0, 0, 0, 0)
      store.startDate = fromDate.value
      showFromDatePicker.value = false
    })
    watch(toDate, (value) => {
      console.debug('watch', value)
      toDate.value.setHours(23, 59, 59, 999)
      store.endDate = toDate.value
      showToDatePicker.value = false
    })

    return {
      fromDate,
      toDate,
      showFromDatePicker,
      showToDatePicker,
      section,
      method,
      list,
      formatId,
      doRefetch,
      setQuery
    }
  }
})
</script>