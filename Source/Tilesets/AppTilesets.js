// import x
(function () {
    "use strict";

    // TODO: Add your ion access token from cesium.com/ion/
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiN2ExYzEwOS1jZDZjLTQ2ZWUtOWRiYi01N2RhZGVlYzQ2NDIiLCJpZCI6NTIwMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjY5ODI3Mn0.bw9cJc3Paj06hBAw36CnFe2xsOusQ2lOhziy0dBPcAQ';

    var viewer = new Cesium.Viewer('cesiumContainer');
	var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    // url : 'http://localhost:8080/tilesets/TilesetWithDiscreteLOD/tileset.json'
    url : 'http://localhost:8080/tilesets/TilesetWithRequestVolume/tileset.json'
	}));
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
    
    var handler = viewer.screenSpaceEventHandler;

    var previousModel;

    handler.setInputAction(function (movement){
        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.endPosition);
        // if(Cesium.defined(pickedFeature)){
        //     pickedFeature.get
        //     var name = pickedFeature.getProperty('name');
        //     Console.log(name);
        // }    

        if(Cesium.defined(previousModel)){
            previousModel.color = {red:1,green:1,blue:1,alpha:1};
        }

        if(Cesium.defined(pickedFeature)){ //pickedFeature={content:Batched3DModel3DTileContent,primitive:Cesium3DTileset}
            // console.log(Object.getPrototypeOf(pickedFeature));
            if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
                var propertyNames = pickedFeature.getPropertyNames();
                var length = propertyNames.length;
                for (var i = 0; i < length; ++i) {
                    var propertyName = propertyNames[i];
                    console.log(propertyName + ': ' + pickedFeature.getProperty(propertyName));
                }
            }
            var content = pickedFeature.content; //
            var model = content._model;
            model.color = Cesium.Color.RED;
            previousModel = model;
        }
          
        

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}());