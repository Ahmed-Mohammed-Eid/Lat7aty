import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
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

const CouriersTable = () => {
    // ROUTER
    const router = useRouter();
    // LOADERS
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [extendShiftLoader, setExtendShiftLoader] = useState(false);
    const [changeStatusLoader, setChangeStatusLoader] = useState(false);

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [users, setUsers] = useState([]);
    const [userInfoDialog, setUserInfoDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [extendShift, setExtendShift] = useState({
        value: 0,
        unit: "hours",
        showDialog: false,
        selectedUser: null,
    });
    const [selectedUserToChangeStatus, setSelectedUserToChangeStatus] = useState({
        status: "",
        selectedUser: null,
        dialog: false,
    });

    // STATE FOR LOADING ANOTHER PAGE OF DATA

    // FETCH COURIERS
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET COURIERS
        if (token) {
            // GET COURIERS
            axios
                .get(`https://api.lathaty.com/api/v1/all/couriers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUsers(res.data.couriers);
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

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // DELETE COURIER
    function deleteCourierHandler(courier) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteLoader(true)
            axios
                .delete(`https://api.lathaty.com/api/v1/delete/courier`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        courierId: courier._id,
                    }
                })
                .then((res) => {
                    setDeleteLoader(false)
                    toast.success(res.data.message);
                    // GET COURIERS COPY
                    const couriersCopy = [...users];
                    // FILTER COURIERS COPY
                    const filteredCouriersCopy = couriersCopy.filter(courierObj => courierObj._id !== courier._id);
                    // SET COURIERS
                    setUsers(filteredCouriersCopy);
                    // CLOSE DIALOG
                    setSelectedUserToDelete(null)
                })
                .catch((err) => {
                    setDeleteLoader(false)
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // EXTEND SHIFT
    function extendShiftHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // SET LOADER
        setExtendShiftLoader(true)

        if (token) {
            axios.post(`https://api.lathaty.com/api/v1/extend/courier/shift`, {
                courierId: extendShift.selectedUser,
                numberOfHours: extendShift.value
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setExtendShiftLoader(false)
                    toast.success(res.data?.message || "Shift extended successfully");
                    // CLOSE DIALOG AND RESET STATE
                    setExtendShift({
                        value: 0,
                        unit: "hours",
                        showDialog: false,
                        selectedUser: null,
                    })
                })
                .catch(err => {
                    setExtendShiftLoader(false)
                    toast.error(err.response?.data?.message || "Something went wrong");
                })

        } else {
            toast.error("You are not authorized to access this page");
        }

    }

    // CHANGE STATUS
    function changeStatusHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        if (token) {
            setChangeStatusLoader(true)
            axios.put(`https://api.lathaty.com/api/v1/set/busy/status`, {
                courierId: selectedUserToChangeStatus.selectedUser,
                state: !selectedUserToChangeStatus.status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    toast.success(res.data?.message || "Status changed successfully");
                    // GET COURIERS COPY
                    const couriersCopy = [...users];
                    // GET THE INDEX OF THE COURIER
                    const courierIndex = couriersCopy.findIndex(courierObj => courierObj._id === selectedUserToChangeStatus.selectedUser);
                    // SET THE NEW STATUS
                    couriersCopy[courierIndex].courierLogId.isBusy = !selectedUserToChangeStatus.status;
                    // SET COURIERS
                    setUsers(couriersCopy);
                    // CLOSE DIALOG AND RESET STATE
                    setSelectedUserToChangeStatus({
                        status: "",
                        selectedUser: null,
                        dialog: false,
                    })
                    setChangeStatusLoader(false)
                })
                .catch(err => {
                    setChangeStatusLoader(false)
                    toast.error(err.response?.data?.message || "Something went wrong");
                })
        }else {
            toast.error("You are not authorized to access this page");
        }
    }

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Couriers (Drivers)</h1>

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
                value={users}
                paginator
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rows={25}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple"
                globalFilter={globalFilter}
                emptyMessage="No records found"
                // Max height of the table container
                scrollable
                scrollHeight="calc(100vh - 370px)"
            >
                <Column
                    field="courierName"
                    header="Courier Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Name"
                    // CLICKABLE
                    body={(rowData) => {
                        return (
                            <span
                                className="text-primary-500 cursor-pointer"
                                onClick={() => router.push(`/couriers/${rowData._id}`)}
                            >
                                {rowData.courierName}
                            </span>
                        );
                    }}
                />
                <Column
                    field="phoneNumber"
                    header="Phone Number"
                    sortable
                    filter
                    filterPlaceholder="Search by Phone"
                />
                <Column
                    field="username"
                    header="Username"
                    // MAKE THE USERNAME COLORED
                    body={(rowData) => {
                        return (
                            <span
                                style={{
                                    backgroundColor: "#6b6bbb",
                                    padding: "0.15rem 1rem",
                                    borderRadius: "1rem",
                                    color: "#FFFFFF",
                                    cursor: "pointer",
                                }}
                                // Copy the username to the clipboard when clicked
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        rowData.username
                                    );
                                    toast.success("Copied to clipboard");
                                }}
                            >
                                {rowData.username}
                            </span>
                        );
                    }}
                    sortable
                    filter
                    filterPlaceholder="Search by Username"
                />
                <Column
                    field="companyName"
                    header="Company Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Company Name"
                />
                <Column
                    field="workingShiftId.shiftHours"
                    header="Shift"
                    sortable
                    filter
                    filterPlaceholder="Search by Car Brand"
                    body={(rowData) => {
                        return (
                            <span
                                style={{
                                    backgroundColor: "#7373b5",
                                    padding: "0.15rem 1rem",
                                    borderRadius: "1rem",
                                    color: "#FFFFFF",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {`${rowData.workingShiftId?.shiftHours} Hours (${rowData.workingShiftId?.startingHour}: ${rowData.workingShiftId?.startingMinute} - ${rowData.workingShiftId?.endingHour}: ${rowData.workingShiftId?.endingMinute})`}
                            </span>
                        );
                    }}
                />
                <Column
                    field="_id"
                    header="Actions"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className="bg-info text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setSelectedUser(rowData);
                                        setUserInfoDialog(true);
                                    }}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-success text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setExtendShift({
                                            ...extendShift,
                                            showDialog: true,
                                            selectedUser: rowData._id,
                                        })
                                    }}
                                >
                                    Extend
                                </button>
                                <button
                                    className="bg-edit text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        router.push(`/couriers/edit/${rowData._id}`);
                                    }}
                                >
                                    Edit
                                </button>
                                {(rowData?.courierLogId) && (<button
                                    className="text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    style={{
                                        backgroundColor: "#FFC107",
                                    }}
                                    onClick={() => {
                                        setSelectedUserToChangeStatus({
                                            status: rowData?.courierLogId.isBusy,
                                            selectedUser: rowData._id,
                                            dialog: true,
                                        })
                                    }}
                                >
                                    {rowData?.courierLogId.isBusy === true ? "Unlock" : "Lock"}
                                </button>)}
                                <button
                                    className="bg-danger text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setSelectedUserToDelete(rowData)
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="USER INFO"
                visible={userInfoDialog}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => {
                    // CLOSE THE DIALOG AND IF DIALOG IS CLOSED, SET THE SELECTED USER TO NULL
                    setUserInfoDialog(false);
                    const timer = setTimeout(() => {
                        setSelectedUser(null);
                        clearTimeout(timer);
                    }, 500)
                }}
            >
                <div className="grid col-12">
                    <div className="col-6">
                        <div className="font-bold">FullName:</div>
                        <div>{selectedUser?.courierName}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Username:</div>
                        <div>{selectedUser?.username}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Phone Number:</div>
                        <div>{selectedUser?.phoneNumber}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Birthdate:</div>
                        <div>
                            {new Date(
                                selectedUser?.birthdate
                            ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Company Name:</div>
                        <div>{selectedUser?.companyName}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Car Brand:</div>
                        <div>{selectedUser?.carBrand}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Car Model:</div>
                        <div>{selectedUser?.carModel}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Has Fridge:</div>
                        <div>{selectedUser?.hasFridge ? (<span className={"text-success"}>Yes</span>) : (
                            <span className={"text-danger"}>No</span>)}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Plate Number:</div>
                        <div>{selectedUser?.plateNumber}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">License Number:</div>
                        <div>{selectedUser?.licenseNumber}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Area Name:</div>
                        <div>
                            {selectedUser?.workingAreaId?.areaName}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Zone Name:</div>
                        <div>
                            {selectedUser?.workingAreaId?.zoneName}
                        </div>
                    </div>

                    {selectedUser?.documents?.length > 0 && (<div className="col-12 card mt-4">
                        <div className="font-bold">Attachments:</div>
                        <div className="flex gap-2 mt-2">
                            {selectedUser?.documents?.map((attachment, index) => {
                                return (
                                    <a key={attachment}
                                       className={"bg-info py-1 px-4 inline-block custom-button rounded-md"}
                                       style={{color: 'white'}} href={attachment}
                                       target={"_blank"}>Attachment {index + 1}</a>
                                )
                            })}
                        </div>
                    </div>)}
                </div>
            </Dialog>
            <Dialog
                header="Extend Shift"
                onHide={() => setExtendShift({...extendShift, showDialog: false, value: 0, selectedUser: null})}
                visible={extendShift.showDialog}
                style={{width: "90vw", maxWidth: "600px"}}>
                <div className="">
                    <div className="flex flex-col flex-wrap">
                        <label className="font-bold col-12" htmlFor={"ExtendShift"}>Hours:</label>
                        <InputNumber
                            className={"col-12"}
                            inputId={"ExtendShift"}
                            placeholder={"Hours"}
                            value={extendShift.value || ''}
                            onValueChange={(e) => setExtendShift({...extendShift, value: e.value})}
                            step={1}
                            min={0}
                            max={24}/>
                        <button
                            className={"button text-white px-6 py-3 rounded-md border-none pointer custom-button"}
                            onClick={extendShiftHandler}
                            style={{
                                marginTop: "1rem",
                                marginLeft: "auto",
                                marginRight: ".5rem",
                                backgroundColor: extendShiftLoader ? "#b5e2b5" : "#28a745",
                            }}>
                            {extendShiftLoader ? (
                                <ProgressSpinner
                                    strokeWidth="4"
                                    style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                    }}
                                />
                            ) : (
                                "Extend Shift"
                            )}
                        </button>
                    </div>
                </div>
            </Dialog>
            <Dialog
                header="Delete Courier"
                visible={selectedUserToDelete}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedUserToDelete(null)}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setSelectedUserToDelete(null)}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={() => deleteCourierHandler(selectedUserToDelete)}
                                style={{
                                    background: deleteLoader
                                        ? "#faacac"
                                        : "red",
                                }}
                                label={
                                    deleteLoader ? (
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
                    Are you sure you want to delete this courier?
                </p>
            </Dialog>
            <Dialog
                header="Change Courier Status"
                visible={selectedUserToChangeStatus.dialog}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedUserToChangeStatus({selectedUser: '', status: '', dialog: false})}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setSelectedUserToChangeStatus({selectedUser: '', status: '', dialog: false})}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={changeStatusHandler}
                                style={{
                                    background: changeStatusLoader
                                        ? "rgba(255,213,84,0.73)"
                                        : "#FFC107",
                                }}
                                label={
                                    changeStatusLoader ? (
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
                    Are you sure you want to change this user status?
                </p>
            </Dialog>
        </div>
    );
};
export default CouriersTable;

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