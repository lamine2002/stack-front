<script setup>
import axios from 'axios';
import {onMounted, ref, watch} from 'vue';
import {getUserConnected} from "../userConnected.js";
const user = ref(null);


onMounted(async () => {
  user.value = await getUserConnected();
  console.log(user.value);
});

const body = ref('');
const question_id = ref(null);
const user_id = ref(null);
const props = defineProps({
  questionId: {
    type: String,
    required: true
  }
});

console.log(props.questionId);

watch(user, () => {
  if (user.value !== null) {
    user_id.value = user.value.id;
  }
});

const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const createAnswer = () => {
  // alert(body.value + props.questionId + user_id.value);
  axios.post('http://127.0.0.1:8000/api/answers', {
    body: body.value,
    question_id: props.questionId,
    user_id: user_id.value
  }, config)
      .then(response => {
        // console.log(response.data);
        // alert('Réponse créée avec succès');
        body.value = '';
        window.location.reload();

      })
      .catch(error => {
       alert(error.response.data.message)
      });
}


</script>

<template>
<!-- Textarea body pour repondre a une question posees -->
  <div v-if="user" class="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Répondre à la question</h2>
    <form @submit.prevent="createAnswer" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Réponse:</label>
        <textarea
          v-model="body"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Répondre
      </button>
    </form>
  </div>

</template>

<style scoped>

</style>