/* eslint-disable no-undef */
import { contVideo, contInfo, infoLoad, url_Models, cameraWeb } from "./initialitation.js"

//  1.-  Async function of get all promises of the models-face-api und start a function
//       URL of "models":  parURL_Models
//       Function if promises is OK:  parFunction
export async function promiseAllFaceapi(parFunction, parURL_Models) {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(parURL_Models),
    faceapi.nets.tinyFaceDetector.loadFromUri(parURL_Models),
    faceapi.nets.faceLandmark68Net.loadFromUri(parURL_Models),
    faceapi.nets.faceRecognitionNet.loadFromUri(parURL_Models),
    faceapi.nets.faceExpressionNet.loadFromUri(parURL_Models),
    faceapi.nets.ageGenderNet.loadFromUri(parURL_Models)
  ])
    .then(parFunction)
    .catch(err => console.error(`Error:  There is a error in the function "promiseAllFaceapi":  ${err}`))
}

//  2.-  Print info (text) of image loaded and numbers of faces recognized
export function printInfo() {
  infoLoad.textContent = "Loaded recognitions!"
}


//  3.-  Play stream live of Camera Web (parCamera)
export function starCamera(parCamera) {
  if (parCamera) {
    navigator.mediaDevices.getUserMedia({ "video": true, "audio": false })
      .then(stream => parCamera.srcObject = stream)
      .catch(error => console.error(`There is an Error !!:  error: ${error}`))
  }
}

//  3.-  Function "inputCamera":  Input signal "video of camera web online"
export function inputCamera() {
  promiseAllFaceapi(starCamera(cameraWeb), url_Models)

  cameraWeb.addEventListener('play', () => {
    const myCanvas = faceapi.createCanvasFromMedia(cameraWeb)
    myCanvas.setAttribute("id", "myCanvas")
    contInfo.appendChild(myCanvas)
    const displaySize = { width: cameraWeb.width, height: cameraWeb.height }
    faceapi.matchDimensions(myCanvas, displaySize)

    async function loop() {
      const detections = await faceapi.detectAllFaces(cameraWeb, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
      // .withFaceDescriptors()

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      myCanvas.getContext('2d').clearRect(0, 0, myCanvas.width, myCanvas.height)
      faceapi.draw.drawDetections(myCanvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(myCanvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(myCanvas, resizedDetections)
      // faceapi.draw.drawFaceDescriptor(myCanvas, resizedDetections)

      window.requestAnimationFrame(loop)
    }
    loop()
  })
}