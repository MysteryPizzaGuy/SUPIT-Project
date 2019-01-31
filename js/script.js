

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

window.addEventListener('load', function () {
    var showcaseimgs = [];
    for(i = 1; i<9; i++){
        showcaseimgs.push(("./res/food-showcase/"+i+".jpg"));
        
    }
    for(img in showcaseimgs){
        this.console.log(showcaseimgs[img]);
    }

    new Vue({
        
        el: '#app',
        // define data - initial display text
        data() {
            return{
            m1: "You got to let me know",
            showcaseimgs,
        }
        },
       
        components:{
            showcasecomponent: showcasecomponent,
        }
      })
    


    
})