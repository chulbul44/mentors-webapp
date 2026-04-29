"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
    User,
    MapPin,
    CreditCard,
    Package,
    Heart,
    Ticket,
    Bell,
    Star,
    Wallet,
    Power,
    Loader2,
    Info
} from "lucide-react"

// Types
interface SidebarItem {
    id: string
    name: string
    icon: any
}

interface SidebarGroup {
    group: string
    items: SidebarItem[]
}

const SIDEBAR_CONTENT: SidebarGroup[] = [
    {
        group: "MY ORDERS",
        items: [{ id: "my-orders", name: "My Orders", icon: Package }]
    },
    {
        group: "ACCOUNT SETTINGS",
        items: [
            { id: "profile-info", name: "Profile Information", icon: User },
            { id: "manage-addresses", name: "Manage Addresses", icon: MapPin },
            { id: "pan-card", name: "PAN Card Information", icon: CreditCard }
        ]
    },
    {
        group: "PAYMENTS",
        items: [
            { id: "gift-cards", name: "Gift Cards", icon: Wallet },
            { id: "saved-cards", name: "Saved Cards", icon: CreditCard }
        ]
    },
    {
        group: "MY STUFF",
        items: [
            { id: "my-coupons", name: "My Coupons", icon: Ticket },
            { id: "my-wishlist", name: "My Wishlist", icon: Heart }
        ]
    }
]

export default function ProfilePage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("profile-info")
    const [user, setUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: { street: "", city: "", state: "", pinCode: "" }
    })

    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }
            try {
                const res = await fetch("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.success) {
                    setUser(data.user)
                    setFormData({
                        name: data.user.name || "",
                        phone: data.user.phone || "",
                        address: {
                            street: data.user.address?.street || "",
                            city: data.user.address?.city || "",
                            state: data.user.address?.state || "",
                            pinCode: data.user.address?.pinCode || ""
                        }
                    })
                }
            } catch (error) {
                console.error("Fetch error")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const token = localStorage.getItem("token")
        try {
            const res = await fetch("http://localhost:5000/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) alert("Profile Updated!")
        } catch (error) {
            alert("Error updating profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-4">

                {/* Sidebar */}
                <aside className="w-full md:w-80 flex flex-col gap-4">
                    <div className="bg-white p-3 flex items-center gap-4 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Hello,</p>
                            <h2 className="font-bold text-gray-800">{user?.name}</h2>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm overflow-hidden border border-gray-100">
                        {SIDEBAR_CONTENT.map((group, gIdx) => (
                            <div key={gIdx} className="border-b border-gray-100 last:border-0">
                                <div className="px-6 py-4 flex items-center gap-4">
                                    <h3 className="font-bold text-gray-400 text-sm tracking-wide uppercase">{group.group}</h3>
                                </div>
                                <div className="pb-2">
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full text-left px-16 py-3 text-sm transition-colors ${activeTab === item.id ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-gray-100">
                            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-gray-600 hover:text-blue-600 font-bold">
                                <Power className="w-5 h-5 text-blue-600" />
                                <span className="text-sm uppercase tracking-wide">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 bg-white shadow-sm p-8 min-h-[600px] border border-gray-100">
                    {activeTab === "profile-info" && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-8">Personal Information</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 font-semibold uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 font-semibold uppercase">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="px-10 py-3 bg-[#fb641b] text-white font-bold uppercase shadow-md hover:bg-[#e65a17] transition-all">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "manage-addresses" && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-8">Manage Addresses</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={formData.address.street}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:border-blue-500"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <input type="text" placeholder="City" value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} className="w-full px-4 py-3 border border-gray-200" />
                                    <input type="text" placeholder="State" value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} className="w-full px-4 py-3 border border-gray-200" />
                                    <input type="text" placeholder="Pin Code" value={formData.address.pinCode} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pinCode: e.target.value } })} className="w-full px-4 py-3 border border-gray-200" />
                                </div>
                                <button type="submit" className="px-10 py-3 bg-[#fb641b] text-white font-bold uppercase">Save Address</button>
                            </form>
                        </div>
                    )}

                    {activeTab === "my-orders" && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-8">My Orders</h3>
                            <div className="space-y-4">
                                {[1, 2].map((order) => (
                                    <div key={order} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">Order #ORD-{Math.floor(Math.random() * 100000)}</h4>
                                                <p className="text-sm text-gray-500">Placed on Oct {12 + order}, 2023</p>
                                                <span className="inline-block mt-1 px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded">Delivered</span>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "pan-card" && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-8">PAN Card Information</h3>
                            <div className="bg-blue-50 p-4 rounded-xl mb-6 flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">Your PAN card is required for purchases over ₹50,000 or for international shipments.</p>
                            </div>
                            <form className="space-y-6 max-w-md">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-semibold uppercase">PAN Number</label>
                                    <input type="text" placeholder="ABCDE1234F" className="w-full px-4 py-3 border border-gray-200 uppercase outline-none focus:border-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-semibold uppercase">Full Name on PAN</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 outline-none focus:border-blue-500" />
                                </div>
                                <button type="button" className="px-10 py-3 bg-[#fb641b] text-white font-bold uppercase shadow-md hover:bg-[#e65a17] transition-all">
                                    Save PAN
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "gift-cards" && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-8">Gift Cards Balance</h3>
                            <div className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-pink-500/20 max-w-sm mb-8">
                                <p className="text-pink-100 text-sm mb-1">Available Balance</p>
                                <h2 className="text-4xl font-black mb-6">₹0.00</h2>
                                <div className="flex gap-4">
                                    <button className="flex-1 bg-white text-pink-600 font-bold py-2 rounded-lg text-sm">Add Gift Card</button>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-6 text-center">
                                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No recent gift card transactions</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "saved-cards" && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-8">Saved Cards</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-32 hover:border-blue-300 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-gray-800">HDFC Bank</div>
                                        <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-gray-500 tracking-widest text-sm mb-1">**** **** **** 4242</div>
                                        <div className="text-xs text-gray-400 uppercase">Expires 12/26</div>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                + Add New Card
                            </button>
                        </div>
                    )}

                    {(activeTab === "my-coupons" || activeTab === "my-wishlist") && (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-300">
                            {activeTab === "my-coupons" ? <Ticket className="w-16 h-16 text-pink-200 mb-6" /> : <Heart className="w-16 h-16 text-pink-200 mb-6" />}
                            <h3 className="text-xl font-bold text-gray-800 mb-2">View Your {activeTab === "my-coupons" ? "Coupons" : "Wishlist"}</h3>
                            <p className="text-gray-500 mb-6">We have a dedicated page for your {activeTab === "my-coupons" ? "coupons" : "wishlist"}.</p>
                            <button 
                                onClick={() => router.push(activeTab === "my-coupons" ? "/coupons" : "/wishlist")}
                                className="px-6 py-3 bg-pink-600 text-white font-bold rounded-full shadow-lg hover:bg-pink-700 transition-colors"
                            >
                                Go to {activeTab === "my-coupons" ? "Coupons" : "Wishlist"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
