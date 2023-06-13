
let ts;
let FUS_DICT_CFG = {
    "Add": 1,
    "Mult": 1,
    "Div": 1,
    "Store": 1,
    "Load": 1,
}

$(function(){
    $("#execucao").hide();
    add_row();
    $('#customFile').on('click', function() {
        this.value = null; // Reset the file input value
      }).on('change', importFile);
  });

function save_cfg(){
    FUS_DICT_CFG["Add"] = $('#add_fu_cfg').val();
    FUS_DICT_CFG["Mult"] = $('#mult_fu_cfg').val();
    FUS_DICT_CFG["Div"] = $('#div_fu_cfg').val();
    FUS_DICT_CFG["Store"] = $('#store_fu_cfg').val();
    FUS_DICT_CFG["Load"] = $('#load_fu_cfg').val();
}

function execute(){
    if(!validate())
        return
    $("#tela_inicial").hide();
    $("#execucao").show();
    arq = new Architecture(FUS_DICT_CFG);
    fus = arq.get_fus();
    load_registers();
    load_fu_table(arq);
    load_instructions_table();
    load_rob_table();
    load_rs_table();
    var instructions = get_instruction_array();
    ts = new Tomasulo(instructions, fus);
}

function load_rs_table(){
    const $table = $("#rs_table tbody");
    $table.empty(); // Remove all rows from the table body
    for(key in FUS_DICT_CFG){
        var newRow = $('<tr>'); // Create a new row with data
        var fu = $("<td>").text(key);
        var state = $(`<td id=${key}_state>`).text("Free");
        var instruction = $(`<td id=${key}_instr>`).text('');
        var d = $(`<td id=${key}_d>`).text('');
        var xi = $(`<td id=${key}_xi>`).text('');
        var xj = $(`<td id=${key}_xj>`).text('');
        newRow.append(fu, state, instruction, d, xi, xj);
        $table.append(newRow); // Append the new row to the table body
    }
}

function get_instruction_array(){
    var instruction_rows = document.querySelectorAll(".instruction_row");
    var length = instruction_rows.length-1;

    var instr_array = []
    for(i=1; i<length+1; i++){
        var words = []
        words.push($("#select_instruction_"+i+" option:selected").text())
        words.push($("#register_"+i+" option:selected").text())
        words.push($("#register_xi_"+i).val())
        words.push($("#register_xj_"+i).val())
        instr_array.push(words)
    }
    return instr_array
}


function next_cycle(){
    ts.next()
}

function update_tables(step, states, instructions_ammount, fus, emission_arr, completion_arr, reservation_station, regs_val){
    $("#step").text(step);
    for( i=0; i < instructions_ammount; i++ ){
        $("#rob_state_"+(i+1)).text(states[i]); 
        $("#rob_ec_"+(i+1)).text(emission_arr[i]);
        $("#rob_cc_"+(i+1)).text(completion_arr[i]);
    }
    var i = 1;
    for(var key in fus){
        $("#fu_state_"+i).text(fus[key]);
        i++;
    }
    for(key in reservation_station){
        if(reservation_station[key].length > 0){
            $(`#${key}_state`).text('Awaiting');
            $(`#${key}_instr`).text(reservation_station[key][0][0]);
            $(`#${key}_d`).text(reservation_station[key][0][1]);
            $(`#${key}_xi`).text(reservation_station[key][0][2]);
            $(`#${key}_xj`).text(reservation_station[key][0][3]);
        }else{
            $(`#${key}_state`).text('Free');
            $(`#${key}_instr`).text('');
            $(`#${key}_d`).text('');
            $(`#${key}_xi`).text('');
            $(`#${key}_xj`).text('');
        }
    }
    for(i=0;i<regs_val.length;i++){
        $(`#register_value_${i}`).text(regs_val[i]);
    }
}

function validate(){
    return true;
}

function load_rob_table(){
    var instruction_rows = document.querySelectorAll(".instruction_row");
    var length = instruction_rows.length-1;
    var tableBody = $("#rob_table tbody"); // Get the reference to the table body
    tableBody.empty(); // Remove all rows from the table body
    for(i=1;i<length+1;i++){
        var instruct_aux =  $("#select_instruction_"+i+" option:selected").text();
        instruct_aux += " " + $("#register_"+i+" option:selected").text();
        instruct_aux += ", " + $("#register_xi_"+i).val();
        instruct_aux += " " + $("#register_xj_"+i).val();

        var newRow = $(`<tr id="rob_row_${i}">`); // Create a new row with data
        var instruction = $(`<td> id="rob_instruction_${i}"`).text(instruct_aux);
        var state = $(`<td id="rob_state_${i}">`).text("issue");
        var emission_cycle = $(`<td id="rob_ec_${i}">`).text("-");

        var instruction_name = $("#select_instruction_"+i+" option:selected").text();
        var destination = ""
        debugger;
        if( instruction_name == "Store"){
            destination = $(`<td id="rob_d_${i}">`).text($("#register_xi_"+i).val() + "(" + $("#register_xj_"+i).val() + ")");
        }else{
            destination = $(`<td id="rob_d_${i}">`).text($("#register_"+i+" option:selected").text());
        }
        var completion_cycle = $(`<td id="rob_cc_${i}">`).text("-");
        newRow.append(instruction, state,emission_cycle,destination,completion_cycle);
        tableBody.append(newRow); // Append the new row to the table body
    }
}

