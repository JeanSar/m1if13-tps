<template>
  <div>
    <h1 style="margin-bottom: 1.5em; color: darkslategrey">Sign in / Sign up</h1>
  </div>
  <div class="formulaire">
    <form id="loginForm" >
      <div class="inputAndLabel">
        <input class="centerInputAndText" placeholder="Login" v-model="loginValue" type="text" name="login" id="login" />
      </div>
      <div class="inputAndLabel">
        <input class="centerInputAndText" placeholder="Password" v-model="passwordValue" type="password" name="password" id="password" />
      </div>
      <div class="inputAndLabel">
        <input class="centerInputAndText" v-model="imageValue" placeholder="Image URL" type="url" name="image" id="image" />
      </div>
      <div class="inputAndLabel">
        <input class="centerInputAndText" v-model="ttlValue" type="number" placeholder="TTL" name="ttl" id="ttl" />
      </div>
      <div class="submitButton">
        <button class="primaryBtn" @click.prevent="login">Se connecter</button>
        <button class="secondaryBtn" @click.prevent="createAccount">Créer un compte</button>
      </div>
    </form>
  </div>
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
        sessionStorage.setItem("login", this.loginValue);
        const token = res.headers.get("Authorization").split("Bearer ")[1];
        sessionStorage.setItem("token", token);
        window.alert("Connection réussi !");
        await this.$router.push("/home");
      }

      if(res.status === 400) { // Le nom de compte renseigné est déjà pris
        window.alert("Utilisateur inexistant ou mot de passe incorrect");
        this.passwordValue = "";
        this.loginValue = "";
      }


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

.inputAndLabel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.6em;
  border-radius: 100px;
  border-color: red;
  border-width: 20px;
  font-weight: bold;
}

.centerInputAndText {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}


button {
  border-radius: 1em;
  width: 10em;
  height: 4em;
  margin-inline: 0.2em;
  margin-top: 1em;
  color: black;
  font-size: 1em;

  border-color: white;
}

.primaryBtn {
  background-color: #2475e5;
  flex: 1;
  color: white;
}

.secondaryBtn {
  background-color: #f6f5f5;
  flex: 1;
}

input {
  padding-left: 1em;
  height: 2.5em;
  font-size: 14pt;
  border-radius: 0.6em;
  border-color: white;
}
.formulaire {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 25em;
  margin-left: auto;
  margin-right: auto;
}

.submitButton {
  display: flex;
  flex: 1;
  flex-direction: row;
  background-color: white;
}

</style>
