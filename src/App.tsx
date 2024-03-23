import './App.css'

function App() {
    return (
        <>
            <h1>Wherify</h1>

            <section className="content">
                <div className="content-areas">
                    <textarea name="data-in" id="data-in" rows={20}
                              placeholder="Paste your data here..."></textarea>
                    <textarea name="data-out" id="data-out" rows={20}
                              placeholder="Output goes here..."></textarea>
                </div>
                <button id="transform-btn">Get it</button>
            </section>
        </>
    )
}

export default App
