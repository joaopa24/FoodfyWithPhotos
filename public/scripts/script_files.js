const PhotosUpload = {
    input:"",
    preview: document.querySelector('#photos-preview-select'),
    uploadLimit:1,
    files:[],

    HasLimit(event){
        const { uploadLimit, input, preview } = PhotosUpload
        const {files: fileList} = input

        if (fileList.length > uploadLimit) {
            alert(`Envie apenas ${uploadLimit} imagem!`)
            event.preventDefault()
            return true
        }

        const photosDiv
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert(`Você atingiu o máximo de fotos`)
            event.preventDefault()
            return true
        }

        return false
    },
    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    }
    
}