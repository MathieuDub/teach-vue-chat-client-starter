<template>
  <div class="message mine">
    <div class="bubble top bottom">{{ message }}</div>
    <div class="reacts"></div>
    <div class="controls">
      <i title="Supprimer" class="circular trash icon"></i>
      <i title="Editer" class="circular edit icon"></i>
      <i title="Répondre" class="circular reply icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "MineMessgae",
  props: ["message"],
  data() {
    return {

    };
  }
}
</script>

<style src="./Conversation.css" scoped />
