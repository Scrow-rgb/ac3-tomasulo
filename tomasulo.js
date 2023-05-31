class Tomasulo {
    constructor(instructions) {
        console.log("A")
        console.log(instructions)
      this.state = 0; // Ciclo inicial, começar zerado
      this.instructions = instructions;
      this.instructions_state = Array(instructions.length).fill("issue");
      this.instr_ammount = instructions.length;
    }

    next(){
        this.state += 1; // Próximo estado (ciclo)

        for (i=0; i<this.instr_ammount; i++){
            if(this.instructions_state[i] == "issue"){

                // Verificar se há dependencia de dados
                console.log("hi")

                // Se não, passar próxima instrução para execute
            }
        }
    }
}