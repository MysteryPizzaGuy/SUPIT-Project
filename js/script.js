var pickedfoods = [];
var summedprice=0;
var isLoading=false;


var showcasecomponent=Vue.component('showcaseimg-component',{
    template: `
    <div class="column is-one-quarter">
        <figure @click="isImageModalActive = true" @mouseover="DeactivateOverlay" @mouseleave="ActivateOverlay" v-bind:class="[showcaseimgs_overlayed ? overlay: '']" class="showcase__images__image image">
                <img :src=imgpath>
        </figure>
        <b-modal :active.sync="isImageModalActive">
        <p class="image">
            <img :src=imgpath>
        </p>
        </b-modal>
    </div>
    `,
    props:[
        'imgpath'
    ],
    data: function(){
        return{
            showcaseimgs_overlayed:true,
            overlay: 'showcaseimgs-overlay',
            isImageModalActive:false,       


        }
    },
    methods: {
        ActivateOverlay(){
            this.showcaseimgs_overlayed = true;
        },
        DeactivateOverlay(){
            this.showcaseimgs_overlayed =false;
        }
    },
});

var contenteditablediv= Vue.component('contenteditable-div',{
    template:`
    <div class="orderdetails__left__textinput "@input="updateInput" contenteditable="true">
     {{ content }}
    </div>
    
    `,
    prop: ['value'],
      data () {
          return { content: '' }
      },
      methods: {
          updateInput () {
            this.$emit('input', this.$el.innerText)
        }
      }
})

var foodcomponent=Vue.component('food-component',{
    template:`
<div>
    <div class="level foodsans">
    <div class="FoodType__Food__Left level-left">
    <span class="FoodType__Food__Left__Title  level-item  title">{{foodname}}</span>
    <span class="FoodType__Food__Left__Subtitle level-item  subtitle">{{fooddescription}}</span>
    </div>
    <div class="FoodType__Food__Right level-right">
    <button v-on:click="ToggleOpen" slot="trigger" class="button is-rounded is-warning">{{foodprice}},00kn</button>
    
    </div>
    </div>
    <b-collapse class=" orderdetails " :open.sync="isopen">
        <div class="columns orderdetails__wrapper level">
            <div class="orderdetails__left level-left">
                <div class="orderdetails__left__above">
                    <span class="orderdetails__left__above__details">Details:</span>
                    <div>
                        <span class="orderdetails__left__above__howmany">#:</span>
                        <input type="number" class="orderdetails__howmany" v-model="numofitems" value="numberofitems" min="1" max="15"> 
                    </div>
                    <div>
                        <span class="totalcostlabel">TOTAL:</span>
                        <span class="totalcost">{{totalcost}}</span>
                    </div>
                </div>
                <contenteditablediv v-model="detailsmessage">{{cmsg}}</contenteditablediv>


        </div>
        
            <div class="orderdetails__right level-right">
                <button v-on:click="AddItem" class="finalbuy button is-rounded is-warning">Add</button>

            </div>
        </div>
    </b-collapse>
</div>
    `,
    data: function(){
        return{

        }
    },
    props:{
        id: Number,
        naziv: String,
        opis:String,
        cijena:Number,
    },
    data:function(){
        return{
            foodid:this.id,
            foodname:this.naziv,
            fooddescription:this.opis,
            foodprice:this.cijena,
            isopen: false,
            pickedfoods,
            numofitems: 1,
            detailsmessage:"",
            
        }
    },
    components:{
        contenteditablediv:contenteditablediv,
    },
    methods:{
        
        ToggleOpen(){
            this.isopen=!this.isopen
        },
        AddItem(){
            
            pickedfoods.push({
                id:this.foodid,
                name:this.foodname,
                description:this.fooddescription,
                price:this.foodprice,
                num:this.numofitems,
                details:this.detailsmessage,     
                fullprice: this.foodprice*this.numofitems,    
            })
        }
    
    },
    computed:{
        openthemenu: function(){
            this.isopen
        },
        numberofitems: function(){
            return this.numofitems;

        },
        totalcost: function(){
            return this.foodprice*this.numofitems;
        },
        cmsg: function(){
            return this.detailsmessage;
        }
    }


})

