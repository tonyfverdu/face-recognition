/* eslint-disable no-undef */
import { url_Models, imageUpload, main, infoLoad, img, cameraWeb } from "./initialitation.js"
import { promiseAllFaceapi, printInfo, inputCamera, recognitionOfFaces } from "./functions.js"


export let newCanvas = false
//  1.-  Launch all the promises of the faceapi-models in parallel (in the foldel: url_Models),  
//       if all ok, the function passed by parameter (recognitionImage) is launched.
promiseAllFaceapi(recognitionImage, url_Models)

//  2.-  Function "recognitionImage":  recognition of image faces
async function recognitionImage() {
    printInfo()

    imageUpload.addEventListener("change", async (e) => {
        infoLoad.textContent = e.target.value
        if (newCanvas) document.querySelector("canvas").remove()
        newCanvas = true
        const theImage = await faceapi.bufferToImage(imageUpload.files[0])
        img.src = theImage.src

        const canvas = faceapi.createCanvasFromMedia(theImage)
        main.append(canvas)

        const displaySize = { width: theImage.width, height: theImage.height }
        faceapi.matchDimensions(canvas, displaySize)
        canvas.style.top = "100px"
        canvas.style.left = "16px"

        const detections = await faceapi.detectAllFaces(theImage)
            .withFaceLandmarks()
            .withFaceExpressions()
            .withFaceDescriptors()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

        resizedDetections.forEach((detection, i) => {
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: `Face: ${i + 1}` })
            drawBox.draw(canvas)
        })

        infoLoad.textContent = `Images faces recognition:  ${detections.length}`
    })
}
/*
function loadLabeledImages() {
    const labels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 6; i++) {
                const img = await faceapi.bufferToImage(`./assets/Members${label}/${i}.jpg`)
                // const img = await faceapi.fetchImage(`https://github.com/tonyfverdu/face-recognition/blob/main/assets/Members/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptors()
                console.log(detections)
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

*/
/////////////////////////////////////////////////////////////////////////
//  B.-  Select Input ("camera", "video" and "image")  ******************************
// 1.- Camera
faceRecognition.addEventListener('change', (ev) => {
    if(ev.target.value === 'off') {
        ev.target.value = "on"
    } else {
        ev.target.value = 'off'
    }

    if(ev.target.value === 'on') {
        inputCamera()
    } else {
        cameraWeb.pause()
    }
}, false)

