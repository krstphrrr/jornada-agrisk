var ContentController = function (
    contentSelector, menuSelector, menuLinkSelector, 
    menuOptionSelector, overlaySelector, loaderSelector, mapContainerSelector, 
    themeContainerSelector, themeHeaderSelector, themePageSelector, chartPageSelector, 
    themeButtonSelector, chartButtonSelector, themeOneFormSelector, 
    themeTwoFormSelector, themeOneChartsSelector, themeTwoChartsSelector) {
    
    this.content = contentSelector;
    this.menu = menuSelector;
    this.menuLink = menuLinkSelector;
    this.menuOption = menuOptionSelector;
    this.overlay = overlaySelector;
    this.loader = loaderSelector;
    this.mapContainer = mapContainerSelector;
    this.themeContainer = themeContainerSelector;
    this.themeHeader = themeHeaderSelector;
    this.themePage = themePageSelector;
    this.chartPage = chartPageSelector;
    this.themeButton = themeButtonSelector;
    this.chartButton = chartButtonSelector;
    this.themeOneForm = themeOneFormSelector;
    this.themeTwoForm = themeTwoFormSelector;
    this.themeOneCharts = themeOneChartsSelector;
    this.themeTwoCharts = themeTwoChartsSelector;
    this.themeManager = null;
    this.map = null;
    this.chartManager = null; 
    this.tour = null;  
    this.userSurvey = null;
    this.downloadManager = null;
    this.chartView = false;
          
    $("body").click({obj: this}, function (event) {        
        $(this).addClass("no-outline");
        
    });
            
    $("body").keydown({obj: this}, function (event) {        
        if (event.keyCode === 9) {
            $(this).removeClass("no-outline");
        }
    });
            
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
          
    $(this.themeHeader).click({obj: this}, function (event) {
        var c = event.data.obj;
        c.toggleThemePanel();
    });
        
    $(this.themeHeader).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) { 
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });
          
    $(this.themeButton).click({obj: this}, function (event) {
        var c = event.data.obj;
        c.chartView = false;
        $(c.chartPage).hide();
        $(c.themePage).show();
        $(c.chartButton).focus();
    });
              
    $(this.themeButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });
              
    $(this.chartButton).click({obj: this}, function (event) {
        var c = event.data.obj;
        c.chartView = true;
        $(c.themePage).hide();
        $(c.themeContainer).addClass("expanded");
        if (c.map) c.map.updateCharts();
    }); 
              
    $(this.chartButton).keydown({obj: this}, function (event) {  
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    }); 
}

ContentController.prototype.addThemeManager = function (manager) {  
    this.themeManager = manager;
    this.themeManager.controller = this;
}

ContentController.prototype.addMap = function (map) {  
    this.map = map;
    this.map.controller = this;
}

ContentController.prototype.addChartManager = function (manager) {  
    this.chartManager = manager;
    this.chartManager.controller = this;
}

ContentController.prototype.addTour = function (tour) {  
    this.tour = tour;
    this.tour.controller = this;
          
}

ContentController.prototype.addUserSurvey = function (userSurvey) {  
    this.userSurvey = userSurvey;
    this.userSurvey.controller = this;
          
}

ContentController.prototype.addDownloadManager = function (downloadManager) {  
    this.downloadManager = downloadManager;
    this.downloadManager.controller = this;
          
}

ContentController.prototype.loadContent = function () { 
    if (this.map) this.map.loadMap();
}

ContentController.prototype.startLoadAnimation = function () {
    $(this.overlay).removeClass("hidden");    
    $(this.loader).html("<div class='loader-container'><p>Loading...</p><div class='loader'></div></div>");
}

ContentController.prototype.stopLoadAnimation = function () {
    $(this.overlay).addClass("hidden");
    $(this.loader).empty();
}

ContentController.prototype.resizeMap = function (label) {   
    if ($(this.content).hasClass("more-map")) {
        $(this.content).removeClass("more-map");
        label.text("More Map");
    }
    else {
        $(this.content).addClass("more-map");
        label.text("Less Map");
    }
}

ContentController.prototype.toggleTheme = function (themeNumber) { 
    if (this.themeManager && (themeNumber == 1 || themeNumber == 2)) {
        if (themeNumber == 1) {
            $(this.themeTwoForm).hide();
            $(this.themeOneForm).show();
            $(this.themeTwoCharts).removeClass("active");
            $(this.themeOneCharts).addClass("active");
        }
        else if (themeNumber == 2) {
            $(this.themeOneForm).hide();
            $(this.themeTwoForm).show();
            $(this.themeOneCharts).removeClass("active");
            $(this.themeTwoCharts).addClass("active");
        }        
        this.themeManager.setThemeNumber(themeNumber);
    }
}

ContentController.prototype.toggleThemePanel = function () {   
    $(this.themeContainer).toggleClass("expanded");
    if (this.themeManager) {
        this.themeManager.closeForms();
        this.themeManager.scrollToTop();
    }
}

ContentController.prototype.hideThemePanel = function () {   
    $(this.themeContainer).removeClass("expanded");
    if (this.themeManager) {
        this.themeManager.closeForms();
        this.themeManager.scrollToTop();
    }
}

ContentController.prototype.updateCharts = function (themeNumber, selections, selectionName) {     
    if (this.chartManager) {
        if (this.chartView) {
            this.chartManager.fetchChartData(themeNumber, selections, selectionName);
        }
    }
}

var Content = function () { 
    this.controller = null;
}


var RMAMap = function (
    containerSelector, mapSelector, themeOneSelector, themeTwoSelector, themeTitleSelector, 
    themeCaptionSelector, legendSelector, legendItemSelector, legendBoxSelector, 
    legendLabelSelector, popupSelector, mapResizeSelector, searchBoxContainerSelector, 
    searchBoxAnchorSelector, searchBoxSelector, searchButtonSelector, searchCloseButtonSelector) { 

    // Element selector names
    this.container = containerSelector; 
    this.map = mapSelector;
    this.themeOneLabel = themeOneSelector;
    this.themeTwoLabel = themeTwoSelector;
    this.themeTitle = themeTitleSelector;
    this.themeCaption = themeCaptionSelector;
    this.legend = legendSelector;
    this.legendItem = legendItemSelector;
    this.legendBox = legendBoxSelector;
    this.legendLabel = legendLabelSelector;
    this.popupContainer = document.getElementById(popupSelector.substring(1));
    this.mapResizeButton = mapResizeSelector;
    this.searchBoxContainer = searchBoxContainerSelector;
    this.searchBoxAnchor = searchBoxAnchorSelector;
    this.searchBox = searchBoxSelector;
    this.searchButton = searchButtonSelector;
    this.searchCloseButton = searchCloseButtonSelector;
     
    // JS objects
    this.olMap;
    this.polygonStroke;
    this.labelFill;
    this.selectStroke;
    this.selectStyle;
    this.styleFunction;
    this.basemap;
    this.overlay;
    this.featureOverlay;
    this.currentSelection = "";
    this.currentSelectionName = "";
    this.countySource;
    this.stateSource;
    this.themeOneLayer;
    this.themeTwoLayer;
    this.stateList = [];
    this.countyList = [];
    
    this.themeOne = {   
        loaded: false,
        name: "Not specified",
        data: [],
        digitCount: 0,
        styleClasses: [],        
        reportingUnit: "county",
        labelResolution: 1000,
        measure: "actual"
    }
          
    this.themeTwo = {  
        loaded: false,    
        name: "Not specified",
        data: [],
        digitCount: 0,
        styleClasses: [],
        reportingUnit: "county",
        labelResolution: 1000,
        measure: "actual"
    }
    
    this.activeTheme = this.themeOne;
    this.currentTheme = "";  
    this.currentThemeNumber = 1;
    this.mapLoaded = false;
    this.searchBoxReady = false;
         
    $(this.mapResizeButton).click({obj: this}, function (event) {
        var map = event.data.obj;
        if (map.controller) map.controller.resizeMap($(this));
        if (map.olMap) map.olMap.updateSize();
    });
    
    $(this.mapResizeButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            var map = event.data.obj;
            if (map.controller) map.controller.resizeMap($(this));
            if (map.olMap) map.olMap.updateSize();
        }
    });
           
    $(this.searchButton).click({obj: this}, function (event) {
        var map = event.data.obj;
        if (!map.searchBoxReady) map.initializeSearchBox();
        $(map.searchBox).val("");
        $(map.searchBoxContainer).toggleClass("expanded");
    });
    
    $(this.searchButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });
          
    $(this.searchCloseButton).click({obj: this}, function (event) {
        var map = event.data.obj;
        $(map.searchButton).focus();
        $(map.searchBox).val("");
        $(map.searchBoxContainer).removeClass("expanded");
    });
    
    $(this.searchCloseButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });
    
    $(this.themeOneLabel).click({obj: this}, function (event) {
        var map = event.data.obj;
        
        if (!$(this).hasClass("active")) {
            map.currentThemeNumber = 1; 
            $(this).addClass("active");
            $(map.themeTwoLabel).removeClass("active");
            map.activeTheme = map.themeOne;  
            map.controller.toggleTheme(1); 
            map.themeTwoLayer.setVisible(false);
            map.themeOneLayer.setVisible(true);
            map.updateCaptionOnLayerChange();
            map.refreshPolygonLayers();
            map.updateLegend(map.activeTheme.styleClasses, map.activeTheme.digitCount);       
            if (map.themeOne.reportingUnit != map.themeTwo.reportingUnit) map.searchBoxReady = false;
            map.resetSearchBox();
        }
    });  
     
    $(this.themeOneLabel).keydown({obj: this}, function (event) {
        if ((event.keyCode === 13 || event.keyCode === 32)) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });  
    
    $(this.themeTwoLabel).click({obj: this}, function (event) {
        var map = event.data.obj;  
        
        if (!$(this).hasClass("active")) {
            map.currentThemeNumber = 2;   
            $(this).addClass("active");
            $(map.themeOneLabel).removeClass("active");
            map.activeTheme = map.themeTwo;  
            map.controller.toggleTheme(2); 
            map.themeOneLayer.setVisible(false);
            map.themeTwoLayer.setVisible(true);
            map.updateCaptionOnLayerChange();
            map.refreshPolygonLayers();
            map.updateLegend(map.activeTheme.styleClasses, map.activeTheme.digitCount); 
            map.resetSearchBox();
        }
    });
       
    $(this.themeTwoLabel).keydown({obj: this}, function (event) {
        if ((event.keyCode === 13 || event.keyCode === 32)) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });
}

RMAMap.prototype = Object.create(Content.prototype);
RMAMap.prototype.constructor = RMAMap;

RMAMap.prototype.loadContent = function () {
    this.loadMap();
}

RMAMap.prototype.loadMap = function () {
    var m = this; 

    this.polygonStroke = new ol.style.Stroke({
        color: "#FFF",
        width: 1
    });
    
    this.labelFill = new ol.style.Fill({
        color: "#000"
    });
    
    this.selectStroke = new ol.style.Stroke({
        color: "#000",
        width: 3
    });

    this.selectStyle = new ol.style.Style({
        stroke: this.selectStroke
    });
    
    var stateStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#222",
            width: 1
        })
    });
       
    var stateLabelFill = new ol.style.Fill({
        color: "000"
    });
    
    this.styleFunction = (function () {
        return function (feature, resolution) {
            var label = false;

            if (resolution < m.activeTheme.labelResolution) { 
                label = true;
             
                var labelStyle = new ol.style.Style({
                    text: new ol.style.Text({
                        text: feature.get("UNIT_NAME"),
                        textAlign: "center",
                        textBaseline: "middle",
                        font: "normal 12px Arial, sans-serif",
                        rotation: 0,
                        fill: m.labelFill
                    })                
                }); 
            }
            
            var value = m.activeTheme.data[feature.get("UNIT_CODE")];           
            var polygonStyle = new ol.style.Style({
                stroke: m.polygonStroke
            });
       
            if (value) {
                var classCount = m.activeTheme.styleClasses.length; 
                               
                for (var i = 0; i < classCount; i++) {
                    if (value >= m.activeTheme.styleClasses[i].low && (value <= m.activeTheme.styleClasses[i].high || Math.abs(value - m.activeTheme.styleClasses[i].high) < 0.0000000001)) {
                        var color = m.activeTheme.styleClasses[i].color;
                        var fill = new ol.style.Fill({
                            color: "rgb(" + color.red + "," + color.green + "," + color.blue + ")"
                        });                                   
                        polygonStyle = new ol.style.Style({
                            stroke: m.polygonStroke,
                            fill: fill
                        });
                        break;
                    }
                }
            }
            
            if (label) {
                return [polygonStyle, labelStyle];
            }
            else {
                return [polygonStyle];
            }
        };
    } ())
    
    // Create background layers using ArcGIS services 
    var attribution = new ol.Attribution({
        html: "Basemap provided by ESRI. Sources: Esri, HERE, DeLorme, MapmyIndia, © OpenStreetMap contributors, and the GIS user community. "
    });

    this.basemap = new ol.layer.Tile({
        id: "Gray",
        source: new ol.source.XYZ({
            attributions: [attribution],
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/' +
                 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        })
    });
    
    // Create a county layer for each theme
    attribution = new ol.Attribution({
        html: "State and county boundaries provided by the U.S. Census Bureau. "
    });
       
    var countyVectorSource = new ol.source.Vector({
        projection: 'EPSG:3857',
        url: "data/cb_2015_us_county_20m.json",             
        format: new ol.format.GeoJSON(),
        attributions: [attribution]
    })
    
    this.countySource = new ol.source.ImageVector({
        source: countyVectorSource,
        style: this.styleFunction
    })
        
    this.themeOneLayer = new ol.layer.Image({
        type: "county",
        source: this.countySource
    });
       
    this.themeTwoLayer = new ol.layer.Image({
        type: "county",
        source: this.countySource,
        visible: false
    });
    
    var stateVectorSource = new ol.source.Vector({
        projection: 'EPSG:3857',
        url: "data/cb_2015_us_state_20m.json",             
        format: new ol.format.GeoJSON(),
        attributions: [attribution]
    })
    
    this.stateSource = new ol.source.ImageVector({
        source: stateVectorSource,
        style: this.styleFunction
    })
    
    var stateLayer = new ol.layer.Vector({
        type: "static",
        source: stateVectorSource,
        style: stateStyle
    });
    
    this.overlay = new ol.Overlay(({
        element: this.popupContainer,              
        autoPan: false
    }));

    var center = ol.proj.transform([-98.5795, 39.8283], 'EPSG:4326', 'EPSG:3857');
    var controls = ol.control.defaults({rotate: false}); 
    var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

    // Create the map
    this.olMap = new ol.Map({
        controls: controls,
        interactions: interactions,
        layers: [this.basemap, this.themeTwoLayer, this.themeOneLayer, stateLayer],
        overlays: [this.overlay],
        target: document.getElementById(this.map.substring(1)),
        view: new ol.View({
            center: center,
            zoom: 4,
            minZoom: 2
        })
    });
       
    this.featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: this.olMap,
        style: this.selectStyle
    });   

    this.olMap.on("click", function(evt) {
        m.displayFeatureInfo(evt.pixel, evt.originalEvent.ctrlKey);
    });
    
    if (!this.mapLoaded) {
        if (this.controller) {            
            if (this.controller.themeManager) {
                this.controller.themeManager.fetchMapData();
            }
        }
    }   
    
    this.countySource.set("loadend", $(m.searchBoxContainer).show());
    this.countySource.set("loadend", this.mapLoaded = true);
}

