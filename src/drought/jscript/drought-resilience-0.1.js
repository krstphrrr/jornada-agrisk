
/**
 * @description This class manages user interactions with the story map.
 * @class
 * @alias StoryMap
 * @param {String} containerSelector Selector for the map container element
 * @param {String} mapSelector Selector for the map element
 * @param {String} sliderSelector Selector for the drought range slider element
 * @param {String} roadBasemapSelector Selector for the road basemap option element
 * @param {String} topoBasemapSelector Selector for the topo basemap option element
 * @param {String} aerialBasemapSelector Selector for the aerial basemap option element
 * @param {String} popupSelector Selector for the map popup element
 * @param {String} popupNameSelector Selector for the map popup name element
 * @param {String} popupDateSelector Selector for the map popup date element
 * @param {String} loadSelector Selector for the data load animation
 * @param {StoryList} storyList StoryList object
 * @param {StoryDetail} storyDetail StoryDetail object
 */  
var StoryMap = function (containerSelector, mapSelector, sliderSelector,
    roadBasemapSelector, topoBasemapSelector, aerialBasemapSelector, popupSelector,
    popupNameSelector, popupDateSelector, loadSelector, storyList, storyDetail) { 

    this.container = containerSelector;
    this.map = mapSelector;
    this.slider = sliderSelector;
    this.roadBasemapButton = roadBasemapSelector;
    this.topoBasemapButton = topoBasemapSelector;
    this.aerialBasemapButton = aerialBasemapSelector;
    this.loadAnimation = loadSelector;
    this.storyList = storyList;
    this.storyDetail = storyDetail;
    
    this.popup = document.getElementById(popupSelector.substring(1));
    this.popupName = document.getElementById(popupNameSelector.substring(1));
    this.popupDate = document.getElementById(popupDateSelector.substring(1));
    
    this.olMap;
    this.mapLoaded = false;
    this.droughtLayer = null;
    this.roadBasemap = null;
    this.topoBasemap = null;
    this.aerialBasemap = null;
    this.storyLayer = null;
    this.storyStyle = null;
    this.selectedFeature = null;
    this.currentZoom = 4;
    
    this.loadStories();
    this.loadMap();  
    
    var m = this;
    
    window.onhashchange = function() {
        m.panToStory();
    }
               
    $(this.roadBasemapButton).click({obj: this}, function (event) {
        event.data.obj.changeBasemap('road');
    });

    $(this.roadBasemapButton).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.changeBasemap('road');
        }
    });
      
    $(this.topoBasemapButton).click({obj: this}, function (event) {
        event.data.obj.changeBasemap('topo');
    });

    $(this.topoBasemapButton).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.changeBasemap('topo');
        }
    });
                 
    $(this.aerialBasemapButton).click({obj: this}, function (event) {
        event.data.obj.changeBasemap('aerial');
    });

    $(this.aerialBasemapButton).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.changeBasemap('aerial');
        }
    });
                
    $(this.slider).on('change', {obj: this}, function (event) {
        event.data.obj.changeDroughtLayerOpacity(this.value);
    });
}

/**
 * @description Loads the map and baselayers
 * @alias loadMap
 * @return Null
 */  
