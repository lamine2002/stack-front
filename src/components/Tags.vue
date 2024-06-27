<script setup>
import axios from 'axios';
import { ref } from 'vue';

const tags = ref([]);

axios.get('http://127.0.0.1:8000/api/tags')
  .then(response => {
    tags.value = response.data.tags;
  })
  .catch(error => {
    console.log(error);
  });

</script>

<template>
<!--  Afficher les tags par card de grid de 4-->
  <div class="grid grid-cols-4 gap-4">
    <div v-for="tag in tags" :key="tag.id" class="bg-white p-4 shadow rounded-lg">
      <h2 class="text-xl font-bold">{{ tag.name }}</h2>
<!--      <p>{{ tag.description }}</p>-->
    </div>
  </div>

</template>

<style scoped>

</style>