var ContentController = function (
    contentSelector, shiftedClass, themeContainerSelector, themeOneFormSelector, 
    themeTwoFormSelector, themeFormCloseSelector, chartContainerSelector,
    themeOneChartsSelector, themeTwoChartsSelector, chartCloseSelector, 
    mapOverlaySelector) {
    
    this.content = contentSelector;
    this.shiftedClass = shiftedClass;
    this.themeContainer = themeContainerSelector;
    this.themeOneForm = themeOneFormSelector;
    this.themeTwoForm = themeTwoFormSelector;
    this.themeFormCloseButton = themeFormCloseSelector;
    this.chartContainer = chartContainerSelector;
    this.themeOneCharts = themeOneChartsSelector;
    this.themeTwoCharts = themeTwoChartsSelector;
    this.chartCloseButton = chartCloseSelector;
    this.mapOverlay = mapOverlaySelector;
    this.themeManager = null;
    this.map = null;
    this.chartManager = null;
               
    $(this.themeFormCloseButton).click({obj: this}, function (event) {
        var controller = event.data.obj; 
        $(controller.content).removeClass(controller.shiftedClass);
    });  
               
    $(this.themeFormCloseButton).keydown({obj: this}, function (event) {
        var controller = event.data.obj; 
         
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(controller.content).removeClass(controller.shiftedClass);
        }
    });  
        
    $(this.chartCloseButton).click({obj: this}, function (event) {
        var controller = event.data.obj; 
        $(controller.content).removeClass(controller.shiftedClass);
    });  
        
    $(this.chartCloseButton).keydown({obj: this}, function (event) {
        var controller = event.data.obj; 
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(controller.content).removeClass(controller.shiftedClass);
        }
    });  
    
    $(this.mapOverlay).click({obj: this}, function (event) {
        var controller = event.data.obj; 
        $(controller.content).removeClass(controller.shiftedClass);
    }); 
    
    $(this.mapOverlay).keydown({obj: this}, function (event) {
        var controller = event.data.obj; 
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            $(controller.content).removeClass(controller.shiftedClass);
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

ContentController.prototype.addSearchBox = function (searchContainerSelector, searchBoxSelector) {  
    if (this.map) {
        var counties = this.map.getCounties();
        
        if (counties.length > 0) {
            this.searchBox = new SearchBox (searchContainerSelector, searchBoxSelector, counties);
        }
    }
}

ContentController.prototype.loadContent = function () { 
    if (this.map) this.map.loadMap();
}

ContentController.prototype.toggleMap = function () { 
}

ContentController.prototype.showThemeManager = function () { 
    if (this.themeManager) {    
        $(this.chartContainer).hide();
        $(this.themeContainer).show();
        
        if (!$(this.content).hasClass(this.shiftedClass)) {
            $(this.content).addClass(this.shiftedClass);
        }
    }
}

ContentController.prototype.closeThemeManager = function () { 
    $(this.content).removeClass(controller.shiftedClass);
}

ContentController.prototype.showChartManager = function () {  
    if (this.chartManager) {
        this.chartManager.startLoadAnimation();
        $(this.themeContainer).hide();
        $(this.chartContainer).show();
            
        if (!$(this.content).hasClass(this.shiftedClass)) {
            $(this.content).addClass(this.shiftedClass);
        }
    }
}

ContentController.prototype.closeChartManager = function () { 
    $(this.content).removeClass(controller.shiftedClass);
}

ContentController.prototype.toggleTheme = function (themeNumber) { 
    if (this.themeManager && (themeNumber == 1 || themeNumber == 2)) {
        if (themeNumber == 1) {
            $(this.themeTwoForm).hide();
            $(this.themeOneForm).show();
            $(this.themeTwoCharts).hide();
            $(this.themeOneCharts + ".active").show();
        }
        else if (themeNumber == 2) {
            $(this.themeOneForm).hide();
            $(this.themeTwoForm).show();
            $(this.themeOneCharts).hide();
            $(this.themeTwoCharts + ".active").show();
        }        
        this.themeManager.setThemeNumber(themeNumber);
    }
}

ContentController.prototype.updateCharts = function (themeNumber, selections, selectionName) {     
    if (this.chartManager) {
        if ($(this.chartContainer).css("display") != "none") {
            this.chartManager.fetchChartData(themeNumber, selections, selectionName);
        }
    }
}

var Content = function () { 
    this.controller = null;
}


var RMAMap = function (
    containerSelector, mapSelector, mapOverlaySelector, mapLoaderSelector, themeSelector, 
    themeOneSelector, themeTwoSelector, modifyThemeSelector, viewChartSelector, 
    themeTitleSelector, themeTimeFrameSelector, themeCaptionSelector, 
    legendSelector, legendToggleSelector, legendItemSelector, legendBoxSelector, 
    legendLabelSelector, popupSelector, searchBoxContainerSelector, searchBoxSelector,
    aggregationUnitSelector) { 

    // Element selector names
    this.container = containerSelector; 
    this.map = mapSelector;
    this.mapOverlay = mapOverlaySelector;
    this.mapLoader = mapLoaderSelector;
    this.themeInfo = themeSelector;
    this.themeOneLabel = themeOneSelector;
    this.themeTwoLabel = themeTwoSelector;
    this.modifyThemeButton = modifyThemeSelector;
    this.viewChartButton = viewChartSelector;
    this.themeTitle = themeTitleSelector;
    this.themeTimeFrame = themeTimeFrameSelector;
    this.themeCaption = themeCaptionSelector;
    this.legend = legendSelector;
    this.legendToggle = legendToggleSelector;
    this.legendItem = legendItemSelector;
    this.legendBox = legendBoxSelector;
    this.legendLabel = legendLabelSelector;
    this.popupContainer = document.getElementById(popupSelector.substring(1));
    this.searchBoxContainer = searchBoxContainerSelector;
    this.searchBox = searchBoxSelector;
    this.aggregationUnitMenu = aggregationUnitSelector;
     
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
        timeFrame: "Not specified",
        data: [],
        digitCount: 0,
        styleClasses: [],        
        aggregationUnit: "county",
        labelResolution: 1000
    }
          
    this.themeTwo = {  
        loaded: false,    
        name: "Not specified",
        timeFrame: "Not specified",
        data: [],
        digitCount: 0,
        styleClasses: [],
        aggregationUnit: "county",
        labelResolution: 1000
    }
    
    this.activeTheme = this.themeOne;
    this.currentTheme = "";  
    this.currentThemeNumber = 1;
    this.mapLoaded = false;
    this.searchBoxReady = false;
    $(this.aggregationUnitMenu).eq(0).prop("checked", true);
        
    $(this.legendToggle).click({obj: this}, function (event) {
        var map = event.data.obj;
        if ($(map.legend).css("display") == "none") {
            $(this).text("Hide legend");
            $(map.legend).removeClass("hidden");
        }
        else {
            $(this).text("Show legend");
            $(map.legend).addClass("hidden");
        }
    });  
           
    $(this.legendToggle).keydown({obj: this}, function (event) {
        var map = event.data.obj;
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            if ($(map.legend).css("display") == "none") {
                $(this).text("Hide legend");
                $(map.legend).removeClass("hidden");
            }
            else {
                $(this).text("Show legend");
                $(map.legend).addClass("hidden");
            }
        }
    });  
    
    $(this.searchBox).click({obj: this}, function (event) {
        var map = event.data.obj;
        if (!map.searchBoxReady) map.initializeSearchBox();
    });
    
    $(this.searchBox).keydown({obj: this}, function (event) {
        var map = event.data.obj;
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            if (!map.searchBoxReady) map.initializeSearchBox();
        }
    });
    
    $(this.themeOneLabel).click({obj: this}, function (event) {
        var map = event.data.obj;
        
        if (!$(this).hasClass("active")) {
            map.currentThemeNumber = 1; 
            $(this).addClass("active");
            $(map.themeTwoLabel).removeClass("active");
            $(map.themeTitle).html(map.themeOne.name);
            $(map.themeTimeFrame).html(map.themeOne.timeFrame);
            $(map.aggregationUnitMenu).val(map.themeOne.aggregationUnit);
            map.activeTheme = map.themeOne;  
            map.controller.toggleTheme(1); 
            map.themeTwoLayer.setVisible(false);
            map.themeOneLayer.setVisible(true);
            map.updateCaptionOnLayerChange();
            map.refreshPolygonLayers();
            map.updateLegend(map.activeTheme.styleClasses, map.activeTheme.digitCount);       
            map.updateCharts();
            if (map.themeOne.aggregationUnit != map.themeTwo.aggregationUnit) map.searchBoxReady = false;
        }
    });  
     
    $(this.themeOneLabel).keydown({obj: this}, function (event) {
        var map = event.data.obj;
        
        if ((event.keyCode === 13 || event.keyCode === 32) && !$(this).hasClass("active")) {
            map.currentThemeNumber = 1; 
            $(this).addClass("active");
            $(map.themeTwoLabel).removeClass("active");
            $(map.themeTitle).html(map.themeOne.name);
            $(map.themeTimeFrame).html(map.themeOne.timeFrame);
            $(map.aggregationUnitMenu).val(map.themeOne.aggregationUnit);
            map.activeTheme = map.themeOne;  
            map.controller.toggleTheme(1); 
            map.themeTwoLayer.setVisible(false);
            map.themeOneLayer.setVisible(true);
            map.updateCaptionOnLayerChange();
            map.refreshPolygonLayers();
            map.updateLegend(map.activeTheme.styleClasses, map.activeTheme.digitCount);       
            map.updateCharts();
            if (map.themeOne.aggregationUnit != map.themeTwo.aggregationUnit) map.searchBoxReady = false;
        }
    });  
    
    $(this.themeTwoLabel).click({obj: this}, function (event) {
        var map = event.data.obj;  
        
        if (!$(this).hasClass("active")) {
            map.currentThemeNumber = 2;   
            $(this).addClass("active");
            $(map.themeOneLabel).removeClass("active");
            $(map.themeTitle).html(map.themeTwo.name);
            $(map.themeTimeFrame).html(map.themeTwo.timeFrame);
            $(map.aggregationUnitMenu).val(map.themeTwo.aggregationUnit);
            map.activeTheme = map.themeTwo;  
            map.controller.toggleTheme(2); 
            map.themeOneLayer.setVisible(false);
            map.themeTwoLayer.setVisible(true);
            map.updateCaptionOnLayerChange();
            map.refreshPolygonLayers();
            map.updateLegend(map.activeTheme.styleClasses, map.activeTheme.digitCount); 
            map.updateCharts(); 
            if (map.themeOne.aggregationUnit != map.themeTwo.aggregationUnit) map.searchBoxReady = false;
        }
    });
       
    $(this.themeTwoLabel).keydown({obj: this}, function (event) {
        var map = event.data.obj;  
        
        if ((event.keyCode === 13 || event.keyCode === 32) && !$(this).hasClass("active")) {
            map.currentThemeNumber = 2;   
            $(this).addClass("active");
            $(map.themeOneLabel).removeClass("active");
            $(map.themeTitle).html(map.themeTwo.name);
            $(map.themeTimeFrame).html(map.themeTwo.timeFrame);
            $(map.aggregationUnitMenu).val(map.themeTwo.aggregationUnit);
            map.activeTheme = map.themeTwo;  
            map.controller.toggleTheme(2); 
            map.themeOneLayer.setVisible(false);
            map.themeTwoLayer.setVisible(true);
            map.updateCaptionOnLayerChange();
            map.refreshPolygonLayers();
            map.updateLegend(map.activeTheme.styleClasses, map.activeTheme.digitCount); 
            map.updateCharts(); 
            if (map.themeOne.aggregationUnit != map.themeTwo.aggregationUnit) map.searchBoxReady = false;
        }
    });
       
    $(this.modifyThemeButton).click({obj: this}, function (event) {
        var map = event.data.obj;
        if (map.controller && map.mapLoaded) {
            map.controller.showThemeManager();
        }
    });  
       
    $(this.modifyThemeButton).keydown({obj: this}, function (event) {
        var map = event.data.obj;
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            if (map.controller && map.mapLoaded) {
                map.controller.showThemeManager();
            }
        }
    });  
    
    $(this.viewChartButton).click({obj: this}, function (event) {
        var map = event.data.obj;
        if (map.controller && map.mapLoaded && map.activeTheme) {
            if (map.activeTheme.loaded) {
                map.controller.showChartManager();
                map.updateCharts();
            }
        }
    });
     
    $(this.viewChartButton).keydown({obj: this}, function (event) {
        var map = event.data.obj;
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            if (map.controller && map.mapLoaded && map.activeTheme) {
                if (map.activeTheme.loaded) {
                    map.controller.showChartManager();
                    map.updateCharts();
                }
            }
        }
    });
    
    $(this.aggregationUnitMenu).change({obj: this}, function (event) {
        var map = event.data.obj;        
        if (map.activeTheme) { 
            map.activeTheme.aggregationUnit = $(this).val();
            
            if (map.controller.themeManager) {
                map.controller.themeManager.fetchMapData();
            }
        }
    }); 
    
    $(this.aggregationUnitMenu).keydown({obj: this}, function (event) {
        var map = event.data.obj; 
        
        if (event.keyCode === 13 || event.keyCode === 32) {
            if (map.activeTheme) { 
                map.activeTheme.aggregationUnit = $(this).val();
                
                if (map.controller.themeManager) {
                    map.controller.themeManager.fetchMapData();
                }
            }
        }
    });
}

