<template>
  <v-container>
    <!-- <v-toolbar density="compact" color="transparent">
      <v-toolbar-title>Accounts</v-toolbar-title>
    </v-toolbar> -->

    <client-only>
    <v-pagination
      v-model="page"
      :length="Math.ceil(totalCount/limit)"
    ></v-pagination>
    <v-table>
      <thead>
        <tr>
          <th>Account</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>
            <NuxtLink :to="`/account/${item.id}`">{{ formatId(item.id) }}</NuxtLink>
            <click-to-copy display="" :text="item.id">
              &nbsp;<sup icon>
                <v-icon size="small">mdi-content-copy</v-icon>
              </sup>
            </click-to-copy>
          </td>
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
import ClickToCopy from '../../components/ClickToCopy.vue';
import { useAccountStore } from '~/stores/accountStore';
import type { IAccount } from '../../global/types'

const QUERY_ACCOUNTS = gql`
query accounts($orderBy: [AccountOrderByInput!], $limit: Int!, $offset: Int!) {
  accountsConnection(orderBy: chainId_ASC) {
    totalCount
  }
  accounts(orderBy: $orderBy, limit: $limit, offset: $offset) {
    id
  }
}
`

export default defineComponent({
  components: {
    ClickToCopy
  },
  setup () {
    const store = useAccountStore()
    const accountId = ref<string>('')
    const showFromDatePicker = ref<boolean>(false)
    const showToDatePicker = ref<boolean>(false)

    const fromDate = ref<Date>(store.startDate)
    const toDate = ref<Date>(store.endDate)
    const limit = ref<number>(store.limit)
    const offset = ref<number>((store.page-1)*store.limit)
    const page = ref<number>(store.page)
    const totalCount = ref<number>(0)

    const list = ref<IAccount[]>([])

    let doRefetch: any

    var { loading, error, refetch, onResult }: any = useQuery(QUERY_ACCOUNTS, {
      orderBy: 'id_DESC',
      offset: offset.value,
      limit: 25,
    }, {
      fetchPolicy: 'cache-and-network'
    })

    onResult((event: any) => {
      console.debug('account/[id].vue: setup(): onResult', event)
      const { loading, data, networkStatus } = event
      if (loading) return
      // block.value = {...data.blockById}
      list.value = data.accounts
      totalCount.value = data.accountsConnection.totalCount
      const maxPage = Math.ceil(totalCount.value / limit.value)
      if(page.value > maxPage) {
        page.value = maxPage
        offset.value = (page.value-1) * limit.value
      }
    })

    doRefetch = () => {
      console.debug('doRefetch', fromDate.value, toDate.value)
      refetch({
        orderBy: 'id_DESC',
        offset: offset.value,
        limit: 25,
      })
    }

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
    watch(() => page.value, (value) => {
      // console.debug('watch', value)
      store.page = value
      offset.value = (value-1) * limit.value
      doRefetch()
    })

    // 1st 6 chars of the id ... and last 6 chars
    const formatId = (id: string) => {
      return `${id.substr(0, 6)}...${id.substr(-6)}`      
    }

    onBeforeMount(() => {
      console.debug('onBeforeMount')
      doRefetch()
    })

    return {
      accountId,
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
    }
  }
})
</script>