
$(function(){
    $("#execucao").hide();
    add_row();
    load_registers();
  });

function execute(){
    $("#tela_inicial").hide();
    $("#execucao").show();
    arq = new Architecture();
    load_fu_table(arq);
    console.log(arq.aFu_add)
}

function load_fu_table(arq){
    var fus = arq.fus;
    var tableBody = $("#fu_table tbody"); // Get the reference to the table body
    
    for (var key in fus) {
        console.log(key)
        console.log(fus[key])
        for(i=0;i<fus[key];i++){
            var newRow = $("<tr>"); // Create a new row with data
            var nameCell = $("<td>").text(`${key}${i}`);
            var stateCell = $("<td>").text("Free");
            newRow.append(nameCell, stateCell);
            tableBody.append(newRow); // Append the new row to the table body
        }
    }
}

function home(){
    $("#tela_inicial").show();
    $("#execucao").hide();
}

function next(){
    console.log("next step")
}

function importFile(){
  const fileInput = document.getElementById('customFile');
  const file = fileInput.files[0];
  
  if (!(file && file.name.endsWith('.txt'))) {
    // File is a .txt file, do something
    alert('Invalid format. Must be a .txt file.');
    return
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const contents = e.target.result;
    const lines = contents.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Do something with each line of the file
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
}

function onchange_instruction(elemento){
    var selectedValue =  $(elemento).val(); // Obtém o valor do elemento selecionado
    var id_elemento = $(elemento).attr("id");
    var id = id_elemento.replace(/\D/g, "");
    if(selectedValue == 6){
        $("#register3_"+id).prop("disabled", true);
        $("#register3_"+id).attr("placeholder", "");
    }else{
        $("#register3_"+id).prop("disabled", false);
    }
}

function load_registers(){
    
    for(i=0;i<15;i++){
        // Registers table (exec page)
        var new_line = $("#register_name").clone();
        new_line.find(".register_name").text("R"+i); // Atualiza index
        new_line.appendTo("#registers_table_body");
        new_line.removeAttr("hidden");
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
    nova_lina.find("#register2").attr("id", "register2_"+index);
    nova_lina.find("#register3").attr("id", "register3_"+index);

    nova_lina.appendTo("#table_body");
    nova_lina.removeAttr("hidden");
}