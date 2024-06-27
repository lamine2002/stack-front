<script setup>
import axios from "axios";
import router from "../router.js";

const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};
const logout = () => {
  axios.post('http://127.0.0.1:8000/api/logout', {}, config)
    .then(response => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      router.go();
    })
    .catch(error => {
      alert(error.response.data.message)
    });
}
</script>

<template>
<!--  Creer un bouton deconnecter que je mettrais dans mon navbar-->
  <button @click="logout" class="hover:text-red-700 text-black  py-2 px-4 rounded-lg">Deconnexion</button>
</template>

<style scoped>

</style>