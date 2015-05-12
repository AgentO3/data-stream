(function() {

var scene, camera, renderer;
var geometry, material, mesh;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;



document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1250;
    camera.position.y = 350;
    //camera.rotate.y = 90 * Math.PI / 180;

    this.h = 1500;
    this.w = 2500;
    this.seg = 32;
    this.smoothingFactor = 1250;
    this.terrain = [];
    this.fog = 0.00089;

    geometry = new THREE.PlaneGeometry( this.h, this.w, this.seg, this.seg );

    material = new THREE.MeshBasicMaterial( { color: 0x00D0FF, wireframe: true } );
    //
    this.terrainGeneration = new TerrainGeneration(this.w, this.h, this.seg, 1000);
		this.terrain = this.terrainGeneration.diamondSquare();
    //
    var index = 0;
    for(var i = 0; i <= this.seg; i++) {
        for(var j = 0; j <= this.seg; j++) {
          geometry.vertices[index].z = this.terrain[i][j];
            index++;
        }
    }

    mesh = new THREE.Mesh( geometry, material );
    //mesh.position.set( 0, -190, 0 );
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;
    scene.add( mesh );
    scene.fog = new THREE.FogExp2(0x000000, this.fog);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

    setTimeout( function() {

      requestAnimationFrame( animate );

    }, 105);

    this.terrain.unshift(this.terrain[this.terrain.length - 1]);
    this.terrain.pop();

    var index = 0;
    for(var i = 0; i <= this.seg; i++) {
        for(var j = 0; j <= this.seg; j++) {
          mesh.geometry.vertices[index].z = this.terrain[i][j];
            index++;
        }
    }

    mesh.geometry.verticesNeedUpdate = true;
    mouse();
    renderer.render( scene, camera );

}

function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX ) * 2.5;
    mouseY = ( event.clientY - windowHalfY ) * 2.5;


}

function mouse() {


				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;
				camera.lookAt( scene.position );

}

})();
