import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";

export default function ItemSizes({sendSizes, selectedSizes}) {

    const [sizes, setSizes] = useState({
        number: 0,
        sizes: [],
    })

    // SET THE SELECTED SIZES
    useEffect(() => {
        if(selectedSizes) {
            setSizes({
                number: selectedSizes.length,
                sizes: selectedSizes
            })
        }
    }, [selectedSizes])
    
    
    // SEND SIZES TO THE PARENT
    function sendSizesToParent(sizesArray) {
        sendSizes(sizesArray)
    }

    // EFFECT TO LISTEN TO THE CHANGES AND SEND IT TO THE PARENT
    useEffect(() => {
        sendSizesToParent(sizes.sizes)
    }, [sizes.sizes])

    return (
        <div className={"card mb-2"}>
            <h2 className={"text-2xl font-bold mb-4 uppercase"}>ITEM SIZES</h2>
            <div className="grid formgrid p-fluid">
                {new Array(sizes.number).fill(0).map((_, index) => {
                    return (
                        <div key={`MealExtra_${index}`} className={'field col-12 grid formgrid p-fluid'}>
                            <div className="field col-9 flex">
                                <InputText
                                    value={sizes.sizes[index]}
                                    onChange={(e) => {
                                        const ArrayOfSizes = [...sizes.sizes]
                                        ArrayOfSizes[index] = e.target.value
                                        setSizes({
                                            ...sizes,
                                            sizes: ArrayOfSizes
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
                                        const ArrayOfSizes = [...sizes.sizes]
                                        ArrayOfSizes.splice(index, 1)
                                        setSizes({
                                            ...sizes,
                                            number: sizes.number - 1,
                                            sizes: ArrayOfSizes
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
                        setSizes({
                            ...sizes,
                            number: sizes.number + 1,
                        })
                    }}
                />
            </div>
        </div>

    )
}