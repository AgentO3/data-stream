(function() {

var scene, camera, renderer;
var geometry, material, mesh;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var h = 2000;
var w = 3000;
var seg = 32;
var smoothingFactor = 1000;
var terrain = [];
var terrainBuff = [];
var fog = 0.001;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1200;
    //camera.position.y = 350;
    //camera.rotate.y = 90 * Math.PI / 180;

    geometry = new THREE.PlaneGeometry( h, w, seg, seg );

    material = new THREE.MeshBasicMaterial( { color: 0x00D0FF, wireframe: true } );
    //
    terrainGeneration = new TerrainGeneration(w, h, seg, smoothingFactor);
		terrain = terrainGeneration.diamondSquare();
    terrainGeneration = new TerrainGeneration(w, h, seg, smoothingFactor);
    terrainBuff = terrainGeneration.diamondSquare();
    //
    var index = 0;
    for(var i = 0; i <= seg; i++) {
        for(var j = 0; j <= seg; j++) {
          geometry.vertices[index].z = terrain[i][j];
            index++;
        }
    }

    mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;
    scene.add( mesh );
    scene.fog = new THREE.FogExp2(0x242534, fog);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {
    mouse();
    TWEEN.update();
    renderer.render( scene, camera );

    setTimeout( function() {

      requestAnimationFrame( animate );

    }, 60);

    terrain.unshift(terrainBuff[terrainBuff.length - 1]);
    terrain.pop();
    terrainBuff.pop();

    if (terrainBuff.length === 0) {
      terrainGeneration = new TerrainGeneration(w, h, seg, smoothingFactor);
      terrainBuff = terrainGeneration.diamondSquare();
    }

    var index = 0;
    for(var i = 0; i <= seg; i++) {
        for(var j = 0; j <= seg; j++) {
          mesh.geometry.vertices[index].z = terrain[i][j];
            index++;
        }
    }

    mesh.geometry.verticesNeedUpdate = true;

    console.log(terrain);


}


function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX ) * 1;
    mouseY = ( event.clientY - windowHalfY ) * 1.5;


}

function mouse() {


				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y + 500 ) * .05;
				camera.lookAt( scene.position );

}

})();
