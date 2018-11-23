// import x
(function () {
    "use strict";

    // TODO: Add your ion access token from cesium.com/ion/
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiN2ExYzEwOS1jZDZjLTQ2ZWUtOWRiYi01N2RhZGVlYzQ2NDIiLCJpZCI6NTIwMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjY5ODI3Mn0.bw9cJc3Paj06hBAw36CnFe2xsOusQ2lOhziy0dBPcAQ';

    var longitude = 104.06001513237308;
    var latitude = 30.57102115402871;
    var height = 0;
    var heading = 0;

    var viewer = new Cesium.Viewer('cesiumContainer');
    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'http://localhost:8080/tilesets/TilesetWithDiscreteLOD/tileset.json'
        // url : 'http://localhost:8080/tilesets/TilesetWithRequestVolume/tileset.json'
        // url : 'http://localhost:8080/tilesets/TilesetWithTreeBillboards/tileset.json'
        // url : 'http://localhost:8080/tilesets/Batched/BatchedWithoutBatchTable/tileset.json',
    }));
    // viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));

    tileset.readyPromise.then(function (argument) {
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        console.log(`model center:${cartographic.longitude},${cartographic.latitude},${cartographic.height}`);
        var position = Cesium.Cartesian3.fromDegrees(longitude,latitude,height);
        var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
        Cesium.Matrix4.multiply(mat,rotationX,mat);
        tileset._root.transform = mat;
        cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        console.log(`model center:${cartographic.longitude},${cartographic.latitude},${cartographic.height}`);
        viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
    });


    var handler = viewer.screenSpaceEventHandler;

    var previousModel;

    handler.setInputAction(function (movement) {
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


    //鼠标点击监听，获取屏幕坐标-弧度制-经纬度
    handler.setInputAction(function (click) {
        var screenX = click.position.x;
        var screenY = click.position.y;
        // console.log("像素:"+screenX+"："+ screenY)
        var cartesianPosition = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(screenX, screenY));
        var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);  //结果是弧度制
        var longitudeString = Cesium.Math.toDegrees(cartographicPosition.longitude);
        var latitudeString = Cesium.Math.toDegrees(cartographicPosition.latitude);
        console.log(`经纬度:${longitudeString},${latitudeString}`);
        console.log(`弧度制:${cartographicPosition.longitude},${cartographicPosition.latitude}`);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}());