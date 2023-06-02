class Tomasulo {
    constructor(instructions, fus) {
      this.state = 0; // Ciclo inicial, começar zerado
      this.instructions = instructions;
      this.instructions_state = Array(instructions.length).fill("issue");
      this.instr_ammount = instructions.length;
      this.fus = fus;

      this.ammount_fu = 0;
      for(var key in this.fus){
        this.ammount_fu += this.fus[key];
      }
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

    next(){
        this.state += 1; // Próximo estado (ciclo)

        for (i=0; i<this.instr_ammount; i++){ // Loop que percorre todas as intstruções
            var dependencia = false; // Para identificar se há dependencia de dados
            if(this.instructions_state[i] == "issue"){ // Se ainda não foi executada

                if(i!=0){ // Na primeira instrução não há necescidade de verificar dependência
                    // Verificar se há dependencia de dados (RAW, WAW, WAR)
                    console.log(this.instructions[i][1])
                    dependencia = false;
                }

                if(dependencia){ // Se há dependência, a instrução deverá aguardar
                    this.instructions_state[i] = "awaiting"
                    break;
                }else{ // Se não
                    var instruction = this.instructions[i][0];
                    var fu_name = this.getFu(instruction); // Obter unidade funcional da instrução
                    for (var key in this.fus) {
                        if (key.includes(fu_name) && this.fus[key] == "Free") {
                          this.instructions_state[i] = "execute"; // passar instrução para execute
                          this.fus[key] = "busy";
                          //$("#fu_state_"+(i+1)).text("Busy");
                          break;
                        }
                      }
                    /*
                    for(i=0; i<this.ammount_fu; i++){ // Percorrer unidades funcionais
                        var table_instr_name = $("#fu_name_"+(i+1)).text();
                        table_instr_name = table_instr_name.split('').slice(0, 3).join('');
                        var state = $("#fu_state_"+(i+1)).text();
                        if(fu == table_instr_name && state == "Free"){
                            // passar instrução para execute
                            this.instructions_state[i] = "execute"
                            $("#fu_state_"+(i+1)).text("Busy");
                            break;
                        }
                    }
                    */
                    break;
                }

            }
        }
        update_tables(this.state, this.instructions_state, this.instr_ammount, this.fus);
    }
}