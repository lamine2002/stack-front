<script setup>
import axios from 'axios';
import {onMounted, ref} from 'vue';
import {getUserConnected} from "../userConnected.js";

const user = ref(null);

onMounted(async () => {
  user.value = await getUserConnected();
  console.log(user.value);
});

const tags = ref([]);

axios.get('http://127.0.0.1:8000/api/tags')
  .then(response => {
    tags.value = response.data.tags;
  })
  .catch(error => {
    console.log(error.response.data.message);
  });

</script>

<template>
<!--  Titre + bouton vers le lien de la creation de tag-->
  <div v-if="user" class="flex justify-between items-center p-8">
    <h1 class="text-2xl font-bold">Liste des Tags</h1>
    <router-link to="/tag/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
      Créer un tag
    </router-link>
  </div>
<!--  Afficher les tags par card de grid de 4-->
  <div class="grid grid-cols-4 gap-4">
    <div v-for="tag in tags" :key="tag.id" class="bg-white p-4 shadow-lg rounded-lg">
      <h2 class="text-xl font-bold">{{ tag.name }}</h2>
<!--      <p>{{ tag.description }}</p>-->
    </div>
  </div>

</template>

<style scoped>

</style>