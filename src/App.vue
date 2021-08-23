<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar color="light-blue darken-3" dark fixed elevation="0">
      <v-toolbar-title class="font-weight-black text-h4"
        >Takahashi Degital Labo Inc.</v-toolbar-title
      >
    </v-app-bar>
    <v-main class="d-flex flex-column mainContainer">
      <!-- メッセージエリア -->
      <v-sheet width="100vw" class="bg-image">
        <v-container
          class="messageContainer px-8 pt-16"
          :style="`height: calc(100vh - 120px);`"
        >
          <transition-group tag="div" name="slide" class="messageWrapper">
            <div v-for="item in dispMessages" :key="item.id">
              <!-- ユーザーの吹き出し -->
              <div class="d-flex justify-end">
                <v-card
                  v-if="item.userMessage"
                  class="mt-5 mb-5 rightBalloon"
                  max-width="500"
                  elevation="0"
                >
                  <v-card-text class="black--text">
                    {{ item.userMessage }}
                  </v-card-text>
                </v-card>
              </div>
              <!-- ボットの吹き出し -->
              <div class="d-flex justify-start">
                <v-avatar color="transparent" size="64" class="mt-5 mr-5">
                  <img
                    src="../public/img/dezigon-icon.png"
                    alt="アイコン"
                    width="50px"
                  />
                </v-avatar>
                <v-card
                  class="mt-5 mb-5 leftBalloon"
                  max-width="500"
                  color="light-blue darken-3"
                  elevation="0"
                  dark
                >
                  <v-card-text class="white--text">
                    {{ item.botMessage }}
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </transition-group>
        </v-container>
      </v-sheet>
      <!-- 質問入力エリア -->
      <v-sheet
        color="white"
        width="100vw"
        height="120px"
        class="inputContainer"
        elevation="10"
      >
        <v-container class="pt-6">
          <v-row no-gutters>
            <v-col cols="12" md="10">
              <!-- 入力フォームのテキストフィールド -->
              <v-text-field
                v-model="inputMessage"
                :label="isRecognizing ? '話しかけてください' : '質問をどうぞ'"
                :disabled="isRecognizing"
                outlined
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="2"
              :class="{
                alignRight: ['xs', 'sm'].includes($vuetify.breakpoint.name),
              }"
            >
              <!-- 「質問する」ボタン -->
              <v-btn
                class="ml-4 font-weight-black text-h5"
                color="light-blue darken-3"
                x-large
                depressed
                dark
                :disabled="isRecognizing"
                @click="sendMessage()"
                >質問する</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <!-- 左下のキャラクター画像 -->
      <img
        src="../public/img/dezigon.png"
        alt="dezigon"
        height="300px"
        class="charaImage"
        v-if="['md', 'lg', 'xl'].includes($vuetify.breakpoint.name)"
      />
      <!-- 音声認識開始ボタン -->
      <v-sheet color="white" width="280" height="60" class="recoBalloon">
        ボタンを押して話しかけてね
        <v-btn
          class="pa-0"
          depressed
          color="light-blue darken-3"
          :disabled="isRecognizing"
          @click="recognition()"
        >
          <v-icon color="white">
            mdi-microphone
          </v-icon>
        </v-btn>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
