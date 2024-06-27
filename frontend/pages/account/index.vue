<template>
  <v-container>
    <v-toolbar density="compact">
      <v-toolbar-title>Accounts</v-toolbar-title>
    </v-toolbar>

    <!-- <v-card>
      <v-card-title>Search</v-card-title>
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
    </v-card> -->

    <client-only>
    <v-list>
      <v-list-item v-for="item in list">
        <NuxtLink :to="`/account/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
        <click-to-copy display="" :text="item.id">
          &nbsp;<sup icon>
            <v-icon size="small">mdi-content-copy</v-icon>
          </sup>
        </click-to-copy>
        <!-- <NuxtLink :to="`/account/${item.id}`">{{ item.id }}</NuxtLink> -->
        <!-- <a :href="`/event/${item.id}`">{{ item.id }}</a> -->
      </v-list-item>
    </v-list>
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
import ClickToCopy from '../../components/ClickToCopy.vue';
import type { IAccount } from '../../global/types'

const QUERY_ACCOUNTS = gql`
query accounts($orderBy: [AccountOrderByInput!], $limit: Int!) {
  accounts(orderBy: $orderBy, limit: $limit) {
    id
  }
}
`

export default defineComponent({
  components: {
    ClickToCopy
  },
  setup () {
    const accountId = ref<string>('')
    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)
    // start of the day
    const fromDate = ref<Date>(new Date(new Date('2024-04-01T00:00:00Z').setHours(0, 0, 0, 0)))
    // end of the day
    const toDate = ref<Date>(new Date(new Date().setHours(23, 59, 59, 999)))
    const list = ref<IAccount[]>([])

    let doRefetch: any

    onBeforeMount(() => {
      var { loading, error, refetch, onResult }: any = useQuery(QUERY_ACCOUNTS, {
        orderBy: 'id_DESC',
        limit: 25,
      }, {
        fetchPolicy: 'cache-and-network'
      })

      onResult((event: any) => {
        console.debug('event/[id].vue: setup(): onResult', event)
        const { loading, data, networkStatus } = event
        if (loading) return
        // block.value = {...data.blockById}
        list.value = data.accounts
      })

      doRefetch = () => {
        console.debug('doRefetch', fromDate.value, toDate.value)
        refetch({
          orderBy: 'id_DESC',
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

    // 1st 6 chars of the id ... and last 6 chars
    const formatId = (id: string) => {
      return `${id.substr(0, 6)}...${id.substr(-6)}`      
    }

    return {
      accountId,
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