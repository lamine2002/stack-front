<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from "vue";
import { getUserConnected } from "../userConnected.js";
import router from "../router.js";
import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";

const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
};

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
      <router-link :to="{ path: '/question/show/' + question.id }" class="flex justify-between items-center px-8">
        <div>
          <h2 class="text-xl font-bold mb-2">{{ question.title }}</h2>
          <p class="text-gray-700">{{ question.body }}</p>
          <div class="mt-2">
            <span v-for="tag in question.tags" :key="tag.id" class="mr-1 inline-block bg-blue-100 text-blue-800 p-2 rounded-xl text-sm font-semibold tracking-wide">{{ tag.name }}</span>
          </div>
          <p
              v-if="question.answers.length === 1"
              :class="['question-with-response', { 'validated-answer': question.answers.some(answer => answer.is_validated) }]"
              class="text-xs text-gray-500 mt-2 inline-block p-1 rounded-lg"
          >
            1 Réponse

            <span v-if="question.answers.some(answer => answer.is_validated)" class="inline-block pl-1">
              <svg fill="#fff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 496.124 496.124" xml:space="preserve">
                <g>
                  <path d="M420.001,219.7c3.666,14.313,5.811,29.238,5.811,44.676c0,99.828-81.199,181.024-181.022,181.024
                    c-99.821,0-181.039-81.195-181.039-181.024c0-99.824,81.218-181.041,181.039-181.041c25.442,0,49.633,5.338,71.623,14.848
                    l26.912-43.26c-29.949-14.15-63.27-22.307-98.535-22.307c-127.793,0-231.764,103.971-231.764,231.76
                    c0,127.779,103.971,231.748,231.764,231.748c127.774,0,231.743-103.969,231.743-231.748c0-35.516-8.271-69.062-22.599-99.178
                    L420.001,219.7z"/>
                  <path d="M463.159,6.385c-19.811-12.32-45.882-6.279-58.217,13.533L236.88,289.985l-56.299-80.289
                    c-13.389-19.104-39.775-23.729-58.879-10.338c-19.1,13.408-23.742,39.756-10.336,58.877l93.002,132.633
                    c7.93,11.291,20.855,17.996,34.609,17.996c0.379,0,0.777,0,1.157-0.018c14.181-0.396,27.229-7.871,34.72-19.914L476.702,64.6
                    C489.05,44.766,482.972,18.713,463.159,6.385z"/>
                </g>
              </svg>
            </span>
          </p>
          <p
              v-if="question.answers.length > 1"
              :class="['question-with-response', { 'validated-answer': question.answers.some(answer => answer.is_validated) }]"
              class="text-xs text-gray-500 mt-2 inline-block p-1 rounded-lg"
          >
            <span>
              {{ question.answers.length + ' Réponses ' }}
            </span>
            <span v-if="question.answers.some(answer => answer.is_validated)" class="inline-block pl-1">
              <svg fill="#fff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 496.124 496.124" xml:space="preserve">
                <g>
                  <path d="M420.001,219.7c3.666,14.313,5.811,29.238,5.811,44.676c0,99.828-81.199,181.024-181.022,181.024
                    c-99.821,0-181.039-81.195-181.039-181.024c0-99.824,81.218-181.041,181.039-181.041c25.442,0,49.633,5.338,71.623,14.848
                    l26.912-43.26c-29.949-14.15-63.27-22.307-98.535-22.307c-127.793,0-231.764,103.971-231.764,231.76
                    c0,127.779,103.971,231.748,231.764,231.748c127.774,0,231.743-103.969,231.743-231.748c0-35.516-8.271-69.062-22.599-99.178
                    L420.001,219.7z"/>
                  <path d="M463.159,6.385c-19.811-12.32-45.882-6.279-58.217,13.533L236.88,289.985l-56.299-80.289
                    c-13.389-19.104-39.775-23.729-58.879-10.338c-19.1,13.408-23.742,39.756-10.336,58.877l93.002,132.633
                    c7.93,11.291,20.855,17.996,34.609,17.996c0.379,0,0.777,0,1.157-0.018c14.181-0.396,27.229-7.871,34.72-19.914L476.702,64.6
                    C489.05,44.766,482.972,18.713,463.159,6.385z"/>
                </g>
              </svg>
            </span>
          </p>


          <p
              v-if="question.answers.length <= 0"
              class="text-xs text-gray-500 mt-2 inline-block p-1 rounded-lg"
          >
            0 Réponses
          </p>
        </div>

        <!-- l'utilisateur qui a posé la question -->
        <div class="">
          <p class="text-gray-700">{{ 'Posée par ' + question.user.name }} {{ timeAgo(question.created_at) }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.question-with-response {
  border: 1.4px solid #0ce12e;
}

.validated-answer {
  background-color: green;
  color: white;
}
</style>
