import React, {useState, useCallback, useEffect} from "react";
import Image from "next/image";
import classes from './CustomFileInput.module.scss';

const ImageUploader = ({accept, handleImageChange}) => {
    const [images, setImages] = useState([]);

    const handleMultipleImageChange = useCallback((event) => {
        const files = Array.from(event.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
        handleImageChange(files);
    }, [handleImageChange]);

    const handleImageRemove = (imageName) => {
        const filteredImages = images.filter((image) => image.name !== imageName);
        setImages(filteredImages);
        handleImageChange(filteredImages);
    };

    const handleRemoveAllImages = () => {
        setImages([]);
        handleImageChange([]);
    };

    useEffect(() => {
        const renderImages = async () => {
            const renderedImages = await Promise.all(
                images.map(async (image) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();

                        if (image.type.startsWith('image/')) {
                            reader.onload = () => {
                                if (reader.readyState === 2) {
                                    resolve(
                                        <div key={image.name}>
                                            <Image
                                                src={reader.result}
                                                alt="Image"
                                                width={80}
                                                height={50}
                                            />
                                            <p>
                                                {image.name} ({Number(image.size / 1024).toFixed(2)} KB)
                                            </p>
                                            <button type="button" onClick={() => handleImageRemove(image.name)}>
                                                &#10006; {/* REMOVE SYMBOL */}
                                            </button>
                                        </div>
                                    );
                                }
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(image);
                        } else {
                            resolve(
                                <div key={image.name}>
                                    <p>{image.name} (Can not preview)</p>
                                    <button type="button" onClick={() => handleImageRemove(image.name)}>
                                        &#10006; {/* REMOVE SYMBOL */}
                                    </button>
                                </div>
                            );
                        }
                    });
                })
            );

            setRenderedImages(renderedImages);
        };

        renderImages();
    }, [images]);

    const [renderedImages, setRenderedImages] = useState([]);

    return (
        <div className={classes.Image_Uploader}>
            <label htmlFor="meal_image">
                <div className={classes.Static}>
                    <Image
                        src="/IMAGES/Upload_Icon.svg"
                        alt="Upload Icon"
                        width={30}
                        height={30}
                    />
                    <span>Upload</span>
                </div>
            </label>
            {renderedImages.length > 0 && (
                <button type="button" className={classes.RemoveAll} onClick={handleRemoveAllImages}>
                    Remove All
                </button>
            )}
            <input
                id="meal_image"
                onChange={handleMultipleImageChange}
                type="file"
                name="Meal_Image"
                multiple
                accept={accept}
            />
            <div className={classes.ImagePreviewer}>
                {renderedImages.map((renderedImage, index) => (
                    <div key={`I${index}`}>
                        {renderedImage}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
