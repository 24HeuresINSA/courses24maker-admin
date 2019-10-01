<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav class="d-none">
        <ul>
          <li>
            <router-link :to="{path:'/admin'}">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap">
        &copy; Interface developped by
        <a href="https://gitlab.com/johnratignier" target="_blank"> &nbsp;John Ratignier.</a>&nbsp;
        Designed by <a href="https://www.creative-tim.com/?ref=pdf-vuejs" target="_blank">&nbsp;Creative Tim.</a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style>
</style>