RMAMap.prototype.displayFeatureInfo = function (pixel, ctrlKey) {
    var m = this;
    
    var feature = this.olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer) {
            if (m.activeTheme.reportingUnit == layer.get("type")) {
                return feature;
            }
        }
    });    
    this.selectFeature(feature, !ctrlKey, false);
}

RMAMap.prototype.resetSearchBox = function () {
    this.searchBoxReady = false;
    $(this.searchBox).val("");
    $(this.searchBoxContainer).removeClass("expanded");
}

RMAMap.prototype.onSearchSelection = function (id) {
    var feature = this.getFeatureByID(id);
    $(this.searchButton).focus();
    $(this.searchBox).blur();
    $(this.searchBox).val("");
    $(this.searchBoxContainer).removeClass("expanded");
    this.selectFeature(feature, true, true);
}

RMAMap.prototype.getFeatureByID = function (id) {
    var features = null;
    var feature;
    
    if (this.activeTheme.reportingUnit == "county" && this.countySource) {
        features = this.countySource.getSource().getFeatures();
    }
    else if (this.activeTheme.reportingUnit == "state" && this.stateSource) {
        features = this.stateSource.getSource().getFeatures();
    }
    if (features) {
        var count = features.length;
        
        for (var i = 0; i < count; i++) {
            feature = features[i];
            if ((feature.get("UNIT_CODE")) == id) break;
        }
    }
    return feature;
}

RMAMap.prototype.updateCharts = function () {      
    if (this.controller) {   
        var selections = this.getSelectedFeatureList(); 
        this.controller.updateCharts(this.currentThemeNumber, selections, this.currentSelectionName);
    }
}

RMAMap.prototype.getSelectedFeatureList = function () {
    var features = this.featureOverlay.getSource().getFeatures();
    var count = features.length;
    var list = [];
  
    for (var i = 0; i < count; i++) {
        list.push(features[i].get("UNIT_CODE"));
    }
    return list;
}

RMAMap.prototype.selectFeature = function (feature, replace, moveToSelection) {   
    if (feature) {
        var selected = false;
        var features = this.featureOverlay.getSource().getFeatures();
        var featureCount = features.length;

        for (var i = 0; i < featureCount; i++) {
            if (features[i] === feature) {
                selected = true;
                break;
            }
        }
        
        if (replace) {
            this.featureOverlay.getSource().clear();
        }
        else if (selected) {
            this.featureOverlay.getSource().removeFeature(feature);
        }
        
        if (selected) {           
            this.updateCaption();
        }
        else {
            this.featureOverlay.getSource().addFeature(feature);            
            this.updateCaption();
            
            if (moveToSelection) {
                var polygon = feature.getGeometry();

                if (polygon) {
                    var extent = polygon.getExtent();
                    var center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
                    var view = this.olMap.getView();
                    var pan = ol.animation.pan({
                        duration: 1000,
                        source: view.getCenter()
                    }); 
                    
                    this.olMap.beforeRender(pan);
                    view.setCenter(center);
                }
            }
        }
        this.updateCharts();
    } 
    else {
        this.clearSelections();
    }
}

RMAMap.prototype.clearSelections = function (pixel) {     
    this.featureOverlay.getSource().clear();
    this.currentSelection = "";
    this.currentSelectionName = "";
    this.updateCharts();            
    this.updateCaption();
}

RMAMap.prototype.updateCaptionOnLayerChange = function () {     
    if (this.themeOne.reportingUnit == this.themeTwo.reportingUnit) {
        this.updateCaption();
        this.updateCharts();
    }
    else { 
        this.clearSelections();
    }
}

RMAMap.prototype.updateCaption = function () {  
    var caption = $(this.themeCaption);
    var features = this.featureOverlay.getSource().getFeatures();
    featureCount = features.length;
    
    if (featureCount > 1) {
        var total = 0;
        var value, valueArray, places;
        var minPlaces = 0;
        var scalar;
        
        for (var i = 0; i < featureCount; i++) {
            id = features[i].get("UNIT_CODE");
           
            if (this.activeTheme.data[id]) {
                value = Number(this.activeTheme.data[id]);
                total = total + value;
                valueArray = String(value).split(".");
                
                if (valueArray.length == 2) {
                    places = valueArray[1].length;
                    
                    if (i == 0 || places < minPlaces) {
                        minPlaces = places;
                    }
                }
            }
        }
        
        if (this.activeTheme.measure == "per_mile" || this.activeTheme.measure == "per_km") {
            total = total/featureCount;
        }

        var scalar = Math.pow(10, minPlaces)/10;
        total = Math.round(total * scalar)/scalar;
            
        if (this.activeTheme.digitCount == 0) {
            var valueArray = String(total).split(".");
            scalar = Math.pow(10, 0);
            total = Math.floor(total * scalar)/scalar; 
            var suffix = "";
            
            if (valueArray.length == 2) {
                if (Number(valueArray[1]) != 0) {
                    suffix = "." + valueArray[1];
                }
            }
            
            total = String(total).replace(/(.)(?=(\d{3})+$)/g,'$1,');
            total = total + suffix;
        }
                  
        this.currentSelection = "";
        this.currentSelectionName = "Multiple";        
        caption.html(this.currentSelectionName + ": " + total);
    }
    else if (featureCount == 1) {
        var feature = features[0];
        
        this.currentSelection = feature.get("UNIT_CODE");
        var value = this.activeTheme.data[this.currentSelection];  
        
        if (this.activeTheme.reportingUnit == "county") {
            this.currentSelectionName = feature.get("UNIT_NAME") + " County, " + feature.get("STATE");
        }
        else {
            this.currentSelectionName = feature.get("UNIT_NAME");
        }
        
        if (!value) {
            value = 0;
        }
        else {
            var valueArray = String(value).split(".");
            var scalar = Math.pow(10, 0);
            value = Math.floor(value * scalar)/scalar; 
            var suffix = "";
            
            if (valueArray.length == 2) {
                if (Number(valueArray[1]) != 0) {
                    suffix = "." + valueArray[1];
                }
            }
            
            value = String(value).replace(/(.)(?=(\d{3})+$)/g,'$1,');
            value = value + suffix;
        }        
        caption.html(this.currentSelectionName + ": " + value);
    }        
    else {
        if (this.activeTheme.reportingUnit == "state") {
            caption.html("All states");
        }
        else {
            caption.html("All counties");
        }
    }
}

RMAMap.prototype.updateTheme = function (themeNumber, themeName, themeData, method, classCount, reportingUnit, measure, isFloat) {
    var array = this.objectToArray(themeData);
    this.resetSearchBox();
    
    if (themeNumber == 1) { 
        this.currentTheme = themeName;  
        this.themeOne.loaded = true;
        this.themeOne.name = themeName; 
        this.themeOne.data = themeData;
        this.themeOne.reportingUnit = reportingUnit;
        this.themeOne.measure = measure;
        var styleClasses;        
        
        $(this.themeTitle).html(themeName);
        
        if (reportingUnit == "state") {
            this.themeOne.labelResolution = 4000;
            this.themeOneLayer.set("type", "state");
            this.themeOneLayer.setSource(this.stateSource);
        }
        else {
            this.themeOne.labelResolution = 1000;
            this.themeOneLayer.set("type", "county");
            this.themeOneLayer.setSource(this.countySource);
        }
        
        if (themeName == this.themeTwo.name && reportingUnit == this.themeTwo.reportingUnit && this.themeTwo.data) {
            var arrayTwo = this.objectToArray(this.themeTwo.data);
            array = array.concat(arrayTwo);
        }
        
        this.themeOne.digitCount = 0;
        if (isFloat) this.themeOne.digitCount = this.getDigitCount(array);
    
        if (method == "equal interval") {
            styleClasses = this.getIntervalClasses(array, classCount);
        }
        else if (method == "percentile") {
            styleClasses = this.getPercentileClasses(array, classCount);
        }
        else if (method == "fixed interval") {
            styleClasses = this.getFixedClasses(array, classCount);
        }
        
        this.themeOne.styleClasses = styleClasses;
        this.activeTheme = this.themeOne;
        this.updateLegend(styleClasses, this.themeOne.digitCount);
        this.clearSelections();
        this.refreshPolygonLayers();
    }
    else if (themeNumber == 2) {    
        this.currentTheme = themeName;  
        this.themeTwo.loaded = true;  
        this.themeTwo.name = themeName; 
        this.themeTwo.data = themeData;
        this.themeTwo.reportingUnit = reportingUnit;
        this.themeTwo.measure = measure;
        var styleClasses;        
        
        $(this.themeTitle).html(themeName);
        
        if (reportingUnit == "state") {
            this.themeTwo.labelResolution = 5000;
            this.themeTwoLayer.set("type", "state");
            this.themeTwoLayer.setSource(this.stateSource);
        }
        else {
            this.themeTwo.labelResolution = 1000;
            this.themeTwoLayer.set("type", "county");
            this.themeTwoLayer.setSource(this.countySource);
        }
            
        if (themeName == this.themeOne.name && reportingUnit == this.themeOne.reportingUnit && this.themeOne.data) {
            var arrayTwo = this.objectToArray(this.themeOne.data);
            array = array.concat(arrayTwo);
        }
         
        this.themeTwo.digitCount = 0;
        if (isFloat) this.themeTwo.digitCount = this.getDigitCount(array);
        
        if (method == "equal interval") {
            styleClasses = this.getIntervalClasses(array, classCount);
        }
        else if (method == "percentile") {
            styleClasses = this.getPercentileClasses(array, classCount);
        }
        else if (method == "fixed interval") {
            styleClasses = this.getFixedClasses(array, classCount);
        }
        
        this.themeTwo.styleClasses = styleClasses;
        this.activeTheme = this.themeTwo;
        this.updateLegend(styleClasses, this.themeTwo.digitCount);  
        this.clearSelections();
        this.refreshPolygonLayers();
    }
    this.controller.stopLoadAnimation();
}

RMAMap.prototype.objectToArray = function (obj) {
    var array = [];
    
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            array.push(Number(obj[prop]));
        }
    }
    return array;
}

RMAMap.prototype.updateLegend = function (styleClasses, digitCount) {
    var classCount = styleClasses.length;
    var legend = $(this.legend);
        
    if (legend.length > 0) { 
        var items = legend.find(this.legendItem);  
        items.hide();
        
        if (classCount > 0) { 
            var scalar = Math.pow(10, digitCount + 1)/10;    
            var j, item, box, label, low, high;
        
            for (i = 0; i < classCount; i++) {
                j = classCount - 1 - i;
                item = items.eq(i);
                box = item.find(this.legendBox);
                label = item.find(this.legendLabel);
                color = "rgb(" + styleClasses[j].color.red + "," + styleClasses[j].color.green + "," + styleClasses[j].color.blue + ")";
            
                low = styleClasses[j].low;
                high = styleClasses[j].high;
                low = Math.round(low * scalar)/scalar;
                high = Math.round(high * scalar)/scalar;
                
                if (digitCount == 0) {
                    low = String(low).replace(/(.)(?=(\d{3})+$)/g,'$1,');
                    high = String(high).replace(/(.)(?=(\d{3})+$)/g,'$1,');
                }
                
                range = low + "&ndash;" + high;                
                box.css("background-color", color);
                label.html(range);
                item.css("display", "inline-block");
            }
        }
    }
}

