import React, {useState, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";

// AXIOS
import axios from "axios";

// TOAST
import {toast} from "react-hot-toast";

const ShiftsTable = () => {

    // STATES FOR LOADERS
    const [editShiftLoader, setEditShiftLoader] = useState(false);
    const [deleteShiftLoader, setDeleteShiftLoader] = useState(false);

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState({
        shiftHours: "",
        startingHour: "",
        startingMinute: "",
        shiftDialog: false,
        shiftId: "",
    });
    const [selectedShiftDelete, setSelectedShiftDelete] = useState({
        shiftDialogDelete: false,
        shiftIdDelete: "",
    });
    // STATE FOR LOADING ANOTHER PAGE OF DATA

    // FUNCTION TO GET THE SHIFTS
    const getShifts = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
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
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // FETCH SHIFTS
    useEffect(() => {
        getShifts();
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };


    //  EDIT SHIFT HANDLER
    function editShiftHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // CHECK IF SHIFT DATA IS VALID
        if (selectedShift.shiftHours === null || selectedShift.startingHour === null || selectedShift.startingMinute === null || selectedShift.shiftId === null) {
            toast.error("Please fill all the fields");
            return;
        }

        // CHECK IF SHIFT HOURS IS GREATER THAN 24
        if (selectedShift.shiftHours > 24) {
            toast.error("Shift hours cannot be greater than 24");
            return;
        }

        // CHECK IF STARTING HOUR IS GREATER THAN 24
        if (selectedShift.startingHour > 24) {
            toast.error("Starting hour cannot be greater than 24");
            return;
        }

        // CHECK IF STARTING MINUTE IS GREATER THAN 60
        if (selectedShift.startingMinute > 60) {
            toast.error("Starting minute cannot be greater than 60");
            return;
        }

        // CHECK IF TOKEN IS VALID
        if (token) {
            // SET LOADER TO TRUE
            setEditShiftLoader(true);

            axios.put(`https://api.lathaty.com/api/v1/edit/shift`, {
                shiftHours: selectedShift.shiftHours,
                startingHour: selectedShift.startingHour,
                startingMinute: selectedShift.startingMinute,
                shiftId: selectedShift.shiftId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(async (res) => {
                    toast.success("Shift edited successfully");
                    // GET SHIFTS
                    await getShifts();
                    // CLOSE THE DIALOG
                    setSelectedShift({
                        shiftHours: "",
                        startingHour: "",
                        startingMinute: "",
                        shiftDialog: false,
                        shiftId: "",
                    });
                    // CLOSE THE LOADER
                    setEditShiftLoader(false);
                })
                .catch((err) => {
                    setEditShiftLoader(false);
                    toast.error(err.response?.data?.message || "Something went wrong");
                })

        } else {
            toast.error("You are not authorized to access this page");
        }

    }

    // DELETE SHIFT
    function deleteShiftHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // CHECK IF THE ID IS VALID
        if (selectedShiftDelete.shiftIdDelete === null || selectedShiftDelete.shiftIdDelete === undefined) {
            toast.error("Please select a shift to delete");
            return;
        }

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteShiftLoader(true)
            axios
                .delete(`https://api.lathaty.com/api/v1/delete/shift`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        shiftId: selectedShiftDelete?.shiftIdDelete,
                    }
                })
                .then(async (res) => {
                    toast.success(res.data.message);
                    // GET SHIFTS
                    await getShifts();
                    // CLOSE THE DIALOG
                    setSelectedShiftDelete({
                        shiftDialogDelete: false,
                        shiftIdDelete: "",
                    });
                    // CLOSE THE LOADER
                    setDeleteShiftLoader(false)
                })
                .catch((err) => {
                    setDeleteShiftLoader(false)
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }


    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Shifts</h1>

            <div className=" mb-3 w-full">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        placeholder="Search"
                        value={globalFilter || ""}
                        onChange={onGlobalFilter}
                        className="p-inputtext p-component"
                    />
                </span>
            </div>
            <DataTable
                value={shifts}
                paginator
                first={page * rowsPerPage}
                rows={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple"
                globalFilter={globalFilter}
                emptyMessage="No records found"
                // Max height of the table container
                scrollable
                scrollHeight="calc(100vh - 370px)"
            >
                <Column
                    field="shiftHours"
                    header="Shift Hours"
                    sortable
                    filter
                    filterPlaceholder="Search by Shift Hours"
                />
                <Column
                    field="startingHour"
                    header="Starting Hour"
                    sortable
                    filter
                    filterPlaceholder="Search by Starting Hour"
                />
                <Column
                    field="startingMinute"
                    header="Starting Minute"
                    sortable
                    filter
                    filterPlaceholder="Search by Starting Minute"
                />
                <Column
                    field="endingHour"
                    header="Ending Hour"
                    sortable
                    filter
                    filterPlaceholder="Search by Ending Hour"
                />
                <Column
                    field="endingMinute"
                    header="Ending Minute"
                    sortable
                    filter
                    filterPlaceholder="Search by Ending Minute"
                />
                <Column
                    field="_id"
                    header="Actions"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className="bg-edit text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setSelectedShift({
                                            shiftHours: rowData.shiftHours,
                                            startingHour: rowData.startingHour,
                                            startingMinute: rowData.startingMinute,
                                            shiftDialog: true,
                                            shiftId: rowData._id,
                                        });
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-danger text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setSelectedShiftDelete({
                                            shiftDialogDelete: true,
                                            shiftIdDelete: rowData._id,
                                        })
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog onHide={() => {
                setSelectedShift({
                    shiftHours: '',
                    startingHour: '',
                    startingMinute: '',
                    shiftDialog: false,
                    shiftId: ''
                })
            }} visible={selectedShift?.shiftDialog} header={"Edit Shift"} style={{width: '90%', maxWidth: '500px'}}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="__shift_hours" className={'font-bold'}>Shift Hours:</label>
                        <InputNumber
                            id="__shift_hours"
                            value={selectedShift?.shiftHours}
                            min={1}
                            max={24}
                            onChange={(e) =>
                                setSelectedShift({
                                    ...selectedShift,
                                    shiftHours: e.value,
                                })
                            }
                            placeholder="Shift Hours"
                            step={0.5}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="starting-hour-2" className={'font-bold'}>Starting Hour:</label>
                        <InputNumber
                            id="starting-hour-2"
                            value={selectedShift?.startingHour}
                            min={0}
                            max={23}
                            onChange={(e) =>
                                setSelectedShift({
                                    ...selectedShift,
                                    startingHour: e.value,
                                })
                            }
                            placeholder="Starting Hour"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="__starting_minute" className={'font-bold'}>Starting Minute:</label>
                        <InputNumber
                            id="__starting_minute"
                            value={selectedShift?.startingMinute}
                            min={0}
                            max={59}
                            onChange={(e) =>
                                setSelectedShift({
                                    ...selectedShift,
                                    startingMinute: e.value,
                                })
                            }
                            placeholder="Starting Minute"
                        />
                    </div>
                    <Button type={'submit'}
                            className={'bg-primary mx-2 mt-2 text-white px-3 py-2 rounded-md pointer border-none custom-button'}
                            onClick={editShiftHandler}
                            style={{
                                background: editShiftLoader
                                    ? "rgba(119,141,206,0.58)"
                                    : "#4e73df",
                            }}
                            label={
                                editShiftLoader ? (
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
            </Dialog>
            <Dialog
                header="Delete Shift"
                visible={selectedShiftDelete?.shiftDialogDelete}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedShiftDelete({
                    shiftDialogDelete: false,
                    shiftIdDelete: ''
                })}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setSelectedShiftDelete({
                                    shiftDialogDelete: false,
                                    shiftIdDelete: ''
                                })}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={() => deleteShiftHandler()}
                                style={{
                                    background: deleteShiftLoader
                                        ? "#faacac"
                                        : "red",
                                }}
                                label={
                                    deleteShiftLoader ? (
                                        <ProgressSpinner
                                            strokeWidth="4"
                                            style={{
                                                width: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        />
                                    ) : (
                                        "Yes"
                                    )
                                }/>
                        </div>
                    )
                }>
                <p className="m-0">
                    Are you sure you want to delete this shift?
                </p>
            </Dialog>
        </div>
    );
};
export default ShiftsTable;

// SERVER SIDE PROPS
export async function getServerSideProps(ctx) {
    // GET THE TOKEN FROM THE COOKIES
    const token = ctx.req.cookies.token;

    // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}