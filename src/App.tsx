import {useRef, useState} from 'react';
import './App.css'

function App() {
    const [isProcessing, setIsProcessing] = useState(false);
    const dataIn = useRef<HTMLTextAreaElement>(null);
    const dataOut = useRef<HTMLTextAreaElement>(null);
    const [isAddParenthesis, setIsAddParenthesis] = useState(true);
    const [isAddBrackets, setIsAddBrackets] = useState(false);
    const [isSingleQuotes, setIsSingleQuotes] = useState(true);
    const [isDoubleQuotes, setIsDoubleQuotes] = useState(false);

    function transform() {
        setIsProcessing(true);

        if (dataOut.current !== null) {
            let surroundingChar = '';

            if (isSingleQuotes) {
                surroundingChar = '\'';
            } else if (isDoubleQuotes) {
                surroundingChar = '"';
            }

            const words = (dataIn.current?.value?.trim()?.split(/\s+/) || []).filter(w => w != ',');
            let processedWords = words.map(w => `${surroundingChar}${w}${surroundingChar}`).join('\n,');

            if (isAddParenthesis) {
                processedWords = `(\n${processedWords}\n)`;
            } else if (isAddBrackets) {
                processedWords = `[\n${processedWords}\n]`;
            }

            dataOut.current.value = processedWords;
        }

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

                <section className="options">
                    <label htmlFor="add-par">Use single-quotes
                        <input type="checkbox" checked={isSingleQuotes} onChange={(e) => {
                            setIsSingleQuotes(e.target.checked);
                            setIsDoubleQuotes(false);
                        }}/>
                    </label>

                    <label htmlFor="add-par">Use double-quotes
                        <input type="checkbox" checked={isDoubleQuotes} onChange={(e) => {
                            setIsSingleQuotes(false);
                            setIsDoubleQuotes(e.target.checked);
                        }}/>
                    </label>

                    <label htmlFor="add-par">Add parenthesis
                        <input type="checkbox" checked={isAddParenthesis} onChange={(e) => {
                            setIsAddParenthesis(e.target.checked);
                            setIsAddBrackets(false);
                        }}/>
                    </label>

                    <label htmlFor="add-par">Add brackets
                        <input type="checkbox" checked={isAddBrackets} onChange={(e) => {
                            setIsAddBrackets(e.target.checked);
                            setIsAddParenthesis(false);
                        }}/>
                    </label>
                </section>

                <button id="transform-btn" onClick={transform} disabled={isProcessing}>
                    {isProcessing ? "Working on it..." : "Transform"}
                </button>
            </section>
        </>
    )
}

export default App
