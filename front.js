
$(function(){
    $("#execucao").hide();
    adicionar_linha();
  });

function execute(){
    $("#tela_inicial").hide();
    $("#execucao").show();
}

function voltar(){
    $("#tela_inicial").show();
    $("#execucao").hide();
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
      console.log(line);
    }
  };

  reader.readAsText(file);
  
}

function limpar(){
    var rows = document.querySelectorAll(".intruction_row");
    var length = rows.length
    console.log(length)
    for(i = 2; i<length; i++){
        $("#table_body").find("#instruction_"+i).remove();
    }
    $("#row_count").val(1);
}

function onchange_instruction(elemento){
    var selectedValue =  $(elemento).val(); // Obtém o valor do elemento selecionado
    var id_elemento = $(elemento).attr("id");
    var id = id_elemento.replace(/\D/g, "");
    console.log(id)
    if(selectedValue == 6){
        $("#register3_"+id).prop("disabled", true);
    }else{
        $("#register3_"+id).prop("disabled", false);
    }
}

function adicionar_linha(){
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