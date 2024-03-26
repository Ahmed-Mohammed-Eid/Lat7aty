import React, {useState, useEffect} from "react";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";


const CourierForm = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [shift, setShift] = useState({
        shiftHours: "",
        startHour: "",
        startMinute: "",
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!shift.shiftHours || (!shift.startHour && shift.startHour !== 0) || (!shift.startMinute && shift.startMinute !== 0)) {
            toast.error("Please fill all fields");
            return;
        }

        // Create object of data to send
        const data = {
            shiftHours: shift.shiftHours,
            startingHour: shift.startHour,
            startingMinute: shift.startMinute,
        }

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.post("https://api.lathaty.com/api/v1/create/shift", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data.message);
                // reset the form
                setShift({
                    shiftHours: "",
                    startHour: "",
                    startMinute: "",
                });
            })
            .catch((err) => {
                console.log(err.response);
                // set the loading to false
                setLoading(false);
                // show error message
                toast.error(err.response.data.message);
            });
    };

    return (
        <form onSubmit={handleSubmit} className={"col-12 card"}>
            <h1 className="text-2xl mb-5 uppercase"> Create Shift</h1>
            <div className="p-fluid formgrid grid">
                <div className="field col-12">
                    <label htmlFor="shift-hours">Shift Hours</label>
                    <InputNumber
                        id="shift-hours"
                        value={shift.shiftHours}
                        step={0.5}
                        min={0.5}
                        max={24}
                        onChange={(e) =>
                            setShift({
                                ...shift,
                                shiftHours: e.value,
                            })
                        }
                        placeholder="Shift Hours"
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="starting-hour">Starting Hour</label>
                    <InputNumber
                        id="starting-hour"
                        value={shift.startHour}
                        min={0}
                        max={23}
                        onChange={(e) =>
                            setShift({
                                ...shift,
                                startHour: e.value,
                            })
                        }
                        placeholder="Starting Hour"
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="starting-minute">Starting Minute</label>
                    <InputNumber
                        id="starting-minute"
                        value={shift.startMinute}
                        min={0}
                        max={59}
                        onChange={(e) =>
                            setShift({
                                ...shift,
                                startMinute: e.value,
                            })
                        }
                        placeholder="Starting Minute"
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
