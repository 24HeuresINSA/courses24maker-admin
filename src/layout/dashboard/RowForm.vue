<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
       <b-form-group v-for="column in Object.keys(tableColumnData)" :key="column" id="input-group-2" :label="tableColumnData[column].label" label-for="input-2" v-if="tableColumnData[column].editable">
        <b-form-input id="input-2" v-model="form[column]" value=""></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
    export default {
        props: {
            tableColumnData: Object
        },
        data() {
            return {
                form: {},
                show: true
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                this.$emit('addNewRow', this.form);
            },
            onReset(evt) {
                evt.preventDefault();
                this.show = false;
                this.form = {}
                this.$nextTick(() => {
                    this.show = true
                })
            }
        }
    }
</script>
