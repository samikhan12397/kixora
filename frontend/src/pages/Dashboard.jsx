import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "../components/Tabs.jsx";
import api from "../services/api.js";
import { logout } from "../redux/slices/authSlice.js";

function Profile({ user }) {
  return (
    <div className="max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-volt text-ink font-display text-2xl flex items-center justify-center">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div className="font-semibold">{user?.name}</div>
          <div className="text-sm text-steel">{user?.email}</div>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders/mine").then((r) => setOrders(r.data)); }, []);
  if (!orders.length) return <p className="text-steel text-sm">No orders yet.</p>;
  return (
    <div className="flex flex-col gap-4">
      {orders.map((o) => (
        <div key={o._id} className="flex justify-between items-center border-b border-steeldim pb-4">
          <div>
            <div className="font-mono text-sm">#{o._id.slice(-8).toUpperCase()}</div>
            <div className="text-xs text-steel capitalize">{o.status}</div>
          </div>
          <div className="font-display text-xl text-volt">${o.grandTotal?.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  useEffect(() => { api.get("/addresses").then((r) => setAddresses(r.data)); }, []);
  if (!addresses.length) return <p className="text-steel text-sm">No saved addresses.</p>;
  return (
    <div className="grid gap-4">
      {addresses.map((a) => (
        <div key={a._id} className="border border-steeldim rounded p-4 text-sm">
          <div className="font-semibold mb-1">{a.label} {a.isDefault && <span className="text-volt text-xs ml-2">DEFAULT</span>}</div>
          <div className="text-steel">{a.street}, {a.city}, {a.state} {a.postalCode}</div>
        </div>
      ))}
    </div>
  );
}

function Settings({ dispatch }) {
  return (
    <div className="max-w-sm">
      <p className="text-steel text-sm mb-6">Manage your notification preferences and account.</p>
      <button onClick={() => dispatch(logout())} className="btn-ghost">Log Out</button>
    </div>
  );
}

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20">
      <h1 className="font-display text-5xl mb-10">My Account</h1>
      <Tabs
        tabs={[
          { label: "Profile", content: <Profile user={user} /> },
          { label: "Orders", content: <Orders /> },
          { label: "Saved Addresses", content: <Addresses /> },
          { label: "Notifications", content: <p className="text-steel text-sm">No new notifications.</p> },
          { label: "Settings", content: <Settings dispatch={dispatch} /> },
        ]}
      />
    </div>
  );
}
