<template>
  <div class="max-w mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Profil Utilisateur</h3>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Nom</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.name }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Email</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.email }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Role</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.role }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Date de Création</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(user.created_at) }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Nombre de Questions Posées</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ questionsCount }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Nombre de Réponses Validées</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ validatedAnswersCount }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Nombre de Votes Reçus</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ totalVotes }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const token = localStorage.getItem('token');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

export default {
  data() {
    return {
      user: {},
      questions: [],
      validatedAnswersCount: 0,
      totalVotes: 0,
    };
  },
  computed: {
    questionsCount() {
      return this.questions.length;
    },
  },
  methods: {
    async fetchUserData() {
      try {
        const userResponse = await axios.get('http://127.0.0.1:8000/api/user', config);
        this.user = userResponse.data;

        const questionsResponse = await axios.get('http://127.0.0.1:8000/api/questions');
        this.questions = questionsResponse.data.questions.filter(
            question => question.user_id === this.user.id
        );

        this.questions.forEach(question => {
          question.answers.forEach(answer => {
            if (answer.user_id === this.user.id && answer.is_validated) {
              this.validatedAnswersCount++;
            }
            if (answer.user_id === this.user.id) {
              this.totalVotes += answer.votes;
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },
  },
  created() {
    this.fetchUserData();
  },
};
</script>

<style scoped>
/* Ajoutez des styles supplémentaires ici si nécessaire */
</style>
