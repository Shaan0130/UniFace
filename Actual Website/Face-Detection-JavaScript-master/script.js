const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    // faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo())



function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play' , () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
            .withFaceExpressions()
            
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections )
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections )
            var emotion = faceapi.draw.drawFaceLandmarks(canvas, resizedDetections )
            console.log(detections.values())
            faceapi.draw.drawFaceExpressions (canvas, resizedDetections )
            if(resizedDetections[0].expressions.happy >= 0.7){
                console.log('Happy');
                document.getElementById('log').innerHTML = "Happy &#128540";
            }
            if(resizedDetections[0].expressions.angry >= 0.6){
                console.log('Angry');
                document.getElementById('log').innerHTML = "Angry &#128545";
            }
            if(resizedDetections[0].expressions.sad >= 0.2){
                console.log('Sad');
                document.getElementById('log').innerHTML = "Sad &#128542";
            }
            if(resizedDetections[0].expressions.surprised >= 0.7){
                console.log('Surprise');
                document.getElementById('log').innerHTML = "Surprised! &#129327";
            }
            if(resizedDetections[0].expressions.disgusted >= 0.7){
                console.log('Disgusted');
                document.getElementById('log').innerHTML = "Disgusted &#129314";
            }
            if(resizedDetections[0].expressions.fearful >= 0.2){
                console.log('Scared');
                document.getElementById('log').innerHTML = "Scared &#128552";
            }
            if(resizedDetections[0].expressions.neutral >= 0.2){
                console.log('Neutral');
                document.getElementById('log').innerHTML = "Neutral &#128566";
            }
    }, 100)
})

