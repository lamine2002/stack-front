<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    login() {
      axios.post('http://127.0.0.1:8000/api/login', {
        email: this.email,
        password: this.password
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        // token expire après 1 heure
        localStorage.setItem('tokenExpiration', Date.now() + 3600 * 1000);
        this.$router.push('/');
      })
      .catch(error => {
        this.error = 'Informations Invalides';
      });
    }
  }
}
</script>

<template>
<!--  Ajouter un bouton retour sur la page home-->

  <div class=" max-w ml-12 mx-auto flex justify-between items-center">
    <router-link to="/" class="mt-24 bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg">Retour</router-link>
  </div>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Se connecter</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email:</label>
        <input 
          type="email" 
          v-model="email" 
          required 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password:</label>
        <input 
          type="password" 
          v-model="password" 
          required 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button 
        type="submit" 
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

      <p class="mt-4">
        Pas encore de compte? <router-link to="/register" class="text-blue-500">Inscrivez-vous</router-link>
      </p>
    </form>
  </div>
</template>