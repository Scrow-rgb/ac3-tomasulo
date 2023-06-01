class Architecture {
    constructor() {
      // Functional Units
      this.fus = {
        "Add": 2,
        "Mult": 2,
        "Div": 2,
        "Store": 2,
        "Load": 2
      };

      // Cycles per instruction
      this.add_time = 3;
      this.md_time = 3; 
      this.ls_time = 2;
    }

    get_fus(){
      return this.fus;
    }
}
  