StoryMap.prototype.loadMap = function () {
    if (this.mapLoaded) return;
    
    var m = this; 
    
    var singleStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 16,
            stroke: new ol.style.Stroke({
              color: '#000',
              width: 2
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255,255,255,0.9)'
            })
        }),
        text: new ol.style.Text({
            text: 'i',            
            font: 'bold 14px Poppins, sans-serif',
            offsetY: 1,
            fill: new ol.style.Fill({
              color: '#000'
            })
        })
    });
    
    var styleCache = {
        1: singleStyle
    };
    
    m.storyStyle = function(feature) {
        var size = 1;  
        var features = feature.get('features');
        
        if (features) {
            size = features.length;
            
            for (var i = 0; i < features.length; i++) {
                if (size == 1) {
                    features[i].set('single', 1);
                }
                else {
                    features[i].set('single', 0);
                }
            }
        }
        else {
            feature.set('single', 1);
        }
        
        var style = styleCache[size];
        
        if (!style) {
            var label = 'i';
            
            if (size > 1) label = size.toString(),
             
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 20,
                        stroke: new ol.style.Stroke({
                        color: '#FFF',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,0,0,0.8)'
                    })
                }),
                text: new ol.style.Text({
                    text: label,
                    font: 'bold 14px Poppins, sans-serif',
                    offsetY: 1,
                    fill: new ol.style.Fill({
                      color: '#FFF'
                    })
                })
            });
            styleCache[size] = style;
        }
        return style;
    }
     
    // Create a US Drought Monitor layer
    var attribution = new ol.Attribution({
        html: "Drought Monitor data courtesy of the National Drought Mitigation Center (NDMC), the U.S. Department of Agriculture (USDA) and the National Oceanic and Atmospheric Administration (NOAA). "
    });

    this.droughtLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.KML,
            projection: 'EPSG:3857',
            url: 'data/usdm_current.kml',
            attributions: [attribution]
        }),
        opacity: 0.5
    });

    // Create background layers using ESRI web services 
    attribution = new ol.Attribution({
        html: 'Basemap provided by ESRI. Sources: Esri, HERE, DeLorme, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, © OpenStreetMap contributors, and the GIS User Community.'
    });

    this.roadBasemap = new ol.layer.Tile({
        id: 'Road',
        visible: true,
        source: new ol.source.XYZ({
            attributions: [attribution],
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                 'World_Street_Map/MapServer/tile/{z}/{y}/{x}'
        })
    });

    this.topoBasemap = new ol.layer.Tile({
        id: 'Topo',
        visible: false,
        source: new ol.source.XYZ({
            attributions: [attribution],
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        })
    });
  
    var attribution = new ol.Attribution({
        html: 'Basemap provided by ESRI. Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community.'
    });
    
    this.aerialBasemap =  new ol.layer.Group({
        id: 'Aerial',
        visible: false,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: [attribution],
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                         'World_Imagery/MapServer/tile/{z}/{y}/{x}'
                })            
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: [attribution],
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/' +
                         'World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
                })            
            })
        ]        
    });

    this.overlay = new ol.Overlay(({
        element: this.popup
    }));
    
    var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false}); 
    
    // Create the map with raster layers only
    this.olMap = new ol.Map({
        layers: [this.roadBasemap, this.topoBasemap, this.aerialBasemap, this.droughtLayer],
        overlays: [this.overlay],
        interactions: interactions,
        target: document.getElementById(m.map.substring(1)),
        view: new ol.View({
            center: [-11022108,5011774],
            zoom: 4,
            minZoom: 2
        })
    });

    // Handle map click events
    this.olMap.on('click', function (evt) {
        m.displayFeatureInfo(evt.pixel, evt.coordinate);
    });
    
    // Change mouse cursor when over marker
    $(this.olMap.getViewport()).on('mousemove', function(e) {
        var pixel = m.olMap.getEventPixel(e.originalEvent);
        var hit = m.olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
            if (layer && layer.get('type') == 'story') {
                return feature;
            }
        });
        if (hit) {
            m.olMap.getTarget().style.cursor = 'pointer';
        } 
        else {
            m.olMap.getTarget().style.cursor = '';
        }
    });
    
    // Handle map click events
    this.olMap.on('moveend', function (evt) {
        var zoom = m.olMap.getView().getZoom();
        
        if (zoom != m.currentZoom) {
            m.currentZoom = zoom;
            m.updateClusterDistance();
        }
        else {
            m.refreshData();
        }
    });
    
    // Handle resolution change events
    this.olMap.getView().on('change:resolution', function() {
        var zoom = m.olMap.getView().getZoom();
        
        if (zoom != m.currentZoom) {
            m.currentZoom = zoom;
            m.updateClusterDistance();
        }
    });
 
    this.mapLoaded = true;
}

/**
 * @description Changes the map basemap to the specified resource
 * @alias loadStories
 * @return Null
 */  
