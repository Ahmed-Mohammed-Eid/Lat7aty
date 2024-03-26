import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";
import { ColorPicker } from 'primereact/colorpicker';

export default function ItemOptions({sendColors, selectedColors}) {

    const [colors, setColors] = useState({
        number: 0,
        colors: [],
    })

    // SET THE SELECTED COLORS
    useEffect(() => {
        if(selectedColors) {
            setColors({
                number: selectedColors.length,
                colors: selectedColors
            })
        }
    }, [selectedColors])


    // SEND SIZES TO THE PARENT
    function sendColorsToParent(colorsArray) {
        sendColors(colorsArray)
    }

    // EFFECT TO LISTEN TO THE CHANGES AND SEND IT TO THE PARENT
    useEffect(() => {
        sendColorsToParent(colors.colors)
    }, [colors])

    return (
        <div className={"card mb-2"}>
            <h2 className={"text-2xl font-bold mb-4 uppercase"}>ITEM COLORS</h2>
            <div className="grid formgrid p-fluid">
                {new Array(colors.number).fill(0).map((_, index) => {
                    return (
                        <div key={`MealExtra_${index}`} className={'field col-12 grid formgrid p-fluid'}>
                            <div className="field col-9 flex">
                                <ColorPicker
                                    value={colors.colors[index]}
                                    onChange={(e) => {
                                        const ArrayOfColors = [...colors.colors]
                                        ArrayOfColors[index] = e.value
                                        setColors({
                                            ...colors,
                                            colors: ArrayOfColors
                                        })
                                    }}
                                />
                            </div>
                            <div className="field col-3 flex justify-content-end align-items-end mt-4 md:mt-0">
                                <Button
                                    icon="pi pi-times"
                                    rounded
                                    type={'button'}
                                    text
                                    raised
                                    severity="danger"
                                    aria-label="Cancel"
                                    onClick={() => {
                                        const ArrayOfColors = [...colors.colors]
                                        ArrayOfColors.splice(index, 1)
                                        setColors({
                                            ...colors,
                                            number: colors.number - 1,
                                            colors: ArrayOfColors
                                        })
                                    }}
                                />
                            </div>
                        </div>)
                })}
            </div>
            <div style={{
                width: `100%`,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: "center",
                marginTop: '20px'
            }}>
                <Button
                    icon="pi pi-plus"
                    type={'button'}
                    rounded
                    text
                    raised
                    severity="help"
                    aria-label="add"
                    onClick={() => {
                        setColors({
                            ...colors,
                            number: colors.number + 1,
                            colors: [...colors.colors, 'ffffff']
                        })
                    }}
                />
            </div>
        </div>

    )
}