RMAMap.prototype.getIntervalClasses = function (array, classCount) {
    var styles = [];

    if (array.length > 0 && classCount > 0 && classCount < 11) {
        array.sort(function(a, b){ return a - b });
        var min = array[0];
        var max = array[array.length - 1];
        var interval = (max - min)/classCount;
        var floor = min;
        var roof, high, color, styleClass;
        
        for (var i = 0; i < classCount; i++) {
            roof = floor + interval;
            
            if (i == classCount - 1) {
                high = roof;
            }
            else {
                high = Number(roof.toPrecision(3));
            }
            color = this.getColorClass(classCount, i + 1); 
            styleClass = {
                low: Number(floor.toPrecision(3)),
                high: high,
                color: color
            };
            styles.push(styleClass);
            floor = roof;
        }  
    }    
    return styles;
}

RMAMap.prototype.getPercentileClasses = function (array, classCount, digits) {
    var styles = [];
    
    if (array.length > 0 && classCount > 0 && classCount < 11) {
        array.sort(function(a, b){ return a - b });
        var interval = 100/classCount;
        var pct = interval;
        var floor = array[0];
        var roof, high, color, styleClass;
        
        for (var i = 0; i < classCount; i++) {
            roof = d3.quantile(array, pct/100); 
            
            if (i == classCount - 1) {
                high = roof;
            }
            else {
                high = Number(roof.toPrecision(3));
            }
            
            color = this.getColorClass(classCount, i + 1);          
            styleClass = {
                low: Number(floor.toPrecision(3)),
                high: high,
                color: color
            };
            styles.push(styleClass);
            floor = roof;
            pct = pct + interval;
        }
    }
    return styles;
}

RMAMap.prototype.getFixedClasses = function (array, classCount) {
    var styles = [];
    
    if (array.length > 0 && classCount > 0 && classCount < 11) {
        var testArray = [];
    
        for (var i = 0; i < array.length; i++) {
            if (array[i] > 0) {
                testArray.push(array[i]);
            }
        }
    
        testArray.sort(function(a, b){ return a - b }); 
        var lowIndex = 0;
        var highIndex = 0; 
        var low, high, color, styleClass;       
        var min = testArray[0];
        var max = testArray[testArray.length - 1];
        var breaks = [
            0.00000000001,
            0.00000000005,
            0.0000000001,
            0.0000000005,
            0.000000001,
            0.000000005,
            0.00000001,
            0.00000005,
            0.0000001,
            0.0000005,
            0.000001,
            0.000005,
            0.00001,
            0.00005,
            0.0001,
            0.0005,
            0.001,
            0.005,
            0.01,
            0.05,
            0.1,
            0.5,
            1,
            5,
            10,
            50,
            100,
            500,
            1000,
            5000,
            10000,
            50000,
            100000,
            500000,
            1000000,
            5000000,
            10000000,
            50000000,
            100000000,
            500000000,
            1000000000,
            5000000000,
            10000000000,
            50000000000,
            100000000000,
            500000000000,
            1000000000000
        ];
        
        for (i = 0; i < breaks.length; i++) {
            if (min <= breaks[i]) {
                lowIndex = i;
                break;
            }
        }
        
        for (i = 0; i < breaks.length; i++) {
            if (max < breaks[i]) {
                highIndex = i - 1;
                break;
            }
        }
        
        if (i == breaks.length) {
            highIndex = breaks.length - 1;
        }
        
        var intervalCount = highIndex - lowIndex;
        var step = 1;       
        
        if (intervalCount < classCount) {
            classCount = intervalCount + 1;
        }
        else if (intervalCount > classCount * 2) {
            step = Math.floor(intervalCount/classCount);
        }

        var baseIndex = highIndex - classCount * step + step;

        for (i = 0; i < classCount; i++) {
            if (i == 0) {
                low = min;
            }
            else {
                low = breaks[baseIndex + i * step];
            }
            
            if (i == classCount - 1) {
                high = max;
            }
            else {
                high = breaks[baseIndex + i * step + step];
            }
            color = this.getColorClass(classCount, i + 1); 
            styleClass = {
                low: low,
                high: high,
                color: color
            };
            styles.push(styleClass);
        }  
    }
    return styles;
}

RMAMap.prototype.percentile = function (sortedArray, percentile) {
    var n = sortedArray.length;
    var x = (percentile/100) * (n - 1) + 1;
    var index = Math.floor(x);

    if (index >= n) {
        result = sortedArray[n - 1];
    }
    else {
        value1 = sortedArray[index - 1];
        value2 = sortedArray[index];    
        result = value1 + x%1 * (value2 - value1); 
    }
    return result;
}

RMAMap.prototype.getDigitCount = function (array) {
    var digits = 0;
    
    if (array.length > 0) {
        var testArray = [];
    
        for (var i = 0; i < array.length; i++) {
            if (array[i] > 0) {
                testArray.push(array[i]);
            }
        }
        
        testArray.sort(function(a, b){ return a - b });
        var min = testArray[0];
        var max = testArray[testArray.length - 1];
        var diff = max - min;

        if (diff == 0) {
            digits = 0;
        }
        else if (diff < 0.000001) {
            digits = 11;
        }
        else if (diff < 0.00001) {
            digits = 10;
        }
        else if (diff < 0.0001) {
            digits = 9;
        }
        else if (diff < 0.001) {
            digits = 8;
        }
        else if (diff < 0.01) {
            digits = 7;
        }
        else if (diff < 0.1) {
            digits = 6;
        }
        else if (diff < 0) {
            digits = 5;
        }
        else if (diff < 10) {
            digits = 4;
        }
        else if (diff < 100) {
            digits = 3;
        }
        else {
            digits = 0;
        }
    }
    return digits;
}

RMAMap.prototype.getColorClass = function (classCount, index) {
    var color = {
        red: 224,
        green: 224,
        blue: 224
    };
    
    if (index > 0 && index < 11) {
        var interval = 1/classCount;
        var halfInterval = interval/2;
        var pct = index * interval - halfInterval;
        
        var lowColor = {
            red: 175,
            green: 234,
            blue: 212
        };
              
        var highColor = {
            red: 14,
            green: 84,
            blue: 57
        }; 
    
        color.red = Math.round(lowColor.red + pct * (highColor.red - lowColor.red));
        color.green = Math.round(lowColor.green + pct * (highColor.green - lowColor.green));
        color.blue = Math.round(lowColor.blue + pct * (highColor.blue - lowColor.blue));
    }
    
    return color;
}

RMAMap.prototype.refreshPolygonLayers = function () {
    this.olMap.getLayers().forEach(function (layer) {              
        layer.getSource().changed();
    }); 
}

RMAMap.prototype.initializeSearchBox = function () {
    var map = this;
    var container = $(this.searchBoxAnchor);
    var control = $(this.searchBox);
    control.val("");
    var source = [];

    if (this.activeTheme.reportingUnit == "state") {
        if (this.stateList.length == 0) this.stateList = this.getStates();
        source = this.stateList;        
    }
    else {
        if (this.countyList.length == 0) this.countyList = this.getCounties();
        source = this.countyList;
    }

    $(this.searchBox).autocomplete({
        appendTo: container,
        source: source, 
        minLength: 4,
        delay: 500,
        focus: function( event, ui ) {
            return false;
        },
        select: function( event, ui ) {
            control.val(ui.item.label);
            map.onSearchSelection(ui.item.value);
            return false;
        },
        open: function(event, ui){
            var input = $(event.target);
            var results = input.autocomplete("widget");
            var top = results.position().top;
            var height = results.height();
            var inputHeight = input.height() * 2;
            var newTop = top - height - inputHeight - 4;
            results.css("top", newTop + "px");
        }
    });
    this.searchBoxReady = true;
}

RMAMap.prototype.getCounties = function () {
    var counties = [];
    var county;
    
    function compare(a, b) {
        if (a.state < b.state) return -1;
        if (a.state > b.state) return 1;        
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    }

    if (this.countySource) {;
        this.countySource.getSource().forEachFeature(function (feature) {
            county = {
                label: feature.get("UNIT_NAME") + ", " + feature.get("STATE_NAME"),
                value: feature.get("UNIT_CODE")
            };
            counties.push(county);
        });
    }
    
    counties = counties.sort(compare);
    return counties;
}

RMAMap.prototype.getStates = function () {
    var states = [];
    var state;
    
    function compare(a, b) {       
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    }

    if (this.stateSource) {;
        this.stateSource.getSource().forEachFeature(function (feature) {
            state = {
                label: feature.get("UNIT_NAME"),
                value: feature.get("UNIT_CODE")
            };
            states.push(state);
        });
    }
    
    states = states.sort(compare);
    return states;
}


var ThemeManager = function (
    contentContainerSelector, formContainerSelector, formSelector, sectionTabSelector, sectionSelector, 
    scrollableClass, truncatedClass, metricCaptionSelector, yearCaptionSelector, commodityCaptionSelector,
    causeCaptionSelector, settingsCaptionSelector, parameterListSelector, 
    metricSelector, yearSelector, commoditySelector, causeSelector, allOptionSelector, classCountSelector, 
    classMethodSelector, measurementUnitSelector, reportingUnitSelector, clearSelector, 
    updateSelector, cancelSelector, bookendSelector) { 

    this.contentContainer = contentContainerSelector;
    this.formContainer = formContainerSelector;
    this.form = formSelector;
    this.sectionTab = sectionTabSelector;
    this.section = sectionSelector;
    this.scrollableClass = scrollableClass;
    this.truncatedClass = truncatedClass;
    this.metricCaption = metricCaptionSelector;
    this.yearCaption = yearCaptionSelector;
    this.commodityCaption = commodityCaptionSelector;
    this.causeCaption = causeCaptionSelector;
    this.settingsCaption = settingsCaptionSelector;
    this.parameterList = parameterListSelector;
    this.metricOption = metricSelector;
    this.yearOption = yearSelector;
    this.commodityOption = commoditySelector;
    this.causeOption = causeSelector;
    this.allOption = allOptionSelector;
    this.classCountMenu = classCountSelector;
    this.classMethodMenu = classMethodSelector;
    this.measurementUnitMenu = measurementUnitSelector;
    this.reportingUnitMenu = reportingUnitSelector;
    this.clearButton = clearSelector;
    this.updateButton = updateSelector;
    this.cancelButton = cancelSelector;   
    this.bookend = bookendSelector;
    this.currentTheme = 1;
    this.thematicData = null; 
    this.themes = [{},{}];   
    this.themeCaptions = [
        {
            metric: "",
            dates: "",
            commodity: "",
            cause: "",
            settings: ""
        },
        {
            metric: "",
            dates: "",
            commodity: "",
            cause: "",
            settings: ""
        }
    ];
    
    $(this.classCountMenu).val(6);
    $(this.classMethodMenu).val("fixed interval");
    $(this.measurementUnitMenu).val("actual");
    $(this.reportingUnitMenu).val("county");
    

    $(this.sectionTab).click({obj: this}, function (event) {
        var manager = event.data.obj; 

        if (!$(this).hasClass("active")) {
            var tabs = $(manager.sectionTab); 
            var index = tabs.index($(this));
            tabs.removeClass("active");        
            $(this).addClass("active");
            manager.showForms(index);
        }
        else {  
            manager.closeForms();
        }
    }); 
    
    $(this.sectionTab).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }  
    });  
        
    $(this.parameterList).keydown({obj: this}, function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            var manager = event.data.obj; 
            $(this).find("li").eq(0).focus();
        }  
    });
    
    $(this.parameterList + " li").keydown({obj: this}, function (event) {
        if (event.keyCode === 38) {
            event.preventDefault();
            $(this).prev().focus();
        }  
    });
     
    $(this.parameterList + " li").keydown({obj: this}, function (event) {
        if (event.keyCode === 40) {
            event.preventDefault();
            $(this).next().focus();
        }  
    });
   
    $(this.metricOption).click({obj: this}, function (event) {
        var manager = event.data.obj;

        if (!$(this).hasClass("selected")) {  
            var form = $(this).parents(manager.form);                       
            var options = form.find(manager.metricOption);
            options.removeClass("selected");
            $(this).addClass("selected");
        }
    });   
    
    $(this.metricOption).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
        }  
    });
    
    $(this.yearOption).click({obj: this}, function (event) {
        var manager = event.data.obj;         
        var form = $(this).parents(manager.form);

        if ($(this).hasClass(manager.allOption.substring(1))) {                      
            var options = form.find(manager.yearOption);
            options.removeClass("active").removeClass("selected");
            $(this).addClass("selected");          
        }
        else if ($(this).hasClass("selected")) {                       
            var options = form.find(manager.yearOption);
            var allOption = form.find(manager.yearOption + manager.allOption);
            options.removeClass("active").removeClass("selected");
            allOption.addClass("selected");          
        }
        else {
            var allOption = form.find(manager.yearOption + manager.allOption);
            allOption.removeClass("selected");
            $(this).toggleClass("active");
            manager.updateYears(form);
        }
    });
    
    $(this.yearOption).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
        }  
    });
    
    $(this.commodityOption).click({obj: this}, function (event) {
        var manager = event.data.obj;
        var form = $(this).parents(manager.form);                      
        var options = form.find(manager.commodityOption);
        var val = $(this).attr("value");
        
        if ($(this).hasClass("selected")) {
            manager.unSelectOptionsByValue(options, val);      
            var selections = form.find(manager.commodityOption + ".selected");
            
            if (selections.length == 0) {
                var allOption = form.find(manager.commodityOption + manager.allOption);
                allOption.addClass("selected"); 
            }
        }
        else {        
            if ($(this).hasClass(manager.allOption.substring(1))) { 
                options.removeClass("selected");    
            }
            else {                      
                var allOption = form.find(manager.commodityOption + manager.allOption);
                allOption.removeClass("selected"); 
            }            
            manager.selectOptionsByValue(options, val);
        }
    }); 

    $(this.commodityOption).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
        }  
    });
    
    $(this.causeOption).click({obj: this}, function (event) {
        var manager = event.data.obj;
        var form = $(this).parents(manager.form);                      
        var options = form.find(manager.causeOption);
        var val = $(this).attr("value");
        
        if ($(this).hasClass("selected")) {
            manager.unSelectOptionsByValue(options, val);     
            var selections = form.find(manager.causeOption + ".selected");
            
            if (selections.length == 0) {
                var allOption = form.find(manager.causeOption + manager.allOption);
                allOption.addClass("selected"); 
            }
        }
        else {
            var form = $(this).parents(manager.form);
        
            if ($(this).hasClass(manager.allOption.substring(1))) {                       
                var options = form.find(manager.causeOption);
                options.removeClass("selected");      
            }
            else {                      
                var allOption = form.find(manager.causeOption + manager.allOption);
                allOption.removeClass("selected");
            }
            manager.selectOptionsByValue(options, val);
        }
    }); 
 
    $(this.causeOption).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
        }  
    });
    
    $(this.clearButton).click({obj: this}, function (event) {
        var manager = event.data.obj;  
        var form = $(manager.form).eq(manager.currentTheme - 1);
        
        if (form.length > 0) {
            var activeTab = $(manager.sectionTab + ".active");        
            var index = $(manager.sectionTab).index(activeTab);
            
            if (index > -1) {
                var section = form.find(manager.section).eq(index);
                
                if (section.length > 0) {
                    section.find(manager.yearOption).removeClass("active").removeClass("selected");
                    section.find(manager.commodityOption).removeClass("selected");
                    section.find(manager.causeOption).removeClass("selected");
                    section.find(manager.allOption).addClass("selected");
                }
            }
        }
    });
    
    $(this.clearButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }  
    });
    
    $(this.updateButton).click({obj: this}, function (event) {
        var manager = event.data.obj;
        manager.fetchMapData();    
        manager.closeForms();
    });
    
    $(this.updateButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }  
    });
    
    $(this.cancelButton).click({obj: this}, function (event) {
        var manager = event.data.obj;   
        manager.closeForms();
    });
    
    $(this.cancelButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }  
    }); 
    
    $(this.bookend).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            var manager = event.data.obj; 
            manager.closeForms();
        }  
    });   
}

