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
      this.reservation_station = {
        "Add": [],
        "Mult": [],
        "Div": [],
        "Store": [],
        "Load": []
      };
      this.register_value = Array(16).fill(0);
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

    // Leitura após escrita
    raw(instruction, index){
        var dependency = false;
        for( i = 0; i < index; i++ ){
           console.log("Escrita em: ", this.instructions[i][1])
           var write_at = this.instructions[i][1];
           // Se há leitura pós escrita, e a instrução anterior ainda não foi finalizada
           if((instruction[2] == write_at || instruction[3] == write_at) && (this.instructions_state[i] != "commit")){
                dependency = true; // Há dependencia de dados
           }
        }
        return dependency
    }

    // Escrita após leitura
    war (instruction, index){
        var dependency = false;
        for( i = 0; i < index; i++ ){
           console.log("Leitura em: ", this.instructions[i][2])
           console.log("Leitura em: ", this.instructions[i][3])
           var read = this.instructions[i][2];
           var read_b = this.instructions[i][3];
           // Se há leitura pós escrita, e a instrução anterior ainda não foi finalizada
           if((instruction[1] == read || instruction[1] == read_b) && (this.instructions_state[i] != "commit")){
                dependency = true; // Há dependencia de dados
           }
        }
        return dependency
    }

    // Escrita após escrita
    waw (instruction, index){
        var dependency = false;
        for( i = 0; i < index; i++ ){
           console.log("Escrita em: ", this.instructions[i][1])
           var write_at = this.instructions[i][1];
           // Se há leitura pós escrita, e a instrução anterior ainda não foi finalizada
           if((instruction[1] == write_at) && (this.instructions_state[i] != "commit")){
                dependency = true; // Há dependencia de dados
           }
        }
        return dependency
    }

    hasDependency(inst, i){
        debugger;
        var dependency = this.raw(inst, i) || this.war(inst, i) || this.waw(inst, i) ? true : false;
        return dependency
    }

    next(){
        var finished_instr = 0; // Contador de instruções já finalizadas
        this.cycle += 1; // Próximo estado (ciclo)
        var i = 0;
        var flag = true; // Flag para parar de percorrer as instruções
        while (i < this.instr_ammount && flag){ // Loop que percorre todas as intstruções
            // Verificar se há dependencia de dados
            var dependency = i != 0 ? this.hasDependency(this.instructions[i], i) : false; // Na primeira instrução não há necescidade de verificar dependência
            var instruction = this.instructions[i][0]; // Obtém opcode de instrução atual
            var fu_name = this.getFu(instruction); // Obter unidade funcional da instrução atual

            switch(this.instructions_state[i]){
                case "awaiting": // Se a instrução estiver aguardando liberação de FU ou dependencia de dados
                    var found_fu = false;
                    for (var key in this.fus) {
                        if (key.includes(fu_name) && this.fus[key] == "Free"){
                            found_fu = true;
                            break;
                        }
                    }
                    if(!dependency && found_fu){ // Se não há dependencia de dados, e há FU livre
                        this.instructions_state[i] = "execute"; // passar instrução para execute
                        this.emission_arr[i] = this.cycle;
                        this.fus[key] = "Busy";
                        // Clear the values of the key
                        this.reservation_station["Add"] = [];
                        console.log(this.reservation_station)
                        //flag = false;
                    }
                    break;
                case "issue":
                    if(dependency){ // Se há dependência, a instrução deverá aguardar
                        this.instructions_state[i] = "awaiting"
                        flag = false;
                    }else{ // Se não
                        var found_fu = false;
                        for (var key in this.fus) {
                            if (key.includes(fu_name) && this.fus[key] == "Free" && flag) {
                              this.instructions_state[i] = "execute"; // passar instrução para execute
                              this.emission_arr[i] = this.cycle;
                              this.fus[key] = "Busy";
                              flag = false;
                              found_fu = true;
                              break; // Encontrou uma FU livre, parar
                            }
                        }
                        if(!found_fu && flag){
                            //var fu_name = this.getFu(this.instructions[i][0]); // Obter unidade funcional da instrução
                            if(this.reservation_station[fu_name].length == 0){
                                this.reservation_station[fu_name].push(this.instructions[i])
                            }
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
                    var destination_register = this.instructions[i][1];
                    var id = destination_register.replace(/\D/g, "");
                    this.register_value[id] = i+1;
                    this.instructions_state[i] = "commit";
                    this.completion_arr[i] = this.cycle;
                    for (var key in this.fus) {
                        if (key.includes(fu_name) && this.fus[key] == "Busy" && flag) {
                          this.fus[key] = "Free"; // passar instrução para execute
                          //flag = false;
                          break; // Encontrou uma FU livre, parar
                        }
                    }
                    break;
                case "commit":
                    finished_instr += 1;
                    break;
            }
            i++;
        }
        update_tables(
            this.cycle,
            this.instructions_state, 
            this.instr_ammount, 
            this.fus, 
            this.emission_arr, 
            this.completion_arr,
            this.reservation_station,
            this.register_value,
            this.instr_ammount == finished_instr ? 1 : 0
            );
    }
}