function load_instructions_table(){
    var instruction_rows = document.querySelectorAll(".instruction_row");
    var length = instruction_rows.length-1;
    var tableBody = $("#instructions_table tbody"); // Get the reference to the table body
    tableBody.empty(); // Remove all rows from the table body
    for(i=1;i<length+1;i++){
        var newRow = $("<tr>"); // Create a new row with data
        var instr_name = $("<td>").text($("#select_instruction_"+i+" option:selected").text());
        var dest_reg = $("<td>").text($("#register_"+i+" option:selected").text());
        var xi = $("<td>").text($("#register_xi_"+i).val());
        var xj = $("<td>").text($("#register_xj_"+i).val());
        newRow.append(instr_name, dest_reg,xi,xj);
        tableBody.append(newRow); // Append the new row to the table body
    }
}

function load_registers(){
    $('#registers_table_body').children().not('#register_row').remove();
    for(i=0;i<16;i++){
        // Registers table (exec page)
        var new_line = $("#register_row").clone();
        new_line.find("#register_name").text("R"+i); // Atualiza index
        new_line.attr("id", `register_row_${i}`); // Atualiza index
        new_line.find("#register_name").attr("id", `register_name_${i}`); // Atualiza index
        new_line.find("#register_value").attr("id", `register_value_${i}`); // Atualiza index
        new_line.appendTo("#registers_table_body");
        new_line.removeAttr("hidden");
    }
}

function load_fu_table(arq){
    var fus = arq.fus;
    var tableBody = $("#fu_table tbody"); // Get the reference to the table body
    tableBody.empty(); // Remove all rows from the table body
    var i = 0;
    for (var key in fus) {
        var newRow = $("<tr>"); // Create a new row with data
        var nameCell = $(`<td id="fu_name_${i+1}">`).text(`${key}`);
        var stateCell = $(`<td id="fu_state_${i+1}">`).text(`${fus[key]}`);
        newRow.append(nameCell, stateCell);
        tableBody.append(newRow); // Append the new row to the table body
        i++;
    }
}

function home(){
    $("#step").text("0");
    $("#tela_inicial").show();
    $("#execucao").hide();
}

function importFile(){
  var instructions = []
  const fileInput = document.getElementById('customFile');
  const file = fileInput.files[0];
  
  if (!(file && file.name.endsWith('.txt'))) {
    // File is a .txt file, do something
    alert('Invalid format. Must be a .txt file.');
    return
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const fileContent = event.target.result;
    const lines = fileContent.split('\n');
    const lineCount = lines.length;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const words = line.split(' ');
        instructions.push(words);
    }

    // Add to our table
    clear_table();
    for(i=0;i<lines.length;i++){
        $("#select_instruction_" + (i+1) + " option").filter(function() {
            return $(this).text() === instructions[i][0];
          }).prop("selected", true);
        $("#register_" + (i+1) + " option").filter(function() {
            return $(this).text() === instructions[i][1];
          }).prop("selected", true);
        $("#register_xi_"+(i+1)).val(instructions[i][2]);
        $("#register_xj_"+(i+1)).val(instructions[i][3]);
        
        if (i < lines.length - 1) {
            add_row();
        } else {
            continue;
        }
    }
    };

  reader.readAsText(file);
}

function clear_table(){
    var rows = document.querySelectorAll(".instruction_row");
    var length = rows.length
    for(i = 2; i<length; i++){
        $("#table_body").find("#instruction_"+i).remove();
    }
    $("#row_count").val(1);
    $("#select_instruction_1").val("");
    $("#register_1").val("");
    $("#register_xi_1").val("");
    $("#register_xj_1").val("");
}

function onchange_instruction(elemento){
    var selectedValue =  $(elemento).val(); // Obtém o valor do elemento selecionado
    var id_elemento = $(elemento).attr("id");
    var id = id_elemento.replace(/\D/g, "");
    if(selectedValue == 6){
        $("#register_xj_"+id).prop("disabled", true);
        $("#register_xj_"+id).attr("placeholder", "");
        $("#register_xj_"+id).val("");
    }else{
        $("#register_xj_"+id).prop("disabled", false);
    }
}

function add_row(){
    var nova_lina = $("#instuction").clone();

    var index = parseInt($("#row_count").val()) + 1; // Pegar e incrementar index
    nova_lina.find("#index").text(index); // Atualiza index
    $("#row_count").val(index); // Atrualiza contador de linhas

    // Criar novos id's
    nova_lina.attr("id", "instruction_"+index);
    nova_lina.find("#select_instruction").attr("id", "select_instruction_"+index);
    nova_lina.find("#register").attr("id", "register_"+index);
    nova_lina.find("#register_xi").attr("id", "register_xi_"+index);
    nova_lina.find("#register_xj").attr("id", "register_xj_"+index);

    nova_lina.appendTo("#table_body");
    nova_lina.removeAttr("hidden");
}