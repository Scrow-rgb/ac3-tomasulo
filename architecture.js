class Architecture {
    constructor() {
      // Functional Units
      this.fus = {
        "Add": 3,
        "Mult": 3,
        "Store": 3,
        "Load": 3
      };

      // Cycles per instruction
      this.add_time = 3;
      this.md_time = 3; 
      this.ls_time = 2;
    }
}
  