<template>
  <div>
    <div id="container" v-loading.body="fullscreenLoading" :element-loading-text="'模型加载中..'+loadPercent">
        <canvas id="canvas"></canvas>
    </div>
    <!-- <div id="info">选中的模型:		NULL</div> -->
    <div class="ulcontent" v-if="showBasicData">
      <div v-if="basicData.length > 0 ">
      <div  v-for="value,key in basicData[0].jsonVal" >
        <el-row class="basicTable" >
            <div class="leftText"><span>{{basicData[0].key}}</span><span>({{key}})</span>
              <el-button type="text" class="basicButton" @click="closeBasicData">关闭</el-button>
            </div>
        </el-row>
        <el-row class="basicTable">
              <el-row v-for="value2,key2 in value" v-if="typeof value2 != 'string'" class="basicContent">
                <el-col :span="4">
                  <div class="">
                    <span>{{key2}}
                    </span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div v-for="value3,key3 in value2" class="tagClass">
                    <div class="tagTop">
                      <span>{{key3}}</span>
                    </div>
                    <div class="tagBottom">
                      <span>{{value3}}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row v-if="typeof value[Object.keys(value)[0]] == 'string'" class="basicContent">
                <el-col :span="4">
                  <div class="">
                    <span>{{key}}
                    </span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div v-for="value2,key2 in value" class="tagClass">
                    <div class="tagTop">
                      <span>{{key2}}</span>
                    </div>
                    <div class="tagBottom">
                      <span>{{value2}}</span>
                    </div>
                  </div>
                </el-col>
              <!-- <el-tag v-for="value2,key2 in value"  class="tagClass">
                  {{key2}}:{{value2}}
              </el-tag> -->
              </el-row>
        </el-row>
      </div>
      </div>
      <div v-if="basicData.length == 0">
        <el-row class="basicTable" >
            <div class="leftText"><span>{{selectBasicObject}}</span>
              <el-button type="text" class="basicButton" @click="closeBasicData">关闭</el-button>
            </div>
        </el-row>
        <el-row class="basicTable2">
          <span>暂无数据</span>
        </el-row>
      </div>
    </div>
    <!-- <div class="ulbottom">
      <h5>工序编号</h5>
      <ul class="ullist">
        <li v-for="item,index in proData" v-bind:class="{liactive: selectedPro == item}" @click="selectPro(item,index)">
          <span>{{item.consPhaseNumber}}</span>
        </li>
      </ul>
    </div> -->
    <div class="ulTop">
      <div>
        <span>选择工序:</span>
        <el-select
          v-model="selectedPro"
          clearable
          placeholder="请选择"
          size=small
          value-key="consPhaseNumber"
          @change="selectPro"
          style="width:100px;">
          <el-option
            v-for="item in proData"
            :key="item.consPhaseNumber"
            :label="item.consPhaseNumber"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div style="backgroundColor:#d6d6d6;height:1px;width:100%;margin-top:5px;margin-bottom:5px"></div>
      <div>
        <span>工序名称:</span>
        <span v-if="selectBasic != null">{{selectedPro.processName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import global from './global.js'
  export default {
    data() {
      return {
        proData:null,
        basicData:[],
        selectedPro:null,
        loadPercent:"0%",
        fullscreenLoading: false,
        allBasic:null,
        selectBasic:null, //选择工序对应的关联单元
        showBasicData:false,
        selectBasicObject:null
      }
    },
    created(){
      // this.getBasisDataList("L4L0")

    },
    mounted(){
      this.fullscreenLoading = true;
      this.getProDataList()
    },
    methods: {
      //选择某个工序
      selectPro(item){
        // this.selectedPro = item
        var temp =this.proData.indexOf(item)
        if(temp != -1) {
          this.selectBasic = this.getAllBasic(temp)
          showBasics(this.selectBasic)
        }
      },
      closeBasicData(){
        this.showBasicData = false
        showBasics(this.selectBasic)
      },
      //得到所有关联单元数组
      getAllBasic(index){
        var temp = [];
        for(var i=0;i<=index;i++){
          if(this.proData[i].associatedUnit != ''){
            temp = this.dataOperate(temp,this.proData[i].associatedUnit.split(","));
          }
        }
        return temp
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
      //获取工序列表
      getProDataList(){
        var self = this
        global.apiGetWithToken(this,global.baseUrl+'returnProList').then((res)=>{
            // console.log(res)
            self.proData = res.data.data
            self.allBasic = self.getAllBasic(self.proData.length-1)
            init(self);
            animate();
        })
      },
      //获取某个关联单元数据
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
              item.jsonVal = JSON.parse(item.value);
            })

            self.basicData = res.data.data
            this.showBasicData = true;
            // console.log(res)
        }).catch(()=>{
            this.showBasicData = true;
        })
      }
    }
  }
  function $(id){return document.getElementById(id);}

  var container;
  var _this;
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
  var showObjects = [];
  var selectObj;
  var oldPos;
  var boundingSphere;
  var selectMat = new THREE.MeshPhongMaterial({color: 0x00D66B});
  var selectMat2 = new THREE.MeshPhongMaterial({color: 0x0000FF});

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
              // console.log(fileName + " " + Math.round(percentComplete, 2) + '% downloaded');
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
          // console.log(resourceFolder + fileName + "/")
          objLoader.load( fileName + modelExtension, function ( object ) {
              scene.add( object );
              var vertices = [];
              for(var i = 0; i < object.children.length; ++i)
              {
                  // console.log(object.children[i])

                  if(self.allBasic.indexOf(object.children[i].name) != -1) {
                    object.children[i].oldMaterial = object.children[i].material;
                    // object.children[i].oldMaterial = selectMat
                    // object.children[i].material = selectMat
                    curObjects.push(object.children[i]);
                  }
                  object.children[i].material.visible = false;
                  for(var j=0; j<object.children[i].geometry.attributes.position.array.length; ++j)
                      vertices.push(object.children[i].geometry.attributes.position.array[j]);
              }

              var box = new THREE.Box3();
              var vector = new THREE.Vector3();

              boundingSphere = new THREE.Sphere();
              var center = boundingSphere.center;

              box.setFromArray( vertices );
              box.center( center );

              var maxRadiusSq = 0;

              for ( var i = 0, il = vertices.length; i < il; i += 3 ) {
                  vector.fromArray( vertices, i );
                  maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );
              }

              boundingSphere.radius = Math.sqrt( maxRadiusSq );
              camera.position.set(center.x, center.y , center.z + boundingSphere.radius );

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
      _this = self
      container = $( 'container' );
      camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 1000000 );

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
      // renderer.domElement.addEventListener( 'dblclick', dblselectObject, false);
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
  function showBasics(arr){
    showObjects = []
    curObjects.forEach(function(item){
      if(arr.indexOf(item.name) == -1) {
        item.material = item.oldMaterial
        item.material.visible = false;
      } else {
        item.material = selectMat
        item.material.visible = true;
        showObjects.push(item)
      }
    })
  }
  function showTable(newSelectObject){
    if(_this.selectBasic.indexOf(newSelectObject.name) != -1){
      _this.selectBasicObject = newSelectObject.name
      _this.getBasisDataList(newSelectObject.name)
    }
  }
  // function dblselectObject(event) {
  //   console.log(camera.position)
  //   event.preventDefault();
  //
  //   var mouse = new THREE.Vector2();
  //   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  //   mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //
  //   raycaster.setFromCamera( mouse, camera );
  //
  //   var intersections = raycaster.intersectObjects( showObjects );
  //
  //   if ( intersections.length > 0 ) {
  //     oldPos = camera.position;
  //     var temp = intersections[ 0 ].object;
  //     camera.position.set(temp.position.x, temp.position.y , temp.position.z + boundingSphere.radius );
  //     // CONTROLS
  //     cameraControls.target.set( temp.position.x, temp.position.y, temp.position.z +100);
  //     // document.body.style.cursor = 'pointer';
  //     // document.body.style.cursor = 'auto';
  //   }
  // }
  function selectObject(event) {
    event.preventDefault();

    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersections = raycaster.intersectObjects( showObjects );

    if ( intersections.length > 0 ) {

      if ( selectObj != intersections[ 0 ].object ) {

        // if ( selectObj ) selectObj.material = selectMat;
        showBasics(_this.selectBasic)
        selectObj = intersections[ 0 ].object;
        selectObj.material = selectMat2;
        showTable(intersections[ 0 ].object);

      }

      // document.body.style.cursor = 'pointer';
      // document.body.style.cursor = 'auto';

    }

    else if ( selectObj ) {
      _this.closeBasicData()
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
    width:550px;
    background-color: white;
    overflow: scroll;
    border:1px solid #d6d6d6;
  }
  .basicTable {
    border-bottom: 1px solid #e6e6e6;
    margin-top: 5px;
    padding-bottom: 20px;
  }
  .basicTable2{
    text-align: center;
    padding-top: 50px;
  }
  .basicTable2 span {
    color: #999999;
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
    display: inline-block;
    width: 141px;
    text-align: center;
    border: 1px solid #d6d6d6;
  }
  .tagClass span {
    font-size: 12px;
  }
  .tagTop{
    background-color: #ECECEC;
    border-bottom: 1px solid #d6d6d6;
    text-align: center;
  }
  .leftText {
    text-align:center;
    margin-top: 15px;
  }
  .basicButton {
    float: right;
    padding: 0px;
    padding-right: 10px;
  }
  .ulTop {
    position: fixed;
    top: 0px;
    /* height: 40px; */
    width: 180px;
    background-color: #ffffff;
    padding: 5px;
    border: 1px solid #d6d6d6;
    margin-left: 2px;
  }
  .ulTop span {
    font-size: 13px;
  }
</style>
