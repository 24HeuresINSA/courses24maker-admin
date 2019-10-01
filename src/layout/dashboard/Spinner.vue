<template>
  <div class="spinner-div">
    <div class="spinner-background"></div>
    <div class="spinner-border spinner-customized" style="width: 4rem; height: 4rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
    name: 'spinner-page',

};


</script>
<style>
  .spinner-customized{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    background-size: 100%;
  }
  .spinner-background{
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background-color: rgba(10,10,10,0.2);
  }
  .spinner-div{
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background-color: rgba(10,10,10,0.2);
  }
</style>
