class Player {

    constructor(){  
        this.container = new THREE.Object3D()

        this.player = this.createPlayer() 
        this.container.add(this.player)

        this.axes = new THREE.AxesHelper(200)
        this.container.add(this.axes)
    }

    createPlayer(){
        let s = cnf.radius

        let geo = new THREE.BoxGeometry(0.5*s, 1*s, 0.2*s)
        let mat = new THREE.MeshBasicMaterial({ color: 0x0000ff })
        let box = new THREE.Mesh(geo, mat)
        
        box.position.set(0, 0.5*s, 0)

        return box
    }
 
    getPlayerCont () {
        return this.container
    }
 
 
    getPlayerMesh () {
        return this.player
    }
 
}
 
 
function updateCamera(camera, target){

    let pos = target.position
    camera.position.set(pos.x, pos.y + 50, pos.z - 20)
    camera.lookAt(pos)
}


function createFloor(w, h){
    floor = {
        geometry: new THREE.PlaneGeometry(h, w),
        material: new THREE.MeshBasicMaterial({color: 0xffff00}),
        plane: null
    }

    floor.plane = new THREE.Mesh(floor.geometry, floor.material)

    floor.plane.rotateX(-Math.PI/2)
    floor.plane.position.set(h/2, 0, w/2)

    return floor.plane
}    


$(() => {

    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x0066ff)
    $('#root').append(renderer.domElement)

    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(0, 100, 0)
    camera.lookAt(scene.position)

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    var raycaster = new THREE.Raycaster()
    scene.add(createFloor(100, 100))


    let player = new Player
    scene.add(player.getPlayerCont())


    var clickedVect = new THREE.Vector3(0,0,0)
    var directionVect = new THREE.Vector3(0,0,0)


    let mouseDown = false
    let mouseVector = {}

     $(document).mouseup(()=>{
        mouseDown = false
    })   

    const target = () => {
        if (mouseDown) {
            raycaster.setFromCamera(mouseVector, camera)
            let intersects = raycaster.intersectObjects(scene.children)

            if (intersects.length > 0) {
                clickedVect = intersects[0].point
            
                directionVect = clickedVect.clone().sub(player.getPlayerCont().position).normalize()
            }
            
            let copy = player.getPlayerCont().position.clone()

            var angle = Math.atan2(copy.x - clickedVect.x, copy.z - clickedVect.z)
            player.getPlayerMesh().rotation.y = angle
            previousDistance = Infinity

        }

    }    
    $(document).mousedown(e=>{
        mouseDown = true
        mouseVector.x = (e.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1
        previousDistance = Infinity
        target()
    })

    $(document).mousemove(e => {
        if(!mouseDown) return

        mouseVector.x = (e.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1
        previousDistance = Infinity
    })


    let previousDistance = Infinity

    function render() {

        requestAnimationFrame( render )
        updateCamera(camera, player.getPlayerCont())

        target()
        

        let currentDistance = player.getPlayerCont().position.clone().distanceTo(clickedVect)
        

        if(previousDistance > currentDistance)
            player.getPlayerCont().translateOnAxis(directionVect, cnf.speed)
        else 
            currentDistance = -Infinity


        previousDistance = currentDistance

        
        renderer.render(scene, camera)
    }
    render()
})