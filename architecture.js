class Architecture {
    constructor(fus_cfg) {
      // Functional Units
      this.fus_cfg = fus_cfg;

      this.fus = [] // Create functional units array
      for(var key in this.fus_cfg){
        for(i=0; i<this.fus_cfg[key];i++){
          var new_key = key + i;
          var value = "Free";
          this.fus[new_key] = value;
        }
      }

      // Cycles per instruction
      //this.add_time = 3;
      //this.md_time = 3; 
      //this.ls_time = 2;
    }

    get_fus(){
      return this.fus;
    }
}
  