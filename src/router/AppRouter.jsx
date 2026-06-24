import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Customers from "../pages/Customers/Customers";
import Accounts from "../pages/Accounts/Accounts";
import Layout from "../components/Layout/Layout";

const AppRouter = () => {
    return(
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />}/>
                <Route path="/customers" element={<Customers />}/>
                <Route path="/accounts" element={<Accounts />}/>
            </Route>
        </Routes>
    )
}

export default AppRouter