<template>
  <div>
    <Sidebar v-if="showSidebar" />
    <router-view v-if="!showSidebar" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue';

const route = useRoute();

const showSidebar = computed(() => {
  return route.path !== '/login' && route.path !== '/register';
});
</script>

<style scoped>
/* Styles globaux */
</style>