var foodpickeditems=Vue.component('foodpicked-items',{
    template:`
    <b-table
    :data="pickedfoods"
    :bordered="false"
    :striped="true"
    :narrowed="true"
    :hoverable="true"
    :loading="false"
    :focusable="false"
    :mobile-cards="true">

    <template slot-scope="props">
        <b-table-column field="name" label="Naziv"  >
            {{ props.row.name }}
            <b-tooltip  v-if="props.row.details!=''" :label="props.row.details"
            position="is-bottom">
            <b-icon class="foodtooltipicon"
                icon="help-circle-outline"
                size="is-small">
            </b-icon>
            </b-tooltip>
        </b-table-column>

        <b-table-column field="price" label="Cijena" >
            {{ props.row.price }}
        </b-table-column>

        <b-table-column field="num" label="Kolicina">
            {{ props.row.num }}
        </b-table-column>

        <b-table-column field="fullprice" label="Ukupno">
            {{ props.row.fullprice}}
        </b-table-column>
    </template>
    <template slot="footer" v-if="pickedfoods.length!=0">
        <div class="has-text-right">
        Total: {{summedprice}}
        </div>
    </template>

    
</b-table>
    `,
    data:function(){
        return{
            pickedfoods,
            summedprice,
        }

    },
   
    watch: {
        pickedfoods: function () {
            let t= 0;
            for(item in this.pickedfoods){
                t+=this.pickedfoods[item].fullprice;
            }
            summedprice=t;
            this.summedprice=t;
          }
        },
      




})


window.addEventListener('load', function () {
    var classesfornavbar=['navbar', 'banner__navbar', 'is-transparent','text-is-white']
    var showcaseimgs = [];
    var foodData =[];
    var foodDataJsonParsed = [];
    subsshown =false;
    
    for(i = 1; i<9; i++){
        showcaseimgs.push(("./res/food-showcase/"+i+".jpg"));
        
    }
    var headerHeight = $("#landing").height();
    var navbarelement= $("#mainnavigation");
    var bodyelement =$("body");
    var $window = $(window);
    var $elem;

    $(window).on('scroll', function(){
    var scrollPosition = $(window).scrollTop();

    if (scrollPosition > headerHeight) {
        bodyelement.addClass('has-navbar-fixed-top');
        classesfornavbar.splice(2,2);
        classesfornavbar.push('is-fixed-top');
        classesfornavbar.push('text-is-black');
    } else {
        bodyelement.removeClass('has-navbar-fixed-top');
        classesfornavbar.splice(2,2);
        classesfornavbar.push('is-transparent');
        classesfornavbar.push('text-is-white');
    }
    if(subsshown!=true){
    if(isScrolledIntoView($elem,$window)){
        subsshown =true;
        }
    }})



    function isScrolledIntoView($elem, $window) {
        let $elemt=$($elem);
        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();

        var elemTop = $elemt.offset().top;
        var elemBottom = elemTop + $elemt.height();


        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    new Vue({
        
        el: '#app',
        // define data - initial display text
        data() {
            return{
            m1: "You got to let me know",
            showcaseimgs,
            burgerisactive:false,
            isOrderActive:false,
            foodData,
            foodDataJsonParsed,
            pickedfoods,
            classesfornavbar,
            loadtracker: false,
            loadingComponent: null,

        }
        },
        mounted: function(){
           $elem=this.$refs["substrans"];
        },
       
        components:{
            showcasecomponent: showcasecomponent,
            foodcomponent:foodcomponent,
            foodpickeditems:foodpickeditems,

        },
        watch: {
            isLoading: function () {

                
              }
            },
        methods:{
            open() {
                this.loadingComponent = this.$loading.open({
                    container: null
                })

            },
            Isitshown(){
                return subsshown;
            },
            ToggleBurger(){
                this.burgerisactive= !this.burgerisactive;
            },
            GetArray(json){
                this.foodData=json;
            },
            GetJSONFile(){
                return $.ajax({
                  dataType: "json",
                  url: `http://www.fulek.com/VUA/SUPIT/GetCategoriesAndFoods`,
                  success: function(data) {
                       foodData = data;
                    }
                });

            },
            ActivateOrderWindow(){
                $('#orderscreenmodal').modal();
                this.isOrderActive=true;
                this.open();
                let vim=this;
                this.GetJSONFile().then(function(){
                    for(item in foodData){
                        foodDataJsonParsed.push(foodData[item]);
                    }
                    vim.loadingComponent.close()
                   
                })

               
            },
            getPosition( element ) {
                var rect = element.getBoundingClientRect();
                return {x:rect.left,y:rect.top};
            },
          
            

        },
        computed:{
            BurgerActivation: function(){
                return{
                    'is-active': this.burgerisactive,
                }
            },
            
            
        }
        
      })    

    
})