StoryMap.prototype.loadStories = function () {
    var m = this;
    var loader = $(this.loadAnimation);
    loader.addClass('active');
    
    $.get('locations.php', function (response) {
        var geoJSONFormat = new ol.format.GeoJSON();
        
        var features = geoJSONFormat.readFeatures(response, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        
        var source = new ol.source.Vector({
            features: features
        });

        var clusterSource = new ol.source.Cluster({
            source: source
        });

        m.storyLayer = new ol.layer.Vector({
            source: clusterSource,
            style: m.storyStyle,
            type: 'story'
        });         
        
        m.storyLayer.once('postcompose', function(event) {
            if (m.storyLayer.getVisible()) {
                m.refreshData();
                m.panToStory();
            }
        });    
        
        m.updateClusterDistance();
        m.olMap.addLayer(m.storyLayer);
        loader.removeClass('active');        
    });
    
    if ($(window).innerWidth() <= 650) {
        m.storyList.showContentByIndex(0);
    }
}

/**
 * @description Updates the minimum distance (pixels) between story feature clusters
 * @alias updateClusterDistance
 * @return Null
 */  
StoryMap.prototype.updateClusterDistance = function () {
    if (this.storyLayer) {
        var res = this.olMap.getView().getResolution();
        var zoom = this.olMap.getView().getZoom();
        var source = this.storyLayer.getSource().getSource();
        var dist = res/100;
        
        if (zoom > 14) dist = 0;
        
        var clusterSource = new ol.source.Cluster({
            distance: dist,
            source: source
        });
        this.storyLayer.setSource(clusterSource);
    }
}

/**
 * @description Refreshes story data to reflect current clustering
 * @alias refreshData
 * @return Null
 */  
StoryMap.prototype.refreshData = function () {
    var data = []; 
    var count = 0;
    
    if (this.storyLayer) { 
        var extent = this.olMap.getView().calculateExtent(this.olMap.getSize());
        var source = this.storyLayer.getSource().getSource(); 
        count = source.getFeatures().length;
        
        source.forEachFeatureInExtent(extent, function (feature) {
            if (feature.get('single') == 1) {
                data.push({
                    id: feature.get('StoryID'),
                    name: feature.get('Impact'),
                    place: feature.get('PlaceName'),
                    lat: feature.get('Latitude'),
                    lon: feature.get('Longitude'), 
                    landType: feature.get('LandType'),
                    date: feature.get('ImpactDate'),  
                    story: feature.get('Story'),  
                    resilienceActions: feature.get('ResilienceActions'), 
                    webLink: feature.get('WebLink'),
                    source: feature.get('Source')
                });
            }
        });
        
        if (this.storyList) this.storyList.updateAvailableCount(count);
        if (this.storyList) this.storyList.updateData(data);
        if (this.storyDetail) this.storyDetail.updateData(data);
    }    
}

/**
 * @description Centers the map on the story specified in the page URL
 * @alias panToStory
 * @return Null
 */  
StoryMap.prototype.panToStory = function () {
    var href = window.location.href;
    var tuple = href.split('#');

    if (tuple.length == 2 && this.storyLayer) {
        var target = tuple[1];
        
        var source = this.storyLayer.getSource().getSource();
        var features = source.getFeatures();
        var count = features.length;
        var feature, center, view;
        
        for (var i = 0; i < count; i++) {
            feature = features[i];
            
            if (feature.get('StoryID') == target) {
                center = [feature.get('Longitude'), feature.get('Latitude')];
                center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');  
                
                view = this.olMap.getView();
                view.setCenter(center);
                view.setZoom(9);
                
                this.popupName.href = '#' + feature.get('StoryID');
                this.popupName.innerHTML = feature.get('Impact');
                this.popupDate.innerHTML = feature.get('ImpactDate');
                this.overlay.setPosition(center);
                this.selectedFeature = feature;
                
                break;
            }
        }
    }    
}

/**
 * @description Changes the the US drought monitor layer opacity
 * @alias changeDroughtLayerOpacity
 * @param {Integer} value The slider value
 * @return Null
 */  
StoryMap.prototype.changeDroughtLayerOpacity = function (value) {
    if (this.droughtLayer) {
        this.droughtLayer.setOpacity(value/100);
    }
}

/**
 * @description Changes the map basemap to the specified resource
 * @alias changeBasemap
 * @param {String} basemap The name of the basemap to display
 * @return Null
 */  
StoryMap.prototype.changeBasemap = function (basemap) {
    $(this.roadBasemapButton).removeClass('active');
    $(this.topoBasemapButton).removeClass('active');
    $(this.aerialBasemapButton).removeClass('active');
    this.roadBasemap.set('visible', false);
    this.topoBasemap.set('visible', false);
    this.aerialBasemap.set('visible', false);

    if (basemap == 'road') {
        $(this.roadBasemapButton).addClass('active');
        this.roadBasemap.set('visible', true);
    }
    else if (basemap == 'topo') {
        $(this.topoBasemapButton).addClass('active');
        this.topoBasemap.set('visible', true);
    }
    else if (basemap == 'aerial') {
        $(this.aerialBasemapButton).addClass('active');
        this.aerialBasemap.set('visible', true);
    }
    
    if (this.storyDetail) this.storyDetail.changeBasemap(basemap);
}

/**
 * @description Displays a popup with basic information about the selected feature
 * @alias displayFeatureInfo
 * @param {ol.Pixel} pixel The pixel at the location clicked
 * @param {ol.Coordinate} coord The coordinate of the location clicked
 * @return Null
 */
StoryMap.prototype.displayFeatureInfo = function (pixel, coord) {     
    var feature = this.olMap.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (layer && layer.get('type') == 'story') {
            return feature;
        }
    });
    if (feature) {
        var features = feature.get('features');
        
        if (features.length > 1) { 
            this.zoomToFeatures(features);
        }
        else if (features.length == 1) {   
            feature = features[0];
            
            if (feature != this.selectedFeature) {
                var pt = feature.getGeometry().getCoordinates();
                this.popupName.href = '#' + feature.get('StoryID');
                this.popupName.innerHTML = feature.get('Impact');
                this.popupDate.innerHTML = feature.get('ImpactDate');
                this.overlay.setPosition(pt);
                this.selectedFeature = feature;
            }
            else {
                this.overlay.setPosition(undefined);
                this.selectedFeature = null;
            }
        }
    }
    else {
        this.overlay.setPosition(undefined);
        this.selectedFeature = null;
    }
}

