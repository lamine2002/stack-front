<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Answer from "./Answer.vue";
import { getUserConnected } from "../userConnected.js";

const user = ref(null);

onMounted(async () => {
  user.value = await getUserConnected();
  console.log(user.value);
});

const route = useRoute();
const questionId = ref(route.params.id);

// récupère les informations de la question
const question = ref({});
const tags = ref([]);
const answers = ref([]);

axios.get('http://127.0.0.1:8000/api/questions/' + questionId.value)
  .then(response => {
    question.value = response.data.question;
    console.log(question.value);
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
        alert(error.response.data.message);
      });
  } else {
    // Logique pour voter négativement
    axios.put(`http://127.0.0.1:8000/api/answers/${answerId}/decrementvote`, {}, config)
      .then(response => {
        const index = answers.value.findIndex(answer => answer.id === answerId);
        answers.value[index].votes--;
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  }
};

// fonction pour valider une réponse
const validateAnswer = (answerId) => {
  axios.put(`http://127.0.0.1:8000/api/answers/${answerId}/validate`, { supervisor_id: "1" }, config)
    .then(response => {
      const index = answers.value.findIndex(answer => answer.id === answerId);
      answers.value[index].is_validated = true; // Mettre à jour l'état de validation de la réponse
      alert('Réponse validée avec succès!');
    })
    .catch(error => {
      alert(error.response.data.message);
    });
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
  <div  class="container mx-auto px-4">
    <div class="border p-4 rounded-md my-8">
      <h2 class="text-4xl font-semibold mb-2">{{ question.title }}</h2>
      <hr class="my-4">
      <p class="text-gray-700">{{ question.body }}</p>
      <div class="mt-2">
        <span v-for="tag in tags" :key="tag.id" class="mr-1 inline-block bg-blue-200 text-blue-800 p-2 rounded-full text-sm font-semibold tracking-wide">{{ tag.name }}</span>
      </div>
      <div  class="mt-4 flex justify-between items-center text-gray-500">
        <div v-if="user">
        <router-link  :to="{ path: '/question/edit/' + question.id }" v-if="question.user_id === user.id" @click="editQuestion" class="text-blue-500 hover:text-blue-700">Modifier</router-link>
      </div>
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
            <button @click="validateAnswer(answer.id)" class="mt-4 text-green-500 hover:text-green-700" v-if="!answer.is_validated && user">
              <svg fill="#047a3f" height="30px" width="30px" version="1.1" id="XMLID_215_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 24 24" xml:space="preserve">
                <g id="validation">
                  <g>
                    <path d="M12,24c-1.2,0-2.1-1-2.8-1.8c-0.4-0.4-0.8-0.9-1-1c-0.3-0.1-1-0.1-1.5-0.1c-1.1,0.1-2.3,0.1-3.1-0.7s-0.8-2.1-0.7-3.1
                      c0-0.6,0.1-1.2-0.1-1.5c-0.1-0.3-0.6-0.7-1-1C1,14.1,0,13.2,0,12s1-2.1,1.8-2.8c0.4-0.4,0.9-0.8,1-1c0.1-0.3,0.1-1,0.1-1.5
                      C2.8,5.6,2.8,4.4,3.6,3.6c0.8-0.8,2.1-0.8,3.1-0.7c0.6,0,1.2,0.1,1.5-0.1c0.3-0.1,0.7-0.6,1-1C9.9,1,10.8,0,12,0s2.1,1,2.8,1.8
                      c0.4,0.4,0.8,0.9,1,1c0.3,0.1,1,0.1,1.5,0.1c1.1-0.1,2.3-0.1,3.1,0.7c0.8,0.8,0.8,2.1,0.7,3.1c0,0.6-0.1,1.2,0.1,1.5
                      c0.1,0.3,0.6,0.7,1,1C23,9.9,24,10.8,24,12s-1,2.1-1.8,2.8c-0.4,0.4-0.9,0.8-1,1c-0.1,0.3-0.1,1-0.1,1.5c0.1,1.1,0.1,2.3-0.7,3.1
                      c-0.8,0.8-2.1,0.8-3.1,0.7c-0.6,0-1.2-0.1-1.5,0.1c-0.3,0.1-0.7,0.6-1,1C14.1,23,13.2,24,12,24z M7.5,19.1c0.5,0,1,0.1,1.5,0.2
                      c0.7,0.3,1.3,0.9,1.8,1.5c0.4,0.5,1,1.1,1.3,1.1s0.9-0.6,1.3-1.1c0.5-0.6,1.1-1.2,1.8-1.5c0.7-0.3,1.6-0.3,2.4-0.2
                      c0.6,0,1.4,0.1,1.6-0.1s0.1-1,0.1-1.6c-0.1-0.8-0.1-1.7,0.2-2.4c0.3-0.7,0.9-1.3,1.5-1.8c0.4-0.3,1-0.9,1-1.2s-0.6-0.9-1.1-1.3
                      c-0.6-0.5-1.2-1.1-1.5-1.8c-0.3-0.7-0.3-1.6-0.2-2.4c0-0.6,0.1-1.4-0.1-1.6c-0.2-0.2-1-0.1-1.6-0.1c-0.8,0.1-1.7,0.1-2.4-0.2
                      c-0.7-0.3-1.3-0.9-1.8-1.5C12.9,2.6,12.3,2,12,2s-0.9,0.6-1.3,1.1c-0.5,0.6-1.1,1.2-1.8,1.5S7.3,4.9,6.5,4.8
                      c-0.6,0-1.4-0.1-1.6,0.1c-0.2,0.2-0.1,1-0.1,1.6c0.1,0.8,0.1,1.7-0.2,2.4c-0.3,0.7-0.9,1.3-1.5,1.8C2.6,11.1,2,11.7,2,12
                      s0.6,0.9,1.1,1.3c0.6,0.5,1.2,1.1,1.5,1.8s0.3,1.6,0.2,2.4c0,0.6-0.1,1.4,0.1,1.6c0.2,0.2,1,0.1,1.6,0.1
                      C6.8,19.2,7.1,19.1,7.5,19.1z M11,16.4l-3.7-3.7l1.4-1.4l2.3,2.3l5.3-5.3l1.4,1.4L11,16.4z"/>
                  </g>
                </g>
              </svg>
            </button>
            <p v-if="answer.is_validated" class="mt-4 text-green-500 font-semibold">
              <svg fill="#047a3f" height="30px" width="30px" version="1.1" id="Filled_Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                   y="0px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
                  <g id="Validation-Filled">
                    <path d="M20.32,8.56c-0.51-1.22,0.38-3.41-0.54-4.33c-0.92-0.92-3.11-0.03-4.33-0.54C14.27,3.19,13.36,1,12,1S9.73,3.19,8.56,3.68
                      C7.33,4.19,5.14,3.3,4.22,4.22C3.3,5.14,4.19,7.33,3.68,8.56C3.19,9.73,1,10.64,1,12s2.19,2.27,2.68,3.44
                      c0.51,1.22-0.38,3.41,0.54,4.33c0.92,0.92,3.11,0.03,4.33,0.54C9.73,20.81,10.64,23,12,23s2.27-2.19,3.44-2.68
                      c1.22-0.51,3.41,0.38,4.33-0.54c0.92-0.92,0.03-3.11,0.54-4.33C20.81,14.27,23,13.36,23,12S20.81,9.73,20.32,8.56z M11,16.41
                      l-3.71-3.71l1.41-1.41L11,13.59l5.29-5.29l1.41,1.41L11,16.41z"/>
                  </g>
              </svg>
            </p>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <p class="text-gray-700">{{ answer.body }}</p>
            <div class="mt-2 flex justify-between items-center text-gray-500">
              <div v-if="user">
              <button v-if="user.id === answer.user_id" @click="editAnswer(answer.id)" class="text-blue-500 hover:text-blue-700">Modifier</button>
              </div>

              <p>Répondu par {{ answer.user.name }} {{ timeAgo(answer.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Answer :questionId="questionId" />
  </div>
</template>

<style scoped>
</style>
