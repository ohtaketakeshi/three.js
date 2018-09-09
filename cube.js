/// <reference path="types/three/index.d.ts" />

var camera, scene, renderer, controls;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();
//render();

function switch_hand_coodinate(camera){
    camera.projectionMatrix.elements[0] *= -1;
    camera.projectionMatrix.elements[8] *= -1;
    camera.projectionMatrix.elements[5] *= -1;
    camera.projectionMatrix.elements[6] *= -1;
}

function init(){
    Array.prototype.flatten=function(){
        return this.reduce(
            function(a,b){
                if(b instanceof Array){
                    return a.concat(b.flatten());
                }else{
                    return a.concat(b);
                }
            },
            []
        );
    }

    
    scene = new THREE.Scene();
    scene.add( new THREE.AxesHelper(1.3));
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xffffff);
    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 10 );
    //camera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, 0.1, 10);
    camera.up = new THREE.Vector3(0,0,-1);
    switch_hand_coodinate(camera);
    camera.position.set(0.5,-1,2);

    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    //controls.noZoom = true;
    //controls.noPan = true;
    //controls.staticMoving = true;
    controls.dynamicDmpingFactor = 0.3;
    //controls.autoRotate = true;
    
    controls.target.set(0.5,0.5,0.5);
    controls.update();

    var ambientLight = new THREE.AmbientLight( 0xffffff, 5);
    scene.add(ambientLight);

    function getPointTexture(radius){
        var canvas = document.createElement('canvas');
        canvas.width = radius*2;
        canvas.height = radius*2;
        var context = canvas.getContext('2d');
        context.fillStyle ='rgba(255,255,255, 0.1)';
        context.arc(radius,radius,radius-0.5,0,Math.PI*2);
        context.fill();
        context.arc(radius,radius,radius-0.5,0,Math.PI*2);
        context.strokeStyle = 'rgba(0,0,0, 0.2)'
        context.stroke();
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    var pointTexture = getPointTexture(16);


    var vertices = [
        [
            [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,0,1)
            ],
            [  
                new THREE.Vector3(0,1,0),
                new THREE.Vector3(0,1,1)
            ]
        ],
        [
            [
                new THREE.Vector3(1,0,0),
                new THREE.Vector3(1,0,1)
            ],
            [
                new THREE.Vector3(1,1,0),
                new THREE.Vector3(1,1,1)
            ]
        ]
    ];
    
    var tetraVertices = [
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][0][1], vertices[0][1][1] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][1][0], vertices[0][1][1] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][1][0], vertices[1][1][0] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][0][1], vertices[1][0][1] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[1][0][0], vertices[1][0][1] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[1][0][0], vertices[1][1][0] ],
    ];
    
   /*
    var tetraVertices = [
        [ vertices[0][0][1], vertices[1][1][1], vertices[0][1][1], vertices[0][1][0] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][0][1], vertices[0][1][0] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][1][0], vertices[1][1][0] ],
        [ vertices[0][0][1], vertices[1][1][1], vertices[1][0][1], vertices[1][0][0] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[0][0][1], vertices[1][0][0] ],
        [ vertices[0][0][0], vertices[1][1][1], vertices[1][0][0], vertices[1][1][0] ],
    ];
    */
    var tetraColors = [
        0x0000ff,
        0x00ff00,
        0xff0000,
        0xffff00,
        0xff00ff,
        0x00ffff
    ];

    var pointsMaterial = new THREE.PointsMaterial({
        color: 0x0000ff,
        map: pointTexture,
        size: 0.1,
        transparent: true
    });

    var meshMaterial = new THREE.MeshStandardMaterial({
        //side: THREE.DoubleSide,
        color: 0x00ffff,
        transparent: true,
        flatShading: true,
        opacity: 0.4,
        depthTest: false,
    });
    var wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
    });

    var tetras = [];
    for( var i=0; i<tetraVertices.length; ++i){
        var tetraGeometry = new THREE.ConvexGeometry(tetraVertices[i]);
        var tetraMeshMaterial = meshMaterial.clone();
        var tetraWireMaterial = wireMaterial.clone();
        tetraMeshMaterial.setValues({color: tetraColors[i]});
        //tetraWireMaterial.setValues({color: tetraColors[i]});
        var tetraMesh = new THREE.Mesh(tetraGeometry, tetraMeshMaterial);
        var tetraWire = new THREE.Mesh(tetraGeometry, tetraWireMaterial);
        var tetraPoints = new THREE.Points(new THREE.BufferGeometry().setFromPoints(tetraVertices[i]), pointsMaterial);
        var tetraGroup = new THREE.Group();
        tetraGroup.add(tetraMesh);
        tetraGroup.add(tetraWire);
        tetraGroup.add(tetraPoints);
        tetras.push(tetraGroup);
    }
    var cubeGroup = new THREE.Group();

    for(var i=0; i<tetras.length; ++i){
        cubeGroup.add(tetras[i]);
    }

    var cubesGroup = new THREE.Group();
    for(var i=0;i<1;++i){
        for(var j=0;j<1;++j){
            for(var k=0;k<1;++k){
                var cube = cubeGroup.clone();
                cube.translateX(i);
                cube.translateY(j);
                cube.translateZ(k);
                cubesGroup.add(cube);
            }
        }
    }
    scene.add(cubesGroup);

    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize(){
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    switch_hand_coodinate(camera);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render(){
    renderer.render( scene, camera );
}

