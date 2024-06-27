<template>
  <v-container :loading="loading" style="max-width: 900px" class="pt-0 mt-0">

    <v-list>
      <v-list-item>
        <v-router-link to="/block/5200000">5_200_000</v-router-link>
      </v-list-item>
    </v-list>

    <Loading :loading="loading"></Loading>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onBeforeMount } from 'vue'
import gql from 'graphql-tag'

// import Loading from './Loading.vue'

const QUERY_BLOCKS = gql`
query Blocks($chainId: String!) {
  Blocks(chainId: $chainId) {
    chainId
    id
    hash
    timestamp
  }
}
`
export default defineComponent({
  name: 'BlockList',
  setup () {
    // const store = useStore()
    const candidateStore = useCandidateStore()
    const router = useRouter()
    const route = useRoute()
    const chainId = computed(() => store.chainId)
    const dark = computed(() => store.dark)
    const apiConnected = computed(() => candidateStore.apiConnected)
    const loading = computed(() => candidateStore.loading)
    const updatedAt = computed(() => candidateStore.updatedAt)
    const favourites = computed(() => candidateStore.favourites)
    const savedSearch = computed(() => candidateStore.search)
    const search = ref('')
    search.value = savedSearch.value

    watch(() => chainId.value, (newVal) => {
      search.value = savedSearch.value
    })

    const filter = computed(() => candidateStore.filter)
    const xfilter = ref<ICandidateListFilter>(filter.value)

    const reload = ref(0) // increment this to trigger reload in child
    const tab = ref(0)
    const windowSize = ref({ x: 0, y: 0 })
    const debouncing = ref(false)
    const showFilterDialog = ref(false)
    const dateTimeFormat = ref('YYYY/MM/DD hh:mm')
    const searching = ref(false)
    const sortItems = ref([
      { text: 'Name', value: 'name' },
      { text: 'Rank', value: 'rank' },
      { text: 'Score', value: 'total' }
    ])

    const filterActive = computed(() => 
      xfilter.value.active ||
      xfilter.value.favourite ||
      (xfilter.value.rank && xfilter.value.rank > 0) ||
      (xfilter.value.total && xfilter.value.total > 0) ||
      xfilter.value.active ||
      xfilter.value.valid ||
      xfilter.value.nominated ||
      search.value !== ''
    )

    const gotoCandidate = (item: ICandidate) => {
      console.debug('gotoCandidate', chainId.value, item)
      // this.store.dispatch('candidate/setCandidate', { chainId: this.chainId, stash: item.stash })
      router.push({
        // path: `/${chainId.value}/candidate/${item.stash}`,
        name: `chainId-candidate-stash`,
        params: { chainId: chainId.value, stash: item.stash }
      })
    }

    const debouncedSearch = debounce((newVal: string) => {
      console.debug('debouncedSearch()', newVal)
      //checkFilterActive()
      // store.dispatch('candidate/setSearch', { chainId: chainId.value, search: newVal })
      candidateStore.setSearch(newVal)
      debouncing.value = false
      searching.value = false
    }, 1000)

    const debouncedFilter = debounce((newVal: IFilter) => {
      console.debug('debouncedFilter()', newVal)
      //checkFilterActive()
      // store.dispatch('candidate/handleFilter', { chainId: chainId.value, filter: {...newVal} })
      candidateStore.handleFilter(newVal as ICandidateListFilter) // FIXME harmonize types
      debouncing.value = false
      searching.value = false
    }, 400)

    watch(() => chainId.value, (val) => {
      xfilter.value = candidateStore.filter
      router.push({
        name: `chainId-candidate`,
        params: { chainId: val }
      })
    })

    watch(() => search.value, (newval: string) => {
      console.debug('Candidates.vue: watch.search', newval)
      debouncing.value = true
      searching.value = true
      debouncedSearch(newval)
    })

    var filterWatch: any

    onBeforeUnmount(() => {
      console.debug('Candidates.vue: onBeforeUnmount()', filterWatch)
      // store.dispatch('candidate/setSearch', { chainId: chainId.value, search: '' })
      if(filterWatch) filterWatch()
    })

    onBeforeMount(async () => {
      console.debug('Candidates.vue: created()', chainId.value)
      xfilter.value = filter.value

      // if (this.$route.params.chainId !== this.chainId) {
      //   await this.$store.dispatch('setChainId', this.$route.params.chainId)
      // }
      windowSize.value = { x: window.innerWidth, y: window.innerHeight }
      // this.options = this.$store.state.candidate.options // .pagination.page
      // this.itemsPerPage = this.$store.state.candidate.pagination.itemsPerPage

      if (!chainId.value || chainId.value === undefined) {
        console.debug('setting chainId to', route.params.chainId)
        // await store.dispatch('setChainId', route.params.chainId)
        store.setChainId(route.params.chainId.toString())
      }

      nextTick(() => {
        filterWatch = watch(() => xfilter.value, (newVal) => {
          console.debug('watch.xfilter', newVal)
          debouncing.value = true
          debouncedFilter(newVal)
        }, {
          deep: true
        })
      })

      console.debug('Candidates.vue: mounted()', chainId.value, route.params)
    })

    return {
      store,
      chainId,
      dark,
      apiConnected,
      search,
      loading,
      updatedAt,
      favourites,
      xfilter,
      reload,
      tab,
      windowSize,
      debouncing,
      filterActive,
      showFilterDialog,
      dateTimeFormat,
      searching,
      sortItems,
      gotoCandidate,
    }
  }
})
</script>

<!-- <style scoped>
.identicon {
    width: 16px;
    max-width: 16px;
    /* white-space:nowrap; */
    display: inline-block;
}

.small-radio i {
  font-size: 19px;
}
.small-radio label {
  font-size: 14px;
  padding-left: 0px;
  margin-left: -4px;
}
.small-radio .v-radio {
  padding: 0px;
}
.small-radio [class*="__ripple"] {
  left: 0;
}
</style> -->
