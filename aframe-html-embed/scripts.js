AFRAME.registerComponent('showbutton', {
    schema: {
      'target': {type: 'selector'},
    },
    init: function () {
      var show=false;    
      this.el.addEventListener("click",()=>{
        if(show){
          this.data.target.setAttribute("visible","false");
          this.el.querySelector("a").innerHTML="Show Box";
        }else{
          this.data.target.setAttribute("visible","true");
          this.el.querySelector("a").innerHTML="Hide Box";
        }
        show=!show;
      });
    }
  });