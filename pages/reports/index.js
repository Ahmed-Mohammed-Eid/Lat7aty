import React, {useEffect} from "react";
import {useRouter} from "next/router";

import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// AXIOS
import axios from "axios";

function Reports() {

    // NEXT-JS ROUTER
    const router = useRouter();

    //STATES
    const [BusinessList, setBusinessList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [role, setRole] = React.useState("");
    const [reportType, setReportType] = React.useState("");
    const [businessOwnerId, setBusinessOwnerId] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    function handleSubmit(e) {
        e.preventDefault();
        //GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
        if (!token) {
            router.push("/login");
        }

        let url = "";

        if (reportType === "sales") {
            url = "https://api.lathaty.com/api/v1/reports/business/owners"
        }

        if (reportType === "sales" && role === "farmer") {
            url = "https://api.lathaty.com/api/v1/reports/sales/business/owner"
        }

        if (reportType === "couriers") {
            url = "https://api.lathaty.com/api/v1/reports/couriers/orders"
        }

        if(reportType === "couriers" && role === "user") {
            url = "https://api.lathaty.com/api/v1/user/couriers/orders"
        }

        let params = {
            dateFrom: startDate,
            dateTo: endDate,
        }

        if (reportType === "sales" && role !== "farmer") {
            params = {
                businessOwnerId: businessOwnerId,
                dateFrom: startDate,
                dateTo: endDate,
            }
        }


        // SET THE LOADING STATE TO TRUE
        setLoading(true);
        // MAKE THE API CALL
        axios.get(`${url}`, {
            params: params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then((res) => {
                // SET THE LOADING STATE TO FALSE
                setLoading(false);
                // OPEN THE URL IN A NEW TAB
                const timer = setTimeout(() => {
                    window.open(res.data.url, "_blank");
                    clearTimeout(timer);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                // SET THE LOADING STATE TO FALSE
                setLoading(false);
            });
    }

    // GET BUSINESS OWNERS
    useEffect(() => {
        // IF THE ROLE IS NOT ADMIN, RETURN
        if (role !== "admin") return;

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
        if (!token) {
            router.push("/login");
        }

        if(role !== "admin") return;
        // GET THE BUSINESS OWNERS
        axios
            .get("https://api.lathaty.com/api/v1/admin/farms", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                const farms = res.data.farms.map((farm) => {
                    return {
                        label: farm.farmName,
                        value: farm._id,
                    };
                });
                setBusinessList(farms);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [reportType, role, router]);

    // GET THE ROLE FROM LOCAL STORAGE
    useEffect(() => {
        const role = localStorage.getItem("role");
        setRole(role);
    }, []);

    const adminReportTypes = [
        {label: "Business Owner Sales Report", value: "sales"},
        {label: "Couriers Orders Report", value: "couriers"},
    ];

    const userReportTypes = [
        {label: "Couriers Orders Report", value: "couriers"},
    ];

    const businessOwnerSalesReport = [
        {label: "Business Owner Sales Report", value: "sales"},
    ]


    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">GET Report</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="reportType">Report Type</label>
                        <Dropdown
                            id="reportType"
                            value={reportType}
                            onChange={(e) => {
                                setReportType(e.target.value);
                            }}
                            placeholder="Report Type"
                            options={role === "admin" ? adminReportTypes : (role === "farmer" ? businessOwnerSalesReport : userReportTypes)}
                        />
                    </div>

                    {(reportType === "sales" && role !== "farmer") && (
                        <div className="field col-12">
                            <label htmlFor="businessOwnerId">Business Owner</label>
                            <Dropdown
                                id="businessOwnerId"
                                value={businessOwnerId}
                                onChange={(e) => {
                                    setBusinessOwnerId(e.target.value);
                                }}
                                placeholder="Business Owner"
                                options={BusinessList || []}
                            />
                        </div>
                    )}

                    <div className="field col-12 md:col-6">
                        <label htmlFor="startDate">Start Date</label>
                        <Calendar
                            id="startDate"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                            placeholder="Start Date"
                            dateFormat="dd/mm/yy"
                            showIcon={true}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="endDate">End Date</label>
                        <Calendar
                            id="endDate"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                            placeholder="End Date"
                            dateFormat="dd/mm/yy"
                            showIcon={true}
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
        </>
    );
}

export default Reports;

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