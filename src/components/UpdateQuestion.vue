<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { getUserConnected } from "../userConnected.js";
import {useRoute} from "vue-router";
import router from "../router.js";

const route = useRoute();
const questionId = ref(route.params.id);
// console.log(questionId.value);

const question = ref({
  title: "",
  body: "",
  user_id: "",
  tags: []
});
const selectedTags = ref([]);
const tagsList = ref([]);

onMounted(async () => {
  // Récupérer les informations de la question à modifier
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/questions/' + questionId.value);
    const data = response.data.question;
    console.log(data);
    question.value = {
      title: data.title,
      body: data.body,
      user_id: data.user_id,
      tags: data.tags.map(tag => tag.id) // Pré-sélectionner les tags existants de la question
    };
    selectedTags.value = question.value.tags; // Sélectionner les tags dans la liste déroulante
  } catch (error) {
    alert(error.response.data.message);
  }

  // Récupérer la liste des tags disponibles
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/tags');
    tagsList.value = response.data.tags;
  } catch (error) {
    console.error(error.response.data.message);
  }
});

const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const updateQuestion = () => {
  axios.patch('http://127.0.0.1:8000/api/questions/' + questionId.value, {
    title: question.value.title,
    body: question.value.body,
    tags: selectedTags.value,
    user_id: question.value.user_id
  }, config)
      .then(response => {
        alert('Question mise à jour avec succès');
        // Rediriger l'utilisateur vers la page de détail de la question
        router.push('/question/show/' + questionId.value);
      })
      .catch(error => {
        alert(error.response.data.message);
      });
}
</script>

<template>
  <div class="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Modifier la question</h2>
    <form @submit.prevent="updateQuestion" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Titre:</label>
        <input
            type="text"
            v-model="question.title"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Question:</label>
        <textarea
            v-model="question.body"
            required
            class="mt-1 block h-28 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Modifier la question</button>
    </form>
  </div>
</template>



<style scoped>
</style>