/**
 * @description Zooms the map view to the extent of the selected features
 * @alias zoomToFeatures
 * @param {ol.Features} features An array of features
 * @return Null
 */
StoryMap.prototype.zoomToFeatures = function (features) {
    if (features) {
        var extent = this.getExtent(features);
        
        if (extent.length > 0) { 
            var view = this.olMap.getView();
            
            var zoom = ol.animation.zoom({
                resolution: view.getResolution(),
                duration: 300
            });
            
            this.olMap.beforeRender(zoom);        
            view.fit(extent, this.olMap.getSize());
            if (view.getZoom() > 9) {
                view.setZoom(9);
            }
            else {              
                view.setZoom(view.getZoom() - 1);
            }
        }
    }
}

/**
 * @description Returns the total extent of the specified features
 * @alias getExtent
 * @param {ol.Features} features An array of features
 * @return ol.Coordinate
 */
StoryMap.prototype.getExtent = function (features) {
    var fullExtent = [];
    var count = features.length;

    if (count > 0) {
        var feature, polygon, extent, minx, miny, maxx, maxy;
        var index = 0;
        
        for (var i = 0; i < count; i++) {
            feature = features[i];
            polygon = feature.getGeometry();
            
            if (polygon) {
                extent = polygon.getExtent();
                
                if (index == 0) {
                    minx = extent[0];
                    miny = extent[1];
                    maxx = extent[2];
                    maxy = extent[3];
                }
                else {
                    if (extent[0] < minx) {
                        minx = extent[0];
                    }
                    if (extent[1] < miny) {
                        miny = extent[1];
                    }
                    if (extent[2] > maxx) {
                        maxx = extent[2];
                    }
                    if (extent[3] > maxy) {
                        maxy = extent[3];
                    }
                }
                index++;
            }
        }
        fullExtent = [minx, miny, maxx, maxy];
    }
    return fullExtent;
}

/**
 * @description This class manages the story list.
 * @class
 * @alias StoryList
 * @param {String} sidebarSelector Selector for the story list sidebar element
 * @param {String} menuOptionSelector Selector for the story list menu option class
 * @param {String} mapOptionSelector Selector for the story list map option element
 * @param {String} contentSelector Selector for the story list content element
 * @param {String} listSelector Selector for the story list element
 * @param {String} itemNameSelector Selector for the list item story name element
 * @param {String} itemPlaceSelector Selector for the list item story place element
 * @param {String} itemDateSelector Selector for the list item story date element
 * @param {String} dateSortSelector Selector for the sort by date option
 * @param {String} placeSortSelector Selector for the sort by place option
 * @param {String} messageSelector Selector for the list message element
 * @param {StoryDetail} storyDetail StoryDetail object
 */  
