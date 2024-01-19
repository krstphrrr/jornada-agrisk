var ContentController = function (
    menuSelector, menuLinkSelector, menuOptionSelector) {
    
    this.menu = menuSelector;
    this.menuLink = menuLinkSelector;
    this.menuOption = menuOptionSelector;
      
    $(this.menuLink).focus({obj: this}, function (event) { 
        var c = event.data.obj;            
        $(c.menu).addClass("active");
    });
            
    $(this.menuLink).blur({obj: this}, function (event) { 
        var c = event.data.obj;            
        $(c.menu).removeClass("active");
    });
             
    $(this.menuOption).focus({obj: this}, function (event) { 
        var c = event.data.obj;            
        $(c.menu).addClass("active");
    });
            
    $(this.menuOption).blur({obj: this}, function (event) { 
        var c = event.data.obj;            
        $(c.menu).removeClass("active");
    });
}


var controller = new ContentController (
    "#header-menu",
    "#header-links a",
    "#header-links span"
);