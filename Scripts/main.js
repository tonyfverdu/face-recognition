/* eslint-disable no-undef */
import { url_Models, imageUpload, infoLoad, contImage, img } from "./initialitation.js"
import { promiseAllFaceapi } from "./functions.js"

const main = document.querySelector('main')

//  1.-  Print info text of image loaded
function print() {
    console.log("all OK")
    infoLoad.textContent = "Loaded !"
}
promiseAllFaceapi(recognitionImage, url_Models)

async function recognitionImage() {
    print()
    const container = document.createElement("div")
    container.style.position = "relative"
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    main.append(container)

    imageUpload.addEventListener("change", async () => {
        const theImage = await faceapi.bufferToImage(imageUpload.files[0])
        theImage.classList.add('imgCentral')
        theImage.setAttribute('id', 'imageCentral')
        theImage.setAttribute('width', '1200px')
        theImage.setAttribute('height', '480px')
        img.src = theImage.src

        const canvas = faceapi.createCanvasFromMedia(theImage)
        main.append(canvas)

        const displaySize = { width: theImage.width, height: theImage.height }
        console.log(displaySize)
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(theImage)
            .withFaceLandmarks()
            .withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d=> faceMatcher.findBestMatch(d.descriptor))
        
        results.forEach( (result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
        })


        infoLoad.textContent = `Faces number:  "${detections.length}"`
    })


    function loadLabeledImages() {
        const labels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
        return Promise.all(
            labels.map(async label => {
                const descriptions = []
                for (let i = 1; i <= 6; i++) {
                    const img = await faceapi.fetchImage(`https://github.com/tonyfverdu/face-recognition/tree/main/assets/Members/${label}/${i}.jpg`)
                    const detections = await faceapi
                        .detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptors()
                    console.log(detections)
                    descriptions.push(detections.descriptor)
                }
                return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
        )
    }
}
