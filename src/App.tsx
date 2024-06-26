import {useEffect, useRef, useState} from 'react';
import './App.css'
import Header from './components/Header/Header';
import Toolbar from './components/Toolbar/Toolbar';

function App() {
    const [isProcessing, setIsProcessing] = useState(false);
    const dataIn = useRef<HTMLTextAreaElement>(null);
    const dataOut = useRef<HTMLTextAreaElement>(null);
    const [isAddParenthesis, setIsAddParenthesis] = useState(true);
    const [isAddBrackets, setIsAddBrackets] = useState(false);
    const [isSingleQuotes, setIsSingleQuotes] = useState(true);
    const [isDoubleQuotes, setIsDoubleQuotes] = useState(false);

    // store and retrieve data dataIn in localstorage

    useEffect(() => {
        if (localStorage.getItem('dataIn')) {
            if (dataIn.current !== null) {
                dataIn.current.value = localStorage.getItem('dataIn')!;
            }
        }
    }, []);

    function transform() {
        setIsProcessing(true);

        if (dataOut.current !== null) {
            let surroundingChar = '';

            if (isSingleQuotes) {
                surroundingChar = '\'';
            } else if (isDoubleQuotes) {
                surroundingChar = '"';
            }

            const words = (dataIn.current?.value?.trim()?.split(/\s+/) || []).filter(w => w !== ',');
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

    function copyToClipboard() {
        void navigator.clipboard.writeText(dataOut?.current?.value ?? '');
    }

    return (
        <div>
            <Header />

            <section className="content">
                <div className="content-areas">
                    <textarea name="data-in" id="data-in" rows={20}
                              placeholder="Paste your data here..."
                              onChange={(e) => localStorage.setItem('dataIn', e.currentTarget.value)}
                              ref={dataIn}></textarea>
                    <textarea name="data-out" id="data-out" rows={20}
                              placeholder="Output goes here..."
                              ref={dataOut}></textarea>
                </div>

                <Toolbar onSingleQuotesChanged={(isSingleQuotes: boolean) => setIsSingleQuotes(isSingleQuotes)}
                        onDoubleQuotesChanged={(isDoubleQuotes: boolean) => setIsDoubleQuotes(isDoubleQuotes)}
                        onAddParenthesisChanged={(isAddParenthesis: boolean) => setIsAddParenthesis(isAddParenthesis)}
                        onAddBracketsChanged={(isAddBrackets: boolean) => setIsAddBrackets(isAddBrackets)}
                    />

                <div className="action-group">
                    <button id="transform-btn" onClick={transform} disabled={isProcessing}>
                        {isProcessing ? "Working on it..." : "Transform"}
                    </button>

                    <button title="Copy to clipboard" onClick={copyToClipboard}>Copy</button>
                </div>
            </section>
        </div>
    )
}

export default App
