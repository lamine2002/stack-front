<script setup>
import axios from 'axios';
import {ref} from "vue";
import Sidebar from "./Sidebar.vue";

const questions = ref([]);

axios.get('http://127.0.0.1:8000/api/questions')
  .then(response => {
    console.log(response.data.questions);
    questions.value = response.data.questions;
  })
  .catch(error => {
    console.log(error);
  });

</script>

<template>
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