ThemeManager.prototype = Object.create(Content.prototype);
ThemeManager.prototype.constructor = ThemeManager;

ThemeManager.prototype.setThemeNumber = function (themeNumber) {
    this.currentTheme = themeNumber;    
    this.changeCaptions();
    this.closeForms();
}

ThemeManager.prototype.updateTheme = function (themeNumber, metric, startYear, endYear, commodities, causes, commodityLookup, causeLookup, unit, measure) {
    themeNumber = themeNumber - 1;
    
    if (themeNumber > -1 && themeNumber < this.themes.length) {
        this.themes[themeNumber] = {
            metric: metric,
            startYear: Number(startYear),
            endYear: Number(endYear), 
            years: [],
            commodities: commodities, 
            causes: causes, 
            commodityLookup: commodityLookup, 
            causeLookup: causeLookup,
            reportingUnit: unit, 
            measure: measure
        };
    }
}

ThemeManager.prototype.getActiveTheme = function () {
    var theme = null;
    
    if (this.currentTheme > 0 && this.currentTheme <= this.themes.length) {
        theme = this.themes[this.currentTheme - 1];
    }
    return theme;
}

ThemeManager.prototype.getTheme = function (themeNumber) {
    var theme = null;
    
    if (themeNumber > 0 && themeNumber < this.themes.length + 1) {
        theme = this.themes[themeNumber - 1];
    }
    return theme;
}

ThemeManager.prototype.showForms = function (index) {    
    if (this.currentTheme > 0 && this.currentTheme < 3) {  
        $(this.contentContainer).removeClass(this.scrollableClass);
        var form = $(this.form).eq(this.currentTheme - 1); 
        var sections = form.find(this.section);
        var tabs = $(this.sectionTab);
        var section = sections.eq(index);
        tabs.addClass(this.truncatedClass);      
        $(this.section).hide();
        section.show();
        $(this.formContainer).show();
        section.find("ul:first").focus();
    }
}

ThemeManager.prototype.closeForms = function () {  
    $(this.contentContainer).addClass(this.scrollableClass);
    $(this.sectionTab + ".active:first").focus();
    $(this.sectionTab).removeClass("active");        
    $(this.section).hide();
    $(this.formContainer).hide();
    $(this.sectionTab).removeClass(this.truncatedClass);
}

ThemeManager.prototype.scrollToTop = function () {  
    $(this.contentContainer).scrollTop(0);
}

ThemeManager.prototype.selectOptionsByValue = function (list, value) {    
    if (list) {
        list.each(function() {
            if($(this).attr("value") == value) {
                $(this).addClass("selected");
            }
        });
    }
}

ThemeManager.prototype.unSelectOptionsByValue = function (list, value) {    
    if (list) {
        list.each(function() {
            if($(this).attr("value") == value) {
                $(this).removeClass("selected");
            }
        });
    }
}

ThemeManager.prototype.getMetric = function () {    
    var theme = "";
    var container = $(this.form).eq(this.currentTheme - 1);
    
    if (container.length > 0) {
        var selections = container.find(this.metricOption + ".selected");

        if (selections.length > 0) {
            theme = selections.eq(0).attr("value");
        }
    }
    return theme;
}

ThemeManager.prototype.getMetricLabel = function () {    
    var theme = "";
    var container = $(this.form).eq(this.currentTheme - 1);
    
    if (container.length > 0) {
        var selections = container.find(this.metricOption + ".selected");

        if (selections.length > 0) {
            theme = selections.eq(0).text();
        }
    }
    return theme;
}

ThemeManager.prototype.getStartYear = function () {    
    var year = "";
    var container = $(this.form).eq(this.currentTheme - 1);
    
    if (container.length > 0) {
        var allOption = container.find(this.yearOption + this.allOption + ".selected");
        if (allOption.length > 0) {           
            var options = container.find(this.yearOption).not(this.allOption);
            if (options.length > 0) {
                year = options.eq(0).attr("value");
            }
        }
        else {
            var selections = container.find(this.yearOption + ".selected");
            if (selections.length > 0) {
                year = selections.eq(0).attr("value");
            }
        }
    }
    return year;
}

ThemeManager.prototype.getEndYear = function () {    
    var year = "";
    var container = $(this.form).eq(this.currentTheme - 1);
    
    if (container.length > 0) {
        var allOption = container.find(this.yearOption + this.allOption + ".selected");
        if (allOption.length > 0) {           
            var options = container.find(this.yearOption).not(this.allOption);
            if (options.length > 0) {
                year = options.eq(options.length - 1).attr("value");
            }
        }
        else {
            var selections = container.find(this.yearOption + ".selected");
            if (selections.length > 0) {
                year = selections.eq(selections.length - 1).attr("value");
            }
        }
    }
    return year;
}

ThemeManager.prototype.getCommodities = function () {    
    var commodities = [];
    var container = $(this.form).eq(this.currentTheme - 1);
    var val;
    
    if (container.length > 0) {
        var selections = container.find(this.commodityOption + ".selected").not(this.allOption);
        selections.each(function() {
            val = $(this).attr("value");
            if (commodities.indexOf(val) == -1) commodities.push(val);
        });
    }
    return commodities.join("|")
}

ThemeManager.prototype.getCauses = function () {    
    var causes = [];
    var container = $(this.form).eq(this.currentTheme - 1);
    var val;
    
    if (container.length > 0) {
        var selections = container.find(this.causeOption + ".selected").not(this.allOption);
        selections.each(function() {
            val = $(this).attr("value");
            if (causes.indexOf(val) == -1) causes.push(val);
        });
    }
    return causes.join("|")
}

ThemeManager.prototype.getCommodityLookup = function () {    
    var lookup = {};
    var container = $(this.form).eq(this.currentTheme - 1);
    var code, label;
    
    if (container.length > 0) {
        var selections = container.find(this.commodityOption + ".selected").not(this.allOption);
        
        if (selections.length == 0) {
            selections = container.find(this.commodityOption).not(this.allOption)
        }

        selections.each(function() {
            code = $(this).attr("value");  
            label = $(this).text();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            if (code) {
                if (!lookup.hasOwnProperty(code)) lookup[code] = label;
            }
        });
    }
    return lookup;
}

ThemeManager.prototype.getCauseLookup = function () {    
    var lookup = {}; 
    var container = $(this.form).eq(this.currentTheme - 1);
    var code, label;
    
    if (container.length > 0) {
        var selections = container.find(this.causeOption + ".selected").not(this.allOption);
              
        if (selections.length == 0) {
            selections = container.find(this.causeOption).not(this.allOption)
        }
        
        selections.each(function() {
            code = $(this).attr("value");  
            label = $(this).text();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            if (code) {
                if (!lookup.hasOwnProperty(code)) lookup[code] = label;
            }
        });
    }
    return lookup;
}

ThemeManager.prototype.getReportingUnit = function () {    
    var unit = "county"; 
    var container = $(this.form).eq(this.currentTheme - 1);
    
    if (container.length > 0) {
        unit = container.find(this.reportingUnitMenu).val();
    }
    return unit;
}

ThemeManager.prototype.getMeasurementUnit = function () {    
    var unit = ""; 
    var container = $(this.form).eq(this.currentTheme - 1);
    
    if (container.length > 0) {
        unit = container.find(this.measurementUnitMenu).val();
    }
    return unit;
}

ThemeManager.prototype.fetchMapData = function () {   
    var c = this.controller;
    if (c) {
        var map = this.controller.map; 
        var chartManager = this.controller.chartManager; 
        var container = $(this.form).eq(this.currentTheme - 1);
        
        if (map && container) {  
            c.startLoadAnimation();

            var manager = this;
            var metric = this.getMetric();
            var startYear = this.getStartYear();
            var endYear = this.getEndYear();
            var commodities = this.getCommodities(); 
            var causes = this.getCauses();
            var commodityLookup = this.getCommodityLookup();
            var causeLookup = this.getCauseLookup();
            var unit = this.getReportingUnit();
            var measure = this.getMeasurementUnit();
            var metricLabel = this.getMetricLabel();
            
            if (metric == "payment_acreage" && startYear < 2001) {
                startYear = 2001;
            }
            var timeSpan = startYear;
            
            if (startYear != endYear) {
                timeSpan = startYear + "&ndash;" + endYear;
            }
            this.thematicData = null;
            
            var params = {
                metric: metric,
                startYear: startYear,
                endYear: endYear,
                commodities: commodities, 
                causes: causes,
                measurementUnit: measure,
                reportingUnit: unit
            };   
            
            var isFloat = false;
            if (measure == "per_mile") {
                metricLabel = metricLabel + " (per sq mile)";
                isFloat = true;
            }
            else if (measure == "per_km") {
                metricLabel = metricLabel + " (per sq km)";
                isFloat = true;
            }

            $.get("payment-map-data.php", params, function (data) {
                if (data != "") {
                    try {
                        manager.thematicData = JSON.parse(data);
                        var method = container.find(manager.classMethodMenu).val();
                        var count = container.find(manager.classCountMenu).val();
                        manager.updateCaptions(metricLabel, timeSpan, commodities, causes, method, count, commodityLookup, causeLookup);
                        manager.updateTheme(manager.currentTheme, metric, startYear, endYear, commodities, causes, commodityLookup, causeLookup, unit, measure);
                        map.updateTheme(manager.currentTheme, metricLabel, manager.thematicData, method, count, unit, measure, isFloat);
                    }
                    catch (err) {
                        c.stopLoadAnimation();
                        alert("There was an error loading data");
                    }
                }
                else {
                    c.stopLoadAnimation();
                }
            });
        }
    }
}

ThemeManager.prototype.updateYears = function (container) {      
    if (container.length > 0) {
        var options = container.find(this.yearOption);                                        
        var activeOptions = container.find(this.yearOption + ".active");
        var activeCount = activeOptions.length;
        var opt;
        
        options.removeClass("selection");
        selectionOn = false;
        activeIndex = 0;
        
        for (var i = 0; i < options.length; i++) {
            opt = options.eq(i);
            
            if (opt.hasClass("active")) {
                activeIndex++;
                opt.addClass("selected");
                
                if (selectionOn) {
                    if (activeIndex == activeCount) {
                        selectionOn = false;
                    }
                }
                else {
                    this.startYear = opt.attr("value");
                    if (activeCount > 1) {
                        selectionOn = true;
                    }
                }
            }                     
            else if (selectionOn) {
                opt.addClass("selected");
            }
        }
    }
}

