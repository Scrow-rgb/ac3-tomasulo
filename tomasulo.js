class Tomasulo {
    constructor(instructions, fus) {
      this.cycle = 0; // Ciclo inicial, começar zerado
      this.instructions = instructions;
      this.instructions_state = Array(instructions.length).fill("issue");
      this.instr_ammount = instructions.length;
      this.steps_to_execute = Array(instructions.length).fill(1);
      this.steps= Array(instructions.length).fill(1);
      this.fus = fus;
      this.ammount_fu = fus.length;
      this.reservation_station = [];
      this.emission_arr = Array(instructions.length).fill(0);
      this.completion_arr = Array(instructions.length).fill(0);
    }

    getFu(instruction){
        var fu;
        switch(instruction){
            case "Add": 
                fu = "Add"
                break;
            case "Sub":
                fu = "Add"
                break;
            case "Mult":
                fu = "Mult"
                break;
            case "Div":
                fu = "Div"
                break;
            case "Load":
                fu = "Load"
                break;
            case "Store":
                fu = "Div"
                break;
            default:
                break;
        }
        return fu;
    }

    raw(instruction){
        return false
    }

    war (instruction){
        return false
    }

    waw (instruction){
        return false
    }

    hasDependency(inst){
        var dependency = this.raw(inst) || this.war(inst) || this.waw(inst) ? true : false;
        return dependency
    }

    next(){
        this.cycle += 1; // Próximo estado (ciclo)
        var i = 0;
        var flag = true;
        while (i < this.instr_ammount && flag){ // Loop que percorre todas as intstruções

            // Verificar se há dependencia de dados
            var dependency = i != 0 ? this.hasDependency(this.instructions[i]) : false; // Na primeira instrução não há necescidade de verificar dependência

            switch(this.instructions_state[i]){
                case "issue":
                    if(dependency){ // Se há dependência, a instrução deverá aguardar
                        this.instructions_state[i] = "awaiting"
                        flag = false;
                    }else{ // Se não
                        var instruction = this.instructions[i][0];
                        var fu_name = this.getFu(instruction); // Obter unidade funcional da instrução
                        var found_fu = false;
                        for (var key in this.fus) {
                            if (key.includes(fu_name) && this.fus[key] == "Free" && flag) {
                              this.instructions_state[i] = "execute"; // passar instrução para execute
                              this.emission_arr[i] = this.cycle;
                              this.fus[key] = "Busy"; // passar instrução para execute
                              flag = false;
                              found_fu = true;
                              break; // Encontrou uma FU livre, parar
                            }
                        }
                        if(!found_fu && flag){
                            console.log(this.instructions[i])
                            this.reservation_station.push(instruction[i])
                            this.instructions_state[i] = "awaiting";
                            flag = false;
                        }
                    }
                    break;
                case "execute":
                    this.steps[i] += 1;
                    if(this.steps[i] >= this.steps_to_execute[i]){
                        this.instructions_state[i] = "write back";
                    }
                    break;
                case "write back":
                    this.instructions_state[i] = "commit";
                    this.completion_arr[i] = this.cycle;
                    var instruction = this.instructions[i][0];
                    var fu_name = this.getFu(instruction); // Obter unidade funcional da instrução
                    for (var key in this.fus) {
                        if (key.includes(fu_name) && this.fus[key] == "Busy" && flag) {
                          this.fus[key] = "Free"; // passar instrução para execute
                          flag = false;
                          break; // Encontrou uma FU livre, parar
                        }
                    }
                    break;
            }
            i++;
        }
        update_tables(this.cycle, this.instructions_state, this.instr_ammount, this.fus, this.emission_arr, this.completion_arr);
    }
}