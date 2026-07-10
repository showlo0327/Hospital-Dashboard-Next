<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './components/layout/DefaultLayout.vue'

const route = useRoute()
const isLoginPage = computed(() => route.name === 'login')
</script>

<template>
  <RouterView v-if="isLoginPage" />
  <DefaultLayout v-else>
    <RouterView />
  </DefaultLayout>
</template>
