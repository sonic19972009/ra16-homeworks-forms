import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

const DEFAULT_COLOR = '#9921ff';
const ERROR_COLOR = '#c13535';

function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
}

function App() {
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');
    const [backgroundColor, setBackgroundColor] = useState(DEFAULT_COLOR);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = backgroundColor;

        return () => {
            document.body.style.backgroundColor = DEFAULT_COLOR;
        };
    }, [backgroundColor]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        setValue(nextValue);

        if (nextValue.length !== 7) {
            setResult('');
            setIsError(false);
            setBackgroundColor(DEFAULT_COLOR);
            return;
        }

        const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(nextValue);

        if (isValidHex) {
            setResult(hexToRgb(nextValue));
            setIsError(false);
            setBackgroundColor(nextValue);
        } else {
            setResult('Ошибка!');
            setIsError(true);
            setBackgroundColor(ERROR_COLOR);
        }
    };

    return (
        <div className="container">
            <form>
                <input
                    className="input-field"
                    type="text"
                    value={value}
                    onChange={onChange}
                />
                <span className={`result ${isError ? 'error' : ''}`}>
                    {result || '\u00A0'}
                </span>
            </form>
        </div>
    );
}

export default App;