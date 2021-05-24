class Game{
    constructor(cont){
        this.cont = cont
        this.data = null
        this.hexes = []

        this.load()
        this.addListeners()
    }


    addListeners(){
        for(let i of [$('#intensityRange'), $('#heightRange')])
            i.on('change', e => {
                let intens = $('#intensityRange').val() / 100
                let height = $('#heightRange').val() / 100
                this.changeLight(intens, height)
        })
    }


    changeLight(intensity, height){
        for(let i of this.hexes)
            if(i.type == 'light')
                i.changeLight(intensity, height)
    }


    generate(size = 5){

        let h = Math.sqrt(3) * cnf.radius
        let w = 2 * cnf.radius
        let d = 1.5 * cnf.radius

        for(let j = 0; j < size; j++)
            for(let i = 0; i < size; i++){
                if(!this.isActive(j, i))
                    continue

                let a = new Hex(this.getDoors(j, i), this.getType(j, i))
                a.container.position.set(w/2, 0, h/2)
                a.moveBy(j*d, i*h + (j % 2 ? h/2 : 0))

                this.hexes.push(a)
                this.cont.add(a.get())
            }

        this.createFloor(w*size, h*size)
        $('#intensityRange').trigger('change')
    }

    createFloor(w, h){
        this.floor = {
            geometry: new THREE.PlaneGeometry(h, w),
            material: new THREE.MeshPhongMaterial({color: 0xffff00}),
            plane: null
        }

        this.floor.plane = new THREE.Mesh(this.floor.geometry, this.floor.material)

        this.floor.plane.rotateX(-Math.PI/2)
        this.floor.plane.position.set(h/2, 0, w/2)

        this.cont.add(this.floor.plane)
    }


    isActive(x, y){
        if(this.data)
            for(let i of this.data)
                if(i.x == x && i.y == y)
                    return true
        return false
    }

    getDoors(x, y){
        if(this.data)
            for(let i of this.data)
                if(i.x == x && i.y == y)
                    return i.doors

        return []
    }
    
    getType(x, y){
        if(this.data)
            for(let i of this.data)
                if(i.x == x && i.y == y)
                    return i.type

        return 'wall'
    }


    load(name = ""){
        $.ajax({
            type: "POST",
            url: "/get",
            data: {
                name: name
            },
            success: (res) => {
                this.data = res.hexes
                this.generate(res.size)
            },
            error: err=>{
                console.error('get: ', err)
            }
        })
    }
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

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    })

/*
    let hex = new Hex([2, 3])
    scene.add(hex.getContainer())
*/
    let level = new THREE.Object3D()
    let game = new Game(level)
    scene.add(level)


    function animate() {

        requestAnimationFrame( animate )

        orbitControl.update()

        renderer.render( scene, camera )
    }
    animate()

    
})