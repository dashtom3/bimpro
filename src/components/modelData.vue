<template>
  <div>
    <div id="container" v-loading.body="fullscreenLoading" :element-loading-text="'模型加载中..'+loadPercent">
        <canvas id="canvas"></canvas>
    </div>
    <!-- <div id="info">选中的模型:		NULL</div> -->
    <div class="ulcontent" v-if="basicData != null">
      <div v-for="value,key in basicData[0].jsonVal">
        <el-row class="basicTable" >
            <div class="leftText"><span>{{basicData[0].key}}</span><span>({{key}})</span>
              <el-button type="text" class="basicButton">关闭</el-button>
            </div>
        </el-row>
        <el-row class="basicTable">
              <el-row v-for="value2,key2 in value" v-if="typeof value2 != 'string'" class="basicContent">
                <span>{{key2}}:
                </span>
                  <el-tag v-for="value3,key3 in value2" class="tagClass">
                    {{key3}}:{{value3}}
                  </el-tag>
              </el-row>
              <el-tag v-for="value2,key2 in value" v-if="typeof value2 == 'string'" class="tagClass">
                  {{key2}}:{{value2}}
              </el-tag>
        </el-row>
      </div>
    </div>
    <div class="ulbottom">
      <h5>工序编号</h5>
      <ul class="ullist">
        <li v-for="item,index in proData" v-bind:class="{liactive: selectedPro == item}" @click="selectPro(item,index)">
          <span>{{item.consPhaseNumber}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import global from './global.js'
  export default {
    data() {
      return {
        proData:null,
        basicData:null,
        selectedPro:null,
        loadPercent:"0%",
        fullscreenLoading: false,
      }
    },
    created(){
      this.getBasisDataList("L4L0")
      this.getProDataList()
    },
    mounted(){
      init(this);
      animate();
    },
    methods: {
      selectPro(item,index){
        this.selectedPro = item
        console.log(this.proData);
        this.getAllBasic(index)
      },
      getAllBasic(index){
        var temp = [];
        for(var i=0;i<=index;i++){
          if(this.proData[i].associatedUnit != ''){
            temp = this.dataOperate(temp,this.proData[i].associatedUnit.split(","));
          }
        }
        console.log(temp)
      },
      dataOperate(arr1,arr2){
          //不要直接使用var arr = arr1，这样arr只是arr1的一个引用，两者的修改会互相影响
          var arr = arr1.concat();
          //或者使用slice()复制，var arr = arr1.slice(0)
          for(var i=0;i<arr2.length;i++){
              arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
          }
          return arr;
      },
      getProDataList(){
        var self = this
        global.apiGetWithToken(this,global.baseUrl+'returnProList').then((res)=>{
            // console.log(res)
            self.proData = res.data.data
        })
      },
      getBasisDataList(basicKey){
        var self = this
        String.prototype.myReplace=function(f,e){//吧f替换成e
          var reg=new RegExp(f,"g"); //创建正则RegExp对象
          return this.replace(reg,e);
        }
        global.apiGetWithToken(this,global.baseUrl+'returnBasisData?key='+basicKey).then((res)=>{
            res.data.data.forEach(function(item){
              // item.jsonVal = JSON.parse(item.value)
              // item.jsonVal = item.value.parseJSON();
              item.value = item.value.myReplace("{", "{\"");
              item.value = item.value.myReplace("={", "\":{");
              item.value = item.value.myReplace("=", "\":\"");
              item.value = item.value.myReplace(",", "\",\"");
              item.value = item.value.myReplace("}\",", "},");
              item.value = item.value.myReplace("}", "\"}");
              item.value = item.value.myReplace("}\"}", "}}");
              item.value = item.value.myReplace("}\"}", "}}");
              console.log(item.value)
              item.jsonVal = JSON.parse(item.value);
            })
            self.basicData = res.data.data
            // console.log(res)
        })
      }
    }
  }
  function $(id){return document.getElementById(id);}

  var container;

  var camera, scene, renderer;
  var cameraControls;

  var clock = new THREE.Clock();
  var raycaster = new THREE.Raycaster();
  //    var transparentMat = new THREE.MeshPhongMaterial({color: 0xcccccc, transparent:true, opacity:0.7});
  var fileType = "shenzhen";
  var resourceFolder = "/static/3d/resource/";
  var modelExtension = ".obj";
  var materialExtension = ".mtl";
  var arrowObj;
  var arrowSize;
  var arrowSpeed = 0.2;

  var curObjects = [];
  var selectObj;
  var oldMat;
  var selectMat = new THREE.MeshPhongMaterial({color: 0x00D66B});
  // var flowPositions = {};
  // var pressurePositions = {};     //压力表显示位置列表
  // var pipeObjects = [];           //管道模型对象列表
  // var flowArrowList = [];         //表示水流箭头的模型对象列表
  // var pressureSpriteList = {};    //压力值sprite列表
  // var pumpStateSpriteList = {};   //泵状态sprite列表
  // var pumpObjects = {};           //泵模型对象列表
  // var pumpPipeList = {};          //泵所对应管道列表
  // var pumpGroupList = {};         //泵所对应组模型列表

  // var pumpState1Material = new THREE.MeshPhongMaterial({color: 0x1a237e});    //状态1颜色值
  // var pumpState2Material = new THREE.MeshPhongMaterial({color: 0x42a5f5});    //状态2颜色值
  // var pumpState3Material = new THREE.MeshPhongMaterial({color: 0xf44336});    //状态3颜色值

  // var waterTexture = new THREE.TextureLoader().load("/static/3d/resource/texture/water.png");
  // waterTexture.wrapS = THREE.RepeatWrapping;
  // waterTexture.wrapT = THREE.RepeatWrapping;
  // waterTexture.repeat.set( 2, 2 );
  // var waterMat = new THREE.MeshPhongMaterial({map: waterTexture, side: THREE.DoubleSide, transparent:true, opacity:0.7});
  //
  // //========测试btn变量========
  // var isShowFlow = false;
  // var isShowPressure = false;
  //=======================

  // init();
  // animate();

  /**
   * 获取某个object的center
   */
  function getCenterOfObject(object) {
      var center = new THREE.Vector3();
      var geometry = object.geometry;
      geometry.computeBoundingBox();
      center.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
      center.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
      center.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
      object.localToWorld( center );
      return center;
  }

  /**
   * 导入模型文件
   * @param fileName: 文件名，不包含文件后缀（如"01"对应模型为"resource/01/01.obj"）
   */
  function loadFile(fileName,self){
      var resourcePath = resourceFolder + fileName + "/" + fileName;
      if(!isExist(resourcePath + modelExtension)) {
          return;
      }

      var onProgress = function(xhr) {
          if (xhr.lengthComputable) {
              var percentComplete = xhr.loaded / xhr.total * 100;
              self.loadPercent = Math.round(percentComplete, 2) + "%";
              console.log(fileName + " " + Math.round(percentComplete, 2) + '% downloaded');
          }
      };

      var onError = function(xhr) {
          console.error("load model: " + fileName + " error");
      };

      var mtlLoader = new THREE.MTLLoader();
      mtlLoader.setPath( resourceFolder + "/" );
      mtlLoader.load( fileName + materialExtension, function( materials ) {
          materials.preload();

          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials( materials );
          objLoader.setPath( resourceFolder + "/" );
          console.log(resourceFolder + fileName + "/")
          objLoader.load( fileName + modelExtension, function ( object ) {
              scene.add( object );
              var vertices = [];
              for(var i = 0; i < object.children.length; ++i)
              {
                  // console.log(object.children[i])
                  // curObjects.push(object.children[i]);
                  for(var j=0; j<object.children[i].geometry.attributes.position.array.length; ++j)
                      vertices.push(object.children[i].geometry.attributes.position.array[j]);
              }

              var box = new THREE.Box3();
              var vector = new THREE.Vector3();

              var boundingSphere = new THREE.Sphere();
              var center = boundingSphere.center;

              box.setFromArray( vertices );
              box.center( center );

              var maxRadiusSq = 0;

              for ( var i = 0, il = vertices.length; i < il; i += 3 ) {
                  vector.fromArray( vertices, i );
                  maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );
              }

              boundingSphere.radius = Math.sqrt( maxRadiusSq );
              camera.position.set(center.x, center.y , center.z + boundingSphere.radius + 100 );

              // CONTROLS
              cameraControls.target.set( center.x, center.y, center.z );
              loadCompleted(fileName);
              // loadArrow();
              //关闭加载
              self.fullscreenLoading = false;
          }, onProgress, onError );
      });
  }

  function loadArrow() {
      var onProgress = function ( xhr ) {
          if ( xhr.lengthComputable ) {
              var percentComplete = xhr.loaded / xhr.total * 100;
              console.log("arrow "+ Math.round(percentComplete, 2) + '% downloaded' );
          }
      };

      var onError = function ( xhr ) {
          console.error("load arrow "  + " error");
      };

      var mtlLoader = new THREE.MTLLoader();
      mtlLoader.setPath( resourceFolder + "arrow/" );
      mtlLoader.load( "arrow" + materialExtension, function( materials ) {
          materials.preload();

          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.setPath( resourceFolder + "arrow/" );
          objLoader.load( "arrow" + modelExtension, function (object) {
              var maxX = 0;
              for(var i=0; i<object.children.length; ++i)
              {
                  for(var j=0; j<object.children[i].geometry.attributes.position.array.length; j+=3) {
                      if(maxX < Math.abs(object.children[i].geometry.attributes.position.array[j]))
                          maxX = Math.abs(object.children[i].geometry.attributes.position.array[j]);
                  }
              }
              arrowObj = object;
              arrowObj.scale.set(0.7, 0.7, 0.7);
              arrowSize = maxX*0.7;
              loadCompleted("arrow");
          }, onProgress, onError);
      });
  }

  function loadCompleted(resourceName) {
      console.log("load model " + resourceName + " completed");
  }
  /**
   * 显示气压值
   * @param index: 气压表索引值
   * @param value: 气压值
   * @param bShow: 是否显示气压值
   */
  function showPressureSprite(index, value, bShow) {
      if(pressurePositions[index] != null) {
        if(pressureSpriteList[index] !== undefined) {
            scene.remove(pressureSpriteList[index]);
            pressureSpriteList[index] = undefined;
        }
        if(bShow == true) {
            var sprite = makeTextSprite( " " + value + " ",
                { fontsize: 64, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
            sprite.position.set(pressurePositions[index].x, pressurePositions[index].y, pressurePositions[index].z);
            pressureSpriteList[index] = sprite;
            scene.add( sprite );
        }
      }
  }


  /**
   * 改变泵的状态
   * @param index 泵的编号
   * @param state 泵的状态 0:停止 1：变频 2：工频 3： 故障
   */
  function changePumpState(index, state) {
      if(pumpObjects[index] === undefined)
          return;
      switch (state) {
          case "泵休息":
              changePumpVisible(index, true);
              changePumpMat(index);
              changePumpStateSprite(index, "泵休息");
              changePumpPipeMat(index, false);
              break;
          case "泵变频":
              changePumpVisible(index, true);
              changePumpMat(index, pumpState1Material);
              changePumpStateSprite(index, "泵变频");
              changePumpPipeMat(index, true);
              break;
          case "泵运行":
              changePumpVisible(index, true);
              changePumpMat(index, pumpState2Material);
              changePumpStateSprite(index, "泵运行");
              changePumpPipeMat(index, true);
              break;
          case "泵故障":
              changePumpVisible(index, true);
              changePumpMat(index, pumpState3Material);
              changePumpStateSprite(index, "泵故障");
              changePumpPipeMat(index, false);
              break;
          case "":
              changePumpVisible(index, false);
              break;
          default:
              break;
      }
  }


  /**
   * 改变泵的显隐（顺便修改管道的显隐）
   * @param index 泵的编号
   * @param visible 显示或隐藏
   */
  function changePumpVisible(index, visible) {
      for(var i=0; i<pumpObjects[index].length; ++i)
          pumpObjects[index][i].visible = visible;
      for(var i=0; i<pumpPipeList[index].length; ++i)
          pumpPipeList[index][i].visible = visible;
      for(var i=0; i<pumpGroupList[index].length; ++i)
          pumpGroupList[index][i].visible = visible;
      if(pumpStateSpriteList[index] != undefined && pumpStateSpriteList[index] != null)
          pumpStateSpriteList[index].visible = visible;
  }

  //更改泵的材质
  function changePumpMat(index, mat) {
      for(var i=0; i<pumpObjects[index].length; ++i) {
          if(mat !== undefined)
              pumpObjects[index][i].material = mat;
          else
              pumpObjects[index][i].material = pumpObjects[index][i].oldmat;
      }
  }
  //更改泵所对应管道状态
  function changePumpPipeMat(index, isWork) {
      for(var i=0; i<pumpPipeList[index].length; ++i) {
          if(isWork)
              pumpPipeList[index][i].material = waterMat;
          else
              pumpPipeList[index][i].material = pumpPipeList[index][i].oldmat;
      }
  }
  //更改泵的状态sprite
  function changePumpStateSprite(index, stateStr) {
      scene.remove(pumpStateSpriteList[index]);
      var sprite = makeTextSprite( " " + stateStr + " ",
          { fontsize: 64, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
      var pos = pumpStateSpriteList[index].position.clone();
      sprite.position.set(pos.x, pos.y, pos.z);
      scene.add(sprite);
      pumpStateSpriteList[index] = sprite;
  }

  //判断资源是否存在
  function isExist(url) {
      try {
          var xmlhttp;
          if (window.XMLHttpRequest) {
              xmlhttp = new XMLHttpRequest();
          } else {
              xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
          xmlhttp.open("get", url, false);
          xmlhttp.send();
          return !(xmlhttp.stacks==="404");
      } catch (e) {
          return false;
      }
  }

  /**
   * 创建显示板
   * @param message 要显示文字
   * @param parameters 样式
   * @returns {THREE.Sprite}
   */
  function makeTextSprite( message, parameters )
  {
      if ( parameters === undefined ) parameters = {};

      var fontface = parameters.hasOwnProperty("fontface") ?
          parameters["fontface"] : "Arial";

      var fontsize = parameters.hasOwnProperty("fontsize") ?
          parameters["fontsize"] : 18;

      var borderThickness = parameters.hasOwnProperty("borderThickness") ?
          parameters["borderThickness"] : 4;

      var borderColor = parameters.hasOwnProperty("borderColor") ?
          parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

      var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
          parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

  //      var spriteAlignment = THREE.SpriteAlignment.topLeft;

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      context.font = "Bold " + fontsize + "px " + fontface;

      var metrics = context.measureText( message );
      var textWidth = metrics.width;

      // background color
      context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
          + backgroundColor.b + "," + backgroundColor.a + ")";
      // border color
      context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
          + borderColor.b + "," + borderColor.a + ")";

      context.lineWidth = borderThickness;
      roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

      // text color
      context.fillStyle = "rgba(0, 0, 0, 1.0)";

      context.fillText( message, borderThickness, fontsize + borderThickness);

      var texture = new THREE.Texture(canvas)
      texture.needsUpdate = true;

      var spriteMaterial = new THREE.SpriteMaterial(
          { map: texture } );
      var sprite = new THREE.Sprite( spriteMaterial );
      sprite.scale.set(200,100,2.0);
      return sprite;
  }
  function roundRect(ctx, x, y, w, h, r)
  {
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.lineTo(x+w-r, y);
      ctx.quadraticCurveTo(x+w, y, x+w, y+r);
      ctx.lineTo(x+w, y+h-r);
      ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      ctx.lineTo(x+r, y+h);
      ctx.quadraticCurveTo(x, y+h, x, y+h-r);
      ctx.lineTo(x, y+r);
      ctx.quadraticCurveTo(x, y, x+r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  }



  /**
   * 初始化场景
   */
  function init(self) {
      container = $( 'container' );
      camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000 );

      // scene
      scene = new THREE.Scene();

      var ambient = new THREE.AmbientLight( 0x666666 );
      scene.add( ambient );

      var directionalLight = new THREE.DirectionalLight( 0xdfebff );
      directionalLight.position.set( 50, 200, 100 );
      scene.add( directionalLight );

      THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
      loadFile(fileType,self);            //导入模型文件

      //
      renderer = new THREE.WebGLRenderer({canvas: $( 'canvas' ), antialias: true});
      renderer.setClearColor( 0xf0f0f0 );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( container.offsetWidth, container.offsetHeight );

      cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

      window.addEventListener( 'resize', onWindowResize, false );
      renderer.domElement.addEventListener( 'click', selectObject, false);
  }

  function onWindowResize() {
      camera.aspect = container.offsetWidth/container.offsetHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( container.offsetWidth, container.offsetHeight );
  }

  function animate() {
      requestAnimationFrame( animate );
      render();
  }
  function selectObject(event) {
    event.preventDefault();

    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersections = raycaster.intersectObjects( curObjects );

    if ( intersections.length > 0 ) {

      if ( selectObj != intersections[ 0 ].object ) {

        if ( selectObj ) selectObj.material = oldMat;

        selectObj = intersections[ 0 ].object;
        oldMat = selectObj.material;
        selectObj.material = selectMat;

      }

      document.body.style.cursor = 'pointer';

    }

    else if ( selectObj ) {

      selectObj.material = oldMat;
      selectObj = null;

      document.body.style.cursor = 'auto';

    }

    if(selectObj)
      console.log(selectObj);
  }
  function render() {
      TWEEN.update();

      if(cameraControls) {
          var delta = clock.getDelta();
          cameraControls.update(delta);
      }
      // waterTexture.offset.y = (clock.getElapsedTime()*0.1 * 3 % 1);

      renderer.render( scene, camera );
  }

</script>
<style scoped>
#container {
   height: 100vh;
   width: 100%;
   /*display: inline-block;*/
 }
  .ullist{
    overflow: hidden;
    list-style: none;
    padding: 0;
    /* border-top: 1px solid #eaeefb; */
    border-radius: 4px;
  }
  .ullist li {
    float: left;
    min-width:60px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    color: #666;
    font-size: 13px;
    transition: color .15s linear;
    border: 1px solid #eee;
    /* border-bottom: 1px solid #eee; */
    z-index: 0;
  }
  .ullist li:hover {
     border-color: #b3d8ff;
     background-color: #ecf5ff;
     position:relative;
     z-index:2;
     cursor:pointer;
     color: #409eff;
  }
  .liactive {
    border-color: #b3d8ff !important;
    background-color: #ecf5ff;
    position:relative;
    z-index:2;
    /* cursor:pointer; */
    color: #409eff !important;
  }
  .ulbottom {
    position: fixed;
    min-height: 100px;
    background-color: white;
    bottom: 0;
    padding:10px;
  }
  .ulcontent{
    position: fixed;
    height: 500px;
    top:20px;
    right: 20px;
    width:500px;
    background-color: white;
    overflow: scroll;
  }
  .basicTable {
    border-bottom: 1px solid #e6e6e6;
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .basicContent {
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 5px;
    padding-bottom: 3px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .tagClass {
    margin-right: 2px;
    margin-bottom: 2px;
  }
  .leftText {
    text-align:center;
  }
  .basicButton {
    float: right;
    padding: 0px;
    padding-right: 10px;
  }
</style>
