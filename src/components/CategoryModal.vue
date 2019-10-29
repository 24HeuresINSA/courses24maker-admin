<template>
  <div>
    <b-modal id="modal-category-new" centered hide-footer hide-header style="padding: 0px;" @hidden="onReset">
      <div class="d-block text-center p-0">
        <h3>{{titleModal}}</h3>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group label="Label*" size="sm">
            <b-form-input v-model="form.category.category_label" type="text" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Description*" size="sm">
            <b-form-textarea v-model="form.category.category_description" type="text" value=""></b-form-textarea>
          </b-form-group>
          <b-form-group label="Type" size="sm">
            <b-form-radio-group v-model="form.category.category_type" :options="optionsModal.type" buttons :button-variant="type_button_color"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Capacity of a team*" size="sm">
            <b-form-input v-model="form.category.category_nb_max" type="number" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Full/closed*" size="sm">
            <b-form-radio-group v-model="form.category.category_full" :options="optionsModal.full" buttons :button-variant="full_button_color"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Price (regular)*" size="sm">
            <b-form-input v-model="form.category.category_price_regular" type="number"></b-form-input>
          </b-form-group>
          <b-form-group label="Price (student)*" size="sm">
            <b-form-input v-model="form.category.category_price_student" type="number"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="success" @click="">{{buttonAdd}}</b-button>&nbsp;
          <b-button type="reset" variant="secondary" @click="onReset" v-show="buttonResetDisplay">Reset</b-button>&nbsp;
          <b-button @click="onCancel">Cancel</b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
    export default {
        name: 'category-modal',
        props: {
          categoryIdToUpdate: String,
          addNewRowModal: Boolean,
          updateRowModal: Boolean,
          show: Boolean
        },
        data() {
            return {
                form: {category: {}},
                optionsModal: {
                    full: [{value: 0, text:'No'}, {value: 1, text:'Yes'}],
                    type: [{value:"CAP", text:'Course à pied'}, {value:"VEL", text:'Vélo'}, {value:"TRI", text:'Triathlon'}, {value:"FOL", text:'Folklo'}]
                },
                titleModal: "",
                buttonAdd: "",
                buttonResetDisplay: false,
                newRow: false
            }
        },
        created: function(){
        },
        computed: {
            full_button_color: function(){
                switch(this.form.category.category_full){
                    case 0:
                        return "outline-success";
                        break;
                    case 1:
                        return "outline-danger";
                        break;
                    default:
                        return "";
                        break;
                }
            },
            type_button_color: function(){
                switch(this.form.category.category_type){
                    case "CAP":
                        return "outline-primary";
                        break;
                    case "VEL":
                        return "outline-primary";
                        break;
                    case "FOL":
                        return "outline-primary";
                        break;
                    case "TRI":
                        return "outline-primary";
                        break;
                    default:
                        return "";
                        break;
                }
            },
        },
        watch: {
            addNewRowModal: function(n, o){
                this.titleModal = "New category";
                this.newRow = true;
                this.buttonResetDisplay = true;
                this.buttonAdd = "Add";
                this.$bvModal.show('modal-category-new');
            },
            updateRowModal: function(n, o){
                this.newRow = false;
                this.titleModal = "Update category";
                this.buttonResetDisplay = false;
                this.buttonAdd = "Update";
                var promiseCategory = this.axios.request({
                    url: "/categories/"+this.categoryIdToUpdate,
                    method: "get"
                });
                Promise.all([promiseCategory])
                    .then(results => {
                        this.form.category = results[0].data.category;
                        delete this.form.category.createdAt;
                        delete this.form.category.updatedAt;
                        Object.keys(this.form.category).filter(el => {
                            if(this.form.category[el] === null){
                                delete this.form.category[el];
                            }
                        });
                        this.$bvModal.show('modal-category-new');
                    })
                    .catch(errors => {
                        console.log(errors)
                    });
            },
            show: function(n, o){
                if (!n) {
                    this.$bvModal.hide('modal-category-new');
                } else {
                    this.$bvModal.show('modal-category-new');
                }
            },
            categoryIdToUpdate: function(n, o){
                this.categoryIdToUpdate = n;
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                delete this.form.category.createdAt;
                delete this.form.category.updatedAt;
                if (this.newRow == true) {
                    this.$parent.toggleSpinner();
                    this.$parent.newRow(this.form.category);
                } else {
                    this.$parent.toggleSpinner();
                    this.$parent.validChange(this.form.category, this.categoryIdToUpdate);
                }
            },
            onReset(evt) {
                evt.preventDefault();
                this.form = {category: {}}
            },
            onCancel(evt){
                this.$bvModal.hide('modal-category-new');
            }
        }
    }
</script>