var StoryList = function (sidebarSelector, menuOptionSelector, mapOptionSelector, 
    contentSelector, listSelector, itemNameSelector, itemPlaceSelector, itemDateSelector, 
    dateSortSelector, placeSortSelector, messageSelector, storyDetail) { 

    this.sidebar = sidebarSelector;
    this.menuOption = menuOptionSelector;
    this.mapOption = mapOptionSelector;
    this.content = contentSelector;
    this.list = listSelector;
    this.itemName = itemNameSelector;
    this.itemPlace = itemPlaceSelector;
    this.itemDate = itemDateSelector;
    this.dateSortOption = dateSortSelector;
    this.placeSortOption = placeSortSelector;
    this.listMessage = messageSelector;
    this.storyDetail = storyDetail;
    this.storyCount = 0;
    this.data = null;
         
    $(this.menuOption).click({obj: this}, function (event) {
        event.data.obj.showContent(this);
    });
    
    $(this.menuOption).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.showContent(this);
        }
    });
        
    $(this.dateSortOption).click({obj: this}, function (event) {
        event.data.obj.sortList('date');
    });
    
    $(this.dateSortOption).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.sortList('date');
        }
    });
         
    $(this.placeSortOption).click({obj: this}, function (event) {
        event.data.obj.sortList('place');
    });
    
    $(this.placeSortOption).keydown({obj: this}, function (event) { 
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.data.obj.sortList('date');
        }
    });         
}

/**
 * @description Shows the selected content in the story list window
 * @alias showContent
 * @param {Object} data menuOption object
 * @return Null
 */
StoryList.prototype.showContent = function (menuOption) {     
    if (menuOption) {
        var options = $(this.menuOption);
        var index = $(this.menuOption).index($(menuOption))
        var content = $(this.content);
        options.removeClass('active');
        $(this.sidebar).removeClass('collapsed');
        
        if ($(menuOption).attr('id') == this.mapOption.replace('#', '')) {
            $(menuOption).addClass('active');
            $(this.sidebar).addClass('collapsed');
        }
        else if (index > -1 && index < content.length) {
            content.removeClass('active');
            $(menuOption).addClass('active');
            content.eq(index).addClass('active');
            
        }
    }
}

/**
 * @description Shows the selected content in the story list window
 * @alias showContentByIndex
 * @param {Integer} index Index of the desired content
 * @return Null
 */
StoryList.prototype.showContentByIndex = function (index) {
    var options = $(this.menuOption);
    var content = $(this.content);
        
    if (index > -1 && index < options.length && index < content.length) {
        options.removeClass('active');
        options.eq(index).addClass('active');
        $(this.sidebar).removeClass('collapsed');
        
        if (index == 0) {
            $(this.sidebar).addClass('collapsed');
        }
        else {
            content.removeClass('active');
            content.eq(index).addClass('active');            
        }
    }
}

/**
 * @description Updates the number of stories available
 * @alias updateAvailableCount
 * @param {Integer} count The number of stories available
 * @return Null
 */
StoryList.prototype.updateAvailableCount = function (count) {     
    this.storyCount = count;
}

/**
 * @description Updates the data used to build the story list
 * @alias updateData
 * @param {Object} data Story data object
 * @return Null
 */
StoryList.prototype.updateData = function (data) {     
    this.data = data;
    this.updateList();
}

/**
 * @description Updates the story list
 * @alias updateList
 * @return Null
 */
StoryList.prototype.updateList = function () {
    if (this.data) {
        this.sortData();
               
        var itemCount = this.data.length;
        var story, item, name, place, del, date;
        var frag = document.createDocumentFragment();
        
        $(this.list).empty();
        $(this.listMessage).text((this.storyCount - itemCount) + ' not shown');
            
        if (itemCount > 0) {    
            var list = document.createElement('ol');

            for (var i = 0; i < itemCount; i++) {
                story = this.data[i];
                
                item = document.createElement('li');
                
                name = document.createElement('a');
                name.className = this.itemName.substring(1);
                name.href = '#' + story.id;
                name.appendChild(document.createTextNode(story.name));
                item.appendChild(name);
                
                item.appendChild(document.createElement('br'));
                
                if (story.date != null) {             
                    date = document.createElement('span');
                    date.className = this.itemPlace.substring(1);
                    date.appendChild(document.createTextNode(story.date));
                    item.appendChild(date);
                }
                
                if (story.place != null && story.date != null) {
                    del = document.createElement('span');
                    del.className = this.itemPlace.substring(1);
                    del.appendChild(document.createTextNode(', '));
                    item.appendChild(del);
                }
                
                if (story.place != null) {      
                    place = document.createElement('span');
                    place.className = this.itemPlace.substring(1);
                    place.appendChild(document.createTextNode(story.place));
                    item.appendChild(place);
                }
                
                list.appendChild(item);
                frag.appendChild(list);   
            }
        }
        else {     
            var msg = document.createElement('p');
            msg.appendChild(document.createTextNode('Zoom and/or pan the map to view available stories')); 
            frag.appendChild(msg);
        }        
        
        var container = document.getElementById(this.list.substring(1));
        container.appendChild(frag);
    }
};

