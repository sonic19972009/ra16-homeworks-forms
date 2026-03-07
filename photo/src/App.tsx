import { useState } from 'react';
import type { ChangeEvent } from 'react';

type PhotoItem = {
    id: string;
    url: string;
    name: string;
};

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.addEventListener('load', () => {
            if (typeof fileReader.result === 'string') {
                resolve(fileReader.result);
                return;
            }

            reject(new Error('File reading error'));
        });

        fileReader.addEventListener('error', () => {
            reject(new Error(fileReader.error?.message || 'File reading error'));
        });

        fileReader.readAsDataURL(file);
    });
}

function App() {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);

    const handleSelect = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const { files } = event.target;

        if (!files || files.length === 0) {
            return;
        }

        const selectedFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

        try {
            const urls = await Promise.all(selectedFiles.map((file) => fileToDataUrl(file)));

            const newPhotos = urls.map((url, index) => ({
                id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
                url,
                name: selectedFiles[index].name,
            }));

            setPhotos((prev) => [...prev, ...newPhotos]);
        } catch (error) {
            console.error(error);
        } finally {
            event.target.value = '';
        }
    };

    const handleDelete = (id: string): void => {
        setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    };

    return (
        <div className="photo-manager">
            <label className="upload-area">
                <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSelect}
                />
                <span className="upload-text">Click to select</span>
            </label>

            <div className="preview-grid">
                {photos.map((photo) => (
                    <div className="preview-item" key={photo.id}>
                        <button
                            className="remove-btn"
                            type="button"
                            onClick={() => handleDelete(photo.id)}
                            aria-label={`Удалить ${photo.name}`}
                        >
                            ✕
                        </button>

                        <img
                            className="preview-image"
                            src={photo.url}
                            alt={photo.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;