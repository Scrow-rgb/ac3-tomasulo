class Architecture {
    constructor() {
      // Functional Units
      this.aFu_add = 3;
      this.aFu_mult = 3;
      this.aFu_store = 3;
      this.aFu_load = 3;

      // Cycles per add/sub 
      this.add_time = 3 

      // mult/div
      this.md_time = 3 

      //load/store
      this.ls_time = 2
    }

    initializeFu(){
      this.fu_add = []
      for (i=0; i<this.aFu_add;i++) {
        this.fu_add.append({ state: 'Free' });
      }
    }
}
  