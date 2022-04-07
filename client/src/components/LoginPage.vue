<template>
  <form id="loginForm">
    <label for="login">Login :</label>
    <input v-model="loginValue" type="text" name="login" id="login" />
    <br />
    <label for="password">Password :</label>
    <input
      v-model="passwordValue"
      type="password"
      name="password"
      id="password"
    />
    <br />
    <button @click.prevent="login">Send</button>
  </form>
  <div></div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      loginValue: "",
      passwordValue: "",
    };
  },
  methods: {
    login() {
      console.log("Login cliqué.");
      console.log(this.loginValue);
    },
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
