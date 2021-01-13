<template>
  <div class="conversation">
    <div class="conversation-header">
      <div v-if="conversation.participants.length > 2" class="avatar">
        <i class="ui users icon"></i>
      </div>
      <img v-else class="avatar" :src=getPicture(conversation.participants[1]) />
      <div class="title">
        <div class="ui compact">
          <!-- todo: when connected -->
          <i class="icon circle"></i>
          <span v-if="conversation.participants.length > 2">Groupe: {{ conversation.title }}</span>
          <span v-else>{{ conversation.title }}</span>
          <div class="ui simple dropdown item">
            <i class="vertical ellipsis icon"></i>

            <div class="menu">
              <div v-if="true" class="item">
                <i class="ui icon paint brush"></i>
                Modifier le thème
              </div>
              <div v-if="true" class="item">
                <i class="ui icon edit"></i>
                Modifier le titre
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell slash"></i>
                Mettre en sourdine
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell"></i>
                Rétablir les notifications
              </div>
              <div class="item" @click="groupPanel = !groupPanel">
                <i class="ui icon users"></i>
                Gérer les participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="conversation-container">
      <div class="conversation-main">
        <div class="conversation-body" id="scroll">
          <div class="wrapper">
            <div v-for="message in conversation.messages" :key="message.id">
              <div class="time">
                {{ new Date(message.posted_at).toLocaleTimeString() }}
              </div>
              <mine-message v-if="message.from === user.username" :message="message.content"></mine-message>
              <their-message v-else :message="message.content" :from="message.from" :picture="getPicture(message.from)"></their-message>
            </div>
            <div class="view">
              <img
                title="Vu par Alice à 01:36:39"
                src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
              /><img
                title="Vu par Gael à 01:36:39"
                src="https://source.unsplash.com/OYH7rc2a3LA/100x100"
              />
            </div>
          </div>
        </div>

        <div class="typing">
          <div class="wrapper">
            Alice est en train d'écrire...
          </div>
        </div>
        <div class="conversation-footer">
          <div class="wrapper">
            <p>
              <i title="Abandonner" class="circular times small icon link"></i>
              Répondre à Alice :
              <span>
                On peut même éditer ou supprimer des messages !
              </span>
            </p>

            <div class="ui fluid search">
              <div class="ui icon input">
                <input
                  v-model="message"
                  class="prompt"
                  type="text"
                  placeholder="Rédiger un message"
                  @keyup.enter="
                    postMessage({ currentConversationId: conversation.id, message: message}),
                    clear()
                  "
                />
                <i class="send icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="conversation-sidebar" v-if="groupPanel">
        <Group />
      </div>
    </div>
  </div>
</template>

<script>
import Group from "@/components/Group/Group";
import MineMessage from "./MineMessage";
import TheirMessage from "./TheirMessage";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Conversation",
  components: { Group, MineMessage, TheirMessage },
  data() {
    return {
      groupPanel: false,
      message: ""
    };
  },
  created() {
    // console.log(this.conversation);
    // console.log('users');
    // console.log(this.users);
  },
  mounted() {
    this.scrollBottom();
  },
  updated() {
    this.scrollBottom();
  },
  computed: {
    ...mapGetters(["conversation", "user", "users"])
  },
  methods: {
    ...mapActions(["postMessage"]),
    scrollBottom() {
      setTimeout(() => {
        let scrollElement = document.querySelector("#scroll");
        if (scrollElement) {
          scrollElement.scrollTop = document.querySelector(
            "#scroll"
          ).scrollHeight;
        }
      }, 0);
    },
    getPicture(name) {
      let picture;
      this.users.forEach((user) => {
        if (user.username === name) {
          picture = user.picture_url;
        }
      });
      return picture;
    },
    clear() {
      this.message = "";
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    conversation(newConversation, oldConversation) {
      this.scrollBottom();
    }
  }
};
</script>

<style src="./Conversation.css" scoped />
