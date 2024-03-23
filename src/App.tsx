import {useRef, useState} from 'react';
import './App.css'

function App() {
    const [isProcessing, setIsProcessing] = useState(false);
    const dataIn = useRef(null);
    const dataOut = useRef(null);

    function transform() {
        setIsProcessing(true);

        dataOut.current.value = dataIn.current.value;

        setIsProcessing(false);
    }

    return (
        <>
            <h1>Wherify</h1>

            <section className="content">
                <div className="content-areas">
                    <textarea name="data-in" id="data-in" rows={20}
                              placeholder="Paste your data here..."
                              ref={dataIn}></textarea>
                    <textarea name="data-out" id="data-out" rows={20}
                              placeholder="Output goes here..."
                              ref={dataOut}></textarea>
                </div>
                <button id="transform-btn" onClick={transform} disabled={isProcessing}>
                    { isProcessing ? "Working on it..." : "Transform" }
                </button>
            </section>
        </>
    )
}

export default App
