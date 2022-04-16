<template>

  <div v-if="this.$store.state.showPopUp" class="backgroundPopUp">
    <div class="popUp">
      <p>{{message}}</p>
      <button @click="btnClick">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopUp",
  props: ['message'],
  methods: {
    btnClick() {
      this.$store.commit("setShowPopUp", false);
    }
  }
}
</script>

<style scoped>
  .backgroundPopUp {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(140, 140, 140, 0.8);
  }

  .popUp {
    position: absolute;
    flex-direction: column;
    left: 37%;
    top: 25%;
    border-radius: 1em;
    z-index: 3;
    width: 400px;
    height: 200px;
    background-color: white;
    border-color: black;
    border-width: 10em;
  }

  p {
    font-size: 25px;
    font-weight: bold;
  }


  button {
    border-radius: 1em;
    width: 10em;
    height: 4em;
    margin: 1em;
    color: black;
    font-size: 1em;

    border-color: white;
  }
</style>