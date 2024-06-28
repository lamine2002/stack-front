<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { getUserConnected } from "../userConnected.js";
import router from "../router.js";

const questions = ref([]);
const filters = ref({ title: '', tag: '', answered: '' });
const sortBy = ref('date');

axios.get('http://127.0.0.1:8000/api/questions')
    .then(response => {
      questions.value = response.data.questions;
    })
    .catch(error => {
      alert(error.response.data.message);
    });

const user = ref(null);

onMounted(async () => {
  user.value = await getUserConnected();
  console.log(user.value);
});

const goCreateQuestion = () => {
  if (user.value === null) {
    alert('Vous devez vous connecter pour poser une question');
    return;
  }
  router.push('/question/create');
}

const applyFilters = () => {
  // Cette méthode est déclenchée lorsque l'utilisateur clique sur le bouton "Appliquer les filtres"
}

const filteredQuestions = computed(() => {
  return questions.value.filter(question => {
    const matchesTitle = !filters.value.title || question.title.toLowerCase().includes(filters.value.title.toLowerCase());
    const matchesTag = !filters.value.tag || question.tags.some(tag => tag.name.toLowerCase().includes(filters.value.tag.toLowerCase()));
    const matchesAnswered = filters.value.answered === '' ||
        (filters.value.answered === 'answered' && question.answers.length > 0) ||
        (filters.value.answered === 'unanswered' && question.answers.length === 0);

    return matchesTitle && matchesTag && matchesAnswered;
  });
});

const sortedQuestions = computed(() => {
  const questionsToSort = [...filteredQuestions.value];
  if (sortBy.value === 'title') {
    questionsToSort.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy.value === 'date') {
    questionsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return questionsToSort;
});
</script>



<template>
  <div class="flex justify-between items-center">
    <h1 class="text-4xl font-bold">Questions</h1>
    <router-link @click="goCreateQuestion" to="" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Une question ?</router-link>
  </div>

  <!-- Section de filtres -->
  <div class="flex justify-between items-center my-4">
    <input v-model="filters.title" type="text" placeholder="Filtrer par titre" class="border rounded px-2 py-1 mr-2">
    <input v-model="filters.tag" type="text" placeholder="Filtrer par tag" class="border rounded px-2 py-1 mr-2">
    <select v-model="filters.answered" class="border rounded px-2 py-1 mr-2">
      <option value="">Tous</option>
      <option value="answered">Répondu</option>
      <option value="unanswered">Non répondu</option>
    </select>
    <select v-model="sortBy" class="border rounded px-2 py-1 mr-2">
      <option value="date">Date</option>
      <option value="title">Titre</option>
    </select>
    <button @click="applyFilters" class="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg">Appliquer les filtres</button>
  </div>

  <div class="container mx-auto px-4">
    <div v-for="question in sortedQuestions" :key="question.id" class="border p-4 rounded-md my-8 hover:shadow-lg">
      <router-link :to="{ path: '/question/show/' + question.id }">
        <h2 class="text-xl font-bold mb-2">{{ question.title }}</h2>
        <p class="text-gray-700">{{ question.body }}</p>
        <div class="mt-2">
          <span v-for="tag in question.tags" :key="tag.id" class="mr-1 inline-block bg-blue-100 text-blue-800 p-2 rounded-xl text-sm font-semibold tracking-wide">{{ tag.name }}</span>
        </div>
        <p v-if="question.answers.length === 1" class="question-with-response text-xs text-gray-500 mt-2  inline-block p-1 rounded-lg">{{'1 Réponse' }}</p>
        <p v-if="question.answers.length > 1" class="question-with-response text-xs text-gray-500 mt-2 inline-block p-1 rounded-lg">{{question.answers.length + ' Réponses' }}</p>
        <p v-if="question.answers.length <= 0" class="text-xs text-gray-500 mt-2 inline-block p-1 rounded-lg">{{'0 Réponses' }}</p>

      </router-link>
    </div>
  </div>
</template>



<style scoped>

.question-with-response {
  border: 1.4px solid #0ce12e;
}

</style>