$(() => {


    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0066ff)
    $('#root').append(renderer.domElement)

    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(0, 20, 100)
    camera.position.set(1, 50, 5)
    camera.lookAt(scene.position)

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    let hex = new Hex([2, 3], 'light')
    scene.add(hex.getContainer())

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    })

    function animate() {

        requestAnimationFrame( animate )

        orbitControl.update()

        renderer.render( scene, camera )
    }
    animate()
})