class Editor{
    constructor() {
        this.hexes = []
        this.data = []
        this.activeType = 'wall'
        this.addListeners()
    }



    getHexById(id){
        for(let i of this.hexes)
            if(i.id == id)
                return i

        return null
    }       


    updateJSON(){
        $('#data').html('')
        this.updateData()

        let text = JSON.stringify(this.data, null, 4)

        if(text != '[]')
            $('#data').html(`<pre>${text}</pre>`)
    }


    generate(size){
        $("#hexes").html('')
        this.hexes = []
        this.updateJSON()
    
        for(let j = 0; j < size; j += 1)
            for(let i = 0; i < size; i += 1){
                let hex = new Hex(i, j, size)
                this.hexes.push(hex)
                
                hex.getDom().appendTo("#hexes")
            }
    }


    addListeners(){
        $('#send').on('click', () => this.send())
        $('#get').on('click', () => this.get())
        $('.type').on('click', e => this.changeType(e))
    }


    changeType(e){
        let chosen = $(e.currentTarget)
        chosen.siblings().removeClass('marked')
        chosen.addClass('marked')
        this.activeType = chosen.attr('id')
    }

    
    updateData(){
        this.data = []

        for(let i of this.hexes)
            if(i.active)
                this.data.push(i.export())
        
    }


    send(){
        let name 
        do {
            name = prompt('Wpisz nazwe:')
        } while (!name)

        this.updateData()

        $.ajax({
            type: "POST",
            url: "/send",
            data: {
                size: $('#select').val(),
                level: this.data,
                name: name
            },
            success: function (res) {
                console.log(res)
            },
            error: err=>{
                console.error('send: ', err)
            }
        })
    }  


    get(){
        let name = prompt('Wpisz nazwe(pusta dla ostatnio edytowanego):')

        $.ajax({
            type: "POST",
            url: "/get",
            data: {
                name: name
            },
            success: (res) => {
                this.loadFromData(res)
            },
            error: err=>{
                console.error('get: ', err)
            }
        })
    }




    loadFromData(data){

        this.generate(data.size)

        for(let i of data.hexes){
            let hex = this.getHexById(i.id) 

            if(i.dir)
                for(let j = 0; j < i.dir; j++)
                    hex.div.click()
            
            hex.changeType(i.type)
        }

        this.updateJSON()
    }

}