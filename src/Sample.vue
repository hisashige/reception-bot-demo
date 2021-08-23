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
            <div>
              <!-- ユーザーの吹き出し -->
              <div class="d-flex justify-end">
                <v-card
                  class="mt-5 mb-5 rightBalloon"
                  max-width="500"
                  elevation="0"
                >
                  <v-card-text class="black--text"></v-card-text>
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
                  <v-card-text class="white--text"> </v-card-text>
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
              <v-text-field label="質問をどうぞ" outlined></v-text-field>
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
        <v-btn class="pa-0" depressed color="light-blue darken-3">
          <v-icon color="white">
            mdi-microphone
          </v-icon>
        </v-btn>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
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
