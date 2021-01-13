import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: false,
    user: {
      username: null,
      token: null,
      picture_url: null
    },
    users: [],
    conversations: [],
    currentConversationId: null,
    usersAvailable: []
  },
  getters: {
    authenticating(state) {
      return state.authenticating;
    },
    authenticated(state) {
      return state.user.token !== null;
    },
    user(state) {
      return state.user;
    },
    users(state) {
      return state.users.map(user => ({
        ...user
        //TODO
      }));
    },
    conversations(state) {
      // console.log(state.conversations);
      state.conversations.sort(( a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      return state.conversations.map(conversation => ({
        ...conversation
        //TODO
      }));
    },
    conversation(state, getters) {
      let conver;
      state.conversations.forEach(conversation => {
        if (conversation.id === state.currentConversationId) {
          conver = conversation;
        }
      });
      return conver;
    }
  },
  mutations: {
    syncCurrentConversation(state, conversationId) {
      state.currentConversationId = conversationId;
    },
    setAuthenticating(state, authenticating) {
      state.authenticating = authenticating;
    },
    setUser(state, { username, token, picture_url }) {
      Vue.set(state.user, "username", username);
      Vue.set(state.user, "token", token);
      Vue.set(state.user, "picture_url", picture_url);
    },
    setUsers(state, users) {
      state.users = users;
    },
    upsertUser(state, { user }) {
      const localUserIndex = state.users.findIndex(
        _user => _user.username === user.username
      );

      if (localUserIndex !== -1) {
        Vue.set(state.users, localUserIndex, user);
      } else {
        state.users.push({
          ...user
        });
      }
    },
    upsertConversation(state, { conversation }) {
      conversation.title = conversation.participants.join();
      state.conversations.splice(state.conversations.findIndex((conver) => conver.id === conversation.id),1)
      state.conversations.push(conversation);
    },
    loadConversations(state, conversations){
      conversations.forEach((conversation) => {
        conversation.title = conversation.participants.join();
      });
      state.conversations = conversations;
    },
    upsertConversationMessages(state, { conversation_id, message }) {
      state.conversations.forEach(conversation => {
        if (conversation.id === conversation_id) {
          conversation.messages.push(message);
        }
      });
    },
    upsertMessagesReaction(state, { conversation_id, message }) {
      state.conversations.forEach(conversation => {
        if (conversation.id === conversation_id) {
          conversation.messages.forEach((currMessage) => {
            if(currMessage.id === message.id) {
              currMessage.reactions = message.reactions;
            }
          });
        }
      });
    },
    removeConversationMessages(state, { conversation_id, message_id }) {
      state.conversations.forEach(conversation => {
        if (conversation.id === conversation_id) {
          conversation.messages.splice(conversation.messages.findIndex((message) => message.id === message_id), 1);
        }
      });
    }
  },
  actions: {
    authenticate({ commit, dispatch }, { username, password }) {
      if (!username || !password) {
        return;
      }
      commit("setAuthenticating", true);
      Vue.prototype.$client
        .authenticate(username, password)
        .then(user => {
          commit("setUser", user);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          dispatch("initializeAfterAuthentication");
        })
        .catch(() => {
          alert("Erreur d'authentification !");
        })
        .finally(() => {
          commit("setAuthenticating", false);
        });
    },

    deauthenticate() {
      localStorage.removeItem("password");
      window.location.reload();
    },

    initializeAfterAuthentication({ dispatch }) {
      dispatch("fetchUsers");
      //TODO: dispatch("fetchConversations");
    },

    fetchUsers({ commit }) {
      Vue.prototype.$client.getUsers().then(({ users }) => {
        commit("setUsers", users);
      });
    },

    createOneToOneConversation({ commit }, username) {
      const promise = Vue.prototype.$client.getOrCreateOneToOneConversation(
        username
      );

      promise.then(({ conversation }) => {
        //commit("upsertConversation", {
        //  conversation
        // });

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },

    createManyToManyConversation({ commit }, username) {
      const promise = Vue.prototype.$client.createManyToManyConversation(
        username
      );

      promise.then(({ conversation }) => {
        //commit("upsertConversation", {
        //  conversation
        //});

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },
    initConversations({ commit }){
      const promise = Vue.prototype.$client.getConversations();
      promise.then(({ conversations }) => {
        commit("loadConversations", conversations);
      });
      return promise;
    },
    postMessage({ commit }, { currentConversationId, message }) {
      const promise = Vue.prototype.$client.postMessage(
        currentConversationId,
        message
      );
      promise.then(({ conversation_id, content }) => {
        commit("upsertConversationMessages", { conversation_id, content });
      });
    },
    addParticipant(context, username) {
      const promise = Vue.prototype.$client.addParticipant(
        context.state.currentConversationId,
        username
      );
    },
    delParticipant(context, username) {
      const promise = Vue.prototype.$client.removeParticipant(
        context.state.currentConversationId,
        username
      );
    },
    addReact(context, payload) {
      const promise = Vue.prototype.$client.reactMessage(
        context.state.currentConversationId,
        payload.message_id,
        payload.reaction
      );
      promise.then(({ conversation_id, content }) => {
        context.commit("upsertMessagesReaction", { conversation_id, content });
      });
    },
    addReply(context, payload) {
      const promise = Vue.prototype.$client.replyMessage(
        context.state.currentConversationId,
        payload.message_id,
        payload.message_content
      );
    },
    eraseMessage(context, payload) {
      const promise = Vue.prototype.$client.deleteMessage(
        context.state.currentConversationId,
        payload.message_id
      );
      promise.then(({ conversation_id, message_id }) => {
        context.commit("removeConversationMessages", { conversation_id, message_id })
      });
    }
  }
});