/**
 * @description Sorts the story list
 * @alias sortList
 * @param {String} sortOption The attribute to sort by
 * @return Null
 */
StoryList.prototype.sortList = function (sortOption) {
    this.activeSortOption = sortOption;
    this.updateList();
    if (this.storyDetail) this.storyDetail.updateData(this.data);
}

/**
 * @description Sorts the data used to build the story list
 * @alias sortData
 * @param {String} sortOption The attribute to sort by
 * @return Null
 */
StoryList.prototype.sortData = function (sortOption) {
    var sortByPlace = function(a, b) {
        return a.place.toLowerCase().localeCompare(b.place.toLowerCase());
    }

    var sortByDate = function(a, b) {
        return a.date - b.date;
    }
    
    if (this.data && this.activeSortOption) {
        if (this.activeSortOption == 'place') {
            $(this.placeSortOption).addClass('active');
            $(this.dateSortOption).removeClass('active');
            this.data.sort(sortByPlace);
        }
        else if (this.activeSortOption == 'date') {
            $(this.dateSortOption).addClass('active');
            $(this.placeSortOption).removeClass('active');
            this.data.sort(sortByDate);
        }
    }    
}


/**
 * @description This class manages the story detail popup.
 * @class
 * @alias StoryDetail
 * @param {String} overlaySelector Selector for the overlay element
 * @param {String} bookendSelector Selector for the bookend element
 * @param {String} containerSelector Selector for the container element
 * @param {String} openSelector Selector for the open button class
 * @param {String} closeSelector Selector for the close button element
 * @param {String} previousSelector Selector for the previous story button element
 * @param {String} nextSelector Selector for the next story button element
 * @param {String} detailMapSelector Selector for the detail map element
 * @param {String} nameSelector Selector for the story name element
 * @param {String} placeSelector Selector for the story place element
 * @param {String} coordinatesSelector Selector for the story coordinates element
 * @param {String} landTypeSelector Selector for the story land type element
 * @param {String} dateSelector Selector for the story date element
 * @param {String} storySelector Selector for the story narrative element
 * @param {String} actionsSelector Selector for the resilience actions element
 * @param {String} webLinkSelector Selector for the story web link element
 * @param {String} sourceSelector Selector for the story source element
 */  
var StoryDetail = function (overlaySelector, bookendSelector, containerSelector, 
    openSelector, mapPopupSelector, closeSelector, previousSelector, nextSelector, 
    detailMapSelector, nameSelector, placeSelector, coordinatesSelector, landTypeSelector,
    dateSelector, storySelector, actionsSelector, webLinkSelector, sourceSelector) { 

    this.overlay = overlaySelector;
    this.bookend = bookendSelector;
    this.container = containerSelector;
    this.openButton = openSelector;
    this.mapPopup = mapPopupSelector;
    this.closeButton = closeSelector;
    this.previousButton = previousSelector;
    this.nextButton = nextSelector;
    this.detailMap = detailMapSelector;
    this.name = nameSelector;
    this.place = placeSelector;
    this.coordinates = coordinatesSelector;
    this.landType = landTypeSelector;
    this.date = dateSelector;
    this.story = storySelector;
    this.actions = actionsSelector;
    this.webLink = webLinkSelector;
    this.source = sourceSelector;
    this.map = null;
    this.targetLayer = null;
    this.roadBasemap = null;
    this.roadBasemap = null;
    this.roadBasemap = null;
    this.data = null;
    this.activeButton = null;
    this.activeIndex = -1;
    this.mapLoaded = false;

    this.prepareMap();
    
    $(this.overlay).click({obj: this}, function (event) {
        event.data.obj.hide();
    });
        
    $('body').on('click', this.openButton, {obj: this}, function (event) {
        event.preventDefault();
        event.data.obj.show(this)
    });
    
    $('body').on('keydown', this.openButton, {obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            event.data.obj.show(this)
        }  
    });  
         
    $(this.mapPopup).on('click', this.openButton, {obj: this}, function (event) {
        event.preventDefault();
        event.data.obj.show(this)
    });
    
    $(this.mapPopup).on('keydown', this.openButton, {obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            event.data.obj.show(this)
        }  
    });  
              
    $(this.container).click({obj: this}, function (event) {
        event.stopPropagation();
    });
       
    $(this.closeButton).click({obj: this}, function (event) {
        event.stopPropagation();
        event.data.obj.hide();
    });
    
    $(this.closeButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            event.data.obj.hide();
        }  
    });  
      
    $(this.previousButton).click({obj: this}, function (event) {
        event.stopPropagation();
        event.data.obj.previous();
    });
    
    $(this.previousButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            event.data.obj.previous();
        }  
    });  
      
    $(this.nextButton).click({obj: this}, function (event) {
        event.stopPropagation();
        event.data.obj.next();
    });
    
    $(this.nextButton).keydown({obj: this}, function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.stopPropagation();
            event.data.obj.next();
        }  
    });  
    
    $(this.bookend).keyup({obj: this}, function (event) {
        if (event.keyCode === 9) {
            var s = event.data.obj;            
            event.data.obj.hide();
        }  
    });   
}

