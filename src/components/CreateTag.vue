<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-center">Créer un nouveau tag</h2>
    <form @submit.prevent="createTag">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Nom du tag</label>
        <input
            type="text"
            id="name"
            v-model="tag.name"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
        />
      </div>
      <div class="mt-6">
        <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Créer Tag
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tag: {
        name: ''
      }
    }
  },
  methods: {
    createTag() {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.post('http://127.0.0.1:8000/api/tags', this.tag, config)
          .then(response => {
            alert('Tag créé avec succès');
            this.tag.name = '';
          })
          .catch(error => {
            alert(error.response.data.message);
          });
    }
  }
}
</script>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
