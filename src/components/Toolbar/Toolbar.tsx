import { useState } from "react";

interface ToolbarProps {
    onSingleQuotesChanged: (isSingleQuotes: boolean) => void;
    onDoubleQuotesChanged: (isDoubleQuotes: boolean) => void;
    onAddParenthesisChanged: (isAddParenthesis: boolean) => void;
    onAddBracketsChanged: (isAddBrackets: boolean) => void;
}

export default function Toolbar(props: ToolbarProps) {

    const [isSingleQuotes, setIsSingleQuotes] = useState(true);
    const [isDoubleQuotes, setIsDoubleQuotes] = useState(false);
    const [isAddParenthesis, setIsAddParenthesis] = useState(true);
    const [isAddBrackets, setIsAddBrackets] = useState(false);

    const singleQuotesChanged = () => {
        return () => {
            setIsSingleQuotes(!isSingleQuotes);
            setIsDoubleQuotes(false);
            props.onSingleQuotesChanged(!isSingleQuotes);
            props.onDoubleQuotesChanged(false);
        }
    }

    const doubleQuotesChanged = () => {
        return () => {
            setIsDoubleQuotes(!isDoubleQuotes);
            setIsSingleQuotes(false);
            props.onDoubleQuotesChanged(!isDoubleQuotes);
            props.onSingleQuotesChanged(false);
        }
    }

    const parenthesisChanged = () => {
        return () => {
            setIsAddParenthesis(!isAddParenthesis);
            setIsAddBrackets(false);
            props.onAddParenthesisChanged(!isAddParenthesis);
            props.onAddBracketsChanged(false);
        }
    }

    const bracketsChanged = () => {
        return () => {
            setIsAddBrackets(!isAddBrackets);
            setIsAddParenthesis(false);
            props.onAddBracketsChanged(!isAddBrackets);
            props.onAddParenthesisChanged(false);
        }
    }

    return (
        <>
            <h5>Separator</h5>
            <section >
                    <label htmlFor="add-par">
                        <input type="checkbox" checked={isSingleQuotes} onChange={singleQuotesChanged()} />
                        Single quote ('')
                    </label>
                    <label htmlFor="add-par">
                        <input type="checkbox" checked={isDoubleQuotes} onChange={doubleQuotesChanged()} />
                        Double-quote ("")
                    </label>
            </section>
            <h5>Closure</h5>
            <section >
                    <label htmlFor="add-par">
                        <input type="checkbox" checked={isAddParenthesis} onChange={parenthesisChanged()} />
                        Parenthesis ()
                    </label>
                    <label htmlFor="add-par">
                        <input type="checkbox" checked={isAddBrackets} onChange={bracketsChanged()} />
                        Square brackets []
                    </label>
            </section>
        </>
    );

    
}