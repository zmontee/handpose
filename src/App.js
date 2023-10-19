import React, {useEffect, useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from "react-webcam";
import logo from './logo.svg';
import './App.css';
import {drawHand} from "./functions";

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const runHandpose = async () => {
        const net = await handpose.load();
        console.log('Handpose model loaded.');
        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 100);
    }

    const detect = async (net) => {
        // Check data is available
        if (webcamRef && webcamRef.current && webcamRef.current.video.readyState === 4) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video height and width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const hand = await net.estimateHands(video);
            console.log(hand);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawHand(hand, ctx);
        }
    }

    useEffect(() => {
        runHandpose();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <Webcam
                    ref={webcamRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
            </header>
        </div>
    );
}

export default App;
