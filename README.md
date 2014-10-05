jquery.vicowa.dockpanels
========================

Jquery plugin that implements a visual studio style movebale panel system where panels can be docked at the side or be combined into tabs.

This plugin depends on the following third party javascript libraries : 

<ul>
<li><a href="http://jquery.com">jQuery(duh)</a> : i have only tested with version 2.1.1</li>
<li><a href="http://jqueryui.com">jQuery UI</a> : i have only tested with 1.11.1</li>
<li><a href="https://github.com/jquery/jquery-ui/blob/9e8e339648901899827a58e5bf919f7dda03b88e/tests/jquery.simulate.js">jquery.simulate</a> : currently only tested with the github checked in version as of 2010-01-20</li>
</ul>

A copy of the above mentioned libraries is in the third_party sub directory of this github depot or you can try the latest versions by going to the appropriate web sites.

The examples directory contains a simple example of how to use this plugin.

Note that the code is still pre-alpha so bugs are to be expected.

When this plugin is used, a new command will be added to the jQuery user interface

<h2>vicowadockpanel</h2>

This command accepts the following properties

| Option | Possible values | Description |
| :----- | :-------------- | :---------- |
| main   | true, false     | Indicates if the panel being created is the main panel (true) or not (false). The main panel will hold all the other panels and at least one should exist |
| dockstate | top, left, right, bottom, float | Indicates the initial dock position for the given panel, where float means not docked and instead is "floating" over the other panels |

```javascript

Example of use:

$("document").ready(function()
{
    // get the children before excuting vicowadockpanel, because content will be reordered so children might not give the expected result
    var $Children = $(".maincontainer").children(".dockcontainer");

    // create the main pane from elements with the "maincontainer" class
    $(".maincontainer").vicowadockpanel({ main: true });
    // make the first layer of child panels with the "dockcontainer" class docked at the top
    // note that this function assumes the items that are made into panels are child items of the main panel
    $Children.vicowadockpanel({ dockstate: "top" });
    // float the remaining items
    $(".dockcontainer").find(".dockcontainer").vicowadockpanel({ dockstate: "float" });
});
```

If you think this useful you can donate bitcoins to the following address: 1CuGEkBCmykfA86ccgpERHCSmeptBz95P6
