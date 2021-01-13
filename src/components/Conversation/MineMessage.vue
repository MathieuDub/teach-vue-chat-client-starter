<template>
  <div class="message mine">
    <div class="bubble top bottom">{{ message.content }}</div>
    <div class="reacts"></div>
    <div class="controls">
      <i title="Supprimer" class="circular trash icon" @click="eraseMessage({message_id: message.id})"></i>
      <i title="Editer" class="circular edit icon"></i>
      <i title="Répondre" class="circular reply icon"></i>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "MineMessgae",
  props: ["message"],
  data() {
    return {

    };
  },
  methods: {
    ...mapActions(["eraseMessage"])
  }
}
</script>

<style src="./Conversation.css" scoped />