ThemeManager.prototype.updateCaptions = function (metricLabel, timeSpan, commodities, causes, method, count, commodityLookup, causeLookup) {      
    var commodityList = commodities.split("|");   
    var causeList = causes.split("|");
    var commodityLabel = "All commodities";
    var causeLabel = "All causes";
    var settingsLabel = count + " classes, " + method;
    
    if (commodities != "" && commodityList.length == 1) {
        commodityLabel = commodityLookup[commodityList[0]];
    }
    else if (commodityList.length > 1) {
        commodityLabel = "Multiple commodities";
    }  
    
    if (causes != "" && causeList.length == 1) {
        causeLabel = causeLookup[causeList[0]];
    }
    else if (causeList.length > 1) {
        causeLabel = "Multiple causes";
    }
    
    if (this.currentTheme > 0 && this.currentTheme < 3) {
        var theme = this.themeCaptions[this.currentTheme - 1];
        theme.metric = metricLabel;
        theme.dates = timeSpan;
        theme.commodity = commodityLabel;
        theme.cause = causeLabel;
        theme.settings = settingsLabel;
        this.changeCaptions();
    }
}

ThemeManager.prototype.changeCaptions = function () { 
    if (this.currentTheme > 0 && this.currentTheme < 3) {
        var theme = this.themeCaptions[this.currentTheme - 1];
    
        $(this.metricCaption).html(theme.metric);
        $(this.yearCaption).html(theme.dates);
        $(this.commodityCaption).html(theme.commodity);
        $(this.causeCaption).html(theme.cause);
        $(this.settingsCaption).html(theme.settings);
    };
}


var ChartManager = function (pageSelector, containerSelector, timeOptionSelector, sectionSelector, metricSelector,
    chartContainerSelector, seriesChartSelector, barChartSelector, monthlyInteractiveChartSelector, 
    monthlyChartSelector, variableSelector, exportSelector, barSelector, dotSelector, monthlyBarSelector,
    previousSelector, nextSelector, seriesChartClearSelector, barChartClearSelector, 
    monthlyChartClearSelector, chartPopupSelector, chartPopupCanvasSelector, chartPopupCloseSelector) { 

    this.page = pageSelector;
    this.container = containerSelector;
    this.timeOption = timeOptionSelector;
    this.section = sectionSelector;
    this.metricTitle = metricSelector;
    this.chartContainer = chartContainerSelector;
    this.seriesChart = seriesChartSelector;
    this.barChart = barChartSelector;
    this.monthlyInteractiveChart = monthlyInteractiveChartSelector;
    this.monthlyChart = monthlyChartSelector;
    this.variableLabel = variableSelector;
    this.exportButton = exportSelector;
    this.bar = barSelector;
    this.dot = dotSelector;
    this.monthlyBar = monthlyBarSelector;
    this.previousButton = previousSelector;
    this.nextButton = nextSelector;
    this.seriesChartClearButton = seriesChartClearSelector;
    this.barChartClearButton = barChartClearSelector;
    this.monthlyChartClearButton = monthlyChartClearSelector;
    this.chartPopup = chartPopupSelector;
    this.chartPopupCanvas = chartPopupCanvasSelector;
    this.chartPopupCloseButton = chartPopupCloseSelector;
    this.activeTheme = null;    
    this.sectionDetails = [];
    
    this.addSectionDetails("annual", "commodity", "commodityLookup", "by commodity", "All commodities", "blue");
    this.addSectionDetails("monthly", "commodity", "commodityLookup", "by commodity", "All commodities", "blue");
    this.addSectionDetails("annual", "cause", "causeLookup", "by cause of loss", "All causes of loss", "teal");
    this.addSectionDetails("monthly", "cause", "causeLookup", "by cause of loss", "All causes of loss", "teal");
    
    $(this.timeOption).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        var container = $(this).parents(manager.container);
        var choice = $(this).attr("value");
        container.find(manager.timeOption).removeClass("checked");
        $(this).addClass("checked");
        manager.toggleSections(container, choice);
    });   
    
    $(this.timeOption).keydown({obj: this}, function (event) {     
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
        }
    });  
    
    $(this.exportButton).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        
        if (manager.activeTheme) {
            var container = $(this).parents(manager.chartContainer);
            var chart = container.find("svg");
            manager.showChartPopup(chart);
        }
    });   
    
    $(this.exportButton).keydown({obj: this}, function (event) {     
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
        }
    });  
    
    $("body").on("click", this.barChart + " " + this.bar + ".non-zero", {obj: this}, function (event) {
        var manager = event.data.obj; 
        var label = $(this).text();
        var parentChart = $(this).parents(manager.barChart);
        var section = parentChart.parents(manager.section);
        var container = section.parents(manager.container);
        var chartIndex = container.find(manager.section).index(section);
        var bars = parentChart.find(manager.bar);
        var barClass = $(this).attr("class").replace("active", "").trim();
        
        if ($(this).attr("class") == barClass + " active") {    
            var baseClass;
            bars.each(function() {
                baseClass = $(this).attr("class").replace("active", "").trim();
                $(this).attr("class", baseClass);
            });
            manager.updateSeriesChart(section, chartIndex, "", "", false);
            manager.updateMonthlyInteractiveChart(section, chartIndex, "", "", false);
        }
        else {
            var code = $(this).attr("code");     
            var baseClass;
            bars.each(function() {
                baseClass = $(this).attr("class").replace("active", "").trim();
                $(this).attr("class", baseClass);
            });
            $(this).attr("class", barClass + " active");
            manager.updateSeriesChart(section, chartIndex, code, label, false);
            manager.updateMonthlyInteractiveChart(section, chartIndex, code, label, false);
        }
    });    
    
    $("body").on("click", this.barChartClearButton, {obj: this}, function (event) {
        var manager = event.data.obj;
        var section = $(this).parents(manager.section);
        var parentChart = section.find(manager.barChart);
        var container = section.parents(manager.container);
        var chartIndex = container.find(manager.section).index(section);
        var bars = parentChart.find(manager.bar);
        
        if (bars.length > 0) {
            var baseClass;
            bars.each(function() {
                baseClass = $(this).attr("class").replace("active", "").trim();
                $(this).attr("class", baseClass);
            });
            manager.updateSeriesChart(section, chartIndex, "", "", false);
            manager.updateMonthlyInteractiveChart(section, chartIndex, "", "", false);
        }
    });    
    
    $("body").on("keydown", this.barChartClearButton, {obj: this}, function (event) {  
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    }); 
       
    $("body").on("click", this.dot, {obj: this}, function (event) {
        var manager = event.data.obj;      

        if (manager.activeTheme) {  
            var parentChart = $(this).parents(manager.seriesChart);
            var section = parentChart.parents(manager.section);
            var container = section.parents(manager.container);
            var dots = parentChart.find(manager.dot);
            var chartIndex = container.find(manager.section).index(section);
            var dotClass = $(this).attr("class").replace("active", "").trim();

            if ($(this).attr("class") == dotClass + " active") {  
                dots.attr("class", dotClass);
                manager.updateBarChart(section, chartIndex, -1);
                manager.updateMonthlyChart(section, chartIndex, -1);
            }
            else {
                dots.attr("class", dotClass);
                var index = dots.index($(this));
                $(this).attr("class", dotClass + " active");
                manager.updateBarChart(section, chartIndex, index);
                manager.updateMonthlyChart(section, chartIndex, index);
            }
        }
    }); 
   
    $(this.previousButton).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        
        if (manager.activeTheme) {
            var section = $(this).parents(manager.section);
            manager.traverseTimeSeriesBackward(section);
        }
    });  
    
    $(this.previousButton).keydown({obj: this}, function (event) {     
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });  
    
    $(this.nextButton).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        
        if (manager.activeTheme) {            
            var section = $(this).parents(manager.section);
            manager.traverseTimeSeriesForward(section);
        }
    });  
    
    $(this.nextButton).keydown({obj: this}, function (event) {    
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });  
    
    $("body").on("click", this.seriesChartClearButton, {obj: this}, function (event) {
        var manager = event.data.obj;
        var section = $(this).parents(manager.section);
        var parentChart = section.find(manager.seriesChart);
        var container = section.parents(manager.container);
        var chartIndex = container.find(manager.section).index(section);
        var dots = parentChart.find(manager.dot);
        
        if (dots.length > 0) {    
            var baseClass = dots.eq(0).attr("class").replace("active", "").trim();
            dots.attr("class", baseClass);
            manager.updateBarChart(section, chartIndex, -1);
            manager.updateMonthlyChart(section, chartIndex, -1);
        }
    });  
       
    $("body").on("keydown", this.seriesChartClearButton, {obj: this}, function (event) {    
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });  
    
    $("body").on("click", this.monthlyInteractiveChart + " " + this.monthlyBar, {obj: this}, function (event) {
        var manager = event.data.obj;      

        if (manager.activeTheme) {  
            var parentChart = $(this).parents(manager.monthlyInteractiveChart);
            var section = parentChart.parents(manager.section);
            var container = section.parents(manager.container);
            var chartIndex = container.find(manager.section).index(section);
            var bars = parentChart.find(manager.monthlyBar);
            var barClass = $(this).attr("class").replace("active", "").trim();

            if ($(this).attr("class") == barClass + " active") {  
                bars.attr("class", barClass);
                manager.updateBarChart(section, chartIndex, -1);
            }
            else {
                bars.attr("class", barClass);
                var index = bars.index($(this));
                $(this).attr("class", barClass + " active");
                manager.updateBarChart(section, chartIndex, index);
            }
        }
    }); 
   
    $("body").on("click", this.monthlyChartClearButton, {obj: this}, function (event) {
        var manager = event.data.obj;
        var section = $(this).parents(manager.section);
        var parentChart = section.find(manager.monthlyInteractiveChart);
        var container = section.parents(manager.container);
        var chartIndex = container.find(manager.section).index(section);
        var bars = parentChart.find(manager.monthlyBar);
        
        if (bars.length > 0) {    
            var baseClass = bars.eq(0).attr("class").replace("active", "").trim();
            bars.attr("class", baseClass);
            manager.updateBarChart(section, chartIndex, -1);
        }
    });  
       
    $("body").on("keydown", this.monthlyChartClearButton, {obj: this}, function (event) {    
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(this).trigger("click");
            $("body").removeClass("no-outline");
        }
    });  
    
    $(this.chartPopupCloseButton).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        $(manager.chartPopup).removeClass("active");
    });  
    
    $(this.chartPopupCloseButton).keydown({obj: this}, function (event) {     
        if (event.keyCode === 13 || event.keyCode === 32) {
            var manager = event.data.obj; 
            $(manager.chartPopup).removeClass("active");
        }
        else if (event.keyCode === 9) {
            event.preventDefault();
        }  
    });  
      
    $(this.chartPopupCloseButton).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            event.preventDefault();
        }  
    });          
}

ChartManager.prototype = Object.create(Content.prototype);
ChartManager.prototype.constructor = ChartManager;

ChartManager.prototype.addSectionDetails = function (timeVariable, groupVariable, groupLookup, titleLabel, chartLabel, color) {
    var details = {
        "timeVariable": timeVariable,
        "groupVariable": groupVariable, 
        "groupLookup": groupLookup,
        "titleLabel": titleLabel,
        "chartLabel": chartLabel,
        "color": color
    }
    this.sectionDetails.push(details);
}

ChartManager.prototype.toggleSections = function (container, choice) {
    if (this.activeTheme && container.length > 0) {
        var sections = container.find(this.section);
        var sectionCount = this.sectionDetails.length;
        
        if (sections.length == sectionCount) {    
            sections.removeClass("active"); 
            
            for (var i = 0; i < sectionCount; i++) {
                if (this.sectionDetails[i].timeVariable == choice) {
                    sections.eq(i).addClass("active");
                }
            }
        }
    }
}

ChartManager.prototype.fetchChartData = function (themeNumber, selections, selectionName) {
    var c = this.controller;
    
    if (c.themeManager) {
        var activeTheme = c.themeManager.getTheme(themeNumber);
        var manager = this;
        
        if (activeTheme) {
            
            if (activeTheme.hasOwnProperty("metric")) {
                c.startLoadAnimation();
                
                var params = {
                    metric: activeTheme.metric,
                    startYear: activeTheme.startYear,
                    endYear: activeTheme.endYear,
                    commodities: activeTheme.commodities, 
                    causes: activeTheme.causes,
                    measurementUnit: activeTheme.measure,
                    reportingUnit: activeTheme.reportingUnit,
                    reportingUnitList: selections.join("|")
                };   
               
                $.get("payment-chart-data.php", params, function (data) {
                    if (data != "") {
                        try {
                            var dataObj = JSON.parse(data);
                            $(manager.page).show();                        
                            manager.loadCharts(themeNumber, selectionName, dataObj);
                        }
                        catch (err) {
                            c.stopLoadAnimation();
                            alert("There was an error loading data");
                        }
                    }
                    else {
                        c.stopLoadAnimation();
                    }
                });
            }
            else {
                $(manager.page).show();         
            }
        }
        else {
            $(manager.page).show();         
        }
    }
}