/**
 * @description Updates the data used to populate the details popup.
 * @alias updateData
 * @param {Object} data Story data object
 * @return Null
 */
StoryDetail.prototype.updateData = function (data) {     
    this.data = data;
}

/**
 * @description Displays the specified story in the details popup.
 * @alias show
 * @param {Object} btn Popup open button
 * @return Null
 */
StoryDetail.prototype.show = function (btn) { 
    if (btn) {
        this.activeButton = btn;   
        
        if (btn.href) {
            var href = $(btn).attr('href');
            var storyID = href.replace('#', '');            
            var index = this.getIndex(storyID);

            if (index > -1 && index < this.data.length) {   
                window.history.pushState({}, '', href);
            
                this.activeIndex = index;
                $(this.overlay).addClass('active');
                $(this.closeButton).focus();
                this.update();
            }
        }
    }
}

/**
 * @description Hides the details popup.
 * @alias hide
 * @return Null
 */
StoryDetail.prototype.hide = function () { 
    if (this.activeButton) {
        $(this.activeButton).focus();
        this.activeButton = null;
        this.activeIndex = -1;        
        $(this.overlay).removeClass('active');
    }
}

/**
 * @description Updates the details popup with the specified story.
 * @alias update
 * @return Null
 */
StoryDetail.prototype.update = function () { 
    if (this.activeIndex > -1 && this.activeIndex < this.data.length) {
        var story = this.data[this.activeIndex];
        $(this.place).html(story.place); 
        $(this.date).html(story.date);  
        $(this.name).html(story.name); 
        $(this.story).html(story.story); 
        $(this.actions).html(story.resilienceActions);  
        $(this.landType).html(story.landType);        
        $(this.webLink).html('<a href="' + story.webLink + '" target="_blank">' + story.webLink + '</a>'); 
        $(this.source).html(story.source);
        this.updateMap(story.lon, story.lat);
    }
}

/**
 * @description Updates the details popup with the previous available story.
 * @alias previous
 * @return Null
 */
StoryDetail.prototype.previous = function () { 
    if (this.activeIndex == 0) {
        this.activeIndex = this.data.length - 1;
    }
    else {
        this.activeIndex = this.activeIndex - 1;
    }    
    this.update();
}

/**
 * @description Updates the details popup with the next available story.
 * @alias next
 * @return Null
 */
StoryDetail.prototype.next = function () { 
    if (this.activeIndex >= this.data.length - 1) {
        this.activeIndex = 0;
    }
    else {
        this.activeIndex = this.activeIndex + 1;
    }    
    this.update();
}

/**
 * @description Gets the index of the specified story.
 * @alias getIndex
 * @param {Integer} storyID Story ID
 * @return Integer
 */
StoryDetail.prototype.getIndex = function (storyID) { 
    var index = -1;
    
    if (this.data) {
        var count = this.data.length;
        var story;
        
        for (var i = 0; i < count; i++) {
            story = this.data[i]; 
            
            if (story.id == storyID) {                   
                index = i;
                break;
            }
        }
    }
    return index;
}

/**
 * @description Prepares the map layers
 * @alias prepareMap
 * @return Null
 */  
StoryDetail.prototype.prepareMap = function () {    
    // Create background layers using ESRI web services 
    attribution = new ol.Attribution({
        html: 'Basemap provided by ESRI. Sources: Esri, HERE, DeLorme, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, © OpenStreetMap contributors, and the GIS User Community.'
    });

    this.roadBasemap = new ol.layer.Tile({
        id: 'Road',
        visible: true,
        source: new ol.source.XYZ({
            attributions: [attribution],
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                 'World_Street_Map/MapServer/tile/{z}/{y}/{x}'
        })
    });

    this.topoBasemap = new ol.layer.Tile({
        id: 'Topo',
        visible: false,
        source: new ol.source.XYZ({
            attributions: [attribution],
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        })
    });
  
    var attribution = new ol.Attribution({
        html: 'Basemap provided by ESRI. Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community.'
    });
    
    this.aerialBasemap =  new ol.layer.Group({
        id: 'Aerial',
        visible: false,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: [attribution],
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                         'World_Imagery/MapServer/tile/{z}/{y}/{x}'
                })            
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: [attribution],
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/' +
                         'World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
                })            
            })
        ]        
    });
}

