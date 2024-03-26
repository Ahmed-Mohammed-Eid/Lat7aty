import React from 'react';
import AppMenuitem from './AppMenuitem';
import {MenuProvider} from './context/menucontext';

const AppMenu = () => {

    const [role, setRole] = React.useState('farmer');
    const model = [
        {
            label: 'Home',
            items: [
                {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'},
            ]
        },
        {
            label: 'Couriers',
            items: [
                {label: 'Couriers List', icon: 'pi pi-users', to: '/couriers'},
                {label: 'Add Courier', icon: 'pi pi-user-plus', to: '/couriers/add'},
            ]
        },
        {
            label: 'Users',
            items: [
                {label: 'Users List', icon: 'pi pi-users', to: '/users'},
                {label: 'Add User', icon: 'pi pi-user-plus', to: '/users/add'},
            ]
        },
        {
            label: 'Orders',
            items: [
                {label: 'Orders List', icon: 'pi pi-list', to: '/orders'},
                {label: 'Orders Queue', icon: 'pi pi-list', to: '/orders/queue'},
            ]
        },
        {
            label: "Pricing",
            items: [
                {label: 'Set Price', icon: 'pi pi-list', to: '/pricing'}
            ]
        },
        {
            label: "Areas",
            items: [
                {label: 'Areas List', icon: 'pi pi-list', to: '/areas'},
                {label: 'Add Area', icon: 'pi pi-plus', to: '/areas/add'},
            ]
        },
        {
            label: 'Shifts',
            items: [
                {label: 'Shifts List', icon: 'pi pi-list', to: '/shifts'},
                {label: 'Add Shift', icon: 'pi pi-plus', to: '/shifts/add'},
            ]
        },
        {
            label: 'Vegetables & Fruits',
            items: [
                {label: 'Set Zones', icon: 'pi pi-list', to: '/food/zones'},
                {label: 'Set Farms / Shops', icon: 'pi pi-list', to: '/food/farms'},
                {label: 'Items List', icon: 'pi pi-list', to: '/food/items'},
                {label: 'Add Item', icon: 'pi pi-plus', to: '/food/items/add'},
            ]
        },
        {
            label: 'Support',
            items: [
                {label: 'Messages', icon: 'pi pi-list', to: '/support'},
            ]
        },
        {
            label: 'Reports',
            items: [
                {label: 'Get report', icon: 'pi pi-chart-bar', to: '/reports'},
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'LogOut', icon: 'pi pi-sign-out', to: '/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/login';
                    },
                },
            ]
        }
    ];

    const farmerModel = [
        {
            label: 'Business Products',
            items: [
                {label: 'Items List', icon: 'pi pi-list', to: '/food/items'},
                {label: 'Add Item', icon: 'pi pi-plus', to: '/food/items/add'},
            ]
        },
        {
            label: 'Reports',
            items: [
                {label: 'Get report', icon: 'pi pi-chart-bar', to: '/reports'},
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'LogOut', icon: 'pi pi-sign-out', to: '/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/login';
                    },
                },
            ]
        }
    ]

    const usermodel = [
        {
            label: 'Reports',
            items: [
                {label: 'Get report', icon: 'pi pi-chart-bar', to: '/reports'},
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'LogOut', icon: 'pi pi-sign-out', to: '/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/login';
                    },
                },
            ]
        }
    ]

    //EFFECT TO GET THE ROLE OF THE USER FROM THE LOCAL STORAGE
    React.useEffect(() => {
        // GET THE ROLE FROM LOCAL STORAGE
        const role = localStorage.getItem("role");
        // SET THE ROLE
        setRole(role);
    }, []);


    return (
        <MenuProvider>
            <ul className="layout-menu">
                {role === "admin" && model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
                {role === "farmer" && farmerModel.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
                {role === "user" && usermodel.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