ChartManager.prototype.loadCharts = function (themeNumber, selectionName, data) {
    if (this.controller.themeManager) {
        var activeTheme = this.controller.themeManager.getTheme(themeNumber);
        var containers = $(this.container);
        
        if (activeTheme && themeNumber <= containers.length) {
            var container = containers.eq(themeNumber - 1);   
            var yearLabel = activeTheme.startYear;
            this.activeTheme = activeTheme;
            activeTheme.data = data;  
            activeTheme.years = [];
            metricLabel = activeTheme.metric.replace("_", " ");

            if (activeTheme.startYear != activeTheme.endYear) {
                yearLabel = activeTheme.startYear + "–" + activeTheme.endYear;
            }
            yearLabel = yearLabel + " totals";

            if (selectionName == "") {
                if (activeTheme.reportingUnit == "state") {
                    selectionName = "All states";
                }
                else if (activeTheme.reportingUnit == "county") {
                    selectionName = "All counties";
                }
            } 
            
            if (activeTheme.measure == "per_mile") {
                metricLabel = metricLabel + " (per sq mile)";
                isFloat = true;
            }
            else if (activeTheme.measure == "per_km") {
                metricLabel = metricLabel + " (per sq km)";
                isFloat = true;
            }

            for (var i = activeTheme.startYear; i < activeTheme.endYear + 1; i++) {
                activeTheme.years.push(i);
            }    
 
            container.addClass("loaded").addClass("active");

            var sections = container.find(this.section); 
            var sectionCount = sections.length;
            var monthLabel = yearLabel;
            var section, details, subData, nameLookup, chartData, chartLabel;

            if (sectionCount > 0 && sectionCount == this.sectionDetails.length) {    
                for (var i = 0; i < sectionCount; i++) {
                    section = sections.eq(i);
                    details = this.sectionDetails[i];
                    section.find(this.metricTitle).html(metricLabel + " " + details.titleLabel);
                    
                    this.updateSeriesChart(section, i, "", "", true);
                    this.updateBarChart(section, i, -1);
                    this.updateMonthlyInteractiveChart(section, i, "", "", true);
                    this.updateMonthlyChart(section, i, -1);
                }               
            }
            this.controller.stopLoadAnimation();
        }
    }
}

ChartManager.prototype.updateSeriesChart = function (container, chartIndex, attribute, label, initialize) {    
    if (container.length > 0 && chartIndex < this.sectionDetails.length && this.activeTheme) {   
        var charts = container.find(this.seriesChart);  

        if (this.activeTheme.data && this.activeTheme.years && charts.length > 0) {
            var data = this.activeTheme.data;
            var details = this.sectionDetails[chartIndex];
            var subData, chartData;
            var defaultLabel = "";

            if (data.hasOwnProperty(details.timeVariable)) {
                subData = data[details.timeVariable];
                
                if (subData.hasOwnProperty(details.groupVariable)) {
                    chartData = subData[details.groupVariable];          
                }
            }
            
            if (chartData) {                 
                var index = -1;
                
                if (!initialize) {                
                    var dots = charts.find(this.dot);
                    var activeDot = charts.find(this.dot + ".active");
                    
                    if (activeDot.length > 0) {
                        index = dots.index(activeDot.eq(0));
                    }
                }
                
                var chart = charts.get()[0];
                charts.empty();
                    
                if (attribute == "") {
                    this.createTimeSeriesChart(chart, chartData["total"], this.activeTheme.years, index, details.chartLabel, details.color);
                }
                else if (chartData.hasOwnProperty(attribute)) {
                    this.createTimeSeriesChart(chart, chartData[attribute], this.activeTheme.years, index, label, details.color);
                }
            }
        }
    }
}

ChartManager.prototype.updateBarChart = function (container, chartIndex, index) {   
    if (container.length > 0 && this.activeTheme) {   
        var charts = container.find(this.barChart);
        
        if (this.activeTheme.data && this.activeTheme.years && charts.length > 0) {
            var data = this.activeTheme.data;
            var details = this.sectionDetails[chartIndex];
            var subData, nameLookup, chartData;             
            var chartLabel = "";
            
            if (details.timeVariable == "monthly") { 
                if (index > -1 && index < 12) {
                    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    chartLabel = months[index];
                } 
                else {
                    chartLabel = "Annual";
                }
            }
            else {
                if (index > -1) {
                    chartLabel = this.activeTheme.years[index];
                }
                else if (this.activeTheme.startYear == this.activeTheme.endYear) {
                    chartLabel = this.activeTheme.startYear;
                }
                else {
                    chartLabel = this.activeTheme.startYear + "–" + this.activeTheme.endYear;
                }
            }
            chartLabel = chartLabel + " totals " + details.titleLabel;
            
            if (data.hasOwnProperty(details.timeVariable) && this.activeTheme.hasOwnProperty(details.groupLookup)) {
                subData = data[details.timeVariable];
                nameLookup = this.activeTheme[details.groupLookup];
                
                if (subData.hasOwnProperty(details.groupVariable)) {
                    chartData = subData[details.groupVariable];                            
                }
            }
            
            if (chartData) {
                charts.empty();
                var chart = charts.get()[0];
                this.createBarChart(chart, chartData, nameLookup, index, chartLabel, details.color);
            }
        }
    }
}

ChartManager.prototype.updateMonthlyInteractiveChart = function (container, chartIndex, attribute, label, initialize) {   
    if (container.length > 0 && this.activeTheme) {   
        var charts = container.find(this.monthlyInteractiveChart);
        
        if (this.activeTheme.data && charts.length > 0) {
            var data = this.activeTheme.data;
            var details = this.sectionDetails[chartIndex];
            var subData, chartData;             
            
            if (data.hasOwnProperty(details.timeVariable)) {
                subData = data[details.timeVariable];
                
                if (subData.hasOwnProperty(details.groupVariable)) {
                    chartData = subData[details.groupVariable];                            
                }
            }
            
            if (chartData) {
                var index = -1;
                
                if (!initialize) {
                    var bars = charts.find(this.monthlyBar);
                    var activeBar = charts.find(this.monthlyBar + ".active");
                
                    if (activeBar.length > 0) {
                        index = bars.index(activeBar.eq(0));
                    }  
                }
                
                var chart = charts.get()[0];              
                charts.empty();
                
                if (attribute == "") {
                    this.createMonthlyBarChart(chart, chartData, attribute, index, details.chartLabel + " by month", details.color);
                }
                else if (chartData.hasOwnProperty(attribute)) {
                    this.createMonthlyBarChart(chart, chartData, attribute, index, label + " by month", details.color);
                }
                
            }
        }
    }
}

ChartManager.prototype.updateMonthlyChart = function (container, chartIndex, yearIndex) {   
    if (container.length > 0 && this.activeTheme) {   
        var charts = container.find(this.monthlyChart);
        var details = this.sectionDetails[chartIndex];
        
        if (this.activeTheme.data && this.activeTheme.years && charts.length > 0 && details.timeVariable == "annual") {
            var data = this.activeTheme.data;
            var subData, chartData;             
            var chartLabel = "";
            
            if (yearIndex > -1) {
                chartLabel = this.activeTheme.years[yearIndex];
            }
            else if (this.activeTheme.startYear == this.activeTheme.endYear) {
                chartLabel = this.activeTheme.startYear;
            }
            else {
                chartLabel = this.activeTheme.startYear + "–" + this.activeTheme.endYear;
            }
            var chartLabel = chartLabel + " totals by month"; 
            var activeYear = this.activeTheme.startYear + yearIndex;
            
            if (data.hasOwnProperty("monthly")) {
                subData = data["monthly"];
                
                if (subData.hasOwnProperty("year")) {
                    chartData = subData["year"];                            
                }
            }
            
            if (chartData) {
                charts.empty();
                var chart = charts.get()[0];
                this.createMonthlyBarChart(chart, chartData, activeYear, -1, chartLabel, details.color);
            }
        }
    }
}

ChartManager.prototype.createTimeSeriesChart = function (chart, data, years, yearIndex, variable, color) { 
    var yearCount = years.length;
    
    if (data.length != yearCount) {
        return;
    }
    
    function dotFunction (d,i) {
        if (i == yearIndex) {
            return "series-chart-dot " + color + " active";
        }
        else {
            return "series-chart-dot " + color;
        }    
    }
          
    function showTooltip(d,i) {
        tooltip.transition()
            .duration(200)		
            .style("visibility", "visible")
            .style("opacity", 1);	
        tooltip.html(years[i] + ": " + d3.format(',')(Number(d)))	 
            .style("left", (x(i) + margin.left) + "px")			 
            .style("top", (y(d/scaleFactor) + margin.top - 40) + "px");
    }
           
    function hideTooltip(d,i) {
        tooltip.transition()
            .duration(200)		
            .style("visibility", "hidden")
            .style("opacity", 0);
    }
    
    var svgWidth = 290; 
    var svgHeight = 270;    
    var min = d3.min(data, function(d) { return Number(d); }); 
    var max = d3.max(data, function(d) { return Number(d); }); 
    var scaleFactor = 1;
    var scaleFactorText = "";
    var commaFormat = d3.format(",");
        
    if (max >= 10000000000) {
        scaleFactor = 1000000000;
        scaleFactorText = "(x 1,000,000,000)";
    }
    else if (max >= 10000000) {
        scaleFactor = 1000000;
        scaleFactorText = "(x 1,000,000)";
    }
    else if (max >= 10000) {
        scaleFactor = 1000;
        scaleFactorText = "(x 1,000)";
    }

    max = max/scaleFactor;
    min = min/scaleFactor;   
    var minAdjusted = min - (max - min) * 0.4;
    var maxAdjusted = max + (max - min) * 0.4;
    
    var margin = {top: 50, right: 20, bottom: 26, left: 40},
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    var y = d3.scaleLinear()        
        .domain([minAdjusted, maxAdjusted])
        .range([height, 0]);
    
    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5)
        .tickSize(6)
        .tickPadding(4);
        
    var x = d3.scaleLinear()        
        .domain([0, yearCount])
        .range([0, width]);

    var valueline = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d/scaleFactor); });
    
    var svg = d3.select(chart).append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(5)
        .tickFormat(function(d) { return years[d]; })
        .tickSize(6)
        .tickPadding(4);
        
    // Add the data lines and points
    var path = svg.append("path")
        .attr("d", valueline(data))
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("class", "series-chart-path " + color);

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 7)
        .attr("stroke-width", 0)
        .attr("cx", function(d,i) { return x(i); })
        .attr("cy", function(d) { return y(d/scaleFactor); })
        .attr("class", dotFunction)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
           
    var tooltip = d3.select(chart)
        .append("div")
        .attr("class", "series-tooltip")
        .style("opacity", 0);
          
    svg.append("g")
        .attr("class", "series-chart-axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "series-chart-axis y-axis")
        .call(yAxis);
        
    svg.append("text")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "15px")
        .attr("class", this.variableLabel.substring(1))
        .style("text-anchor", "start")
    .append("tspan")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left)
        .attr("dy", "1em")
        .text(variable)  
    .append("tspan")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left)
        .attr("dy", "2.1em")
        .text(scaleFactorText); 
}

ChartManager.prototype.createBarChart = function (chart, data, nameLookup, yearIndex, yearLabel, color) {
    var totals = [];
    var totalsSub = [];
    var barCount = 0;
    var barWidth = 16;
    var barGap = 4;
    var subCount = 10;
    var total = 0;
    var subtotal = 0;
    var commaFormat = d3.format(",");
    var name, textClass, obj, value, otherTotal;
    
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (yearIndex > -1 && yearIndex < data[key].length) {            
                value = Number(data[key][yearIndex]);
            }
            else {
                value = d3.sum(data[key], function(d) { return Number(d); });
            }
            name = "";
            textClass = "non-zero";
                        
            if (nameLookup.hasOwnProperty(key)) name = nameLookup[key];
            if (value == 0) textClass = "zero";
            
            if (key != "total") {        
                obj = {
                    code: key,
                    name: name,
                    textClass: textClass,
                    value: value
                };
                totals.push(obj);
                total = total + value;
                barCount++;
            }
        }
    }
    totals.sort(function(a, b){ 
        if (b.value == a.value) {
            return a.name.localeCompare(b.name);
        }
        else {
            return b.value - a.value;
        }
    });
    
    if (barCount < subCount) subCount = barCount;
    
    for (var i = 0; i < subCount; i++) {
        subtotal = subtotal + totals[i].value;
        totalsSub.push(totals[i]);
    }
    
    otherTotal = total - subtotal;
    textClass = "non-zero";
    if (otherTotal == 0) textClass = "zero";
    
    obj = {
        code: "other",
        name: "Other",
        textClass: textClass,
        value: otherTotal
    };
    
    totalsSub.push(obj);
             
    function showTooltip(d,i) {
        tooltip.transition()
            .duration(200)	
            .style("visibility", "visible")
            .style("opacity", 1);	
        tooltip.html(d3.format(',')(d.value))	 
            .style("left", (margin.left + 10) + "px")			 
            .style("top", (y(i) + margin.top) + "px");
    }
           
    function hideTooltip(d,i) {
        tooltip.transition()
            .duration(200)		
            .style("visibility", "hidden")
            .style("opacity", 0);
    }
    
    var min = d3.min(totalsSub, function(d) { return d.value; });
    var max = d3.max(totalsSub, function(d) { return d.value; }); 
    var scaleFactor = 1;
    var scaleFactorText = "";
     
    if (max >= 1000000000) {
        scaleFactor = 1000000000;
        scaleFactorText = "(x 1,000,000,000)";
    }
    else if (max >= 1000000) {
        scaleFactor = 1000000;
        scaleFactorText = "(x 1,000,000)";
    }
    else if (max >= 1000) {
        scaleFactor = 1000;
        scaleFactorText = "(x 1,000)";
    }

    max = max/scaleFactor;
    min = min/scaleFactor;
    var maxAdjusted = max + (max - min) * 0.05; 
    
    var svgWidth = 290; 
    var svgHeight = 270;

    var margin = {top: 50, right: 10, bottom: 0, left: 180},
        width = svgWidth - margin.left - margin.right,
        height = (subCount + 1) * (barWidth + barGap);
    
    var x = d3.scaleLinear()
        .domain([0, maxAdjusted])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, subCount + 1.5])
        .range([0, height]);

    var svg = d3.select(chart).append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".chart-bar")
        .data(totalsSub)
        .enter()
        .append("g")
        .attr("class", "chart-bar " + color);
           
    var tooltip = d3.select(chart)
        .append("div")
        .attr("class", "bar-tooltip")
        .style("opacity", 0);
        
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(3)
        .tickSize(-6)
        .tickPadding(-16);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(subCount)
        .tickFormat("")
        .tickSize(0)
        .tickPadding(0);
        
    svg.append("g")
        .attr("class", "bar-chart-axis")
        .call(xAxis);
        
    svg.append("g")
        .attr("class", "bar-chart-axis")
        .call(yAxis);

    bar.append("rect")        
        .attr("x", 0)
        .attr("y", function(d,i) { return y(i) + barGap*2; })
        .attr("width", function(d) { return x(d.value/scaleFactor); })
        .attr("height", barWidth);
        
    bar.append("text")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "12px")
        .attr("class", function(d) { return d.textClass; })
        .attr("dy", "0.4em")
        .attr("x", -4)
        .attr("y", function(d,i) { return y(i) + barGap*2 + barWidth/2; })
        .attr("text-anchor", "end")
        .attr("code", function(d) { return d.code; })
        .text(function(d) { return d.name; })
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
        
    svg.append("text")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "15px")
        .attr("class", this.variableLabel.substring(1))
        .attr("dy", "1em")
        .style("text-anchor", "start")
    .append("tspan")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left)
        .attr("dy", "1em")
        .text(yearLabel)
    .append("tspan")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left)
        .attr("dy", "2.1em")
        .text(scaleFactorText); 
}

