<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Answer from "./Answer.vue";

const route = useRoute();
const questionId = ref(route.params.id);

// récupère les informations de la question
const question = ref({});
const tags = ref([]);
const answers = ref([]);

axios.get('http://127.0.0.1:8000/api/questions/' + questionId.value)
    .then(response => {
      question.value = response.data.question;
      tags.value = response.data.question.tags;
      answers.value = response.data.question.answers;
    })
    .catch(error => {
      console.log(error);
    });

// fonction pour formater la date
const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
};

const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};
// fonctions pour gérer les votes
const vote = (answerId, increment) => {
  if (increment === 1) {
    // Logique pour voter positivement
    axios.put(`http://127.0.0.1:8000/api/answers/${answerId}/incrementvote`, {}, config)
        .then(response => {
          const index = answers.value.findIndex(answer => answer.id === answerId);
          answers.value[index].votes++;
        })
        .catch(error => {
         alert(error.response.data.message)
        });
  } else {
    // Logique pour voter négativement
    axios.put(`http://127.0.0.1:8000/api/answers/${answerId}/decrementvote` , {}, config)
        .then(response => {
          const index = answers.value.findIndex(answer => answer.id === answerId);
          answers.value[index].votes--;
        })
        .catch(error => {
          alert(error.response.data.message)
        });
  }
};

// fonction pour modifier
const editQuestion = () => {
  // Logique pour modifier la question
};

const editAnswer = (answerId) => {
  // Logique pour modifier la réponse
};
</script>

<template>
  <div class="container mx-auto px-4">
    <div class="border p-4 rounded-md my-8">
      <h2 class="text-4xl font-semibold mb-2">{{ question.title }}</h2>
      <hr class="my-4">
      <p class="text-gray-700">{{ question.body }}</p>
      <div class="mt-2">
        <span v-for="tag in tags" :key="tag.id" class="mr-1 inline-block bg-blue-200 text-blue-800 p-2 rounded-full text-sm font-semibold tracking-wide">{{ tag.name }}</span>
      </div>
      <div class="mt-4 flex justify-between items-center text-gray-500">
        <button @click="editQuestion" class="text-blue-500 hover:text-blue-700">Modifier</button>
        <p>Posté par {{ question.user.name }} {{ timeAgo(question.created_at) }}</p>
      </div>
    </div>

    <div class="border p-4 rounded-md my-8">
      <h3 class="text-3xl font-semibold mb-2">Réponses</h3>
      <hr class="my-4">
      <div v-for="answer in answers" :key="answer.id" class="border p-4 rounded-md my-4">
        <div class="flex">
          <div class="flex flex-col items-center mr-4">
            <button @click="vote(answer.id, 1)" class="text-green-500 hover:text-green-700 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center border-2">
              ▲
            </button>
            <span class="text-gray-700 text-xl font-bold">{{ answer.votes }}</span>
            <button @click="vote(answer.id, -1)" class="text-red-500 hover:text-red-700 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center border-2">
              ▼
            </button>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <p class="text-gray-700">{{ answer.body }}</p>
            <div class="mt-2 flex justify-between items-center text-gray-500">
              <button @click="editAnswer(answer.id)" class="text-blue-500 hover:text-blue-700">Modifier</button>
              <p>Répondu par {{ answer.user.name }} {{ timeAgo(answer.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Answer :questionId="questionId" />


</template>

<style scoped>
</style>
