import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Register from "./components/Register.vue";
import Home from "./components/Home.vue";
import QuestionDetail from "./components/QuestionDetail.vue";
import CreateQuestion from "./components/CreateQuestion.vue";
import Tags from "./components/Tags.vue";
import MyQuestions from "./components/MyQuestions.vue";
import UpdateQuestion from "./components/UpdateQuestion.vue";


const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  {
    path: '/register', component: Register
  },
  {
    path: '/question/show/:id',
    component: QuestionDetail,
    props: true // Active la récupération automatique des paramètres d'URL
  },
  {
    path: '/question/create',
    component: CreateQuestion,
    meta: { requiresAuth: true }  // Ajoute la métadonnée pour la protection de la route
  },
  {
    path: '/question/edit/:id',
    component: UpdateQuestion,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/tags',
    component: Tags
  },
  {
    path: '/my-questions',
    component: MyQuestions,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