ChartManager.prototype.createMonthlyBarChart = function (chart, data, variable, index, chartLabel, color) {
    var labels = ["J","F","M","A","M","J","J","A","S","O","N","D"];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var totals = [0,0,0,0,0,0,0,0,0,0,0,0];
    var barCount = 12;
    var barWidth = 16;
    var barGap = 4;
    var commaFormat = d3.format(",");
    
    if (variable < 0 || !data.hasOwnProperty(variable)) {
        for (var i = 0; i < 12; i++) {
            totals[i] = Number(data["total"][i]);
        }
    }
    else {
        for (var i = 0; i < 12; i++) {
            totals[i] = Number(data[variable][i]);
        }
    }
      
    function barFunction (d,i) {
        if (i == index) {
            return "chart-bar " + color + " active";
        }
        else {
            return "chart-bar " + color;
        }    
    }
          
    function showTooltip(d,i) {
        tooltip.transition()
            .duration(200)	
            .style("visibility", "visible")
            .style("opacity", 1);	
        tooltip.html(months[i] + ": " + d3.format(',')(d))	 
            .style("left", (x(i) + margin.left) + "px")			 
            .style("top", (y(d/scaleFactor) + margin.top - 20) + "px");
    }
           
    function hideTooltip(d,i) {
        tooltip.transition()
            .duration(200)		
            .style("visibility", "hidden")
            .style("opacity", 0);
    }
      
    var svgWidth = 290; 
    var svgHeight = 270; 
    var min = d3.min(totals);
    var max = d3.max(totals); 
    var scaleFactor = 1;
    var scaleFactorText = "";
     
    if (max >= 1000000000) {
        scaleFactor = 1000000000;
        scaleFactorText = "(x 1,000,000,000)";
    }
    else if (max >= 1000000) {
        scaleFactor = 1000000;
        scaleFactorText = "(x 1,000,000)";
    }
    else if (max >= 1000) {
        scaleFactor = 1000;
        scaleFactorText = "(x 1,000)";
    }

    max = max/scaleFactor;
    min = min/scaleFactor;       
    var maxAdjusted = max + (max - min) * 0.3;
    
    var margin = {top: 50, right: 20, bottom: 26, left: 40},
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;
    
    var x = d3.scaleLinear()
        .domain([-0.5, 11.5])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, maxAdjusted])
        .range([height, 0]);

    var svg = d3.select(chart).append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var bar = svg.selectAll(".chart-bar")
        .data(totals)
        .enter()
        .append("g")
        .attr("class", barFunction);
           
    var tooltip = d3.select(chart)
        .append("div")
        .attr("class", "series-tooltip")
        .style("opacity", 0);
 
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(12)
        .tickFormat(function(d,i) { return labels[i]; })
        .tickSize(6)
        .tickPadding(4);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5)
        .tickSize(6)
        .tickPadding(4);
         
    svg.append("g")
        .attr("class", "bar-chart-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        
    svg.append("g")
        .attr("class", "bar-chart-axis")
        .call(yAxis);

    bar.append("rect")        
        .attr("x", function(d,i) { return x(i) - barWidth/2; })
        .attr("y", function(d) { return y(d/scaleFactor); })
        .attr("width", barWidth)
        .attr("height", function(d) { return height - y(d/scaleFactor); })
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
        
    svg.append("text")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "15px")
        .attr("class", this.variableLabel.substring(1))
        .attr("dy", "1em")
        .style("text-anchor", "start")
    .append("tspan")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left)
        .attr("dy", "1em")
        .text(chartLabel)
    .append("tspan")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left)
        .attr("dy", "2.1em")
        .text(scaleFactorText); 
}

ChartManager.prototype.traverseTimeSeriesBackward = function (section) { 
    if (section.length > 0) { 
        var container = section.parents(this.container);
        var chartIndex = container.find(this.section).index(section);
        
        if (chartIndex > -1 && chartIndex < this.sectionDetails.length) {
            if (this.sectionDetails[chartIndex].timeVariable == "monthly") {
                var parentChart = section.find(this.monthlyInteractiveChart);
                var bars = parentChart.find(this.monthlyBar);
                var activeBar = parentChart.find(this.monthlyBar + ".active");
                var index = -1;
                
                if (bars.length > 0) {    
                    var baseClass = bars.eq(0).attr("class").replace("active", "");
                    var activeClass = baseClass + " active";
                    
                    if (activeBar.length > 0) {
                        index = bars.index(activeBar.eq(0));
                    }
                    
                    bars.attr("class", baseClass);
                    index--;
                    
                    if (index < -1) {
                        index = 11;
                    }
                    if (index > -1) {                
                        var activeBar = bars.eq(index);            
                        activeBar.attr("class", activeClass);
                    }
                    
                    this.updateBarChart(section, chartIndex, index);
                } 
            }
            else {        
                var parentChart = section.find(this.seriesChart);
                var dots = parentChart.find(this.dot);
                var activeDot = parentChart.find(this.dot + ".active");
                var index = -1;
                
                if (dots.length > 0) {    
                    var baseClass = dots.eq(0).attr("class").replace("active", "");
                    var activeClass = baseClass + " active";
                    
                    if (activeDot.length > 0) {
                        index = dots.index(activeDot.eq(0));
                    }
                    
                    dots.attr("class", baseClass);
                    index--;
                    
                    if (index < -1) {
                        index = this.activeTheme.years.length - 1;
                    }
                    if (index > -1) {                
                        var activeDot = dots.eq(index);            
                        activeDot.attr("class", activeClass);
                    }
                    
                    this.updateBarChart(section, chartIndex, index);
                    this.updateMonthlyChart(section, chartIndex, index);
                } 
            }
        }
    }
}

ChartManager.prototype.traverseTimeSeriesForward = function (section) { 
    if (section.length > 0) {        
        var container = section.parents(this.container);
        var chartIndex = container.find(this.section).index(section);
        
        if (chartIndex > -1 && chartIndex < this.sectionDetails.length) {
            if (this.sectionDetails[chartIndex].timeVariable == "monthly") {
                var parentChart = section.find(this.monthlyInteractiveChart);
                var bars = parentChart.find(this.monthlyBar);
                var activeBar = parentChart.find(this.monthlyBar + ".active");
                var index = -1;
                
                if (bars.length > 0) {    
                    var baseClass = bars.eq(0).attr("class").replace("active", "");
                    var activeClass = baseClass + " active";
                    
                    if (activeBar.length > 0) {
                        index = bars.index(activeBar.eq(0));
                    }
                    
                    bars.attr("class", baseClass);
                    index++;
                    
                    if (index > 11) {
                        index = -1;
                    }
                    else {                
                        var activeBar = bars.eq(index);            
                        activeBar.attr("class", activeClass);
                    }
                           
                    this.updateBarChart(section, chartIndex, index);
                }
            }
            else {  
                var parentChart = section.find(this.seriesChart);
                var dots = parentChart.find(this.dot);
                var activeDot = parentChart.find(this.dot + ".active");
                var index = -1;
                
                if (dots.length > 0) {    
                    var baseClass = dots.eq(0).attr("class").replace("active", "");
                    var activeClass = baseClass + " active";
                    
                    if (activeDot.length > 0) {
                        index = dots.index(activeDot.eq(0));
                    }
                    
                    dots.attr("class", baseClass);
                    index++;
                    
                    if (index > this.activeTheme.years.length - 1) {
                        index = -1;
                    }
                    else {                
                        var activeDot = dots.eq(index);            
                        activeDot.attr("class", activeClass);
                    }
                           
                    this.updateBarChart(section, chartIndex, index);
                    this.updateMonthlyChart(section, chartIndex, index);
                }
            }
        }
    }
}

ChartManager.prototype.showChartPopup = function (chart) {  
    var popup = $(this.chartPopup);
    var canvas = $(this.chartPopupCanvas);
    
    if (chart.length > 0 && popup.length > 0 && canvas.length > 0) { 
        var canvasElement = canvas.get()[0];
        var callback = function() {
            canvasElement.toDataURL();
        }
        
        this.chartToImage(chart, canvasElement, callback);
        popup.addClass("active");
        $(this.chartPopupCloseButton).focus();
    }
}


ChartManager.prototype.chartToImage = function (chart, canvas, callback) { 
    if (chart.length > 0) { 
        var svg = chart.get()[0];
        var serializer = new XMLSerializer(); 
        var svgStr = serializer.serializeToString(svg);
        var img  = new Image();
        var width = 600;
        var height = 579;
        var icon = new Image(80, 55);
        var context = canvas.getContext("2d");
        
        canvas.width = width;
        canvas.height = height;
        
        icon.onload = function(){
            context.save();
            context.globalAlpha = 0.1;
            context.drawImage(this, 189, 214, 222, 152);
            context.restore();
        }
        
        img.onload = function(){
            context.drawImage(this, 0, 0, width, height);
            callback();
        }
        
        icon.src = "icons/USDA-logo.png";
        img.src = 'data:image/svg+xml;base64,'+window.btoa(unescape(encodeURIComponent(svgStr)));
    }
}


var Tour = function (openSelector, stopContainerSelector, stopNumberSelector, 
    stopNarativeSelector, nextStopSelector, previousStopSelector, closeSelector,
    startBookendSelector, endBookendSelector) {
    
    this.openButton = openSelector;
    this.stopContainer = stopContainerSelector;
    this.stopNumber = stopNumberSelector;
    this.stopNarrative = stopNarativeSelector;
    this.nextStopButton = nextStopSelector;
    this.previousStopButton = previousStopSelector;
    this.closeButton = closeSelector;
    this.startBookEnd = startBookendSelector;
    this.endBookend = endBookendSelector;
    this.stops = [];
    this.currentStop = -1;
           
    $(this.openButton).click({obj: this}, function (event) {
        event.data.obj.show();
    });

    $(this.openButton).keydown({obj: this}, function (event) {       
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.show();
        }
    });
 
    $(this.nextStopButton).click({obj: this}, function (event) {
        event.stopPropagation();
        event.data.obj.nextStop();
    });
       
    $(this.nextStopButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            event.data.obj.nextStop();
        }  
    });
    
    $(this.previousStopButton).click({obj: this}, function (event) {
        event.stopPropagation();
        event.data.obj.previousStop();
    });
             
    $(this.previousStopButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            event.data.obj.previousStop();
        }  
    });
       
    $(this.closeButton).click({obj: this}, function (event) {
        event.stopPropagation();
        event.data.obj.hide();
    });   
    
    $(this.closeButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            var t = event.data.obj;
            t.hide();
            $(t.openButton).focus();
        }  
    }); 
    
    $(this.startBookend).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            var t = event.data.obj;
            $(t.closeButton).focus();
        }  
    });  
    
    $(this.endBookend).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            var t = event.data.obj;
            $(t.previousStopButton).focus();
        }  
    });      
}

Tour.prototype.addStop = function (anchorElement, narrative, enterAction, leaveAction) {  
    var stop = {
        anchorElement: anchorElement,
        narrative: narrative,
        enterAction: enterAction,
        leaveAction: leaveAction
    };
    this.stops.push(stop);
}

Tour.prototype.show = function () { 
    var stopCount = this.stops.length;
    var stop;
    this.currentStop = -1;

    for (var i = 0; i < stopCount; i++) {
        stop = this.stops[i];
        $(stop.anchorElement).show();
    }
    
    if (this.controller) this.controller.hideThemePanel();
    this.nextStop();
}

