<script setup>
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import { getUserConnected } from "../userConnected.js";

const user = ref(null);
const tagsList = ref([]);

onMounted(async () => {
  user.value = await getUserConnected();
  console.log(user.value);

  // Récupération des tags
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/tags');
    tagsList.value = response.data.tags;
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
  }
});

const title = ref('');
const body = ref('');
const selectedTags = ref([]);
const user_id = ref(null);

watch(user, () => {
  if (user.value !== null) {
    user_id.value = user.value.id;
  }
});

const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const createQuestion = () => {
  axios.post('http://127.0.0.1:8000/api/questions', {
    title: title.value,
    body: body.value,
    tags: selectedTags.value,
    user_id: user_id.value
  }, config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Poser une question</h2>
    <form @submit.prevent="createQuestion" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Titre:</label>
        <input
            type="text"
            v-model="title"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Question:</label>
        <textarea
            v-model="body"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Tags:</label>
        <select
            v-model="selectedTags"
            multiple
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option v-for="tag in tagsList" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
        </select>
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Poser la question</button>
    </form>
  </div>
</template>

<style scoped>
</style>
