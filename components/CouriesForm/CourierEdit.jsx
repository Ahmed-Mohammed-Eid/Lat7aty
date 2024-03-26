import React, {useState, useEffect} from "react";
import {InputText} from "primereact/inputtext";
import CustomInputMask from "@/components/CustomMaskInput/CustomMaskInput";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Checkbox} from "primereact/checkbox";
import {FileUpload} from "primereact/fileupload";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {Dialog} from "primereact/dialog";
// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";
import CustomFileInput from "@/components/CustomFileInput/CustomFileInput";


const CourierForm = ({id, courier: courierServer}) => {

    // STATES
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [areas, setAreas] = useState([]);
    const [courier, setCourier] = useState({
        courierId: id,
        courierName: "",
        birthdate: null,
        phoneNumber: "",
        companyName: "",
        carBrand: "",
        carModel: "",
        plateNumber: "",
        workingAreaId: "",
        workingShiftId: "",
        files: [],
        licenseNumber: "",
        hasFridge: false,
    });
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!courier.courierName || !courier.birthdate || !courier.phoneNumber || !courier.companyName || !courier.carBrand || !courier.carModel || !courier.plateNumber || !courier.workingAreaId || !courier.workingShiftId || !courier.licenseNumber || !courier.files || courier.hasFridge === null) {
            toast.error("Please fill all fields");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        // Append data to FormData object
        formData.append("courierId", courier.courierId || id);
        formData.append("courierName", courier.courierName);
        formData.append("birthdate", courier.birthdate);
        formData.append("phoneNumber", courier.phoneNumber);
        formData.append("companyName", courier.companyName);
        formData.append("carBrand", courier.carBrand);
        formData.append("carModel", courier.carModel);
        formData.append("plateNumber", courier.plateNumber);
        formData.append("workingAreaId", courier.workingAreaId);
        formData.append("workingShiftId", courier.workingShiftId);
        formData.append("licenseNumber", courier.licenseNumber);
        formData.append("hasFridge", courier.hasFridge);
        // Append files to FormData object
        for (let i = 0; i < courier.files.length; i++) {
            formData.append("files", courier.files[i]);
        }

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.put("https://api.lathaty.com/api/v1/edit/courier", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data.message);
                // SHOW DIALOG
                setUserInfo({
                    username: res.data.username,
                    password: res.data.password,
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


    // EFFECT TO GET SHIFTS AND WORKING AREAS
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");
        if (token) {
            // GET SHIFTS
            axios
                .get(`https://api.lathaty.com/api/v1/get/all/shifts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setShifts(res.data.shifts);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(
                        err.response.data.message || "Something went wrong"
                    );
                });

            // GET WORKING AREAS
            axios
                .get(`https://api.lathaty.com/api/v1/get/areas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setAreas(res.data.areas);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(
                        err.response.data.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }, []);

    // EFFECT TO SET THE COURIER DATA FROM THE SERVER VERSION
    useEffect(() => {
        setCourier({
            courierName: courierServer.courierName,
            birthdate: new Date(courierServer.birthdate),
            phoneNumber: courierServer.phoneNumber,
            companyName: courierServer.companyName,
            carBrand: courierServer.carBrand,
            carModel: courierServer.carModel,
            plateNumber: courierServer.plateNumber,
            workingAreaId: courierServer.workingAreaId?._id,
            workingShiftId: courierServer.workingShiftId,
            files: [],
            licenseNumber: courierServer.licenseNumber,
            hasFridge: courierServer.hasFridge,
        })
    }, [courierServer]);

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Edit Courier</h1>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="courier-name">Courier Name</label>
                        <InputText
                            id="courier-name"
                            value={courier.courierName}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    courierName: e.target.value,
                                })
                            }
                            placeholder="Courier Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="birthdate">Birthdate</label>
                        <Calendar
                            id="birthdate"
                            value={courier.birthdate}
                            dateFormat="dd/mm/yy"
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    birthdate: e.value,
                                })
                            }
                            placeholder="Birthdate"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="phone">Phone</label>
                        <CustomInputMask
                            id="phone"
                            value={courier.phoneNumber}
                            onChange={(value) =>
                                setCourier({
                                    ...courier,
                                    phoneNumber: value,
                                })
                            }
                            placeholder="Phone Number"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="company-name">Company Name</label>
                        <InputText
                            id="company-name"
                            value={courier.companyName}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    companyName: e.target.value,
                                })
                            }
                            placeholder="Company Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="car-brand">Car Brand</label>
                        <InputText
                            id="car-brand"
                            value={courier.carBrand}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    carBrand: e.target.value,
                                })
                            }
                            placeholder="Car Brand"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="car-model">Car Model</label>
                        <InputText
                            id="car-model"
                            value={courier.carModel}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    carModel: e.target.value,
                                })
                            }
                            placeholder="Car Model"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="working-area">Working Area</label>
                        <Dropdown
                            id="working-area"
                            value={courier.workingAreaId}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    workingAreaId: e.target.value,
                                })}
                            placeholder="Working Area"
                            options={areas.map((area) => ({
                                label: area.areaName,
                                value: area._id,
                            }))}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="working-shift">Working Shift</label>
                        <Dropdown
                            id="working-shift"
                            value={courier.workingShiftId}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    workingShiftId: e.target.value,
                                })}
                            placeholder="Working Shift"
                            options={shifts.map((shift) => ({
                                label: `${shift.shiftHours} Hours - (${shift.startingHour}:${shift.startingMinute} - ${shift.endingHour}:${shift.endingMinute})`,
                                value: shift._id,
                            }))}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="plate-number">Plate Number</label>
                        <InputText
                            id="plate-number"
                            value={courier.plateNumber}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    plateNumber: e.target.value,
                                })
                            }
                            placeholder="Plate Number"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="license-number">License Number</label>
                        <InputText
                            id="license-number"
                            value={courier.licenseNumber}
                            onChange={(e) =>
                                setCourier({
                                    ...courier,
                                    licenseNumber: e.target.value,
                                })
                            }
                            placeholder="License Number"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="files">Files</label>
                        <CustomFileInput accept={'.jpg, .jpeg, .png, .gif, .pdf, .doc, .docx'} handleImageChange={(files) => {
                            // SET THE FILES
                            setCourier({ ...courier, files: files })
                        }} />
                    </div>

                    <div className="field col-12 md:col-6 flex items-center gap-2">
                        <Checkbox
                            inputId="hasFridge"
                            checked={courier.hasFridge}
                            onChange={(e) =>
                                setCourier({...courier, hasFridge: e.checked})
                            }
                        />
                        <label htmlFor="hasFridge">Has Fridge</label>
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
            <Dialog
                header="USER INFO"
                visible={userInfo.username && userInfo.password}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => {
                    // CLOSE THE DIALOG AND IF DIALOG IS CLOSED, SET THE SELECTED USER TO NULL
                    setUserInfo(false);
                }}
            >
                <div className="grid p-4">
                    <div className="col-12 grid">
                        <div className={"col-6"}>
                            <div className="font-bold">Username:</div>
                            <p>{userInfo.username}</p>
                        </div>
                        <div className={"col-6 flex"} style={{justifyContent: "flex-end"}}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        userInfo.username
                                    );
                                    toast.success("Username copied!");
                                }}
                                className={"bg-success border-none py-1 px-4 text-white text-bold custom-button pointer"}>Copy
                            </button>
                        </div>
                    </div>
                    <div className="col-12 grid">
                        <div className={"col-6"}>
                            <div className="font-bold">Password:</div>
                            <p>{userInfo.password}</p>
                        </div>
                        <div className={"col-6 flex"} style={{justifyContent: "flex-end"}}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        userInfo.password
                                    );
                                    toast.success("Password copied!");
                                }}
                                className={"bg-success border-none py-1 px-4 text-white text-bold custom-button pointer"}>Copy
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default CourierForm;
