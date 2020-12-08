<template>
  <div class="sidebar">
    <div class="user">
      <div class="user-picture">
        <img :src="user.picture_url" class="ui circular image" />
      </div>

      <div class="user-info">
        <div class="user-info-pseudo">{{ user.username }}</div>

        <div class="user-info-status ui simple dropdown">
          <div class="available text">
            En ligne
          </div>
          <i class="dropdown icon"> </i>
          <div class="menu">
            <div class="item" @click="deauthenticate">
              <i class="logout icon"> </i>
              Déconnexion
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu">
      <div class="blue button" @click="openCommunity">
        <i class="users icon"> </i>
        <br />
        <span>Communauté</span>
      </div>
      <div v-if="true" class="blue button" @click="openMessageSearch">
        <i class="search icon"> </i>
        <br />
        <span>Messages</span>
      </div>
    </div>
    <div class="conversations">
      <div class="conversation-search">
        <div class="ui fluid search">
          <div class="ui icon input">
            <input
              v-model="search"
              class="prompt"
              placeholder="Rechercher une conversation"
              type="text"
            />
            <i class="search icon"> </i>
          </div>
        </div>
      </div>
      <div v-for="conversation in search_conversations" :key="conversation.id" class="conversation new" :title="conversation.title" @click="openConversation(conversation.id)">
        <a class="avatar">
          <i v-if="conversation.participants.length > 2" class="ui users icon"></i>
          <img v-else :src=getPicture(conversation.participants[1])>
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title"><i class="ui small icon circle"> </i> {{conversation.title}}</div>
            <span class="time">{{conversation.updated_at}}</span>
          </div>
          <div class="text">{{conversation.messages[-1]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      search: ""
    };
  },
  created(){
    this.initConversations();
  },
  methods: {
    ...mapActions(["deauthenticate","initConversations"]),
    openCommunity() {
      router.push({ name: "Community" });
    },
    openMessageSearch() {
      router.push({ name: "Search" });
    },
    openConversation(id) {
      router.push({ name: "Conversation", params: { id } });
    },
    getPicture(username) {
      let picture;
      this.users.forEach((user) => {
        if (user.username === username) {
          picture = user.picture_url;
        }
      });
      return picture;
    }
  },
  computed: {
    ...mapGetters(["user", "conversations", "users"]),
    search_conversations(){
      let filteredConversations;
      filteredConversations = this.conversations.filter((conversation) =>
        conversation.title? conversation.title.toLowerCase().includes(this.search.toLowerCase()): ""
      );

      return filteredConversations;
    }
  }
};
</script>

<style scoped src="./Sidebar.css" />
