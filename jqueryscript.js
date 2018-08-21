$(document).ready(function() {
    
    /*------------------------------------------buttons row1*/
    $(".button-position").click(function() {
        $(this).parent().parent().parent().hide("blind", "slow");
        $(this).parent().parent().parent().prev().show("blind", "slow")
        
    });
    
    $(".btn-hidden").click(function() {
        $(this).next().show("blind", "slow");
        $(this).hide("fast")
    });
    /*------------------------------------------buttons row1*/
    
    
    /*suburb help selector*/
    $(".help-icon").mouseenter(function() {
        $(this).children().addClass("description-container-show");
        $(this).children().removeClass("description-container-hidden");
        
    });
    
    $(".help-icon").mouseleave(function() {
        $(this).children().removeClass("description-container-show");
        $(this).children().addClass("description-container-hidden");
    });
    
    
    
    
})