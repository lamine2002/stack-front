<script setup>
import axios from 'axios';
import {onMounted, ref} from "vue";
import Sidebar from "./Sidebar.vue";
import {getUserConnected} from "../userConnected.js";
import router from "../router.js";

const questions = ref([]);

axios.get('http://127.0.0.1:8000/api/questions')
  .then(response => {
    // console.log(response.data.questions);
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
  // verifier si l'utilisateur est connecte
  if (user.value === null) {
    alert('Vous devez vous connecter pour poser une question');
    return;
  }
  // rediriger vers la page de creation de question
  router.push('/question/create');
}
</script>

<template>
<!--  Mettre le titre Question et a cote ajoute un bouton poser une question qui est un lien situe tout a droite en utilisant les flex et justify-content-->
  <div class="flex justify-between items-center">
    <h1 class="text-4xl font-bold">Questions</h1>
    <router-link @click="goCreateQuestion" to="" class="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg">Une question ?</router-link>
  </div>

  <div class="container mx-auto px-4">
      <div v-for="question in questions" :key="question.id" class="border p-4 rounded-md my-8">
        <router-link :to="{ path: '/question/show/' + question.id }" >
        <h2 class="text-xl font-bold mb-2">{{ question.title }}</h2>
        <p class="text-gray-700">{{ question.body }}</p>
        <div class="mt-2">
          <span v-for="tag in question.tags" :key="tag.id" class="mr-1 inline-block bg-blue-200 text-blue-800 p-2 rounded-full text-sm font-semibold tracking-wide">{{ tag.name }}</span>
        </div>
        </router-link>
      </div>


  </div>

</template>

<style scoped>

</style>