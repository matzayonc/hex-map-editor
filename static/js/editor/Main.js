let editor

$(() => {
    console.log('ok')

    editor = new Editor
    editor.generate($('#select').val())

    $('#select').on('change', () => {
        
        editor.generate($('#select').val())
    })
})