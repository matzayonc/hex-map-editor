class Hex{
    constructor(doors = [], type){
        this.container = new THREE.Object3D()
        this.material = new THREE.MeshPhongMaterial({ color: 0xffaa })

        this.doors = doors.map(i => {return (parseInt(i) + 4) % 6})
        this.type = type

        this.light = null

        this.init(this.doors)
    }


    moveTo(x, z){
        this.container.position.set(x, 0, z)
    }

    moveBy(x, z){
        let pos = this.container.position
        this.container.position.set(pos.x + x, pos.y, pos.z + z)
    }


    changeLight(intensity, height){
        this.light.position.set(0, height, 0)
        this.light.intensity = intensity
    }


    init(doors){
        let s = cnf.radius

        let geometryOfWall = new THREE.BoxGeometry(0.1*s, 0.4*s, 1*s)
        let geometryOfDoor = new THREE.BoxGeometry(0.1*s, 0.4*s, 0.2*s)

        for(let k in cnf.positionsForHexagon){

            let p = cnf.positionsForHexagon[k]


            let hex = new THREE.Object3D()


            if(!doors.includes(parseInt(k))){
                let cube = new THREE.Mesh(geometryOfWall, this.material)

                cube.position.set(p.x * s, p.y, p.z * s)
                cube.rotation.set(0, p.r, 0)

                hex.add(cube)
            }
            else{
                let door = new THREE.Object3D()

                door.add(new THREE.Mesh(geometryOfDoor, this.material))
                door.add(new THREE.Mesh(geometryOfDoor, this.material))

                door.children[0].position.set(0, 0, -0.4*s)
                door.children[1].position.set(0, 0, 0.4*s)

                door.position.set(p.x*s, p.y, p.z*s)
                door.rotation.set(0, p.r, 0)
                hex.add(door)
            }

            if(this.type == 'light'){

                this.light = new THREE.PointLight(0xffff00, 10)
                this.changeLight(0.1, 1)

                hex.add(this.light)
            }
            else if(this.type == 'treasure'){
                let geo = new THREE.BoxGeometry(0.3*s, 0.2*s, 0.2*s)
                let mat = new THREE.MeshPhongMaterial({ color: 0xffff00 })
                let treasure = new THREE.Mesh(geo, mat)
                
                treasure.position.set(0, 0.1*s, 0)
                hex.add(treasure)
            }
            else if(this.type == 'enemy'){
                let geo = new THREE.BoxGeometry(0.2*s, 0.3*s, 0.2*s)
                let mat = new THREE.MeshPhongMaterial({ color: 0xff0000 })
                let treasure = new THREE.Mesh(geo, mat)
                
                treasure.position.set(0, 0.15*s, 0)
                hex.add(treasure)
            }

            this.container.add(hex)
        }
        

        this.container.rotation.set(0, Math.PI/2, 0)
    }

    getContainer(){
        return this.container
    }

    get(){
        return this.getContainer()
    }
}