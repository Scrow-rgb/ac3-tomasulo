class Tomasulo {
    constructor(instructions) {
      this.state = 0; // Ciclo inicial, começar zerado
      this.instructions = instructions;
      this.instructions_state = Array(instructions.length).fill("issue");
    }

    next(){
        // Verificar se há dependencia de dados

        // Se não, passar próxima instrução para execute
    }
}