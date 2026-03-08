import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

type Training = {
    date: string;
    distance: number;
};

type FormData = {
    date: string;
    distance: string;
};

function normalizeDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
}

function parseDate(date: string): number {
    const [day, month, year] = date.split('.');
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

function App() {
    const [form, setForm] = useState<FormData>({
        date: '',
        distance: '',
    });

    const [items, setItems] = useState<Training[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedDate = form.date.trim();
        const trimmedDistance = form.distance.trim();

        if (!trimmedDate || !trimmedDistance) {
            return;
        }

        const parsedDistance = Number(trimmedDistance);

        // защита от отрицательных значений
        if (Number.isNaN(parsedDistance) || parsedDistance <= 0) {
            return;
        }

        const normalizedDate = normalizeDate(trimmedDate);

        setItems((prev) => {
            const existingItem = prev.find((item) => item.date === normalizedDate);

            let updatedItems: Training[];

            if (existingItem) {
                updatedItems = prev.map((item) =>
                    item.date === normalizedDate
                        ? { ...item, distance: item.distance + parsedDistance }
                        : item,
                );
            } else {
                updatedItems = [
                    ...prev,
                    {
                        date: normalizedDate,
                        distance: parsedDistance,
                    },
                ];
            }

            return [...updatedItems].sort(
                (a, b) => parseDate(b.date) - parseDate(a.date),
            );
        });

        setForm({
            date: '',
            distance: '',
        });
    };

    const handleDelete = (date: string) => {
        setItems((prev) => prev.filter((item) => item.date !== date));
    };

    const handleEdit = (date: string, distance: number) => {
        const [day, month, year] = date.split('.');

        setForm({
            date: `${year}-${month}-${day}`,
            distance: String(distance),
        });

        handleDelete(date);
    };

    return (
        <div className="container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date">Дата (ДД.ММ.ГГ)</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="distance">Пройдено км</label>
                            <input
                                id="distance"
                                name="distance"
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={form.distance}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="submit-btn" type="submit">
                            OK
                        </button>
                    </div>
                </form>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <div className="col-date">Дата</div>
                    <div className="col-distance">Пройдено км</div>
                    <div className="col-actions">Действия</div>
                </div>

                <div className="table-body">
                    {items.map((item) => (
                        <div className="table-row" key={item.date}>
                            <div className="col-date">{item.date}</div>
                            <div className="col-distance">{item.distance}</div>

                            <div className="col-actions">
                                <button
                                    className="action-btn edit-btn"
                                    type="button"
                                    onClick={() =>
                                        handleEdit(item.date, item.distance)
                                    }
                                >
                                    ✎
                                </button>

                                <button
                                    className="action-btn delete-btn"
                                    type="button"
                                    onClick={() => handleDelete(item.date)}
                                >
                                    ✘
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;