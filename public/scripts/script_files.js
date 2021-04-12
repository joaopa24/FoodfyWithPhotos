const PhotosUpload = {
    input:"",
    preview: document.querySelector('#photos-preview-select'),
    uploadLimit:5,
    files:[],

    HasLimit(event){
        const { uploadLimit, input, preview } = PhotosUpload
        const {files: fileList} = input

        if (fileList.length > uploadLimit) {
            alert(`Envie apenas ${uploadLimit} imagem!`)
            event.preventDefault()
            return true
        }

        const photosDiv = []

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
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        
        return button
    },
    handleFileInput(event){
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.HasLimit(event)) return

        Array.from(fileList).forEach(file => {
            
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        photoDiv.remove();
    }
}