<template>
  <LoginPage />
  <HomePage msg="Hello World"/>
</template>

<script>
import HomePage from "@/components/HomePage";
import LoginPage from "@/components/LoginPage";

export default {
  name: "App",
  components: {
    LoginPage,
    HomePage,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
