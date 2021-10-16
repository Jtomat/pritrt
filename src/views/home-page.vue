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
        <button class="btn btn-primary btn-lg" type="button">Поддержать</button>
      </div>
    </div>
    <div class="row align-items-md-stretch">
      <div class="col-md-6">
        <div class="h-100 p-5 text-white bg-dark rounded-3">
          <h2>Change the background</h2>
          <p>
            Swap the background-color utility and add a `.text-*` color utility
            to mix up the jumbotron look. Then, mix and match with additional
            component themes and more.
          </p>
          <button class="btn btn-outline-light" type="button">
            Example button
          </button>
        </div>
      </div>
      <div class="col-md-6">
        <div class="h-100 p-5 bg-light border rounded-3">
          <h2>Add borders</h2>
          <p>
            Or, keep it light and add a border for some added definition to the
            boundaries of your content. Be sure to look under the hood at the
            source HTML here as we've adjusted the alignment and sizing of both
            column's content for equal-height.
          </p>
          <button class="btn btn-outline-secondary" type="button">
            Example button
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home-page",
};
</script>

<style scoped>
.inner {
  margin: 40px;
  text-align: center;
}
</style>
