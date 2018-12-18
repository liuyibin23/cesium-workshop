// import x
(function () {
    "use strict";

    // TODO: Add your ion access token from cesium.com/ion/
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiN2ExYzEwOS1jZDZjLTQ2ZWUtOWRiYi01N2RhZGVlYzQ2NDIiLCJpZCI6NTIwMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjY5ODI3Mn0.bw9cJc3Paj06hBAw36CnFe2xsOusQ2lOhziy0dBPcAQ';

    // var longitude = 104.06001513237308;
    // var latitude = 30.57102115402871;
    // var height = 0;
    var heading = 10;

    var viewer = new Cesium.Viewer('cesiumContainer',{
        imageryProvider:new Cesium.createOpenStreetMapImageryProvider({
            url : 'https://a.tile.openstreetmap.org/'
            // url : 'http://a.tile.openstreetmap.fr/hot/'
        }),
        animation: false,
        timeline: false
    });
    
    // var viewer = new Cesium.Viewer('cesiumContainer',{
    //     imageryProvider:new Cesium.WebMapTileServiceImageryProvider({
    //         url : 'http://t0.tianditu.com/img_w/wmts?',
    //         layer:'img',
    //         style:'default',
    //         format:'tiles',
    //         tileMatrixSetID:'w',
    //         credit:new Cesium.Credit('天地图全球影像服务'),
    //         maximumLevel:18
    //     }),
    //     animation: false,
    //     timeline: false
    // });
    // var osmProvider = new Cesium.createOpenStreetMapImageryProvider({
    //     url : 'https://a.tile.openstreetmap.org/'
    // });

    var osmProvider = new Cesium.WebMapTileServiceImageryProvider({
                url : 'http://t0.tianditu.com/img_w/wmts?',
                layer:'img',
                style:'default',
                format:'tiles',
                tileMatrixSetID:'w',
                credit:new Cesium.Credit('天地图全球影像服务'),
                maximumLevel:18
            });
    osmProvider = viewer.imageryLayers.addImageryProvider(osmProvider);
    osmProvider.alpha = 0.5;
    osmProvider.brightness = 1.3;
    viewer._cesiumWidget._creditContainer.style.display = 'none';//代码消除水印
    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8080/tilesets/TestModel/tileset.json'
        // url: 'http://localhost:8080/tilesets/TilesetWithDiscreteLOD/tileset.json'
        // url : 'http://localhost:8080/tilesets/TilesetWithRequestVolume/tileset.json'
        // url : 'http://localhost:8080/tilesets/TilesetWithTreeBillboards/tileset.json'
        // url : 'http://localhost:8080/tilesets/Batched/BatchedWithoutBatchTable/tileset.json',
    }));
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));

    tileset.readyPromise.then(function (argument) {
        var x = tileset._root._initialTransform[12];
        var y = tileset._root._initialTransform[13];
        var z = tileset._root._initialTransform[14];
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        console.log(`model center:${cartographic.longitude},${cartographic.latitude},${cartographic.height}`);
        console.log(`model center:${Cesium.Math.toDegrees(cartographic.longitude)},${Cesium.Math.toDegrees(cartographic.latitude)},${Cesium.Math.toDegrees(cartographic.height)}`);

        // var position = Cesium.Cartesian3.fromDegrees(longitude,latitude,height);
        var position = new Cesium.Cartesian3(x,y,z);
        var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
        Cesium.Matrix4.multiply(mat,rotationX,mat);
        tileset._root.transform = mat;
        cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        console.log(`model center:${cartographic.longitude},${cartographic.latitude},${cartographic.height}`);
        // viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
        // // if(viewer.scene.primitives._primitives[0].root.contentReady){
        // //     viewer.scene.primitives._primitives[0].root._content.features[231].color = Cesium.Color.RED;
        // // }else{
        // //     viewer.scene.primitives._primitives[0].root._contentReadyPromise.then(function(arg){
        // //         viewer.scene.primitives._primitives[0].root._content.features[231].color = Cesium.Color.RED;
        // //     });
        // // }

    });

    // var heightOffset = -32;
    // tileset.readyPromise.then(function(tileset) {
    //     // Position tileset
    //     var boundingSphere = tileset.boundingSphere;
    //     var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    //     var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    //     var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
    //     var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    //     tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    // });

    
    var defaultStyle = new Cesium.Cesium3DTileStyle({
        color:"color('white')",
        show:true
    });
    var yellowStyle = new Cesium.Cesium3DTileStyle({
        color:"color('yellow')",
        show:true
    });
    var transparentStyle = new Cesium.Cesium3DTileStyle({
        color:"color('yellow',0.3)",
        show:true
    });
    //Basic_Roof:Live_Roof_over_Wood_Joist_Flat_Roof:184483_mesh22424-Mesh
    //Basic_Wall:Exterior_-_Brick_on_Block:143478_mesh5445-Mesh
    var wallStyle = new Cesium.Cesium3DTileStyle({
        color:{
            conditions:[
                ["${name} === 'Basic_Roof:Live_Roof_over_Wood_Joist_Flat_Roof:184483_mesh22424-Mesh'","rgba(45,0,75,0.5)"],
                ["${name} === 'Basic_Wall:Exterior_-_Brick_on_Block:143478_mesh5445-Mesh'","rgba(45,0,75,0.5)"],
                ["true","color('red')"]
            ]
        }
    });
    tileset.style = defaultStyle;

    var tileStyle = document.getElementById('tileStyle1');
    function set3DTileStyle() {
        var selectedStyle = tileStyle.options[tileStyle.selectedIndex].value;
        if (selectedStyle === 'none') {
            tileset.style = defaultStyle;
            // alert('none');
        } else if (selectedStyle === 'yellowStyle') {
            tileset.style = yellowStyle;
            // alert('yellowStyle');
        } else if (selectedStyle === 'transparent') {
            tileset.style = transparentStyle;
            // alert('transparent');
        } else if(selectedStyle === 'wallStyle'){
            tileset.style = wallStyle;
            // alert('wallStyle');
        }
    }
    tileStyle.addEventListener('change', set3DTileStyle);

    var handler = viewer.screenSpaceEventHandler;

    var previousModel;

    handler.setInputAction(function (movement) {
        // if(viewer.scene.primitives._primitives[0]._root.contentReady){
        //     if(viewer.scene.primitives._primitives[0]._root._content._features){
        //         viewer.scene.primitives._primitives[0]._root._content._features[231].color = Cesium.Color.RED;
        //     }
        // }
        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.endPosition);
        // if(Cesium.defined(pickedFeature)){
        //     pickedFeature.get
        //     var name = pickedFeature.getProperty('name');
        //     Console.log(name);
        // }    

        if (Cesium.defined(previousModel)) {
            previousModel.color = { red: 1, green: 1, blue: 1, alpha: 1 };
        }

        if (Cesium.defined(pickedFeature)) { //pickedFeature={content:Batched3DModel3DTileContent,primitive:Cesium3DTileset}
            // console.log(Object.getPrototypeOf(pickedFeature));
            if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                var propertyNames = pickedFeature.getPropertyNames();
                var length = propertyNames.length;
                for (var i = 0; i < length; ++i) {
                    var propertyName = propertyNames[i];
                    console.log(propertyName + ': ' + pickedFeature.getProperty(propertyName));
                }

                var name = pickedFeature.getProperty('name');
                console.log(`====nameproperty:${name}`);
                if(name.split(':')[0] ==='Basic_Roof'){
                    pickedFeature.color = Cesium.Color.RED;
                } else if(name.split(':')[0] ==='Basic_Wall'){
                    pickedFeature.color = Cesium.Color.BLUE;
                } else if(name.split(':')[0] ==='M_Bed-Standard'){
                    pickedFeature.color = Cesium.Color.YELLOW;
                }
            }



            // var content = pickedFeature.content; //
            // var model = content._model;
            // model.color = Cesium.Color.RED;
            // previousModel = model;


            // var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
            // var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            // var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,10);
            // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
            // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        }



    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    // //鼠标点击监听，获取屏幕坐标-弧度制-经纬度
    // handler.setInputAction(function (click) {
    //     var screenX = click.position.x;
    //     var screenY = click.position.y;
    //     // console.log("像素:"+screenX+"："+ screenY)
    //     var cartesianPosition = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(screenX, screenY));
    //     var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);  //结果是弧度制
    //     var longitudeString = Cesium.Math.toDegrees(cartographicPosition.longitude);
    //     var latitudeString = Cesium.Math.toDegrees(cartographicPosition.latitude);
    //     console.log(`经纬度:${longitudeString},${latitudeString}`);
    //     console.log(`弧度制:${cartographicPosition.longitude},${cartographicPosition.latitude}`);
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    document.getElementById("btn_color").onclick = function(){
        if(viewer.scene.primitives._primitives[0]._root.contentReady){
            if(viewer.scene.primitives._primitives[0]._root._content._features){
                if(viewer.scene.primitives._primitives[0]._root._content._features[231].color.equals(Cesium.Color.RED)){
                    viewer.scene.primitives._primitives[0]._root._content._features[231].color = Cesium.Color.YELLOW;
                } else {
                    viewer.scene.primitives._primitives[0]._root._content._features[231].color = Cesium.Color.RED;
                }
            }
        }
        // alert("hello");
    }





    // /**
    //  * 动态添加气泡窗口
    //  */
    // var removeHandler;
    // var content;
    // var autoInfoWindow;
    // var infoDiv = '<div id="trackPopUp" style="display:none;">'+
    //     '<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">'+
    //     '<a class="leaflet-popup-close-button" href="#">×</a>'+
    //     '<div class="leaflet-popup-content-wrapper">'+
    //     '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;"></div>'+
    //     '</div>'+
    //     '<div class="leaflet-popup-tip-container">'+
    //     '<div class="leaflet-popup-tip"></div>'+
    //     '</div>'+
    //     '</div>'+
    //     '</div>';
    // $("#cesiumContainer").append(infoDiv);
    // var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //
    // handler3D.setInputAction(function(movement) {
    //     var pick = viewer.scene.pick(movement.position);
    //     if(pick && pick instanceof Cesium.Cesium3DTileFeature){
    //         console.log('picked batchedId:${pick._batchedId}');
    //         $('#trackPopUp').show();
    //         var cartesianPosition = viewer.camera.pickEllipsoid(movement.position);
    //         // var cartographic = Cesium.Cartographic.fromCartesian(movement.position);
    //         var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);
    //         var point=[cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
    //         var destination=Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
    //         // var id=pick.id._id.replace(/[^0-9]/ig,"");
    //         content =
    //             '<table><tbody><tr><th style="color:black;">'+pick._batchedId+'</th><td><button style="color:black;" onclick="updateValve('+pick._batchedId+')">确定</button></td><td><button onclick="deleteValve('+pick._batchedId+')" style="color:black;">删除</button></td></tr>'+
    //             '<tr><th style="color:black;">类型</th><td><input style="color:black;" value='+pick._batchedId+'></td></tr>'+
    //             '<tr><th style="color:black;">经度</th><td><input id="x" style="color:black;" value='+point[0]+'></td></tr>'+
    //             '<tr><th style="color:black;">纬度</th><td><input id="y" style="color:black;" value='+point[1]+'></td></tr>'+
    //             '</tbody></table>'
    //         var obj = {position:movement.position,destination:destination,content:content};
    //         infoWindow(obj);
    //
    //         function infoWindow(obj) {
    //             var picked = viewer.scene.pick(obj.position);
    //             $(".cesium-selection-wrapper").show();
    //             $('#trackPopUpLink').empty();
    //             $('#trackPopUpLink').append(obj.content);
    //             function positionPopUp (c) {
    //                 var x = c.x - ($('#trackPopUpContent').width()) / 2;
    //                 // var x = c.x;
    //                 var y = c.y - ($('#trackPopUpContent').height());
    //                 $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
    //             }
    //             var c = new Cesium.Cartesian2(obj.position.x, obj.position.y);
    //             $('#trackPopUp').show();
    //             positionPopUp(c); // Initial position
    //
    //
    //
    //             if (Cesium.defined(picked)) {
    //                 var id = Cesium.defaultValue(picked.id, picked.primitive.id);
    //                 if (id instanceof Cesium.Entity) {
    //                     $(".cesium-selection-wrapper").show();
    //                     $('#trackPopUpLink').empty();
    //                     $('#trackPopUpLink').append(obj.content);
    //                     function positionPopUp (c) {
    //                         var x = c.x - ($('#trackPopUpContent').width()) / 2;
    //                         var y = c.y - ($('#trackPopUpContent').height());
    //                         $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
    //                     }
    //                     var c = new Cesium.Cartesian2(obj.position.x, obj.position.y);
    //                     $('#trackPopUp').show();
    //                     positionPopUp(c); // Initial position
    //                     // at the place item
    //                     // picked
    //                     removeHandler = viewer.scene.postRender.addEventListener(function () {
    //                         if(picked.id._polyline!=null){
    //                             var pos={};
    //                             pos.x=(id._polyline._positions._value["0"].x+id._polyline._positions._value[1].x)/2;
    //                             pos.y=(id._polyline._positions._value["0"].y+id._polyline._positions._value[1].y)/2;
    //                             pos.z=(id._polyline._positions._value["0"].z+id._polyline._positions._value[1].z)/2;
    //                             var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,pos);
    //                         }else{
    //                             var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, id._position._value);
    //                         }// If things moved, move the
    //                         // popUp too
    //                         if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
    //                             positionPopUp(changedC);
    //                             c = changedC;
    //                         }
    //                     });
    //                     // PopUp close button event handler
    //                     $('.leaflet-popup-close-button').click(function() {
    //                         $('#trackPopUp').hide();
    //                         $('#trackPopUpLink').empty();
    //                         $(".cesium-selection-wrapper").hide();
    //                         removeHandler.call();
    //                         return false;
    //                     });
    //                     return id;
    //                 }
    //             }
    //         }
    //     }
    //     else{
    //         $('#trackPopUp').hide();
    //
    //     }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // $(document).ready(function () {
    //     //console.log('1');
    //     alert(1);
    // })

    var _teemo_canvas = viewer.scene.canvas;
    var _teemo_scene = viewer.scene;
    var _teemo_camera = viewer.camera;
    var _teemo_viewer = viewer;
    var _position, _pm_position, _cartesian, max_width = 300, max_height = 500, infoDiv;
    var handler_teemo = new Cesium.ScreenSpaceEventHandler(_teemo_canvas);
    // handler_teemo.setInputAction(function (CLICK) {
    //     //http://blog.csdn.net/u013929284/article/details/52503295
    //     var cartesian = _teemo_scene.globe.pick(_teemo_camera.getPickRay(CLICK.position), _teemo_scene);
    //     var cartographic = _teemo_scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    //     var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_teemo_scene, cartesian);

    //     _position = CLICK.position;
    //     _cartesian = cartesian;
    //     _pm_position = {x: picks.x, y: picks.y}

    //     var lng = cartographic.longitude * 180 / Math.PI;
    //     var lat = cartographic.latitude * 180 / Math.PI;
    //     var hei = cartographic.height;

    //     if (infoDiv) {
    //         console.warn("气泡尚未关闭");
    //         return false;
    //     }else {
    //         infoDiv = window.document.createElement("div");
    //         infoDiv.id = "trackPopUp";
    //         infoDiv.style.display = "none";
    //         //style="top:0;left:0;"
    //         infoDiv.innerHTML = '<div id="trackPopUpContent" class="leaflet-popup">' +
    //             '<a class="leaflet-popup-close-button" href="javascript:void(0)">×</a>' +
    //             '<div class="leaflet-popup-content-wrapper">' +
    //             '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: ' + max_width + 'px;max-height: ' + max_height + 'px"><h2>这是一个大大的提示气泡</h2></div>' +
    //             '</div>' +
    //             '<div class="leaflet-popup-tip-container">' +
    //             '<div class="leaflet-popup-tip"></div>' +
    //             '</div>' +
    //             '</div>';

    //         window.document.getElementById("cesiumContainer").appendChild(infoDiv);
    //         window.document.getElementById("trackPopUp").style.display = "block";
    //     }

    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    // var _pm_position_2;
    // _teemo_viewer.scene.postRender.addEventListener(function () {

    //     if (_pm_position != _pm_position_2) {
    //         _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_teemo_scene, _cartesian);
    //         // var popw = document.getElementById("trackPopUpContent").offsetWidth;
    //         // var poph = document.getElementById("trackPopUpContent").offsetHeight;

    //         // var trackPopUpContent_ = window.document.getElementById("trackPopUpContent");
    //         // trackPopUpContent_.style.left = _pm_position_2.x-(popw/2) + 'px';
    //         // trackPopUpContent_.style.top = _pm_position_2.y-(poph-10) + 'px';
    //         // trackPopUpContent_.style.left = 100 + '';
    //         // trackPopUpContent_.style.top = 100 + '';

    //         var popw = $('#trackPopUpContent').width();
    //         var poph = $('#trackPopUpContent').height();

    //         $('#trackPopUpContent').css('top',_pm_position_2.y-(poph-10) + 'px');
    //         $('#trackPopUpContent').css('left',_pm_position_2.x-(popw/2) +'px');
    //     }

    // });

}());