/**
 * @description Updates the map
 * @alias updateMap
 * @param {Number} lat Latitude degrees of the map center
 * @param {Number} lon Longitude degrees of the map center
 * @return Null
 */  
StoryDetail.prototype.updateMap = function (lon, lat) { 
    var d = this;
    var center = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'); 
    
    if (this.mapLoaded) {
        var ptFeature = new ol.Feature({
            geometry: new ol.geom.Point(center)
        });
        
        var targetSource = new ol.source.Vector({
            features: [ptFeature]
        });
      
        this.targetLayer.setSource(targetSource);
        this.map.getView().setCenter(center);
        this.map.updateSize();
    }
    else {   
        var targetStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 12,
                stroke: new ol.style.Stroke({
                  color: '#000',
                  width: 1
                }),
                fill: new ol.style.Fill({
                  color: 'rgba(255,255,255,0.9)'
                })
            }),
            text: new ol.style.Text({
                text: 'i',            
                font: 'bold 12px Poppins, sans-serif',
                offsetY: 2,
                fill: new ol.style.Fill({
                  color: '#000'
                })
            })
        });
        
        var ptFeature = new ol.Feature({
            geometry: new ol.geom.Point(center)
        });
        
        var targetSource = new ol.source.Vector({
            features: [ptFeature]
        });
      
        this.targetLayer = new ol.layer.Vector({
            source: targetSource,
            style: targetStyle
        });

        var controls = ol.control.defaults({
            zoom : false,
        });
        
        var interactions = ol.interaction.defaults({
            altShiftDragRotate: false, 
            doubleClickZoom: false, 
            keyboard: false, 
            mouseWheelZoom: false, 
            shiftDragZoom: false, 
            dragPan: false, 
            pinchRotate: false, 
            pinchZoom: false
        });
        
        this.map = new ol.Map({
            layers: [this.roadBasemap, this.topoBasemap, this.aerialBasemap, this.targetLayer],
            controls: controls,
            interactions: interactions,
            target: document.getElementById(d.detailMap.substring(1)),
            view: new ol.View({
                center: center,
                zoom: 9
            })
        });
        this.mapLoaded = true;
    }
}

/**
 * @description Changes the map basemap to the specified resource
 * @alias changeBasemap
 * @param {String} basemap The name of the basemap to display
 * @return Null
 */  
StoryDetail.prototype.changeBasemap = function (basemap) {
    this.roadBasemap.set('visible', false);
    this.topoBasemap.set('visible', false);
    this.aerialBasemap.set('visible', false);

    if (basemap == 'road') {
        this.roadBasemap.set('visible', true);
    }
    else if (basemap == 'topo') {
        this.topoBasemap.set('visible', true);
    }
    else if (basemap == 'aerial') {
        this.aerialBasemap.set('visible', true);
    }
}


var storyList = new StoryList(
    '#sidebar',
    '.sidebar-menu-option',
    '#map-option',
    '.sidebar-content',
    '#list-container',
    '.story-details-link',
    '.list-item-place',
    '.list-item-date',
    '#date-sort-option',
    '#place-sort-option',
    '#list-message'
);

var storyDetail = new StoryDetail(
    '#detail-overlay',
    '.detail-bookend',   
    '#detail-page',
    '.story-details-link',
    '#map-popup',
    '#detail-close-button',
    '#previous-story-button',
    '#next-story-button',
    '#detail-map',
    '#detail-name',
    '#detail-place',
    '#detail-coordinates',
    '#detail-land-type',
    '#detail-date',
    '#detail-story',
    '#detail-actions',
    '#detail-web-link',
    '#detail-source'
);

var storyMap = new StoryMap(
    '#map-container',
    '#dr-map',
    '#drought-range-slider',
    '#road-basemap-option',
    '#topo-basemap-option',
    '#aerial-basemap-option',
    '#map-popup',
    '#map-popup-name',
    '#map-popup-date',
    '#sidebar-loader',
    storyList,
    storyDetail
);



