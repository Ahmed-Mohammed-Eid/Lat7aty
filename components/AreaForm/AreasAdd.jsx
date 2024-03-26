import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";


const CourierForm = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [area, setArea] = useState({
        areaName: "",
        zoneName: "",
        areaPolygon: "",
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!area.areaName || !area.zoneName || !area.areaPolygon) {
            toast.error("Please fill all fields");
            return;
        }

        // Create object of data to send
        const data = {
            areaName: area.areaName,
            zoneName: area.zoneName,
            areaPolygon: area.areaPolygon,
        }

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.post("https://api.lathaty.com/api/v1/create/area", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data?.message || "Area created successfully");
                // reset the form
                setArea({
                    areaName: "",
                    zoneName: "",
                    areaPolygon: "",
                });
            })
            .catch((err) => {
                console.log(err.response);
                // set the loading to false
                setLoading(false);
                // show error message
                toast.error(err.response?.data?.message || "Something went wrong");
            });
    };

    return (
        <form onSubmit={handleSubmit} className={"col-12 card"}>
            <h1 className="text-2xl mb-5 uppercase">Create area</h1>
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="area-name">Area Name</label>
                    <InputText
                        id="area-name"
                        value={area.areaName}
                        onChange={(e) =>
                            setArea({
                                ...area,
                                areaName: e.target.value,
                            })
                        }
                        placeholder="Area Name"
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="zone-name">Zone Name</label>
                    <InputText
                        id="zone-name"
                        value={area.zoneName}
                        onChange={(e) =>
                            setArea({
                                ...area,
                                zoneName: e.target.value,
                            })
                        }
                        placeholder="Zone Name"
                    />
                </div>

                <div className="field col-12">
                    <label htmlFor="area-polygon">Area Polygon</label>
                    <InputTextarea
                        id="area-polygon"
                        value={area.areaPolygon}
                        onChange={(e) =>
                            setArea({
                                ...area,
                                areaPolygon: e.target.value,
                            })
                        }
                        placeholder="Area Polygon"
                        style={{height: "150px", resize: "none"}}
                    />
                </div>

                <div className="w-1/2 ml-auto">
                    <Button
                        type="submit"
                        className="bg-slate-500 w-full"
                        style={{
                            background: loading
                                ? "#dcdcf1"
                                : "var(--primary-color)",
                        }}
                        label={
                            loading ? (
                                <ProgressSpinner
                                    strokeWidth="4"
                                    style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                    }}
                                />
                            ) : (
                                "Submit"
                            )
                        }
                    />
                </div>
            </div>
        </form>
    );
};

export default CourierForm;
