// JQuery extension that creates a dockable panel system
// V1.0
// Copyright (C) 2014 www.ViCoWa.com
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
// and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


(function(factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery', 'jquery-ui'], factory);
    }
    else 
    {
        factory(jQuery);
    }
}(function($)
{
    var Classes = Object.freeze(
    {
        C_MAINCONTAINER:        "jq-vcw-dp-maincontainer",
        C_CONTAINER:            "jq-vcw-dp-container",
        C_CONTAINERCONTENT:     "jq-vcw-dp-container-content",
        C_CONTAINERHANDLER:     "jq-vcw-dp-container-handler",
        C_CONTAINERFLOAT:       "jq-vcw-dp-floatcontainer",
        C_DOCK:                 "jq-vcw-dp-dock",
        C_VERTICAL:             "jq-vcw-dp-vertical",
        C_HORIZONTAL:           "jq-vcw-dp-horizontal",
        C_DROPHIGHLIGHT:        "jq-vcw-dp-drop-highlight",
        C_LEFT:                 "jq-vcw-dp-left",
        C_RIGHT:                "jq-vcw-dp-right",
        C_TOP:                  "jq-vcw-dp-top",
        C_BOTTOM:               "jq-vcw-dp-bottom",
        C_CENTER:               "jq-vcw-dp-center",
        C_TAB:                  "jq-vcw-dp-tab",
        C_CONTAINERDROPOVERLAY: "jq-vcw-dp-containerdropoverlay",
        C_GLOBALDROPOVERLAY:    "jq-vcw-dp-globaldropoverlay",
        C_DROPHOVER:            "jq-vcw-dp-drop-hover",
        C_FLOAT:                "jq-vcw-dp-float",
        C_DRAGGING:             "jq-vcw-dp-dragging",
        C_SPLITTER:             "jq-vcw-dp-splitter",
        C_NOUSERSELECT:         "jq-vcw-dp-nouserselect",
        C_MOUSETRANSPARENT:     "jq-vcw-dp-mousetransparent"
    });
    
    var Selectors = Object.freeze(
    {
        S_MAINCONTAINER:        "." + Classes.C_MAINCONTAINER,
        S_CONTAINER:            "." + Classes.C_CONTAINER,
        S_CONTAINERCONTENT:     "." + Classes.C_CONTAINERCONTENT,
        S_CONTAINERHANDLER:     "." + Classes.C_CONTAINERHANDLER,
        S_CONTAINERFLOAT:       "." + Classes.C_CONTAINERFLOAT,
        S_CONTAINERDROPOVERLAY: "." + Classes.C_CONTAINERDROPOVERLAY,
        S_GLOBALDROPOVERLAY:    "." + Classes.C_GLOBALDROPOVERLAY,
        S_DRAGGING:             "." + Classes.C_DRAGGING,
        S_LEFT:                 "." + Classes.C_LEFT,
        S_RIGHT:                "." + Classes.C_RIGHT,
        S_TOP:                  "." + Classes.C_TOP,
        S_BOTTOM:               "." + Classes.C_BOTTOM,
        S_CENTER:               "." + Classes.C_CENTER,
        S_SPLITTER:             "." + Classes.C_SPLITTER,
        S_DROPTARGET:           ".jq-vcw-dp-droptarget",
    });
    
    var DockOptions = Object.freeze(
    {
        DO_FLOAT:           "float",
        DO_TOP:             "top",
        DO_RIGHT:           "right",
        DO_BOTTOM:          "bottom",
        DO_LEFT:            "left",
        DO_CENTER:          "center",
        DO_TARGET_TOP:      "targettop",
        DO_TARGET_RIGHT:    "targetright",
        DO_TARGET_BOTTOM:   "targetbottom",
        DO_TARGET_LEFT:     "targetleft",
        DO_TARGET_TAB:      "targettab",        
    });
    var Orientation = Object.freeze(
    {
        O_HORIZONTAL: "horizontal",
        O_VERTICAL: "vertical"
    });
    
    function Swap(p_FirstItem, p_SecondItem)
    {
        var Temp = p_FirstItem;
        p_FirstItem = p_SecondItem;
        p_SecondItem = Temp;
    }
    
    function cleanupDockingClasses($p_Container)
    {
        $p_Container.removeClass([Classes.C_DOCK, Classes.C_VERTICAL, Classes.C_HORIZONTAL, Classes.C_LEFT, Classes.C_RIGHT, Classes.C_TOP, Classes.C_BOTTOM, Classes.C_CENTER, Classes.C_TAB, Classes.C_FLOAT].join(" "));
    }
    
    function cleanupResizable()
    {
        $(Selectors.S_MAINCONTAINER).find(".ui-resizable-handle").removeClass("ui-icon").removeClass("ui-icon-gripsmall-diagonal-se").removeAttr("style");
    }

    function handleDrop($p_DropTarget, $p_DraggedItem)
    {
        if ($p_DraggedItem.length)
        {
            var Option = $p_DropTarget.data("dropside");

            switch(Option)
            {
            case DockOptions.DO_TARGET_TOP:     Option = DockOptions.DO_TOP;    break;
            case DockOptions.DO_TARGET_RIGHT:   Option = DockOptions.DO_RIGHT;  break;
            case DockOptions.DO_TARGET_BOTTOM:  Option = DockOptions.DO_BOTTOM; break;
            case DockOptions.DO_TARGET_LEFT:    Option = DockOptions.DO_LEFT ;  break;
            case DockOptions.DO_TARGET_TAB:     Option = DockOptions.DO_CENTER; break;
            }
            
            dockPanel($p_DropTarget.data("owner"), $p_DraggedItem, Option);
        }
    }
    
    function createNewContainer($p_Dom, p_DockOption, p_Size, p_Options)
    {
        cleanupDockingClasses($p_Dom);
        $p_Dom.addClass(Classes.C_CONTAINER).attr("dock", p_DockOption);
        if ($p_Dom.resizable("instance"))
        {
            $p_Dom.resizable("destroy");
        }

        function onTargetMouseEnter()
        {
            $(this).toggleClass(Classes.C_DROPHOVER, true);

            switch($(this).data("dropside"))
            {
                case DockOptions.DO_TOP:            $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_TOP).prependTo($(this).parents(Selectors.S_GLOBALDROPOVERLAY))); break;
                case DockOptions.DO_LEFT:           $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_LEFT).prependTo($(this).parents(Selectors.S_GLOBALDROPOVERLAY))); break;
                case DockOptions.DO_RIGHT:          $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_RIGHT).prependTo($(this).parents(Selectors.S_GLOBALDROPOVERLAY))); break;
                case DockOptions.DO_BOTTOM:         $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_BOTTOM).prependTo($(this).parents(Selectors.S_GLOBALDROPOVERLAY))); break;
                case DockOptions.DO_TARGET_TOP:     $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_TOP).prependTo($(this).parents(Selectors.S_CONTAINERDROPOVERLAY))); break;
                case DockOptions.DO_TARGET_LEFT:    $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_LEFT).prependTo($(this).parents(Selectors.S_CONTAINERDROPOVERLAY))); break;
                case DockOptions.DO_TARGET_RIGHT:   $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_RIGHT).prependTo($(this).parents(Selectors.S_CONTAINERDROPOVERLAY))); break;
                case DockOptions.DO_TARGET_BOTTOM:  $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_BOTTOM).prependTo($(this).parents(Selectors.S_CONTAINERDROPOVERLAY))); break;
                case DockOptions.DO_TARGET_TAB:     $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_TAB).prependTo($(this).parents(Selectors.S_CONTAINERDROPOVERLAY))); break;
            }
        }
        
        function onTargetMouseLeave()
        {
            $(this).toggleClass(Classes.C_DROPHOVER, false);
            $(this).data("drophighlight").remove();
        }

        if (p_DockOption === DockOptions.DO_CENTER)
        {
            var $Content = $p_Dom.children(Selectors.S_CONTAINERCONTENT);
            if ($Content.length === 0)
            {
                $p_Dom.children().appendTo($("<Div/>").addClass(Classes.C_CONTAINERCONTENT).appendTo($p_Dom));
            }
            $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_CENTER); 
        }
        else
        {
            var $Draghandler = null;
            p_Options = $.extend({ title: "unnamed", tabclass: null }, p_Options);
            $Draghandler = $p_Dom.children(Selectors.S_CONTAINERHANDLER);
    
            if ($Draghandler.length === 0)
            {
                // create the content container and add the child items to it
                $p_Dom.children().appendTo($("<Div/>").addClass(Classes.C_CONTAINERCONTENT).appendTo($p_Dom));
                // then prepend the drag handler
                $Draghandler = $("<div/>").prependTo($p_Dom).addClass(Classes.C_CONTAINERHANDLER).addClass(Classes.C_NOUSERSELECT).text(p_Options.title);
            }

            switch (p_DockOption)
            {
                case DockOptions.DO_TOP:      $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_TOP);    break;
                case DockOptions.DO_BOTTOM:   $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_BOTTOM); break;
                case DockOptions.DO_LEFT:     $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_LEFT);    break;
                case DockOptions.DO_RIGHT:    $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_RIGHT);   break;
                case DockOptions.DO_TARGET_TAB:   
                    $Draghandler.addClass(Classes.C_TAB);
                    if (p_Options.tabclass)
                    {
                        $Draghandler.addClass(p_Options.tabclass);
                    }
                    break;
                case DockOptions.DO_FLOAT:     
                    $p_Dom.addClass(Classes.C_FLOAT).css({ width: p_Size.x, height: p_Size.y }); 
                    break;
            }
            
            $p_Dom.draggable(
            {
                scroll: false,
                iframeFix: true,
                handle: Selectors.S_CONTAINERHANDLER,
                start: function(p_Event, p_UI)
                {
                    var $GlobalOverlayDiv = $("<div/>"),
                    $ContainerOverlayDiv = $("<div/>"),
                    $This = $(this),
                    $TopMostContainer = $p_Dom.parents(Selectors.S_MAINCONTAINER).filter(":first").children(Selectors.S_CONTAINER).filter(":first"),
                    $ParentContainerContent = $p_Dom.parent(Selectors.S_CONTAINERCONTENT),
                    $FirstContainer = $ParentContainerContent.parent(Selectors.S_CONTAINER);
    
                    if ($FirstContainer.length === 0)
                    {
                         if ($p_Dom.parent(Selectors.S_CONTAINERFLOAT))  // if there is no container check if this is a floating container                    
                        {
                            $FirstContainer = $TopMostContainer;
                        }
                        else
                        {
                            throw "The parent of a draggable container should be either " + Classes.C_CONTAINER + " or " + Classes.C_CONTAINERFLOAT;
                        }
                    }
    
                    $This.toggleClass(Classes.C_DRAGGING, true);
                    $This.toggleClass(Classes.C_MOUSETRANSPARENT, true);
                    
                    $GlobalOverlayDiv.load("../jquery.vicowa.dockpanels.droptargets.html " + Selectors.S_GLOBALDROPOVERLAY, function()
                    {
                        $(Selectors.S_CONTAINER).on("mouseenter", function()
                        {
                            $(Selectors.S_CONTAINERDROPOVERLAY).appendTo(this);
                            $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_DROPTARGET].join(" ")).data("owner", $(this));
                        });
                        
                        $GlobalOverlayDiv.find(Selectors.S_GLOBALDROPOVERLAY).appendTo($TopMostContainer).find(Selectors.S_DROPTARGET).on("mouseup", function()
                        {
                            handleDrop($(this), $(Selectors.S_DRAGGING));
                        });
    
                        $([Selectors.S_GLOBALDROPOVERLAY, Selectors.S_DROPTARGET].join(" ")).data("owner", $TopMostContainer).on("mouseenter", onTargetMouseEnter).on("mouseleave", onTargetMouseLeave);
                        $([Selectors.S_GLOBALDROPOVERLAY, Selectors.S_TOP, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_TOP);
                        $([Selectors.S_GLOBALDROPOVERLAY, Selectors.S_LEFT, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_LEFT);
                        $([Selectors.S_GLOBALDROPOVERLAY, Selectors.S_RIGHT, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_RIGHT);
                        $([Selectors.S_GLOBALDROPOVERLAY, Selectors.S_BOTTOM, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_BOTTOM);
                    });
                    $ContainerOverlayDiv.load("../jquery.vicowa.dockpanels.droptargets.html " + Selectors.S_CONTAINERDROPOVERLAY, function()
                    {
                        $ContainerOverlayDiv.find(Selectors.S_CONTAINERDROPOVERLAY).appendTo($FirstContainer).find(Selectors.S_DROPTARGET).on("mouseup", function()
                        {
                            handleDrop($(this), $(Selectors.S_DRAGGING));
                        });
                        $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_DROPTARGET].join(" ")).data("owner", $FirstContainer).on("mouseenter", onTargetMouseEnter).on("mouseleave", onTargetMouseLeave);
                        $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_TOP, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_TARGET_TOP);
                        $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_LEFT, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_TARGET_LEFT);
                        $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_RIGHT, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_TARGET_RIGHT);
                        $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_BOTTOM, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_TARGET_BOTTOM);
                        $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_CENTER, Selectors.S_DROPTARGET].join(" ")).data("dropside", DockOptions.DO_TARGET_TAB);
                    });
                    
                    var $OldParent = $This.parent();
                    floatPanel($This);
                    var $NewParent = $This.parent();
                    $This.data("parentChanged", { changed: $OldParent[0] != $NewParent[0], topOffset: $OldParent.offset().top - $NewParent.offset().top, leftOffset: $OldParent.offset().left - $NewParent.offset().left });
                },
                drag:  function(p_Event, p_UI)
                {
                    var $This = $(this),
                    ParentChanged = $This.data("parentChanged");
    
                    if (ParentChanged && ParentChanged.changed)
                    {
                        p_UI.position.top += ParentChanged.topOffset;
                        p_UI.position.left += ParentChanged.leftOffset;
                    }
                    
                    if (p_UI.position.top < 0)
                    {
                        p_UI.position.top = 0;
                    }
                },
                stop: function(p_Event, p_UI)
                {
                    var $This = $(this),
                    $Target = $(p_Event.target);
                    $This.removeData("parentChanged");
                    $(Selectors.S_CONTAINER).off("mouseenter");
                    $Target.toggleClass(Classes.C_DRAGGING, false);
                    $Target.toggleClass(Classes.C_MOUSETRANSPARENT, false);
                    $Target.css({ position: "absolute" });
                    $(Selectors.S_GLOBALDROPOVERLAY).remove();
                    $(Selectors.S_CONTAINERDROPOVERLAY).remove();
                    $(Selectors.S_DROPTARGET).off("mouseenter", onTargetMouseEnter);
                    $(Selectors.S_DROPTARGET).off("mouseleave", onTargetMouseLeave);
                }
            });
        }
        
        return $p_Dom;
    }
    
    function addAndSplitContainers($p_Parent, $p_Center, $p_DockedContainer)
    {
        var Or = null,
        $Splitter = null;

        switch ($p_DockedContainer.attr("dock"))
        {
        case DockOptions.DO_TOP:     Or = Orientation.O_HORIZONTAL;      break;
        case DockOptions.DO_RIGHT:   Or = Orientation.O_VERTICAL;        break;
        case DockOptions.DO_BOTTOM:  Or = Orientation.O_HORIZONTAL;      break;
        case DockOptions.DO_LEFT:    Or = Orientation.O_VERTICAL;        break;
        }

        // create the splitter and set its orientation                        
        $Splitter = $("<div/>").draggable
        (
            {
                iframeFix: true,
                axis: (Or === Orientation.O_VERTICAL) ? "x" : "y",
                drag: function(p_Event, p_UI)
                {
                    var $Siblings = $(this).siblings(),
                    $FirstItem = null,
                    $SecondItem = null,
                    $Temp = null;
                    
                    if ($Siblings.length !== 2)
                    {
                        throw "A splitter should have two siblings but this one has " + $Siblings.length;
                    }
                    
                    $FirstItem = $Siblings.filter(":first");
                    $SecondItem = $Siblings.filter(":last");
                    
                    if (Or === Orientation.O_VERTICAL)
                    {
                        if ($FirstItem.attr("dock") === "right" || $SecondItem.attr("dock") === "left")
                        {
                            Swap($FirstItem, $SecondItem);
                        }
                        
                        p_UI.position.left = Math.max(10, Math.min($Splitter.parent().innerWidth() - $Splitter.outerWidth() - 10, p_UI.position.left));
                        $FirstItem.css({ width: p_UI.position.left });
                        $SecondItem.css({ left: p_UI.position.left + $Splitter.outerWidth() });
                    }
                    else
                    {
                        if ($FirstItem.attr("dock") === "bottom" || $SecondItem.attr("dock") === "top")
                        {
                            Swap($FirstItem, $SecondItem);
                        }

                        p_UI.position.top = Math.max(10, Math.min($Splitter.parent().innerHeight() - $Splitter.outerHeight() - 10, p_UI.position.top));
                        $FirstItem.css({ height: p_UI.position.top });
                        $SecondItem.css({ top: p_UI.position.top + $Splitter.outerHeight() });
                    }
                }
            }
        ).addClass(Classes.C_SPLITTER).addClass(Or);

        // reorganize so left and top items are before center and right and bottom items are after center        
        switch ($p_DockedContainer.attr("dock"))
        {
        case DockOptions.DO_TOP:  
            $p_DockedContainer.appendTo($p_Parent);
            $Splitter.appendTo($p_Parent).addClass(Classes.C_HORIZONTAL);
            $p_Center.appendTo($p_Parent);

            // set the splitter location            
            $Splitter.css({ position : "absolute", top: Math.min($p_DockedContainer.position().top + $p_DockedContainer.outerHeight(), $p_Parent.innerHeight()*3/4) });

            $p_DockedContainer.removeAttr("style"); // clear all styles
            $p_DockedContainer.css({ bottom: $p_Parent.outerHeight() - $Splitter.position().top }); // set the top style
            $p_Center.removeAttr("style"); // clear all styles
            $p_Center.css({ top: $Splitter.position().top + $Splitter.outerHeight() });
            break;
        case DockOptions.DO_BOTTOM: 
            $p_Center.appendTo($p_Parent);
            $Splitter.appendTo($p_Parent).addClass(Classes.C_HORIZONTAL);
            $p_DockedContainer.appendTo($p_Parent);

            $Splitter.css({ position : "absolute", top: $p_DockedContainer.position().top + $Splitter.outerHeight() });
            
            $p_Center.removeAttr("style"); // clear all styles
            $p_Center.css({ bottom: $p_Parent.outerHeight() - $Splitter.position().top });
            $p_DockedContainer.removeAttr("style"); // clear all styles
            $p_DockedContainer.css({ top: $Splitter.position().top + $Splitter.outerHeight() });
            break;
        case DockOptions.DO_LEFT:   
            $p_DockedContainer.appendTo($p_Parent);
            $Splitter.appendTo($p_Parent).addClass(Classes.C_VERTICAL);
            $p_Center.appendTo($p_Parent);

            $Splitter.css({ position : "absolute", left: $p_DockedContainer.position().left + $p_DockedContainer.outerWidth() });

            $p_DockedContainer.removeAttr("style"); // clear all styles
            $p_DockedContainer.css({ right: $p_Parent.outerWidth() - $Splitter.position().left }); // set the top style
            $p_Center.removeAttr("style"); // clear all styles
            $p_Center.css({ left: $Splitter.position().left + $Splitter.outerWidth() });
            break;
        case DockOptions.DO_RIGHT:  
            $p_Center.appendTo($p_Parent);
            $Splitter.appendTo($p_Parent).addClass(Classes.C_VERTICAL);
            $p_DockedContainer.appendTo($p_Parent);

            $Splitter.css({ position : "absolute", left: $p_DockedContainer.position().left - $Splitter.outerWidth() });      

            $p_Center.removeAttr("style"); // clear all styles
            $p_Center.css({ right: $p_Parent.outerWidth() - $Splitter.position().left });
            $p_DockedContainer.removeAttr("style"); // clear all styles
            $p_DockedContainer.css({ left: $Splitter.position().left + $Splitter.outerWidth() });
            break;
        }
    }
    
    function floatPanel($p_Container)
    {
        if ($p_Container.hasClass(Classes.C_CONTAINER))
        {
            var $FloatParent = $p_Container.parents(Selectors.S_MAINCONTAINER).children(Selectors.S_CONTAINERFLOAT).first();

            // have to remove the old properties and add the new ones
            if ($p_Container.attr("dock") !== DockOptions.DO_FLOAT)
            {
                // get the height width etc
                // the parent is about to change so we have to get the screen x and y and 
                // calculate them back to x and y relative to the new container
                var NewStyle = 
                {
                    top: $p_Container.offset().top - $FloatParent.offset().top,
                    left: $p_Container.offset().left - $FloatParent.offset().left,
                    position: "absolute",
                    width: $p_Container.width(),
                    height: $p_Container.height()
                };
                
                $p_Container.removeAttr("style")
                $p_Container.css(NewStyle);
                cleanupDockingClasses($p_Container);
                $p_Container.attr("dock", DockOptions.DO_FLOAT).addClass(Classes.C_FLOAT);
                $p_Container.resizable({ handles: "all", minWidth: 90, minHeight: 60 });
                cleanupResizable();
            }
            
            // we have to cleanup the current container, for instance remove the splitter and move the remaining content into the content
            var $Siblings = $p_Container.siblings();
            
            if ($Siblings.length === 2)
            {
                $Siblings.find(Selectors.S_SPLITTER).remove();
                $Siblings = $p_Container.siblings();
                
                if ($p_Container.parent(Selectors.S_CONTAINERCONTENT).length)
                {
                    $Siblings.find(Selectors.S_CONTAINERCONTENT).children().appendTo($p_Container.parent(Selectors.S_CONTAINERCONTENT));
                    $Siblings.remove();
                }
            }
        
            
            // always append to the end, so it is now on top
            $p_Container.appendTo($FloatParent);
        }
        else
        {
            createNewContainer($p_Container || $("<div/>"), DockOptions.DO_FLOAT, { x: $p_Container.outerWidth(), y: $p_Container.outerHeight() }).appendTo($p_Container.parents(Selectors.S_MAINCONTAINER).children(Selectors.S_CONTAINERFLOAT).first()).resizable({ handles: "all", minWidth: 90, minHeight: 60 });
            cleanupResizable();
        }
    }
    
    function dockPanel($p_TargetContainer, $p_Container, p_DockOption, p_Options)
    {
        var Orientations = {};
        Orientations[DockOptions.DO_TOP]            = Orientation.O_HORIZONTAL;
        Orientations[DockOptions.DO_RIGHT]          = Orientation.O_VERTICAL;
        Orientations[DockOptions.DO_BOTTOM]         = Orientation.O_HORIZONTAL;
        Orientations[DockOptions.DO_LEFT]           = Orientation.O_VERTICAL;
        Orientations[DockOptions.DO_TARGET_TOP]     = Orientation.O_HORIZONTAL;
        Orientations[DockOptions.DO_TARGET_RIGHT]   = Orientation.O_VERTICAL;
        Orientations[DockOptions.DO_TARGET_BOTTOM]  = Orientation.O_HORIZONTAL;
        Orientations[DockOptions.DO_TARGET_LEFT]    = Orientation.O_VERTICAL;

        if (Orientations[p_DockOption])
        {
            var $TargetContainerContent = $p_TargetContainer.children(Selectors.S_CONTAINERCONTENT).filter(":first"),
            $Children = $TargetContainerContent.children(),
            $newContainer = createNewContainer($p_Container || $("<div/>"), p_DockOption, p_Options),
            $newCenter = null;
    
            if ($Children.length !== 0)        
            {
                $newContainer.css((Orientations[p_DockOption] == Orientation.O_HORIZONTAL) ? { height: "25%" } : { width: "25%" });

                // also add a center one and move the exiting content of the target container into it
                $newCenter = createNewContainer($("<div/>").append($Children), DockOptions.DO_CENTER, { x: "75%", y: "75%" });
                addAndSplitContainers($TargetContainerContent, $newCenter, $newContainer);
            }
            else
            {
                $TargetContainerContent.append($newContainer);
            }
        }
        else
        {
            throw "Invalid dock option for dockPanel " + p_DockOption;
        }
    }

    $.fn.maincontainer = function(p_Options)
    {
        this.addClass(Classes.C_MAINCONTAINER);
        this.children().appendTo($("<div/>").addClass(Classes.C_CONTAINERCONTENT).appendTo($("<div/>").appendTo(this).addClass(Classes.C_CONTAINER).addClass(Classes.C_DOCK).addClass(Classes.C_CENTER).attr("dock", DockOptions.DO_CENTER)));
        $("<div/>").appendTo(this).addClass(Classes.C_CONTAINERFLOAT);
    }

    $.fn.dockcontainer = function(p_Options)
    {
        p_Options = $.extend(
        {
            dockstate: DockOptions.DO_FLOAT,
            initialsize: { x: "10em", y: "10em" },
        }, p_Options);
        
        this.each(function()
        {
            var $This = $(this);
            
            switch (p_Options.dockstate)
            {
                case DockOptions.DO_TOP:       $This.css({ height: p_Options.initialsize.y });   break;
                case DockOptions.DO_BOTTOM:    $This.css({ height: p_Options.initialsize.y });break;
                case DockOptions.DO_LEFT:      $This.css({ width: p_Options.initialsize.x });  break;
                case DockOptions.DO_RIGHT:     $This.css({ width: p_Options.initialsize.x }); break;
            }
    
            if (p_Options.dockstate != DockOptions.DO_FLOAT)
            {
                dockPanel($This.parents(Selectors.S_CONTAINER).first(), $This, p_Options.dockstate);
            }
            else
            {
                $This.css({ width: p_Options.initialsize.x, height: p_Options.initialsize.y });
                floatPanel($This);
            }
        });
    };
}));