RMAMap.prototype = Object.create(Content.prototype);
RMAMap.prototype.constructor = RMAMap;

RMAMap.prototype.loadContent = function () {
    this.loadMap();
}

RMAMap.prototype.startLoadAnimation = function () {
    $(this.mapOverlay).removeClass("hidden");
    $(this.mapLoader).html("<div class='loader-container'><p>Loading...</p><div class='loader'></div></div>");
}

RMAMap.prototype.stopLoadAnimation = function () {
    $(this.mapOverlay).addClass("hidden");
    $(this.mapLoader).empty();
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
  
    var stateStyleFunction = (function () {
        return function (feature, resolution) {
            var label = false;

            if (resolution < 10000 && resolution > m.activeTheme.labelResolution) { 
                label = true;
             
                var labelStyle = new ol.style.Style({
                    text: new ol.style.Text({
                        text: feature.get("UNIT_ALIAS"),
                        textAlign: "center",
                        textBaseline: "middle",
                        font: "normal 16px Arial, sans-serif",
                        rotation: 0,
                        fill: stateLabelFill
                    })                
                }); 
            }
            
            if (label) {
                return [stateStyle, labelStyle];
            }
            else {
                return [stateStyle];
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
    
    this.countySource = new ol.source.Vector({
        projection: 'EPSG:3857',
        url: "data/cb_2015_us_county_20m.json",             
        format: new ol.format.GeoJSON(),
        attributions: [attribution]
    })
        
    this.themeOneLayer = new ol.layer.Vector({
        type: "county",
        source: this.countySource,
        style: this.styleFunction
    });
       
    this.themeTwoLayer = new ol.layer.Vector({
        type: "county",
        source: this.countySource,
        style: this.styleFunction,
        visible: false
    });
         
    this.stateSource = new ol.source.Vector({
        projection: 'EPSG:3857',
        url: "data/cb_2015_us_state_20m.json",             
        format: new ol.format.GeoJSON(),
        attributions: [attribution]
    })
    
    var stateLayer = new ol.layer.Vector({
        type: "static",
        source: this.stateSource,
        style: stateStyle
    });
    
    this.overlay = new ol.Overlay(({
        element: this.popupContainer,              
        autoPan: false
    }));

    var center = ol.proj.transform([-98.5795, 39.8283], 'EPSG:4326', 'EPSG:3857');

    // Create the map
    this.olMap = new ol.Map({
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
            if (m.activeTheme.aggregationUnit == layer.get("type")) {
                return feature;
            }
        }
    });    
    this.selectFeature(feature, !ctrlKey, false);
}

RMAMap.prototype.onSearchSelection = function (id) {
    var feature = this.getFeatureByID(id);
    this.selectFeature(feature, true, true);
}

RMAMap.prototype.getFeatureByID = function (id) {
    var features = null;
    var feature;
    
    if (this.activeTheme.aggregationUnit == "county" && this.countySource) {
        features = this.countySource.getFeatures();
    }
    else if (this.activeTheme.aggregationUnit == "state" && this.stateSource) {
        features = this.stateSource.getFeatures();
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
    var caption = $(this.themeCaption);

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
    var caption = $(this.themeCaption);    
    this.featureOverlay.getSource().clear();
    this.currentSelection = "";
    this.currentSelectionName = "";
    caption.html("&nbsp;");
    this.updateCharts();
}

RMAMap.prototype.updateCaptionOnLayerChange = function () {     
    if (this.themeOne.aggregationUnit == this.themeTwo.aggregationUnit) {
        this.updateCaption();
        this.updateCharts();
    }
    else {  
        $(this.themeCaption).html("&nbsp;");
        this.clearSelections();
    }
}

RMAMap.prototype.updateCaption = function () {   
    var caption = $(this.themeCaption);
    var features = this.featureOverlay.getSource().getFeatures();
    featureCount = features.length;
    
    if (featureCount > 1) {
        var scalar = Math.pow(10, this.activeTheme.digitCount + 1)/10;
        var total = 0;
        
        for (var i = 0; i < featureCount; i++) {
            id = features[i].get("UNIT_CODE");
           
            if (this.activeTheme.data[id]) {
                total = total + Number(this.activeTheme.data[id]);
            }
        }
        
        total = Math.round(total * scalar)/scalar;
        
        if (this.activeTheme.digitCount == 0) {
            total = String(total).replace(/(.)(?=(\d{3})+$)/g,'$1,');
        }
                  
        this.currentSelection = "";
        this.currentSelectionName = "Multiple";        
        caption.html(this.currentSelectionName + ": " + total);
    }
    else if (featureCount == 1) {
        var scalar = Math.pow(10, this.activeTheme.digitCount + 1)/10;
        var feature = features[0];
        
        this.currentSelection = feature.get("UNIT_CODE");
        var value = this.activeTheme.data[this.currentSelection];  
        
        if (this.activeTheme.aggregationUnit == "county") {
            this.currentSelectionName = feature.get("UNIT_NAME") + " County, " + feature.get("STATE");
        }
        else {
            this.currentSelectionName = feature.get("UNIT_NAME");
        }
        
        if (!value) {
            value = 0;
        }
        else {
            value = Math.round(value * scalar)/scalar; 
            
            if (this.activeTheme.digitCount == 0) {
                value = String(value).replace(/(.)(?=(\d{3})+$)/g,'$1,');
            }
        }        
        caption.html(this.currentSelectionName + ": " + value);
    }        
    else {
        caption.html("&nbsp;");
    }
}

RMAMap.prototype.updateTheme = function (themeNumber, themeName, themeTimeFrame, themeData, method, classCount, aggregationUnit, isFloat) {
    var array = this.objectToArray(themeData);
    
    if (themeNumber == 1) { 
        this.currentTheme = themeName;  
        this.themeOne.loaded = true;
        this.themeOne.name = themeName; 
        this.themeOne.timeFrame = themeTimeFrame;
        this.themeOne.data = themeData;
        this.themeOne.aggregationUnit = aggregationUnit;
        var styleClasses;        
        
        $(this.themeTitle).html(themeName);
        $(this.themeTimeFrame).html(themeTimeFrame);
        
        if (aggregationUnit == "state") {
            this.themeOne.labelResolution = 4000;
            this.themeOneLayer.set("type", "state");
            this.themeOneLayer.setSource(this.stateSource);
        }
        else {
            this.themeOne.labelResolution = 1000;
            this.themeOneLayer.set("type", "county");
            this.themeOneLayer.setSource(this.countySource);
        }
        
        if (themeName == this.themeTwo.name && aggregationUnit == this.themeTwo.aggregationUnit && this.themeTwo.data) {
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
        this.themeTwo.timeFrame = themeTimeFrame;
        this.themeTwo.data = themeData;
        this.themeTwo.aggregationUnit = aggregationUnit;
        var styleClasses;        
        
        $(this.themeTitle).html(themeName);
        $(this.themeTimeFrame).html(themeTimeFrame);
        
        if (aggregationUnit == "state") {
            this.themeTwo.labelResolution = 5000;
            this.themeTwoLayer.set("type", "state");
            this.themeTwoLayer.setSource(this.stateSource);
        }
        else {
            this.themeTwo.labelResolution = 1000;
            this.themeTwoLayer.set("type", "county");
            this.themeTwoLayer.setSource(this.countySource);
        }
            
        if (themeName == this.themeOne.name && aggregationUnit == this.themeOne.aggregationUnit && this.themeOne.data) {
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
        
        this.themeTwo.styleClasses = styleClasses;
        this.activeTheme = this.themeTwo;
        this.updateLegend(styleClasses, this.themeTwo.digitCount);  
        this.clearSelections();
        this.refreshPolygonLayers();
    }
    this.stopLoadAnimation();
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
            $(this.legendToggle).show();
        
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
        else {
            $(this.legendToggle).hide();
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
        var roof, color, styleClass;
        
        for (var i = 0; i < classCount; i++) {
            roof = floor + interval;   
            color = this.getColorClass(classCount, i + 1); 
            styleClass = {
                low: Number(floor.toPrecision(3)),
                high: Number(roof.toPrecision(3)),
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
        var roof, color, styleClass;
        
        for (var i = 0; i < classCount; i++) {
            roof = d3.quantile(array, pct/100);
            color = this.getColorClass(classCount, i + 1);          
            styleClass = {
                low: Number(floor.toPrecision(3)),
                high: Number(roof.toPrecision(3)),
                color: color
            };
            styles.push(styleClass);
            floor = roof;
            pct = pct + interval;
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
        array.sort(function(a, b){ return a - b });
        var min = array[0];
        var max = array[array.length - 1];
        var diff = max - min;

        if (diff == 0) {
            digits = 0;
        }
        else if (diff < 0.000001) {
            digits = 9;
        }
        else if (diff < 0.00001) {
            digits = 8;
        }
        else if (diff < 0.0001) {
            digits = 7;
        }
        else if (diff < 0.001) {
            digits = 6;
        }
        else if (diff < 0.01) {
            digits = 5;
        }
        else if (diff < 0.1) {
            digits = 4;
        }
        else if (diff < 0) {
            digits = 3;
        }
        else if (diff < 10) {
            digits = 2;
        }
        else if (diff < 100) {
            digits = 1;
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

RMAMap.prototype.getFeatureLookup = function () {  
    var lookup = {};
    var code;
    
    if (this.activeTheme.aggregationUnit == "state") {
        if (this.stateSource) {;
            this.stateSource.forEachFeature(function (feature) {     
                code = feature.get("UNIT_CODE"); 
                lookup[code] = feature.get("UNIT_NAME");
            });
        }
    }
    else {
        if (this.countySource) {;
            this.countySource.forEachFeature(function (feature) {    
                code = feature.get("UNIT_CODE"); 
                lookup[code] = feature.get("UNIT_NAME");
            });
        }      
    }
}

RMAMap.prototype.initializeSearchBox = function () {
    var map = this;
    var container = $(this.searchBoxContainer);
    var control = $(this.searchBox);
    control.val("");
    var source = [];

    if (this.activeTheme.aggregationUnit == "state") {
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
        select: function( event, ui ) {
            control.val(ui.item.label);
            map.onSearchSelection(ui.item.value);
            return false;
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
        this.countySource.forEachFeature(function (feature) {
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
        this.stateSource.forEachFeature(function (feature) {
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


var ThemeManager = function (containerSelector, sectionTabSelector, 
    sectionSelector, metricSelector, yearSelector, commoditySelector, causeSelector,
    allOptionSelector, classCountSelector, classMethodSelector, measurementUnitSelector,
    aggregationUnitSelector, clearSelector, updateSelector) { 

    this.container = containerSelector;
    this.sectionTab = sectionTabSelector;
    this.section = sectionSelector;
    this.metricOption = metricSelector;
    this.yearOption = yearSelector;
    this.commodityOption = commoditySelector;
    this.causeOption = causeSelector;
    this.allOption = allOptionSelector;
    this.classCountMenu = classCountSelector;
    this.classMethodMenu = classMethodSelector;
    this.measurementUnitMenu = measurementUnitSelector;
    this.aggregationUnitMenu = aggregationUnitSelector;
    this.clearButton = clearSelector;
    this.updateButton = updateSelector;
    
    this.currentTheme = 1;
    this.thematicData = null;
    $(this.classCountMenu).val(5);
    $(this.classMethodMenu).val("equal interval");
    $(this.measurementUnitMenu).val("actual");
    $(this.aggregationUnitMenu).val("county");
    

    $(this.sectionTab).click({obj: this}, function (event) {
        var manager = event.data.obj; 

        if (!$(this).hasClass("active")) {   
            var tabs = $(manager.sectionTab);
            tabs.removeClass("active");
            $(this).addClass("active");            
            var index = tabs.index($(this));
            var sections;
            
            $(manager.container).each(function(){
                sections = $(this).find(manager.section);
                sections.hide();  
                sections.eq(index).show();
            });
        }
    }); 
    
    $(this.metricOption).click({obj: this}, function (event) {
        var manager = event.data.obj;

        if (!$(this).hasClass("selected")) {  
            var container = $(this).parents(manager.container);                       
            var options = container.find(manager.metricOption);
            options.removeClass("selected");
            $(this).addClass("selected");
        }
    });   
    
    $(this.yearOption).click({obj: this}, function (event) {
        var manager = event.data.obj;         
        var container = $(this).parents(manager.container);

        if ($(this).hasClass(manager.allOption.substring(1))) {                      
            var options = container.find(manager.yearOption);
            options.removeClass("active").removeClass("selected");
            $(this).addClass("selected");          
        }
        else if ($(this).hasClass("selected")) {                       
            var options = container.find(manager.yearOption);
            var allOption = container.find(manager.yearOption + manager.allOption);
            options.removeClass("active").removeClass("selected");
            allOption.addClass("selected");          
        }
        else {
            var allOption = container.find(manager.yearOption + manager.allOption);
            allOption.removeClass("selected");
            $(this).toggleClass("active");
            manager.updateYears(container);
        }
    });
       
    $(this.commodityOption).click({obj: this}, function (event) {
        var manager = event.data.obj;
        
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
        }
        else {
            var container = $(this).parents(manager.container);
        
            if ($(this).hasClass(manager.allOption.substring(1))) {                       
                var options = container.find(manager.commodityOption);
                options.removeClass("selected");
                $(this).addClass("selected");     
            }
            else {                      
                var allOption = container.find(manager.commodityOption + manager.allOption);
                allOption.removeClass("selected");           
                $(this).addClass("selected");
            }
        }
    }); 
          
    $(this.causeOption).click({obj: this}, function (event) {
        var manager = event.data.obj;
        
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
        }
        else {
            var container = $(this).parents(manager.container);
        
            if ($(this).hasClass(manager.allOption.substring(1))) {                       
                var options = container.find(manager.causeOption);
                options.removeClass("selected");
                $(this).addClass("selected");       
            }
            else {                      
                var allOption = container.find(manager.causeOption + manager.allOption);
                allOption.removeClass("selected");            
                $(this).addClass("selected");
            }
        }
    }); 
       
    $(this.clearButton).click({obj: this}, function (event) {
        var manager = event.data.obj;  
        var container = $(manager.container).eq(manager.currentTheme - 1);
        
        if (container.length > 0) {
            var activeTab = $(manager.sectionTab + ".active");        
            var index = $(manager.sectionTab).index(activeTab);
            
            if (index > -1) {
                var section = container.find(manager.section).eq(index);
                
                if (section.length > 0) {
                    section.find(manager.yearOption).removeClass("active").removeClass("selected");
                    section.find(manager.commodityOption).removeClass("selected");
                    section.find(manager.causeOption).removeClass("selected");
                    section.find(manager.allOption).addClass("selected");
                }
            }
        }
    });
    
    $(this.updateButton).click({obj: this}, function (event) {
        var manager = event.data.obj;
        manager.fetchMapData();
    });
}

ThemeManager.prototype = Object.create(Content.prototype);
ThemeManager.prototype.constructor = ThemeManager;

ThemeManager.prototype.setThemeNumber = function (themeNumber) {
    this.currentTheme = themeNumber;
}

ThemeManager.prototype.getMetric = function (container) {    
    var theme = "";
    
    if (container.length > 0) {
        var selections = container.find(this.metricOption + ".selected");

        if (selections.length > 0) {
            theme = selections.eq(0).attr("value");
        }
    }
    return theme;
}

ThemeManager.prototype.getStartYear = function (container) {    
    var year = "";
    
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

ThemeManager.prototype.getEndYear = function (container) {    
    var year = "";
    
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

ThemeManager.prototype.getCommodities = function (container) {    
    var commodities = [];
    
    if (container.length > 0) {
        var selections = container.find(this.commodityOption + ".selected").not(this.allOption);
        selections.each(function() {
            commodities.push($(this).attr("value"));
        });
    }
    return commodities.join("|")
}

ThemeManager.prototype.getCauses = function (container) {    
    var causes = [];
    
    if (container.length > 0) {
        var selections = container.find(this.causeOption + ".selected").not(this.allOption);
        selections.each(function() {
            causes.push($(this).attr("value"));
        });
    }
    return causes.join("|")
}

ThemeManager.prototype.getCommodityLookup = function (container) {    
    var lookup = {};
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
            if (code) lookup[code] = label;
        });
    }
    return lookup;
}

ThemeManager.prototype.getCauseLookup = function (container) {    
    var lookup = {};
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
            if (code) lookup[code] = label;
        });
    }
    return lookup;
}

ThemeManager.prototype.fetchMapData = function () {    
    if (this.controller) {
        var map = this.controller.map;  
        var container = $(this.container).eq(this.currentTheme - 1);
        
        if (map && container) {  
            map.startLoadAnimation();
            
            var manager = this;
            var metric = this.getMetric(container);
            var startYear = this.getStartYear(container);
            var endYear = this.getEndYear(container);
            var commodities = this.getCommodities(container); 
            var causes = this.getCauses(container);
            var commodityLookup = this.getCommodityLookup(container);
            var causeLookup = this.getCauseLookup(container);
            var measure = container.find(manager.measurementUnitMenu).val();
            var unit = map.activeTheme.aggregationUnit;
            var timeSpan = startYear;
            var metricLabel = metric;
            
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
                aggregationUnit: unit
            };   
            
            var isFloat = false;
            if (measure == "per_mile") {
                metricLabel = metric + " (per sq mile)";
                isFloat = true;
            }
            else if (measure == "per_km") {
                metricLabel = metric + " (per sq km)";
                isFloat = true;
            }

            $.get("fetch-map-data.php", params, function (data) {
                if (data != "") {
                    try {
                        manager.thematicData = JSON.parse(data);
                        var method = container.find(manager.classMethodMenu).val();
                        var count = container.find(manager.classCountMenu).val();
                        map.updateTheme(manager.currentTheme, metricLabel, timeSpan, manager.thematicData, method, count, unit, isFloat);
                        chartManager.updateTheme(manager.currentTheme, metric, startYear, endYear, commodities, causes, commodityLookup, causeLookup, unit, measure);
                    }
                    catch (err) {
                        map.stopLoadAnimation();
                        alert("There was an error loading data");
                    }
                }
                else {
                    map.stopLoadAnimation();
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


var ChartManager = function (containerSelector, overlaySelector, loaderSelector, 
    sectionTabSelector, sectionSelector, metricSelector, unitSelector,
    seriesChartSelector, barChartSelector, variableSelector, yearSelector, 
    barSelector, dotSelector, previousSelector, nextSelector,
    seriesChartClearSelector, barChartClearSelector) { 

    this.container = containerSelector;
    this.overlay = overlaySelector;
    this.loader = loaderSelector;
    this.sectionTab = sectionTabSelector;
    this.section = sectionSelector;
    this.metricTitle = metricSelector;
    this.unitTitle = unitSelector;
    this.seriesChart = seriesChartSelector;
    this.barChart = barChartSelector;
    this.variableLabel = variableSelector;
    this.yearLabel = yearSelector;
    this.bar = barSelector;
    this.dot = dotSelector;
    this.previousButton = previousSelector;
    this.nextButton = nextSelector;
    this.seriesChartClearButton = seriesChartClearSelector;
    this.barChartClearButton = barChartClearSelector;
    this.activeTheme = null;
    this.themes = [{},{}];

    $(this.sectionTab).click({obj: this}, function (event) {
        var manager = event.data.obj; 

        if (!$(this).hasClass("active")) {   
            var tabs = $(manager.sectionTab);
            tabs.removeClass("active");
            $(this).addClass("active");            
            var index = tabs.index($(this));
            var sections;
            
            $(manager.container).each(function(){
                sections = $(this).find(manager.section);
                sections.hide();  
                sections.eq(index).show();
            });
        }
    }); 
    
    $("body").on("click", this.bar + ".non-zero", {obj: this}, function (event) {
        var manager = event.data.obj; 
        var code = $(this).attr("code");
        var label = $(this).text();
        var container = $(this).parents(manager.section); 
        manager.updateSeriesChart(container, code, label);
    });    
    
    $("body").on("click", this.dot, {obj: this}, function (event) {
        var manager = event.data.obj;      
        
        if ($(this).attr("class") != manager.dot.substring(1) + " active" && manager.activeTheme) {
            var parentChart = $(this).parents(manager.seriesChart);
            var container = $(this).parents(manager.section);
            var dots = parentChart.find(manager.dot);
            var index = dots.index($(this));
            dots.attr("class", manager.dot.substring(1));
            $(this).attr("class", manager.dot.substring(1) + " active");
            manager.updateBarChart(container, index);
        }
    }); 
   
    $(this.previousButton).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        
        if (manager.activeTheme) {
            var container = $(this).parents(manager.section);
            var parentChart = container.find(manager.seriesChart);
            var dots = parentChart.find(manager.dot);
            var activeDot = parentChart.find(manager.dot + ".active");
            var index = -1;
            
            if (activeDot.length > 0) {
                index = dots.index(activeDot.eq(0));
            }
            
            dots.attr("class", manager.dot.substring(1));
            index--;
            
            if (index < -1) {
                index = manager.activeTheme.years.length - 1;
            }
            if (index > -1) {                
                var activeDot = dots.eq(index);            
                activeDot.attr("class", manager.dot.substring(1) + " active");
            }
            
            manager.updateBarChart(container, index);
        }
    });  
    
    $(this.nextButton).click({obj: this}, function (event) {
        var manager = event.data.obj; 
        
        if (manager.activeTheme) {
            var container = $(this).parents(manager.section);
            var parentChart = container.find(manager.seriesChart);
            var dots = parentChart.find(manager.dot);
            var activeDot = parentChart.find(manager.dot + ".active");
            var index = -1;
            
            if (activeDot.length > 0) {
                index = dots.index(activeDot.eq(0));
            }
            
            dots.attr("class", manager.dot.substring(1));
            index++;
            
            if (index > manager.activeTheme.years.length - 1) {
                index = -1;
            }
            else {                
                var activeDot = dots.eq(index);            
                activeDot.attr("class", manager.dot.substring(1) + " active");
            }
                   
            manager.updateBarChart(container, index);
        }
    });  
    
    $("body").on("click", this.seriesChartClearButton, {obj: this}, function (event) {
        var manager = event.data.obj;
        var container = $(this).parents(manager.section);
        var seriesChart = container.find(manager.seriesChart);
        var dots = seriesChart.find(manager.dot);
        dots.attr("class", manager.dot.substring(1));
        manager.updateBarChart(container, -1);
    });  
    
    $("body").on("click", this.barChartClearButton, {obj: this}, function (event) {
        var manager = event.data.obj;
        var container = $(this).parents(manager.section); 
        manager.updateSeriesChart(container, "", "");
    });    
}

ChartManager.prototype = Object.create(Content.prototype);
ChartManager.prototype.constructor = ChartManager;

ChartManager.prototype.startLoadAnimation = function () {
    $(this.overlay).removeClass("hidden");    
    $(this.loader).html("<div class='loader-container'><p>Loading...</p><div class='loader'></div></div>");
}

ChartManager.prototype.stopLoadAnimation = function () {
    $(this.overlay).addClass("hidden");
    $(this.loader).empty();
}

ChartManager.prototype.updateTheme = function (themeNumber, metric, startYear, endYear, commodities, causes, commodityLookup, causeLookup, unit, measure) {
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
            aggregationUnit: unit, 
            measure: measure
        };
    }
}

ChartManager.prototype.fetchChartData = function (themeNumber, selections, selectionName) {
    themeNumber = themeNumber - 1;
    
    if (themeNumber > -1 && themeNumber < this.themes.length) {   
        var manager = this;
        var activeTheme = this.themes[themeNumber];
        
        if (activeTheme.hasOwnProperty("metric")) {
            this.startLoadAnimation();
            
            var params = {
                metric: activeTheme.metric,
                startYear: activeTheme.startYear,
                endYear: activeTheme.endYear,
                commodities: activeTheme.commodities, 
                causes: activeTheme.causes,
                measurementUnit: activeTheme.measure,
                aggregationUnit: activeTheme.aggregationUnit,
                aggregationUnitList: selections.join("|")
            };   
           
            $.get("fetch-chart-data.php", params, function (data) {
                if (data != "") {
                    try {
                        var dataObj = JSON.parse(data);
                        manager.loadCharts(themeNumber, selectionName, dataObj);
                    }
                    catch (err) {
                        manager.stopLoadAnimation();
                        alert("There was an error loading data");
                    }
                }
                else {
                    manager.stopLoadAnimation();
                }
            });
        }
    }
}

ChartManager.prototype.loadCharts = function (themeNumber, selectionName, data) {
    if (themeNumber < this.themes.length) {
        var activeTheme = this.themes[themeNumber];
        var container = $(this.container).eq(themeNumber);   
        var yearLabel = activeTheme.startYear;
        activeTheme.data = data;  
        activeTheme.years = [];
        metricLabel = activeTheme.metric;

        if (activeTheme.startYear != activeTheme.endYear) {
            yearLabel = activeTheme.startYear + "–" + activeTheme.endYear;
        }
        yearLabel = yearLabel + " totals";

        if (selectionName == "") {
            if (activeTheme.aggregationUnit == "state") {
                selectionName = "All states";
            }
            else if (activeTheme.aggregationUnit == "county") {
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

           
        container.find(this.metricTitle).html(metricLabel);
        container.find(this.unitTitle).html(selectionName);
        container.addClass("active");
        container.show();
        var sections = container.find(this.section); 

        if (sections.length > 0) {            
            var sectionOne = sections.eq(0);
            var sectionTwo = sections.eq(1);
            
            if (data.commodity && data.cause && sectionOne.length > 0 && sectionTwo.length > 0) { 
                sectionOne.show();
                var commodityLabel = yearLabel + " by commodity";
                var causeLabel = yearLabel + " by cause of loss";
                this.loadChartPanel(sectionOne, data.commodity, activeTheme.commodityLookup, activeTheme.years, commodityLabel, activeTheme.metric, metricLabel, "All commodities");      
                this.loadChartPanel(sectionTwo, data.cause, activeTheme.causeLookup, activeTheme.years, causeLabel, activeTheme.metric, metricLabel, "All causes of loss");
            }
        }
        this.stopLoadAnimation();
        this.activeTheme = activeTheme;
    }
}

ChartManager.prototype.loadChartPanel = function (section, data, nameLookup, years, yearLabel, metric, metricLabel, variable) {    
    if (section.length > 0 && data && years) { 
        var seriesChart = section.find(this.seriesChart);     
        var barChart = section.find(this.barChart);
        
        if (years.length > 0 && seriesChart.length > 0 && barChart.length > 0) { 
            var seriesCanvas = seriesChart.get()[0];
            var barCanvas = barChart.get()[0]; 
            seriesChart.empty();
            barChart.empty();
            this.createTimeSeriesChart(seriesCanvas, data["total"], years, -1, variable);
            this.createBarChart(barCanvas, data, nameLookup, -1, yearLabel);
        }
    }
}

ChartManager.prototype.updateSeriesChart = function (container, attribute, label) {     
    if (container.length > 0 && this.activeTheme) {     
        var activeTab = $(this.sectionTab + ".active");
        
        if (activeTab.length > 0 && this.activeTheme.data && this.activeTheme.years) {
            var charts = container.find(this.seriesChart);
            var data;
            var defaultLabel = "";
            
            if (activeTab.attr("value") == "commodity") {
                data = this.activeTheme.data.commodity;
                defaultLabel = "All commodities";
            }
            else if (activeTab.attr("value") == "cause") {
                data = this.activeTheme.data.cause;
                defaultLabel = "All causes of loss";
            }
            
            if (data && charts.length > 0) {     
                var dots = charts.find(this.dot);
                var activeDot = charts.find(this.dot + ".active");
                var index = -1;
                
                if (activeDot.length > 0) {
                    index = dots.index(activeDot.eq(0));
                }
                if (attribute == "") {
                    charts.empty();
                    var chart = charts.get()[0];
                    this.createTimeSeriesChart(chart, data["total"], this.activeTheme.years, index, defaultLabel);
                }
                else if (data.hasOwnProperty(attribute)) {
                    charts.empty();
                    var chart = charts.get()[0];
                    this.createTimeSeriesChart(chart, data[attribute], this.activeTheme.years, index, label);
                }
            }
        }
    }
}

ChartManager.prototype.updateBarChart = function (container, yearIndex) {   
    if (container.length > 0 && this.activeTheme) {   
        var activeTab = $(this.sectionTab + ".active");   
        
        if (activeTab.length > 0 && this.activeTheme.data && this.activeTheme.years) {
            var charts = container.find(this.barChart);
            var data, nameLookup;                
            var yearLabel = "";
            
            if (yearIndex > -1) {
                yearLabel = this.activeTheme.years[yearIndex];
            }
            else {
                yearLabel = this.activeTheme.startYear + "–" + this.activeTheme.endYear;
            }
            
            if (activeTab.attr("value") == "commodity") {
                data = this.activeTheme.data.commodity;
                nameLookup = this.activeTheme.commodityLookup;
                yearLabel = yearLabel + " totals by commodity";
            }
            else if (activeTab.attr("value") == "cause") {
                data = this.activeTheme.data.cause;
                nameLookup = this.activeTheme.causeLookup;
                yearLabel = yearLabel + " totals by cause of loss";
            }
           
            if (data && charts.length > 0) {
                charts.empty();
                var chart = charts.get()[0];
                this.createBarChart(chart, data, nameLookup, yearIndex, yearLabel);
            }
        }
    }
}

ChartManager.prototype.createTimeSeriesChart = function (chart, data, years, yearIndex, variable) { 
    var yearCount = years.length;
    
    if (data.length != yearCount) {
        return;
    }
    
    function dotFunction (d,i) {
        if (i == yearIndex) {
            return "series-chart-dot active";
        }
        else {
            return "series-chart-dot";
        }    
    }
          
    function showTooltip(d,i) {
        tooltip.transition()
            .duration(200)		
            .style("visibility", "visible")
            .style("opacity", 1);	
        tooltip.html(years[i] + ": " + d3.format(',')(Number(d).toFixed(4)))	 
            .style("left", (x(i) + margin.left) + "px")			 
            .style("top", (y(d/scaleFactor) + margin.top - 40) + "px");
    }
           
    function hideTooltip(d,i) {
        tooltip.transition()
            .duration(200)		
            .style("visibility", "hidden")
            .style("opacity", 0);
    }
    
    var svgWidth = 280; 
    var svgHeight = 300;    
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

    var x = d3.scaleLinear()        
        .domain([0, yearCount])
        .range([0, width]);

    var y = d3.scaleLinear()        
        .domain([minAdjusted, maxAdjusted])
        .range([height, 0]);
    
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

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5)
        .tickSize(6)
        .tickPadding(4);
        
    // Add the data lines and points
    var path = svg.append("path")
        .attr("d", valueline(data))
        .attr("class", "series-chart-path")

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 6)
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
        .attr("class", "series-chart-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "series-chart-axis")
        .call(yAxis);
        
    svg.append("text")
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

ChartManager.prototype.createBarChart = function (chart, data, nameLookup, yearIndex, yearLabel) {
    var totals = [];
    var totalsSub = [];
    var barCount = 0;
    var barWidth = 16;
    var barGap = 4;
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
    
    var subCount = 12;
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
        tooltip.html(d3.format(',')(d.value.toFixed(4)))	 
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
    
    var svgWidth = 280; 

    var margin = {top: 50, right: 10, bottom: 20, left: 180},
        width = svgWidth - margin.left - margin.right,
        height = (subCount + 1) * (barWidth + barGap);

    var svgHeight = height + margin.top + margin.bottom ; 
    
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
        .attr("class", "chart-bar");
           
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
        .attr("class", this.yearLabel.substring(1))
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


var controller = new ContentController (
    "#content",
    "shifted", 
    "#theme-form-container",
    "#theme-one-form", 
    "#theme-two-form",
    "#theme-form-close-button",  
    "#chart-container", 
    "#theme-one-charts", 
    "#theme-two-charts",
    "#chart-container-close-button",
    "#map-overlay"
);

var rmaMap = new RMAMap (
    "#map-container", 
    "#rma-map",
    "#theme-form-overlay",
    "#theme-form-loader",
    "#map-theme", 
    "#map-theme-one-title",
    "#map-theme-two-title",
    "#modify-theme-button",
    "#view-charts-button",
    "#map-theme-metric", 
    "#map-theme-time-frame",
    "#map-theme-caption",
    "#map-legend",
    "#map-legend-toggle",
    ".map-legend-item",
    ".map-legend-box",
    ".map-legend-label",
    "#map-popup",
    "#search-container",
    "#search-box",
    "input[name='aggregation-unit']"
);

var themeManager = new ThemeManager (
    ".theme-form", 
    ".theme-form-menu-option", 
    ".theme-form-section", 
    ".metric-option-list li", 
    ".year-option-list li",
    ".commodity-option-list li",
    ".cause-option-list li",
    ".all-option",
    ".map-class-count-menu", 
    ".map-class-method-menu",  
    ".map-measurement-unit-menu",
    ".map-aggregation-unit-menu",
    "#theme-form-clear-button",
    "#theme-form-update-button" 
);

var chartManager = new ChartManager (
    ".chart-section-container", 
    "#chart-overlay",
    "#chart-loader",
    ".chart-menu-option", 
    ".chart-section",  
    ".chart-metric-title",
    ".chart-unit-title",
    ".series-chart", 
    ".bar-chart",   
    ".chart-variable-label",
    ".chart-year-label", 
    ".chart-bar text",
    ".series-chart-dot",
    ".series-chart-previous-button",
    ".series-chart-next-button",
    ".series-chart-clear-button",
    ".bar-chart-clear-button"
);

controller.addThemeManager(themeManager);
controller.addMap(rmaMap);
controller.addChartManager(chartManager);
controller.loadContent(); 
    