<template>
  <!--TODO: переписать тексты-->
  <div class="inner">
    <div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Проект UnSleepingEye</h1>
        <p class="col-md-8 fs-4" style="width: 100%">
          Данные проект, в ходе своего развития претерпел множество изменений,
          среди них: 2 перехода на другой FrameWork, смена языка для написания
          серверного приложения, базы данных и перемещение на новый хостинг. Но
          всё же он до сих пор жив.
        </p>
        <button
          class="btn btn-primary btn-lg"
          type="button"
          onclick="alert('Спасибо!')"
        >
          Поддержать
        </button>
      </div>
    </div>
    <div class="row align-items-md-stretch">
      <div class="col-md-6">
        <div class="h-100 p-5 text-white bg-dark rounded-3">
          <h2>О том как всё происходило</h2>
          <p>
            В большенстве своём (а точнее все) коммиты не несут смысловой
            нагрузки. Но если вам так хочется посмотреть на это, то допбро
            пожаловать.
          </p>
          <button
            class="btn btn-outline-light"
            type="button"
            @click="openGit()"
          >
            Перейти на GitHub
          </button>
        </div>
      </div>
      <div class="col-md-6">
        <div class="h-100 p-5 bg-light border rounded-3">
          <h2>Предыдущая версия приложения</h2>
          <p>Не рекомендую её открывать, тк многие маршруты были изменены.</p>
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="openOld()"
          >
            Всё равно открыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home-page",
  methods: {
    openGit() {
      window.open("https://github.com/Jtomat/pritrt", "_blank");
    },
    openOld() {
      window.open("https://unsleepingeye.herokuapp.com/", "_blank");
    },
  },
};
</script>

<style scoped>
.inner {
  margin: 40px;
  text-align: center;
}
</style>
