import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const { save } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post('http://localhost:4000/auth/register', { name, email, password })
      save(res.data.user, res.data.token)
      nav('/dashboard')
    }catch(err){
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-gray-800 p-6 rounded">
        <h2 className="text-2xl mb-4">Create account</h2>
        <input className="w-full p-2 mb-3 bg-gray-900 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 mb-3 bg-gray-900 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 mb-3 bg-gray-900 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 p-2 rounded">Register</button>
      </form>
    </div>
  )
}
