<template>
  <form id="loginForm">
    <label for="login">Login :</label>
    <input v-model="loginValue" type="text" name="login" id="login" />
    <br />
    <label for="password">Password :</label>
    <input v-model="passwordValue" type="password" name="password" id="password" />
    <br />
    <label for="image">Image :</label>
    <input v-model="imageValue" type="url" name="image" id="image" />
    <br />
    <label for="ttl">TTL :</label>
    <input
      v-model="ttlValue"
      type="number"
      name="ttl"
      id="ttl"
    />
    <br />
    <button @click.prevent="login">Se connecter</button>
    <button @click.prevent="createAccount">Créer un compte</button>
  </form>
  <div></div>
</template>

<script>
import { createAnAccountOnNode, createAnAccountOnSpring, loginFunction } from "@/utils/loginFunction";

export default {
  name: "LoginPage",
  data() {
    return {
      loginValue: "",
      passwordValue: "",
      imageValue: "",
      ttlValue: 0
    };
  },
  methods: {
    async login() {
      const res = await loginFunction(this);
      if(res.status === 204) { // La création de compte s'est bien passé
        window.alert("Connection réussi !");
        // this.loginValue = "";
        // this.passwordValue = "";
      }

      if(res.status === 400) { // Le nom de compte renseigné est déjà pris
        window.alert("Utilisateur inexistant ou mot de passe incorrect");
        this.passwordValue = "";
        this.loginValue = "";
      }
      const token = res.headers.get("Authorization").split("Bearer ")[1];
      sessionStorage.setItem("token", token);

    },
    async createAccount() {
      const res = await createAnAccountOnSpring(this);
      if(res.status === 204) { // La création de compte s'est bien passé
        await createAnAccountOnNode(this);
        window.alert("Compte crée ! ");
        // this.loginValue = "";
        // this.passwordValue = "";
      }

      if(res.status === 400) { // Le nom de compte renseigné est déjà pris
        window.alert("Nom d'utilisateur non disponible");
        this.loginValue = "";
      }
    }
  },
};
</script>

<style scoped>
input,
input[type="submit"],
select {
  background-color: #2f4f4f !important;
  color: lightgray;
  border: 1px solid;
}
</style>
