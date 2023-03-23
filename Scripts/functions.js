/* eslint-disable no-undef */
import { contInfo, infoLoad, url_Models, cameraWeb } from "./initialitation.js"

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
    // .then(pargetLabeledFaces)
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
      .catch(error => console.error(`There is an Error in the function "starCamera" !!,  error: ${error}`))
  }
}

//  3.-  Function "inputCamera":  Input signal "video of camera web online"
export function inputCamera() {
  promiseAllFaceapi(starCamera(cameraWeb), url_Models)

  cameraWeb.addEventListener('play', () => {
    document.querySelector("canvas").remove()
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

//  4.-  Function "getLabeledFaceDescription" =>  parLabelsOfModels :  array of name (strings) of the "models of images" to recognized
//       const labelsOfModels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
export function getLabeledFacesDescription() {
  // const labelsOfModels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
  const labelsOfModels = ['John Lennon', 'Paul McCartney', 'Ringo Starr']
  return Promise.all(
    labelsOfModels.map(async label => {
      const descriptions = []
  
      for (let i = 1; i <= 4; i++) {
        let image
        await fetch(`./assets/Members/${label}/${i}.jpg`)
        .then(async responseURL => {
          image = await faceapi.fetchImage(responseURL.url)
          console.log(`i: ${i}  ${`./assets/Members/${label}/${i}.jpg`}  ${image instanceof HTMLImageElement}`)  // ?true
        })
        .catch(error => console.log(error))
  
        const detections = await faceapi.detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor()

        descriptions.push(detections.descriptor)
      }
      console.log('label:  ', label, 'Descriptions:  ', descriptions)
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

//  5.-  Function "recognitionOfFaces" => 
export async function recognitionOfFaces() {
  const labeledFaceDescriptors = await getLabeledFacesDescription()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
  console.log('faceMatcher:  ', faceMatcher)

  cameraWeb.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(cameraWeb)
    document.body.append(canvas)
    console.log(canvas)

    const displaySize = { width: cameraWeb.width, height: cameraWeb.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces()
      .withFaceLandmarks()
      .withFaceDescriptor()

      const resizedDetections = faceapi.resizeResults(detections, )

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
      const results = resizedDetections.map(d => {
        return faceMatcher.findBestMatch(d.descriptor)
      }) 

      results.forEach((result, i) => {
        const box = resizeddetections[i].detections.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result})
        drawBox.draw(canvas)
      })
    }, 100)
  })
}