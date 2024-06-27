<script setup>
import axios from 'axios';
import {onMounted, ref} from "vue";
import {getUserConnected} from "../userConnected.js";

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
const myQuestions = ref([]);

onMounted(async () => {
  user.value = await getUserConnected();
  // console.log(user.value);
  myQuestions.value = questions.value.filter(question => question.user_id === user.value.id);
  // console.log(myQuestions.value);
});





</script>

<template>
  <div class="flex justify-between items-center">
    <h1 class="text-4xl font-bold">Mes questions</h1>
    <router-link to="/question/create" class="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg">Une question ?</router-link>
  </div>

  <div class="container mx-auto px-4">
    <div v-for="question in myQuestions" :key="question.id" class="border p-4 rounded-md my-8">
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