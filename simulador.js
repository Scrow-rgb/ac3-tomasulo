function execute(){
    $("#tela_inicial").hide();
    $("#execucao").show();
}
function voltar(){
    $("#tela_inicial").show();
    $("#execucao").hide();
}
$(document).ready(function(){
    $("#execucao").hide();
});
function adicionar_linha(){
    var nova_lina = $("#instuction").clone();
    var index = $("#index").val();
    
    nova_lina.attr("index", index++);
    console.log(nova_lina)

    

    nova_lina.appendTo("#table_body");

}