<template>
  <v-footer class="ma-0 pa-0 d-flex flex-column" fluid>

    <v-toolbar color="none" fluid>
      <v-spacer></v-spacer>
      <v-btn class="text-none" disabled>
        developed by <strong>metaspan</strong>
      </v-btn>
      <a href="https://twitter.com/metaspan_io" target="_blank">      
        <v-btn
          icon="mdi-twitter"
          class="mx-4"
          size="small"
          variant="plain"
        ></v-btn>
      </a>
      <a href="https://github.com/metaspan/encointer-explorer" target="_blank">
        <v-btn
          icon="mdi-github"
          class="mx-4"
          size="small"
          variant="plain"
        ></v-btn>
      </a>
    </v-toolbar>

  </v-footer>
</template>

<script lang="ts">
  export default {
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }),
  }
</script>