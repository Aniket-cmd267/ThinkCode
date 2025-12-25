
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { IoAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { Link } from "react-router";


function AdminPanel() {
    const navigate= useNavigate();
    const adminOptions = [
        {
            id: 'create',
            description: 'Create problem',
            bgColor: 'bg-sucess',
            route: '/admin/create',
            btn: 'btn-success'
        },
        {
            id: 'update',
            description: 'Update problem',
            bgColor: 'bg-warning',
            route: '/admin/update',
            btn: 'btn-warning'
        },
        {
            id: 'delete',
            description: 'Delete problem',
            bgColor: 'bg-error',
            route: '/admin/delete',
            btn: 'btn-error'
        }
    ]

    function handleClick(option){
        navigate(`${option.route}`)
    }
    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="hero bg-base-100 p-6 rounded-lg shadow-sm mb-6">
                    <div className="hero-content">
                        <div>
                            <h1 className="text-3xl font-bold">Admin Panel</h1>
                            <p className="py-2 text-sm opacity-70">Manage problems: create, update or delete DSA problems from this panel.</p>
                        </div>
                        <div className="ml-auto hidden md:block">
                            <div className="badge badge-lg badge-primary">Admin</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminOptions.map((option) => (
                        <div
                            key={option.id}
                            role="button"
                            onClick={() => handleClick(option)}
                            className="card bg-base-100 shadow hover:shadow-lg transition-all duration-150 cursor-pointer"
                        >
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{option.id === 'create' ? <IoAdd /> : option.id === 'update' ? <FiEdit2 /> : <MdDelete />}</div>
                                    <div className="flex-1">
                                        <h2 className="card-title">{option.description}</h2>
                                        <p className="text-sm opacity-70">Quick action: {option.id}</p>
                                    </div>
                                    <div className="self-start">
                                        <button className={`btn ${option.btn} btn-sm`}>{option.id}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;