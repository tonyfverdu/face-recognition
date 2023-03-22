/* eslint-disable no-undef */


//  1.-  Async function of get all promises of the models-face-api
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
      .catch (err => console.error(`Error:  There is a error in the function "promiseAllFaceapi":  ${err}`))
  }