Tour.prototype.hide = function () { 
    var stopCount = this.stops.length;
    var stop;
    this.currentStop = -1;
    
    for (var i = 0; i < stopCount; i++) {
        stop = this.stops[i];
        $(stop.anchorElement).hide();
    }
    
    $(this.stopNumber).empty();
    $(this.stopNarrative).empty();
    this.currentStop = -1;
}

Tour.prototype.nextStop = function () { 
    var stop;
    
    if (this.currentStop > -1 && this.currentStop < this.stops.length) {
        stop = this.stops[this.currentStop];
        if (stop.leaveAction) stop.leaveAction();
    }
    this.currentStop = this.currentStop + 1;
    
    if (this.currentStop < 0 || this.currentStop >= this.stops.length) {
        this.currentStop = 0;
    }
      
    var stop = this.stops[this.currentStop];
    var stopContainer = $(this.stopContainer);
    $(this.stopNumber).html(this.currentStop + 1);
    $(this.stopNarrative).html(stop.narrative);
    $(stop.anchorElement).append(stopContainer); 
    if (stop.enterAction) stop.enterAction(); 
    $(this.nextStopButton).focus();  
}

Tour.prototype.previousStop = function () { 
    var stop;
    
    if (this.currentStop > -1 && this.currentStop < this.stops.length) {
        stop = this.stops[this.currentStop];
        if (stop.leaveAction) stop.leaveAction();
    }    
    this.currentStop = this.currentStop - 1;
    
    if (this.currentStop < 0 || this.currentStop >= this.stops.length) {
        this.currentStop = this.stops.length - 1;
    }
      
    stop = this.stops[this.currentStop];
    var stopContainer = $(this.stopContainer);
    $(this.stopNumber).html(this.currentStop + 1);
    $(this.stopNarrative).html(stop.narrative);
    $(stop.anchorElement).append(stopContainer);
    if (stop.enterAction) stop.enterAction(); 
    $(this.previousStopButton).focus();  
}


var UserSurvey = function (overlaySelector, containerSelector, openSelector, closeSelector, bookendSelector) {  
    this.overlay = overlaySelector;
    this.container = containerSelector;
    this.openButton = openSelector;
    this.closeButton = closeSelector; 
    this.bookend = bookendSelector;
       
    $(this.openButton).click({obj: this}, function (event) {
        event.stopPropagation();
        var s = event.data.obj;
        $(s.overlay).addClass("active");   
        $(s.closeButton).focus();
    });
       
    $(this.openButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            $(this).trigger("click");
        }  
    });  
    
    $(this.closeButton).click({obj: this}, function (event) {
        event.stopPropagation();
        var s = event.data.obj;
        $(s.overlay).removeClass("active");
        $(s.openButton).focus();
    });
    
    $(this.closeButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            $(this).trigger("click");
        }  
    });  
    
    $(this.bookend).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            var s = event.data.obj;
            $(s.overlay).removeClass("active");
            $(s.openButton).focus();
        }  
    });     
}


var DownloadManager = function (
    overlaySelector, openSelector, closeSelector, detailsToggleSelector,
    detailsSelector, metricSelector, countySelector, yearSelector, monthSelector, 
    commoditySelector, causeSelector, formatSelector, submitSelector, bookendSelector) {  
    
    this.overlay = overlaySelector;
    this.openButton = openSelector;
    this.closeButton = closeSelector;
    this.detailsToggle = detailsToggleSelector;
    this.details = detailsSelector;
    this.metricOption = metricSelector; 
    this.countyOption = countySelector; 
    this.yearOption = yearSelector; 
    this.monthOption = monthSelector; 
    this.commodityOption = commoditySelector; 
    this.causeOption = causeSelector; 
    this.formatMenu = formatSelector; 
    this.submitButton = submitSelector; 
    this.bookend = bookendSelector;
       
    $(this.openButton).click({obj: this}, function (event) {
        event.stopPropagation();
        var s = event.data.obj;
        $(s.overlay).addClass("active");   
        $(s.closeButton).focus();
        s.onOpen();
    });
       
    $(this.openButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            $(this).trigger("click");
        }  
    });  
    
    $(this.closeButton).click({obj: this}, function (event) {
        event.stopPropagation();
        var s = event.data.obj;
        $(s.overlay).removeClass("active");
        $(s.openButton).focus();
    });
    
    $(this.closeButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            $(this).trigger("click");
        }  
    });  
     
    $(this.detailsToggle).click({obj: this}, function (event) {
        var s = event.data.obj;
        $(this).toggleClass("active");
        $(s.details).toggle();
    });
    
    $(this.detailsToggle).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            var s = event.data.obj;
            $(this).toggleClass("active");
            $(s.details).toggle();
        }  
    });  
     
    $(this.submitButton).click({obj: this}, function (event) {
        event.stopPropagation();
        var s = event.data.obj;
        $(s.overlay).removeClass("active");
        $(s.openButton).focus();
        s.requestData();
    });
    
    $(this.submitButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            $(this).trigger("click");
        }  
    });  
    
    $(this.bookend).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            var s = event.data.obj;
            $(s.overlay).removeClass("active");
            $(s.openButton).focus();
        }  
    });     
}

DownloadManager.prototype.onOpen = function () { 
    var c = this.controller;
    
    if (c) {
        if (c.themeManager) {
            var activeTheme = c.themeManager.getActiveTheme();
            var selections = c.map.getSelectedFeatureList();
            
            if (activeTheme) {
                $(this.metricOption).each(function() {
                    if ($(this).val() == activeTheme.metric) $(this).prop("checked", true);
                });
            }
            
            if (selections == "") {
                $(this.monthOption).prop("checked",false).prop("disabled",true);
                $(this.commodityOption).prop("checked",false).prop("disabled",true);
                $(this.causeOption).prop("checked",false).prop("disabled",true);
            }
            else {
                $(this.monthOption).prop("disabled",false);
                $(this.commodityOption).prop("disabled",false);
                $(this.causeOption).prop("disabled",false);
            }
        }
    } 
}

DownloadManager.prototype.requestData = function () { 
    var c = this.controller;
    
    if (c) {
        if (c.map && c.themeManager) { 
            var activeTheme = c.themeManager.getActiveTheme();
            
            if (activeTheme) {
                var startYear = activeTheme.startYear;
                var endYear = activeTheme.endYear;
                var commodities = activeTheme.commodities; 
                var causes = activeTheme.causes;
                var measure = activeTheme.measure;
                var unit = activeTheme.reportingUnit;
                var selections = c.map.getSelectedFeatureList();
                var unitID = "";
                var metricList = "";
                var countyColumn = "no";
                var yearColumn = "no";
                var monthColumn = "no";
                var commodityColumn = "no";
                var causeColumn = "no";
                
                if (selections.length > 0) {
                    unitID = selections[0];
                }
                
                $(this.metricOption + ":checked").each(function() {
                    metricList = metricList + $(this).val() + "|";
                });
                
                if (metricList != "") {
                    metricList = metricList.substring(0, metricList.length - 1);
                }
                
                if ($(this.countyOption).is(":checked")) {
                    countyColumn = "yes";
                }
                if ($(this.yearOption).is(":checked")) {
                    yearColumn = "yes";
                }
                if ($(this.monthOption).is(":checked")) {
                    monthColumn = "yes";
                }
                if ($(this.commodityOption).is(":checked")) {
                    commodityColumn = "yes";
                }
                if ($(this.causeOption).is(":checked")) {
                    causeColumn = "yes";
                }
                    
                var params = {
                    metrics: metricList,
                    startYear: startYear,
                    endYear: endYear,
                    commodities: commodities, 
                    causes: causes,
                    measurementUnit: measure,
                    reportingUnit: unit,
                    reportingUnitID: unitID,
                    countyColumn: countyColumn,
                    yearColumn: yearColumn,
                    monthColumn: monthColumn,
                    commodityColumn: commodityColumn,
                    causeColumn: causeColumn,
                    format: $(this.formatMenu).val()
                };   
      
                var url = "payment-formatted-data.php?" + $.param(params);
                window.location.href = url;
            }
        }
    } 
}


var controller = new ContentController (
    "#content",
    "#header-menu",
    "#header-links a",
    "#header-links span",
    "#load-overlay",
    "#content-loader",
    "#map-container",
    "#theme-container",
    "#theme-header",
    "#theme-page",
    "#chart-page", 
    "#theme-button",
    "#chart-button", 
    "#theme-one-form", 
    "#theme-two-form",
    "#theme-one-charts", 
    "#theme-two-charts"
);

var rmaMap = new RMAMap (
    "#map-container", 
    "#rma-map",
    "#map-layer-one-option",
    "#map-layer-two-option",
    "#map-theme-metric", 
    ".selection-title h3",
    "#map-legend",
    ".map-legend-item",
    ".map-legend-box",
    ".map-legend-label",
    "#map-popup",
    "#map-resize-button",
    "#search-container",
    "#search-box-wrapper",
    "#search-box",
    "#search-button",
    "#search-close-button"
);

var themeManager = new ThemeManager (
    "#theme-content",
    "#theme-form-container",
    ".theme-form", 
    ".theme-parameter", 
    ".theme-form-section",
    "scrollable",
    "truncated",
    "#metric-details", 
    "#date-details",
    "#commodity-details",
    "#cause-details",
    "#setting-details",
    ".option-list",
    ".metric-option-list li", 
    ".year-option-list li",
    ".commodity-option-list li",
    ".cause-option-list li",
    ".all-option",
    ".map-class-count-menu", 
    ".map-class-method-menu",  
    ".map-measurement-unit-menu",
    ".reporting-unit-menu",
    "#theme-form-clear-button",
    "#theme-form-update-button",
    "#theme-form-cancel-button",
    ".theme-bookend"
);

var chartManager = new ChartManager (
    "#chart-page",   
    ".chart-section-container",   
    ".chart-time-option",
    ".chart-section",  
    ".chart-title",  
    ".chart-wrapper",  
    ".series-chart", 
    ".bar-chart", 
    ".monthly-interactive-chart",
    ".monthly-chart",     
    ".chart-variable-label",
    ".chart-export-button", 
    ".chart-bar text",
    ".series-chart-dot", 
    ".chart-bar",
    ".series-chart-previous-button",
    ".series-chart-next-button",
    ".series-chart-clear-button",
    ".bar-chart-clear-button",
    ".monthly-chart-clear-button",
    "#chart-overlay",
    "#chart-popup-canvas",
    "#chart-popup-close-button"
);

var tour = new Tour ( 
    "#tour-button",
    "#tour-stop-container",   
    "#tour-stop-number",   
    "#tour-stop-narrative",  
    "#tour-next-stop-button",
    "#tour-previous-stop-button", 
    "#tour-close-button",
    "#tour-start-bookend",
    "#tour-end-bookend"
);

tour.addStop(
    "#tour-layer-anchor",
    "Toggle between two customizeable data layers by clicking on the Layer One or Layer Two option.",
    null,
    null
);

tour.addStop(
    "#tour-map-anchor",
    "Click on a county or state to view data specific to that map feature. Select multiple counties by holding down the Ctrl key, and select all counties by clicking on an area outside of U.S. boundaries.",
    null,
    null
);

tour.addStop(
    "#tour-search-anchor",
    "Search for and select a state or county by name.",
    null,
    null
);

tour.addStop(
    "#tour-layer-details-anchor",
    "Details about the selected data layer are shown on the Now Viewing panel. Modify data layer parameters (e.g., commodity) by clicking on the parameter name and choosing from available options.",
    function () { if (controller) $(controller.themeContainer).addClass("expanded") },
    function () { if (controller) $(controller.themeContainer).removeClass("expanded") }
);

tour.addStop(
    "#tour-selection-details-anchor",
    "View additional details about the selected map feature by clicking on the View Selection Details (chart) icon. A panel containing several interactive charts will be displayed. Return to the Now Viewing panel by clicking on the View Layer Details (map) icon.",
    function () { if (controller) $(controller.themeContainer).addClass("expanded") },
    function () { if (controller) $(controller.themeContainer).removeClass("expanded") }
);

tour.addStop(
    "#tour-map-settings-anchor",
    "Change how data is displayed on the map by clicking on the Map Settings option. For example, data can be reported by either state or county.",
    function () { if (controller) $(controller.themeContainer).addClass("expanded") },
    function () { if (controller) $(controller.themeContainer).removeClass("expanded") }
);

var userSurvey = new UserSurvey (
    "#survey-overlay", 
    "#survey-container-frame",
    "#survey-button",   
    "#survey-close-button",
    ".survey-bookend"
);

var downloadManager = new DownloadManager (
    "#download-overlay",    
    ".data-button",
    "#download-close-button",
    "#download-message-details-toggle",
    "#download-message-details",
    "#download-container input[name='metric']",
    "#download-container input[name='county']", 
    "#download-container input[name='year']", 
    "#download-container input[name='month']", 
    "#download-container input[name='commodity']", 
    "#download-container input[name='cause']", 
    "#download-format-menu",
    "#download-button", 
    ".download-bookend"
);

controller.addThemeManager(themeManager);
controller.addMap(rmaMap);
controller.addChartManager(chartManager);
controller.addTour(tour);
controller.addUserSurvey(userSurvey);
controller.addDownloadManager(downloadManager);
controller.loadContent(); 

var qs = decodeURI(location);
var tourTag = qs.indexOf("#tour");
if (tourTag > -1) tour.show();