// 必要なパッケージのインポート
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default {
  name: "App",
  // 初期データ
  data: function() {
    return {
      talkId: 1, // カウント用の入力文字列と回答文字列セットのID
      inputMessage: "", // テキストフォームからの入力文章
      dispMessages: [
        {
          // 会話メッセージ表示用データ
          id: 0, // 入力文字列と回答文字列セットのID
          userMessage: "", // 表示用のユーザーの入力文字列
          botMessage: "こんにちは！何かお困りですか？？", // ボットからの回答文字列
        },
      ],
      sessionId: "", // Dialogflowの会話セッションを維持するID
      isRecognizing: false, // 音声認識中判別フラグ
    };
  },
  created() {
    this.sessionId = uuidv4();
  },
  watch: {
    dispMessages() {
      this.$nextTick(() => {
        this.scrollToEnd();
      });
    },
  },
  methods: {
    // 音声認識処理
    recognition() {
      this.isRecognizing = true;

      // SpeechRecognitionを利用
      const recognition = new window.webkitSpeechRecognition();
      // 言語を日本語に設定
      recognition.lang = "ja-JP";
      // 認識開始
      recognition.start();

      // 認識に成功した時
      recognition.onresult = function(event) {
        let speech = event.results[0][0].transcript;
        this.inputMessage = speech;
        this.sendMessage();
        this.isRecognizing = false;
      }.bind(this);

      // 発声が終了した時
      recognition.onspeechend = function() {
        recognition.stop();
        this.isRecognizing = false;
      }.bind(this);

      // 認識できず最終結果を返された時
      recognition.onnomatch = function() {
        this.isRecognizing = false;
      }.bind(this);

      // エラーが発生した時
      recognition.onerror = function() {
        this.isRecognizing = false;
      }.bind(this);
    },
    // 音声合成処理
    speech(text) {
      // speechSynthesisを利用
      const synth = window.speechSynthesis;
      // 読み上げるテキストや読み上げ方についての情報を設定
      const uttr = new SpeechSynthesisUtterance();
      uttr.text = text; // 読み上げるテキスト
      uttr.lang = "ja-JP"; // 言語を日本語に設定
      uttr.pitch = 1.3; // 音声の高さ
      uttr.rate = 1.2; // 音声の速さ
      // 音声読み上げ
      synth.speak(uttr);
    },
    sendMessage() {
      // APIを呼び出し、Dialogflowでの自然言語処理結果から返却メッセージを取得する
      axios
        .get("http://localhost:3000/detectIntent", {
          params: {
            sessionId: this.sessionId,
            inputMessage: this.inputMessage,
          },
        })
        .then((response) => {
          const responseData = response.data;
          if (responseData) {
            // 発話
            this.speech(responseData.fulfillmentText);
            // 画面上のメッセージ一覧に結果を表示する
            this.dispMessages.push({
              id: this.talkId,
              userMessage: this.inputMessage,
              botMessage: responseData.fulfillmentText,
            });
            this.inputMessage = "";
            this.talkId++;
          }
        });
    },
    scrollToEnd() {
      // チャットを常に最下部に移動する
      const messageWrapper = document.getElementsByClassName("messageWrapper");
      if (messageWrapper) {
        messageWrapper[0].scrollIntoView({
          block: "end",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style>
.mainContainer {
  width: 100vw;
  height: 100vh;
}
.messageContainer {
  max-width: 800px !important;
  overflow-y: scroll;
  /* scrollbar非表示 */
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.messageContainer::-webkit-scrollbar {
  /* scrollbar非表示 */
  display: none;
}
.bg-image {
  background-image: url("../public/img/office.png");
  background-size: cover;
}
.alignRight {
  text-align: right;
}
.recoBalloon {
  position: fixed;
  left: 50px;
  bottom: 370px;
  padding: 10px;
}
.recoBalloon::after {
  position: absolute;
  content: "";
  display: inline-block;
  bottom: -10px;
  right: 70px;
  width: 13px;
  height: 13px;
  background-size: contain;
  background-image: url("../public/img/right-balloon.svg");
  transform: rotate(90deg);
}
.recoBalloon .v-btn {
  width: 40px !important;
  height: 40px !important;
  min-width: 0px !important;
}
.charaImage {
  position: fixed;
  left: 10px;
  bottom: 120px;
}
/* 吹き出し部分 */
.leftBalloon,
.rightBalloon {
  position: relative;
}
.leftBalloon::before,
.rightBalloon::before {
  position: absolute;
  content: "";
  display: inline-block;
  top: 25px;
  width: 13px;
  height: 13px;
  background-size: contain;
}
.leftBalloon::before {
  background-image: url("../public/img/left-balloon.svg");
  left: -12px;
}
.rightBalloon::before {
  background-image: url("../public/img/right-balloon.svg");
  right: -12px;
}
.v-card__text {
  font-weight: 900 !important;
  font-size: 1.5rem !important;
  line-height: 2.5rem !important;
}
/* 入力フォーム */
.v-input input {
  font-size: 1.5rem !important;
}
.v-application--is-ltr .v-text-field .v-label {
  font-size: 1.5rem;
  line-height: 1.5rem;
  height: 1.5rem;
}
/* 吹き出しのアニメーション */
.slide-enter-active,
.slide-leave-active {
  transform: translate(0px, 0px);
  transition: transform 800ms cubic-bezier(0, 0, 0.2, 1) 0ms, opacity 800ms;
  opacity: 1;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
