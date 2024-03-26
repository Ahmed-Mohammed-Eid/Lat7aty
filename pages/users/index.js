import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

// AXIOS
import axios from "axios";
// TOAST
import {toast} from "react-hot-toast";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputMask} from "primereact/inputmask";
import {Dropdown} from "primereact/dropdown";
import {MultiSelect} from "primereact/multiselect";

const UsersTable = () => {
    // LOADERS STATE
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [editUserLoader, setEditUserLoader] = useState(false);

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [users, setUsers] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [farms, setFarms] = useState([]);
    const [selectedUser, setSelectedUser] = useState({
        userName: "",
        phoneNumber: "",
        role: "",
        farmId: "",
        userDialog: false,
        userId: "",
        selectedCouriers: [],
    });


    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // GET USERS HANDLER
    function getUsers() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET COURIERS
        if (token) {
            // GET COURIERS
            axios
                .get(`https://api.lathaty.com/api/v1/all/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUsers(res.data.users);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }


    // Fetch users from API
    useEffect(() => {
        getUsers();
    }, []);

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
                    setCouriers(res.data.couriers);
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

    // DELETE User
    function deleteUserHandler(user) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteLoader(true)
            axios
                .delete(`https://api.lathaty.com/api/v1/delete/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        userId: user._id,
                    }
                })
                .then((res) => {
                    setDeleteLoader(false)
                    toast.success(res.data.message);
                    // GET COURIERS COPY
                    const userssCopy = [...users];
                    // FILTER COURIERS COPY
                    const filteredCouriersCopy = userssCopy.filter(userObj => userObj._id !== user._id);
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


    //  EDIT USER HANDLER
    function editUserHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // CHECK IF SHIFT DATA IS VALID
        if (!selectedUser.userName || !selectedUser.phoneNumber || !selectedUser.role) {
            toast.error("Please fill all the fields");
            return;
        }

        // CHECK IF TOKEN IS VALID
        if (token) {
            // SET LOADER TO TRUE
            setEditUserLoader(true);

            axios.put(`https://api.lathaty.com/api/v1/edit/user`, {
                employeeName: selectedUser.userName,
                phoneNumber: selectedUser.phoneNumber,
                role: selectedUser.role,
                userId: selectedUser.userId,
                farmId: selectedUser.farmId,
                couriersIds: selectedUser.selectedCouriers,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(async (_) => {
                    toast.success("User edited successfully");
                    // GET SHIFTS
                    await getUsers();
                    // CLOSE THE DIALOG
                    setSelectedUser({
                        userName: "",
                        phoneNumber: "",
                        role: "",
                        userDialog: false,
                        userId: "",
                    });
                    // CLOSE THE LOADER
                    setEditUserLoader(false);
                })
                .catch((err) => {
                    setEditUserLoader(false);
                    toast.error(err.response?.data?.message || "Something went wrong");
                })

        } else {
            toast.error("You are not authorized to access this page");
        }

    }

    // GET FARMS HANDLER
    function getFarms() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`https://api.lathaty.com/api/v1/admin/farms`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                const farms = res.data?.farms || [];
                const options = farms.map((farm) => {
                    return {
                        label: farm.farmName,
                        value: farm._id,
                    }
                });
                setFarms(options || []);
            })
            .catch((err) => {
                console.log(err.response?.data?.message || "Something went wrong!");
            })
    }

    // EFFECT TO GET FARMS
    useEffect(() => {
        getFarms();
    }, []);

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Users (Employees)</h1>

            <div className=" mb-3 w-full">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
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
                    field="employeeName"
                    header="Full Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Full Name"
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
                    field="phoneNumber"
                    header="Phone Number"
                    sortable
                    filter
                    filterPlaceholder="Search by Phone Number"
                />
                <Column
                    field="role"
                    header="Role"
                    sortable
                    filter
                    filterPlaceholder="Search by Role"
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
                                        setSelectedUser({
                                            userName: rowData.employeeName,
                                            phoneNumber: rowData.phoneNumber,
                                            role: rowData.role,
                                            farmId: rowData.farmId,
                                            userDialog: true,
                                            userId: rowData._id,
                                            selectedCouriers: rowData.couriersIds || [],
                                        });
                                    }}
                                >
                                    Edit
                                </button>
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
                header="Delete User (Employee)"
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
                                onClick={() => deleteUserHandler(selectedUserToDelete)}
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
                    Are you sure you want to delete this User (Employee)?
                </p>
            </Dialog>
            <Dialog onHide={() => {
                setSelectedUser({
                    phoneNumber: "",
                    userName: "",
                    role: "",
                    userDialog: false,
                    userId: "",
                })
            }} visible={selectedUser?.userDialog} header={"Edit User (Employee)"} style={{width: '90%', maxWidth: '500px'}}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="user-name">User Name</label>
                        <InputText
                            id="user-name"
                            value={selectedUser.userName}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    userName: e.target.value,
                                })
                            }
                            placeholder="User Name"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="phone">Phone</label>
                        <InputMask
                            id="phone"
                            mask="9999-9999"
                            value={selectedUser.phoneNumber}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    phoneNumber: e.target.value,
                                })
                            }
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="role">Role</label>
                        <Dropdown
                            id="role"
                            value={selectedUser.role}
                            onChange={(e) =>{
                                setSelectedUser({
                                    ...selectedUser,
                                    role: e.target.value,
                                    selectedCouriers: [],
                                })
                            }}
                            placeholder="Select a Role"
                            options={[
                                {label: "Admin", value: "admin"},
                                {label: "User", value: "user"},
                                {label: "Business Owner", value: "farmer"}
                            ]}
                        />
                    </div>

                    {selectedUser.role === "user" && (<div className="field col-12">
                        <label htmlFor="role">Couriers</label>
                        <MultiSelect
                            id="courier"
                            value={selectedUser.selectedCouriers}
                            onChange={(e) =>{
                                setSelectedUser({
                                    ...selectedUser,
                                    selectedCouriers: e.value,
                                })
                            }}
                            placeholder="Select Couriers"
                            options={couriers || []}
                            optionLabel="courierName"
                            optionValue="_id"
                        />
                    </div>)}

                    {selectedUser.role === "farmer" && (<div className="field col-12">
                        <label htmlFor="farm">Farm</label>
                        <Dropdown
                            id="farm"
                            value={selectedUser.farmId}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    farmId: e.target.value,
                                })
                            }
                            placeholder="Select a Farm"
                            options={farms || []}
                        />
                    </div>)}
                    <Button type={'submit'}
                            className={'bg-primary mx-2 mt-2 text-white px-3 py-2 rounded-md pointer border-none custom-button'}
                            onClick={editUserHandler}
                            style={{
                                background: editUserLoader
                                    ? "rgba(119,141,206,0.58)"
                                    : "#4e73df",
                            }}
                            label={
                                editUserLoader ? (
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
        </div>
    );
};
export default UsersTable;


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