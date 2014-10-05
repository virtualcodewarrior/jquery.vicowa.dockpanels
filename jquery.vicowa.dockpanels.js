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
/*jslint browser: true, white: true */
/*global define, jQuery*/

(function(factory)
{
    'use strict';
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery', 'jquery-ui', 'jquery.simulate'], factory);
    }
    else 
    {
        factory(jQuery);
    }
}(function($)
{
    'use strict';
    
    var LastID = 0;
    var Constants = Object.freeze({ Prefix: "jq-vcw-dp-" });
    
    var Classes = Object.freeze(
    {
        C_MAINCONTAINER:        Constants.Prefix + "maincontainer",
        C_CONTAINER:            Constants.Prefix + "container",
        C_CONTAINERCONTENT:     Constants.Prefix + "container-content",
        C_CONTAINERHANDLER:     Constants.Prefix + "container-handler",
        C_CONTAINERFLOAT:       Constants.Prefix + "floatcontainer",
        C_DOCK:                 Constants.Prefix + "dock",
        C_VERTICAL:             Constants.Prefix + "vertical",
        C_HORIZONTAL:           Constants.Prefix + "horizontal",
        C_DROPHIGHLIGHT:        Constants.Prefix + "drop-highlight",
        C_LEFT:                 Constants.Prefix + "left",
        C_RIGHT:                Constants.Prefix + "right",
        C_TOP:                  Constants.Prefix + "top",
        C_BOTTOM:               Constants.Prefix + "bottom",
        C_CENTER:               Constants.Prefix + "center",
        C_TAB:                  Constants.Prefix + "tab",
        C_TABHIGHLIGHT:         Constants.Prefix + "tabhighlight",
        C_CONTAINERDROPOVERLAY: Constants.Prefix + "containerdropoverlay",
        C_GLOBALDROPOVERLAY:    Constants.Prefix + "globaldropoverlay",
        C_DROPHOVER:            Constants.Prefix + "drop-hover",
        C_FLOAT:                Constants.Prefix + "float",
        C_DRAGGING:             Constants.Prefix + "dragging",
        C_SPLITTER:             Constants.Prefix + "splitter",
        C_NOUSERSELECT:         Constants.Prefix + "nouserselect",
        C_MOUSETRANSPARENT:     Constants.Prefix + "mousetransparent",
        C_CONTENTISCONTAINERS:  Constants.Prefix + "contentiscontainers",
        C_TOPCONTAINER:         Constants.Prefix + "topcontainer",
        C_TABCONTAINER:         Constants.Prefix + "tabcontainer",
        C_TABLISTSCROLLBEGIN:   Constants.Prefix + "tab-scroll-begin",
        C_TABLISTSCROLLEND:     Constants.Prefix + "tab-scroll-end",
        C_TABLIST:              Constants.Prefix + "tablist",
        C_TABLEFT:              Constants.Prefix + "tabsleft",
        C_TABRIGHT:             Constants.Prefix + "tabsright",
        C_TABTOP:               Constants.Prefix + "tabstop",
        C_TABBOTTOM:            Constants.Prefix + "tabsbottom",
        C_TABLISTCONTAINER:     Constants.Prefix + "tablistcontainer",
        C_TABCONTENT:           Constants.Prefix + "tabcontent",
        C_ACTIVE:               Constants.Prefix + "active",
        C_TABTEXT:              Constants.Prefix + "tabtext",
        C_TABSCROLLCONTAINER:   Constants.Prefix + "tabscrollcontainer",
        C_USEDINTAB:            Constants.Prefix + "usedintab"
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
        S_TOPCONTAINER:         "." + Classes.C_TOPCONTAINER,
        S_FLOAT:                "." + Classes.C_FLOAT,
        S_TABCONTAINER:         "." + Classes.C_TABCONTAINER,
        S_TABLISTSCROLLBEGIN:   "." + Classes.C_TABLISTSCROLLBEGIN,
        S_TABLISTSCROLLEND:     "." + Classes.C_TABLISTSCROLLEND,
        S_TABLIST:              "." + Classes.C_TABLIST,
        S_TABLISTCONTAINER:     "." + Classes.C_TABLISTCONTAINER,
        S_TABCONTENT:           "." + Classes.C_TABCONTENT,
        S_ACTIVE:               "." + Classes.C_ACTIVE,
        S_TAB:                  "." + Classes.C_TAB,
        S_TABTEXT:              "." + Classes.C_TABTEXT,
        S_USEDINTAB:            "." + Classes.C_USEDINTAB,
        S_TABSCROLLCONTAINER:   "." + Classes.C_TABSCROLLCONTAINER,
        S_DROPTARGET:           "." + Constants.Prefix + "droptarget"
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
        DO_TARGET_TAB:      "targettab"       
    });
    var TabOptions = Object.freeze(
    {
        TO_TOP:     "top",    
        TO_LEFT:    "left",     
        TO_BOTTOM:  "bottom",
        TO_RIGHT:   "right"
    });
    var Orientation = Object.freeze(
    {
        O_HORIZONTAL: "horizontal",
        O_VERTICAL: "vertical"
    });
    
    function swap(p_FirstItem, p_SecondItem)
    {
        var Temp = p_FirstItem;
        p_FirstItem = p_SecondItem;
        p_SecondItem = Temp;
    }
    
    function cleanupDockingClasses($p_Container)
    {
        $p_Container.removeClass([Classes.C_DOCK, Classes.C_VERTICAL, Classes.C_HORIZONTAL, Classes.C_LEFT, Classes.C_RIGHT, Classes.C_TOP, Classes.C_BOTTOM, Classes.C_CENTER, Classes.C_TAB, Classes.C_FLOAT, Classes.C_USEDINTAB].join(" "));
    }
    
    function makeResizable($p_Dom)
    {
        $p_Dom.resizable({ handles: "all", minWidth: 90, minHeight: 60 });
        $p_Dom.find(".ui-resizable-handle").removeClass("ui-icon").removeClass("ui-icon-gripsmall-diagonal-se").removeAttr("style");
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
            }
            
            dockPanel($($p_DropTarget.data("owner")), $p_DraggedItem, Option);
        }
    }
    
    function createContainer($p_Dom, p_Options)
    {
        // skip the ones that are already a container
        if (!$p_Dom.hasClass(Classes.C_CONTAINER))
        {
            $p_Dom.addClass(Classes.C_CONTAINER);
            p_Options = $.extend({ title: "unnamed", tabclass: null }, p_Options);

            // move the current content into the content container            
            $p_Dom.children().appendTo($("<div/>").appendTo($p_Dom).addClass(Classes.C_CONTAINERCONTENT));
            // then add a drag handler
            $("<div/>").prependTo($p_Dom).addClass(Classes.C_CONTAINERHANDLER).addClass(Classes.C_NOUSERSELECT).text(p_Options.title);

            attachDraggableToContainer($p_Dom);
        }
        
        return $p_Dom;
    }
    
    function resetDocking($p_Dom)
    {
        cleanupDockingClasses($p_Dom);
        $p_Dom.removeAttr("style");
        $p_Dom.removeAttr("dock");
        if ($p_Dom.resizable("instance"))
        {
            $p_Dom.resizable("destroy");
        }
    }
    
    function dockContainer($p_Dom, p_DockOption, p_Size, p_Options)
    {
        var WasContainer = $p_Dom.hasClass(Classes.C_CONTAINER);
        if (!WasContainer || $p_Dom.attr("dock") !== p_DockOption)
        {
            $p_Dom = createContainer($p_Dom, p_Options);
            resetDocking($p_Dom);
            
            $p_Dom.attr("dock", p_DockOption);

            switch (p_DockOption)
            {
                case DockOptions.DO_TOP:      $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_TOP);      break;
                case DockOptions.DO_BOTTOM:   $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_BOTTOM);   break;
                case DockOptions.DO_LEFT:     $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_LEFT);     break;
                case DockOptions.DO_RIGHT:    $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_RIGHT);    break;
                case DockOptions.DO_CENTER:   $p_Dom.addClass(Classes.C_DOCK).addClass(Classes.C_CENTER);   break;
                case DockOptions.DO_TARGET_TAB:   
                    $p_Dom.addClass(Classes.C_TAB);
                    if (p_Options.tabclass)
                    {
                        $p_Dom.find(Selectors.S_CONTAINERHANDLER).addClass(p_Options.tabclass);
                    }
                    break;
                case DockOptions.DO_FLOAT:     
                    $p_Dom.addClass(Classes.C_FLOAT).css({ width: p_Size.x, height: p_Size.y }); 
                    break;
            }
        }
        
        return $p_Dom;
    }
    
    function doDragSplitter($p_Splitter, p_Position, p_UserTriggered, p_Margins)
    {
        var $Siblings = $p_Splitter.siblings(),
        $FirstItem = null,
        $SecondItem = null,
        Or = $p_Splitter.hasClass(Orientation.O_VERTICAL) ? Orientation.O_VERTICAL : Orientation.O_HORIZONTAL;

        if ($Siblings.length !== 2)
        {
            throw "A splitter should have two siblings but this one has " + $Siblings.length;
        }
        
        $FirstItem = $Siblings.filter(":first");
        $SecondItem = $Siblings.filter(":last");
        
        if (Or === Orientation.O_VERTICAL)
        {
            // make sure the first item is on the left
            if ($FirstItem.attr("dock") === DockOptions.DO_RIGHT || $SecondItem.attr("dock") === DockOptions.DO_LEFT)
            {
                swap($FirstItem, $SecondItem);
            }

            if (p_UserTriggered || $FirstItem.attr("dock") === DockOptions.DO_LEFT || $SecondItem.attr("dock") !== DockOptions.DO_RIGHT)
            {
                p_Position.left = Math.max(p_Margins.left, Math.min($p_Splitter.parent().innerWidth() - $p_Splitter.outerWidth() - p_Margins.right, p_Position.left));
            }
            else
            {
                // if we have a right docked item we want the right distance to stay the same
                p_Position.left = Math.max(p_Margins.left, Math.min($p_Splitter.parent().innerWidth() - $p_Splitter.outerWidth() - p_Margins.right, $p_Splitter.parent().innerWidth() - ((($SecondItem.data("width")) ? $SecondItem.data("width") : $SecondItem.outerWidth()) + $p_Splitter.outerWidth())));
            }

            $FirstItem.css({ width: p_Position.left });
            $SecondItem.css({ left: p_Position.left + $p_Splitter.outerWidth() });
            
            if (p_UserTriggered)
            {
                if ($FirstItem.attr("dock") !== DockOptions.DO_CENTER)
                {
                    $FirstItem.data("width", p_Position.left);
                }
                else
                {
                    $FirstItem.removeData("width");
                }
                if ($SecondItem.attr("dock") !== DockOptions.DO_CENTER)
                {
                    $SecondItem.data("width", $p_Splitter.parent().innerWidth() - (p_Position.left + $p_Splitter.outerWidth()));
                }
                else
                {
                    $SecondItem.removeData("width");
                }
            }
        }
        else
        {
            // make sure the first item is on the top
            if ($FirstItem.attr("dock") === DockOptions.DO_BOTTOM || $SecondItem.attr("dock") === DockOptions.DO_TOP)
            {
                swap($FirstItem, $SecondItem);
            }

            if (p_UserTriggered || $FirstItem.attr("dock") === DockOptions.DO_TOP || $SecondItem.attr("dock") !== DockOptions.DO_BOTTOM)
            {
                p_Position.top = Math.max(p_Margins.top, Math.min($p_Splitter.parent().innerHeight() - $p_Splitter.outerHeight() - p_Margins.bottom, p_Position.top));
            }
            else
            {
                // if we have a bottom docked item we want the bottom distance to stay the same
                p_Position.top = Math.max(p_Margins.top, Math.min($p_Splitter.parent().innerHeight() - $p_Splitter.outerHeight() - p_Margins.bottom, $p_Splitter.parent().innerHeight() - ((($SecondItem.data("height")) ? $SecondItem.data("height") : $SecondItem.outerHeight()) + $p_Splitter.outerHeight())));
            }
            $FirstItem.css({ height: p_Position.top });
            $SecondItem.css({ top: p_Position.top + $p_Splitter.outerHeight() });

            if (p_UserTriggered)
            {
                if ($FirstItem.attr("dock") !== DockOptions.DO_CENTER)
                {
                    $FirstItem.data("height", p_Position.top);
                }
                else
                {
                    $FirstItem.removeData("height");
                }
                if ($SecondItem.attr("dock") !== DockOptions.DO_CENTER)
                {
                    $SecondItem.data("height", $p_Splitter.parent().innerHeight() - (p_Position.top + $p_Splitter.outerHeight()));
                }
                else
                {
                    $SecondItem.removeData("height");
                }
            }
        }

        $Siblings.find(Selectors.S_SPLITTER).each(function()
        {
            var $This = $(this),
            Position = $This.position();
            
            doDragSplitter($This, Position, false, { top: 10, left: 10, right: 10, bottom: 10 });
            $This.css(Position);
        });
    }

    function triggerSplitters($p_ParentDom)
    {
        //handle sibling splitters
        $p_ParentDom.find(Selectors.S_SPLITTER).each(function()
        {
            var $This =$(this),
            Position = $This.position();
            
            doDragSplitter($This, Position, false, { top: 10, left: 10, right: 10, bottom: 10 });
            $This.css(Position);
        });
    }
    
    function attachDraggableToSplitter($p_Splitter)
    {
        if (!$p_Splitter.draggable("instance"))
        {
            var Or = ($p_Splitter.hasClass(Orientation.O_VERTICAL)) ? Orientation.O_VERTICAL : Orientation.O_HORIZONTAL;
        
            $p_Splitter.draggable
            (
                {
                    iframeFix: true,
                    axis: (Or === Orientation.O_VERTICAL) ? "x" : "y",
                    drag: function(p_Event, p_UI){ doDragSplitter($p_Splitter, p_UI.position, true, { top: 10, left: 10, right: 10, bottom: 10}); },
                }
            );
        }
    }
    
    function ensureSplittersDraggable()
    {
        $(Selectors.S_SPLITTER).each(function()
        {
            attachDraggableToSplitter($(this));
        });
    }
    
    function attachDraggableToContainer($p_Container)
    {
        if (!$p_Container.draggable("instance"))
        {
            var onTargetMouseEnter = function()
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
                    case DockOptions.DO_TARGET_TAB:     $(this).data("drophighlight", $("<div/>").addClass(Classes.C_DROPHIGHLIGHT).addClass(Classes.C_TABHIGHLIGHT).prependTo($(this).parents(Selectors.S_CONTAINERDROPOVERLAY))); break;
                }
            },
            onTargetMouseLeave = function()
            {
                $(this).toggleClass(Classes.C_DROPHOVER, false);
                $(this).data("drophighlight").remove();
            };

            $p_Container.draggable(
            {
                scroll: false,
                iframeFix: true,
                handle: Selectors.S_CONTAINERHANDLER,
                start: function(p_Event, p_UI)
                {
                    var $GlobalOverlayDiv = $("<div/>"),
                    $ContainerOverlayDiv = $("<div/>"),
                    $This = $(this),
                    $TopMostContainer = $p_Container.parents(Selectors.S_MAINCONTAINER).filter(":first").children(Selectors.S_CONTAINER).filter(":first"),
                    $ParentContainerContent = $p_Container.parent(Selectors.S_CONTAINERCONTENT),
                    $FirstContainer = $ParentContainerContent.parent(Selectors.S_CONTAINER);
    
                    if ($FirstContainer.length === 0)
                    {
                         if ($p_Container.parent(Selectors.S_CONTAINERFLOAT))  // if there is no container check if this is a floating container                    
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
                        $(Selectors.S_CONTAINER).not(Selectors.S_USEDINTAB).on("mousemove", function(p_Event)
                        {
                            // find most desired target, which is the top most container with less then 2 child containers
                            var $TargetContainer = $(p_Event.target);
                            
                            if (!$TargetContainer.hasClass(Classes.C_CONTAINER) || $TargetContainer.hasClass(Classes.C_USEDINTAB))
                            {
                                $TargetContainer = $TargetContainer.parents(Selectors.S_CONTAINER).not(Selectors.S_USEDINTAB).filter(":first");
                            }

                            if ($TargetContainer.parent(Selectors.S_CONTAINERCONTENT).length && $TargetContainer.parent(Selectors.S_CONTAINERCONTENT).children(Selectors.S_CONTAINER).length < 2)
                            {
                                $TargetContainer = $TargetContainer.parent(Selectors.S_CONTAINERCONTENT).parent(Selectors.S_CONTAINER);
                            }

                            $(Selectors.S_CONTAINERDROPOVERLAY).appendTo($TargetContainer);
                            $([Selectors.S_CONTAINERDROPOVERLAY, Selectors.S_DROPTARGET].join(" ")).data("owner", $TargetContainer[0]);
                        });
                        
                        $GlobalOverlayDiv.find(Selectors.S_GLOBALDROPOVERLAY).appendTo($TopMostContainer).find(Selectors.S_DROPTARGET).on("mouseup", function()
                        {
                            handleDrop($(this), $(Selectors.S_DRAGGING));
                            event.stopPropagation();
                        });
    
                        $([Selectors.S_GLOBALDROPOVERLAY, Selectors.S_DROPTARGET].join(" ")).data("owner", $TopMostContainer[0]).on("mouseenter", onTargetMouseEnter).on("mouseleave", onTargetMouseLeave);
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
                    
                    var $OldParent = $This.parent(),
                    OldOffset = $OldParent.offset();
                    floatPanel($This);
                    var $NewParent = $This.parent();
                    $This.data("parentChanged", { changed: $OldParent[0] != $NewParent[0], topOffset: OldOffset.top - $NewParent.offset().top, leftOffset: OldOffset.left - $NewParent.offset().left + $This.outerWidth() * 0.05 });
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
                    $(Selectors.S_CONTAINER).off("mousemove");
                    $Target.toggleClass(Classes.C_DRAGGING, false);
                    $Target.toggleClass(Classes.C_MOUSETRANSPARENT, false);
                    $Target.css({ position: "absolute" });
                    $(Selectors.S_GLOBALDROPOVERLAY).remove();
                    $(Selectors.S_CONTAINERDROPOVERLAY).remove();
                    $(Selectors.S_DROPTARGET).off("mouseenter", onTargetMouseEnter);
                    $(Selectors.S_DROPTARGET).off("mouseleave", onTargetMouseLeave);
                    ensureFloatsResizable();
                }
            }).css({position : "absolute"});
        }
    }

    // ensure that the containers that are not used in a tab, are draggable    
    function ensureContainersDraggable()
    {
        $(Selectors.S_CONTAINER).not(Selectors.S_USEDINTAB).each(function()
        {
            attachDraggableToContainer($(this));
        });
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
        $Splitter = $("<div/>").addClass(Classes.C_SPLITTER).addClass(Or);

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
        attachDraggableToSplitter($Splitter);
    }
    
    function ensureFloatsResizable()
    {
        $(Selectors.S_FLOAT).each(function()
        {
            var $This = $(this);
            // first remove resizable if any
            if ($This.resizable("instance"))
            {
                $This.resizable("destroy");
            }
            
            // then reapply
            makeResizable($This);    
        });
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
                // shrink the new panel by 5 % in each direction to show it is no longer docked
                var NewStyle = 
                {
                    top: $p_Container.offset().top - $FloatParent.offset().top + $p_Container.height() * 0.05,
                    left: $p_Container.offset().left - $FloatParent.offset().left + $p_Container.width() * 0.05,
                    position: "absolute",
                    width: Math.max(10, $p_Container.width() - $p_Container.width() * 0.1),
                    height: Math.max(10, $p_Container.height() - $p_Container.height() * 0.1)
                };
                
                $p_Container.removeAttr("style");
                $p_Container.css(NewStyle);
                cleanupDockingClasses($p_Container);
                $p_Container.attr("dock", DockOptions.DO_FLOAT).addClass(Classes.C_FLOAT);
                makeResizable($p_Container);
            }
            
            // get the parents before moving the container into the float container
            var $Parents = $p_Container.parents(Selectors.S_CONTAINER);

            // append to the float container 
            // always append to the end, so it is now on top
            $p_Container.appendTo($FloatParent);
            
            // we have to cleanup the current container, for instance remove the splitter and move the remaining content into the parentcontainer content
            $Parents.each(function()
            {
                var $ContainerParent = $(this),
                $ContainerParentContent = $ContainerParent.children(Selectors.S_CONTAINERCONTENT).filter(":first");
                
                if ($ContainerParent.hasClass(Classes.C_CONTENTISCONTAINERS))
                {
                    if ($ContainerParentContent.children().length < 3)
                    {
                        // remove the splitter if there was one
                        $ContainerParentContent.children(Selectors.S_SPLITTER).remove();
                        
                        // if this was not the top container, we try to move up the content
                        if (!$ContainerParent.hasClass(Classes.C_TOPCONTAINER)) 
                        {
                            // the length should be either 1 or 0                    
                            if ($ContainerParentContent.children().length === 1)
                            {
                                // the remaining child should be a container
                                $ContainerParentContent.children().each(function()
                                {
                                    var $ChildContainer = $(this);
                                    
                                    if ($ChildContainer.hasClass(Classes.C_CONTAINER))
                                    {
                                        // if this is a tab container we have to move the class to the parent container
                                        if ($ChildContainer.hasClass(Classes.C_TABCONTAINER))
                                        {
                                            $ContainerParent.addClass(Classes.C_TABCONTAINER);
                                            $ChildContainer.removeClass(Classes.C_TABCONTAINER);
                                        }
                                        // since there is only a single container left, we can move this child's content and handler info into the parent
                                        var $ContainerContent = $ChildContainer.children();
                                        $ContainerParent.children().remove();
                                        $ContainerParent.append($ContainerContent);
                                        // and then we remove the container
                                        $ChildContainer.remove();
                                        
                                        // then we have to reattach the draggable handlers
                                        ensureContainersDraggable();
                                    }
                                    else
                                    {
                                        throw "Expected a container here";
                                    }
                                });
                                
                                // if after this there are no containers left then remove the Classes.C_CONTENTISCONTAINERS flag
                                if ($ContainerParent.children(Selectors.S_CONTAINERCONTENT).children(Selectors.S_CONTAINER).length === 0)
                                {
                                    $ContainerParent.removeClass(Classes.C_CONTENTISCONTAINERS);
                                }
                            }
                            else 
                            {
                                // the content was empty so this parent container can be removed
                                $ContainerParent.remove();
                            }
                        }
                        else
                        {
                            // if we have containers remaining we have to re-dock them
                            $ContainerParentContent.children(Selectors.S_CONTAINER).each(function()
                            {
                                dockPanel($ContainerParent, $(this), DockOptions.DO_TOP);
                            });
                        }
                    }
                }
                else if ($ContainerParent.hasClass(Classes.C_TABCONTAINER))
                {
                    
                }
                else
                {
                    throw "All parents should have the " + Classes.C_CONTENTISCONTAINERS + " class";
                }
            });
        }
        else
        {
            makeResizable(dockContainer($p_Container || $("<div/>"), DockOptions.DO_FLOAT, { x: $p_Container.outerWidth(), y: $p_Container.outerHeight() }).appendTo($p_Container.parents(Selectors.S_MAINCONTAINER).children(Selectors.S_CONTAINERFLOAT).first()));
        }
    }
    
    // remove a tab
    function removeTab($p_Tab)
    {
        var KeepTabs = false; // for now, will change this to an option later
        
        // use the active tab history to decide which tab to activate after removing the given tab
        var ActiveTabHistory = $p_Tab.parent().data("activetabhistory");
        
        if (ActiveTabHistory)
        {
            var ThisTabIndex = ActiveTabHistory.indexOf($p_Tab[0]);
        
            if (ThisTabIndex != -1)
            {
                ActiveTabHistory.splice(ThisTabIndex, 1);
            }
            
            if (ActiveTabHistory.length)
            {
                $(ActiveTabHistory[0]).trigger("click");
            }
            else
            {
                // if no active tab history is found just activate the first tab
                $p_Tab.siblings(Selectors.S_TAB).first().trigger("click");
            }
        }
        else
        {
            // if no active tab history is found just activate the first tab
            $p_Tab.siblings(Selectors.S_TAB).first().trigger("click");
        }
        
        var $SibLings = $p_Tab.siblings(Selectors.S_TAB);
        
        $p_Tab.remove();
        
        // depending on the settings of the container we might have to revert it back to a normal container when only one tab remains
        if (!KeepTabs && $SibLings.length === 1)
        {
            var $TabContainer = $SibLings.parents(Selectors.S_TABCONTAINER).first();
            // revert back to a normal container
            var $ContainerContent = $TabContainer.children(Selectors.S_CONTAINERCONTENT);
            
            // first remove the tab list
            $ContainerContent.children(Selectors.S_TABLISTCONTAINER).remove();
            // then move the content of the remaining tab into the container content
            $ContainerContent.find(Selectors.S_CONTAINERCONTENT).first().children().appendTo($ContainerContent);
            // then remove the tab content
            $ContainerContent.children(Selectors.S_TABCONTENT).remove();
            // then remove the tab container class from the parent
            $TabContainer.removeClass(Classes.C_TABCONTAINER);
        }
    }
    
    function addAsTab($p_TabContainer, $p_Container, $p_Tab)
    {
        resetDocking($p_Container);
        if ($p_Container.draggable("instance"))
        {
            // clear the draggable from tabbed containers, the tabs will be set draggable instead
            $p_Container.draggable("destroy");
        }
        var Options = { location: TabOptions.TO_TOP };
        $p_TabContainer.parents(Selectors.S_CONTAINER).filter(":first").addClass(Classes.C_TABCONTAINER);

        var $TabList = $p_TabContainer.children(Selectors.S_TABLISTCONTAINER).find(Selectors.S_TABLIST).filter(":first"),
        $TabContents = $p_TabContainer.children(Selectors.S_TABCONTENT).filter(":first");
        
        if ($TabList.length === 0)
        {
            $TabList = $("<ul/>").addClass(Classes.C_TABLIST);
            $("<div/>").addClass(Classes.C_TABLISTCONTAINER).appendTo($p_TabContainer).append($("<div/>").addClass(Classes.C_TABLISTSCROLLBEGIN)).append($("<div/>").append($TabList).addClass(Classes.C_TABSCROLLCONTAINER)).append($("<div/>").addClass(Classes.C_TABLISTSCROLLEND));
            $TabContents = $("<div/>").addClass(Classes.C_TABCONTENT).appendTo($p_TabContainer);

            $p_TabContainer.removeClass([Classes.C_TABSLEFT, Classes.C_TABSTOP, Classes.C_TABSBOTTOM, Classes.C_TABSRIGHT].join(" "));
            
            switch (Options.location)
            {
                case TabOptions.TO_TOP:     $p_TabContainer.addClass(Classes.C_TABTOP);    break;
                case TabOptions.TO_LEFT:    $p_TabContainer.addClass(Classes.C_TABLEFT);   break;
                case TabOptions.TO_RIGHT:   $p_TabContainer.addClass(Classes.C_TABRIGHT);  break;
                case TabOptions.TO_BOTTOM:  $p_TabContainer.addClass(Classes.C_TABBOTTOM); break;
            }
        }
        var HasContainer = false;
        $TabList.children(Selectors.S_TAB).each(function()
        {
            if ($(this).data("container") === $p_Container[0])
            {
                HasContainer = true;
            }
        });
        
        if (!HasContainer)
        {
            // load tab from our tab definition file, this will allow for customizing tabs later on
            $p_Tab.appendTo($TabList).data("container", $p_Container[0]).on("click", function()
            {
                $p_TabContainer.find(Selectors.S_ACTIVE).toggleClass(Classes.C_ACTIVE, false);

                $(this).toggleClass(Classes.C_ACTIVE, true);
                $($(this).data("container")).toggleClass(Classes.C_ACTIVE, true);
                var ActiveTabHistory = $p_Tab.parent().data("activetabhistory") || [],
                TabIndex = ActiveTabHistory.indexOf($p_Tab[0]);
                if (TabIndex >= 0)
                {
                    ActiveTabHistory.splice(TabIndex, 1);
                }
                
                ActiveTabHistory.splice(0, 0, $p_Tab[0]);
                
                $p_Tab.parent().data("activetabhistory", ActiveTabHistory);
            });
            $p_Tab.find(Selectors.S_TABTEXT).text("tab");
            (function()
            {
                var $Container = null,
                $HoveredTab = null,
                $TabSiblings = null;

                $p_Tab.draggable({
                    scroll: false,
                    iframeFix: true,
                    start: function(p_Event, p_UI)
                    {
                        // first force this tab active
                        $p_Tab.trigger("click");
                        
                        // make sure the tab stays initially within its container
                        switch (Options.location)
                        {
                            case TabOptions.TO_TOP:     p_UI.position.top = p_UI.originalPosition.top; break;
                            case TabOptions.TO_LEFT:    p_UI.position.left = p_UI.originalPosition.left; break;
                            case TabOptions.TO_RIGHT:   p_UI.position.left = p_UI.originalPosition.left; break;
                            case TabOptions.TO_BOTTOM:  p_UI.position.top = p_UI.originalPosition.top; break;
                        }
                        
                        $TabSiblings = $p_Tab.parent().children(Selectors.S_TAB).not($p_Tab);
                        $TabSiblings.on("mouseenter", function()
                        {
                            $HoveredTab = $(this); 
                        });
                        $p_Tab.addClass(Classes.C_MOUSETRANSPARENT);
                    },
                    drag: function(p_Event, p_UI)
                    {
                        var UndockDistance = 50,
                        OffsetDelta = 0;
                        
                        // do manual snap like behaviour
                        switch (Options.location)
                        {
                            case TabOptions.TO_LEFT:    
                            case TabOptions.TO_RIGHT:   OffsetDelta = p_UI.position.left - p_UI.originalPosition.left; if (OffsetDelta < UndockDistance){ p_UI.position.left = p_UI.originalPosition.left;} break;
                            case TabOptions.TO_TOP:     
                            case TabOptions.TO_BOTTOM:  OffsetDelta = p_UI.position.top - p_UI.originalPosition.top; if (OffsetDelta < UndockDistance){ p_UI.position.top = p_UI.originalPosition.top;} break;
                        }
                        
                        if (Math.abs(OffsetDelta) >= UndockDistance)
                        {
                            // undock tab here and make the container floating
                            // first find the container that belongs to the tab
                            $Container = $($p_Tab.data("container"));
                            
                            var $OldParent = $Container.parent(),
                            OldOffset = $OldParent.offset();
                            floatPanel($Container);
                            var $NewParent = $Container.parent();
                            $Container.data("parentChanged", { changed: $OldParent[0] != $NewParent[0], topOffset: OldOffset.top - $NewParent.offset().top, leftOffset: OldOffset.left - $NewParent.offset().left + $Container.outerWidth() * 0.05 });
                            
                            removeTab($p_Tab);
                            $p_Tab = null;

                            // use a timeout here to make sure the previous drag operation is totally finished
                            setTimeout(function()
                            {
                                // then continue dragging this new container
                                attachDraggableToContainer($Container);
                                $Container.children(Selectors.S_CONTAINERHANDLER).simulate("mousedown", { clientX : p_Event.clientX, clientY : p_Event.clientY });
                            }, 1);                            

                            return false;
                        }
                    },
                    stop: function(p_Event, p_UI)
                    {
                        if ($p_Tab)
                        {
                            // find the tab we are hovering and insert this tab before or after that tab
                            if (p_Event.pageX > $HoveredTab.offset().left + $HoveredTab.width()/2)
                            {
                                $p_Tab.insertAfter($HoveredTab);
                            }
                            else
                            {
                                $p_Tab.insertBefore($HoveredTab);
                            }
                            $p_Tab.removeAttr("style");
                            $p_Tab.removeClass(Classes.C_MOUSETRANSPARENT);
                        }   
                        
                        $TabSiblings.off("hover");
                    }
                });
            })();
            
            $TabContents.append($p_Container.addClass(Classes.C_USEDINTAB));
            $p_Tab.trigger("click");
        }
    }
    
    function dockAsTab($p_TargetContainer, $p_Container, p_Options)
    {
        if ($p_TargetContainer.parents(Selectors.S_TABCONTAINER).length !== 0)
        {
            $p_TargetContainer = $p_TargetContainer.parents(Selectors.S_TABCONTAINER).filter(":first");
        }
        var $TargetContainerContent = $p_TargetContainer.children(Selectors.S_CONTAINERCONTENT).filter(":first"),
        $Children = $TargetContainerContent.children().not($p_Container),
        Queue = [],
        Tab = $p_TargetContainer.data("tabtemplate");
        
        p_Options = $.extend({ tabtemplate: "../jquery.vicowa.dockpanels.tabs.html" }, p_Options);

        if ($Children.filter(Selectors.S_CONTAINER).length === 0 && $Children.filter(Selectors.S_TABCONTENT).length === 0)
        {
            dockContainer($("<div/>"), DockOptions.DO_CENTER, {}).appendTo($TargetContainerContent).children(Selectors.S_CONTAINERCONTENT).filter(":first").append($Children);
        }

        if (!$p_TargetContainer.hasClass(Classes.C_TABCONTAINER))
        {
            var $ContentChildren = $TargetContainerContent.children().not($p_Container);
            // only one child and the child is a tab container -> move all tabs up to this new container
            if ($ContentChildren.length === 1 && $ContentChildren.hasClass(Classes.C_TABCONTAINER))
            {
                $ContentChildren.children(Selectors.S_CONTAINERCONTENT).children(Selectors.S_TABCONTENT).children(Selectors.S_CONTAINER).each(function()
                {
                    Queue.push($(this)); 
                });
                $ContentChildren.remove();
            }
            else
            {
                // add the children as new tabs
                $ContentChildren.each(function()
                {
                    Queue.push($(this)); 
                });
            }
        }
        
        Queue.push($p_Container)

        if (!Tab)
        {
            var $LoadTarget = $("<div/>").load(p_Options.tabtemplate + " " + Selectors.S_TAB, function()
            {
                var $Tab = $LoadTarget.find(Selectors.S_TAB);
                if ($Tab.length)
                {
                    $Tab.addClass(Classes.C_NOUSERSELECT);
                    $p_TargetContainer.data("tabtemplate", $Tab[0]);
                    while (Queue.length)
                    {
                        addAsTab($TargetContainerContent, Queue[0], $Tab.clone());
                        Queue.splice(0, 1);
                    }
                }
            });
        }
        else
        {
            while (Queue.length)
            {
                addAsTab($TargetContainerContent, Queue[0], $(Tab).clone());
                Queue.splice(0, 1);
            }
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
            $newContainer = dockContainer($p_Container || $("<div/>"), p_DockOption, p_Options),
            $Children = $TargetContainerContent.children().not($p_Container),
            $newCenter = null;
    
            if ($Children.length !== 0)        
            {
                $newContainer.css((Orientations[p_DockOption] == Orientation.O_HORIZONTAL) ? { height: "25%" } : { width: "25%" });
                // first check if this is the right target for this panel

                // find most desired target, which is the top most container with less then 2 child containers
                var $TargetContainer = $p_TargetContainer;

                if ($TargetContainer.parent(Selectors.S_CONTAINERCONTENT).length && $TargetContainer.parent(Selectors.S_CONTAINERCONTENT).children(Selectors.S_CONTAINER).length < 2)
                {
                    // the parent of the target only contains one panel, so we can just dock this new one as a sibling of the target
                    $TargetContainer = $TargetContainer.parent(Selectors.S_CONTAINERCONTENT).parent(Selectors.S_CONTAINER);
                    // get the content of this new target
                    $TargetContainerContent = $TargetContainer.children(Selectors.S_CONTAINERCONTENT).filter(":first");
                    // and dock the new container next to the old target
                    addAndSplitContainers($TargetContainerContent, $p_TargetContainer, $newContainer);
                    $TargetContainer.addClass(Classes.C_CONTENTISCONTAINERS);
                }
                else
                {
                    // also add a center one and move the exiting content of the target container into it
                    $newCenter = dockContainer($("<div/>").append($Children), DockOptions.DO_CENTER, { x: "75%", y: "75%" }, { title : "" });
                    
                    // move the tab container class to the new center
                    if ($TargetContainer.hasClass(Classes.C_TABCONTAINER))
                    {
                        $newCenter.addClass(Classes.C_TABCONTAINER);
                        $TargetContainer.removeClass(Classes.C_TABCONTAINER);
                    }
                    else if ($newCenter.children(Selectors.S_CONTAINERCONTENT).children(Selectors.S_CONTAINER).length !== 0)
                    {
                        $newCenter.addClass(Classes.C_CONTENTISCONTAINERS);
                    }
                    addAndSplitContainers($TargetContainerContent, $newCenter, $newContainer);
                    $TargetContainer.addClass(Classes.C_CONTENTISCONTAINERS);
                }
            }
            else
            {
                // if the parent of the target only contains the target we can just put the content of our new container in there instead of creating a new container
                if ($p_TargetContainer.parents(Selectors.S_CONTAINER).filter(":first").hasClass(Classes.C_CONTENTISCONTAINERS) && $p_TargetContainer.parent(Selectors.S_CONTAINER).children(Selectors.S_CONTAINERCONTENT).filter(":first").children().not($p_TargetContainer).length === 0)
                {
                    $p_TargetContainer.children().remove();
                    $p_TargetContainer.append($newContainer.children());
                    cleanupDockingClasses($newContainer);
                    $p_TargetContainer.addClass($newContainer.attr("class")); 
                }
                else
                {
                    $newContainer = dockContainer($newContainer, DockOptions.DO_CENTER);
                    $p_TargetContainer.addClass(Classes.C_CONTENTISCONTAINERS);
                    $TargetContainerContent.append($newContainer);
                }
            }
        }
        else if (p_DockOption === DockOptions.DO_TARGET_TAB)
        {
            dockAsTab($p_TargetContainer, $p_Container);
        }
        else
        {
            throw "Invalid dock option for dockPanel " + p_DockOption;
        }
        
        ensureSplittersDraggable();
        triggerSplitters(($p_TargetContainer.hasClass(Classes.C_TOPCONTAINER)) ? $p_TargetContainer : $p_TargetContainer.parents(Selectors.C_TOPCONTAINER));
        ensureContainersDraggable();
    }

    function mainPanel($p_Panel, p_Options)
    {
        $p_Panel.addClass(Classes.C_MAINCONTAINER);
    
        // create a new container for the current content and dock it
        var $newContainer = dockContainer($("<div/>").append($p_Panel.children()), DockOptions.DO_CENTER);
        if ($newContainer.draggable("instance"))
        {
            // this first container cannot be draggable
            $newContainer.draggable("destroy");
        }
        // so it doesn't need a handler either
        $newContainer.children(Selectors.S_CONTAINERHANDLER).remove();
        $newContainer.addClass(Classes.C_TOPCONTAINER);
        $p_Panel.append($newContainer);
        
        // now add a draggable container for is original content
        dockPanel($newContainer, $("<div/>").append($newContainer.children(Selectors.S_CONTAINERCONTENT).children()), DockOptions.DO_TOP);

        // create a container for floating panels
        $("<div/>").appendTo($p_Panel).addClass(Classes.C_CONTAINERFLOAT);
    };

    $.fn.vicowadockpanel = function(p_Options)
    {
        p_Options = $.extend(
        {
            main: false,
            dockstate: DockOptions.DO_FLOAT,
            initialsize: { x: "10em", y: "10em" },
            id: null
        }, p_Options);
        
        if (p_Options.id === null)
        {
            p_Options.id = LastID + 1;
        }
        
        if (p_Options.main)
        {
            mainPanel(this, p_Options);
        }
        else
        {
            this.each(function()
            {
                var $This = $("<div/>").appendTo($(this).parent()).append(this);
                
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
        }
    };
    
    function backupBranch($p_DockPanel)
    {
        var Backup = 
        {
            dock: $p_DockPanel.attr("dock"),
            tabs: false,
            children: []
        },
        $Content = $p_DockPanel.children(Selectors.S_CONTAINERCONTENT);
        
        if ($Content.hasClass(Classes.C_TABCONTAINER))
        {
            Backup.tabs = true;

            $Content.children(Selectors.S_TABCONTENT).children(Selectors.S_CONTAINER).each(function()
            {
               Backup.children.push(backupBranch($(this))); 
            });
        }
        else if ($Content.hasClass(Classes.C_CONTENTISCONTAINERS))
        {
            $Content.children(Selectors.S_CONTAINER).each(function()
            {
               Backup.children.push(backupBranch($(this))); 
            });
        }

        return Backup;
    }
    
    // save the current state for all the dock panels and return the backup object
    $.fn.vicowadockpanelbackup = function()
    {
        var Backup = [];
        this.each(function()
        {
            var $This = $(this);
            if ($This.hasClass(Classes.C_MAINCONTAINER))
            {
                $This = $This.children(Selectors.S_CONTAINER).first();
            }

            if ($This.hasClass(Classes.C_CONTAINER))
            {
                Backup.push(backupBranch($This));
            }
            else
            {
                throw "vicowadockpanelbackup can only be called on the main container or a child container";
            }
        });
        
        return Backup;
    };
    
    // restore the dockpanels to the state given in the backup object
    $.fn.vicowadockpanelrestore = function(p_BackupData)
    {
        
    };
}));

