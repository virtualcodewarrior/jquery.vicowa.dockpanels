$("document").ready(function()
{
    var $Children = $(".maincontainer").children(".dockcontainer");
    
    $(".maincontainer").vicowadockpanel({ main: true });
    $Children.vicowadockpanel({ dockstate: "top" });
    $(".dockcontainer").find(".dockcontainer").vicowadockpanel({ dockstate: "float" });
});
