$("document").ready(function()
{
    var $Children = $(".maincontainer").children(".dockcontainer");
    
    $(".maincontainer").maincontainer();
    $Children.dockcontainer({ dockstate: "top" });
    $(".dockcontainer").find(".dockcontainer").dockcontainer({ dockstate: "float" });
});
