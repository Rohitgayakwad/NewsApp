import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NavBar = ()=> {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    const collapseRef = useRef(null)
    const toggleRef = useRef(null)

    const handleSearch = (e) => {
        e.preventDefault()
        const trimmed = query.trim()
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`)
            setQuery('')
            // Close navbar on mobile after search
            if (collapseRef.current?.classList.contains('show') && toggleRef.current) {
                toggleRef.current.click()
            }
        }
    }

    const closeNavbar = () => {
        if (collapseRef.current?.classList.contains('show') && toggleRef.current) {
            toggleRef.current.click()
        }
    }

    useEffect(() => {
        const handleDocumentClick = (event) => {
            const collapseEl = collapseRef.current
            const toggleEl = toggleRef.current
            if (!collapseEl || !toggleEl) return

            if (collapseEl.classList.contains('show') && !collapseEl.contains(event.target) && !toggleEl.contains(event.target)) {
                toggleEl.click()
            }
        }

        document.addEventListener('click', handleDocumentClick)
        return () => document.removeEventListener('click', handleDocumentClick)
    }, [])

    return (
        <div>
            <nav className="navbar fixed-top navbar-expand-lg" style={{ backgroundColor: "#6f42c1" }} data-bs-theme="light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" onClick={closeNavbar} style={{ color: "white" }}>NewsWeb</Link>
                    <button ref={toggleRef} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div ref={collapseRef} className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" aria-current="page" to="/" onClick={closeNavbar} style={{ color: "white" }}>Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/business" onClick={closeNavbar} style={{ color: "white" }}>Business</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/entertainment" onClick={closeNavbar} style={{ color: "white" }}>Entertainment</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/health" onClick={closeNavbar} style={{ color: "white" }}>Health</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/science" onClick={closeNavbar} style={{ color: "white" }}>Science</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/sports" onClick={closeNavbar} style={{ color: "white" }}>Sports</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/technology" onClick={closeNavbar} style={{ color: "white" }}>Technology</Link></li>
                        </ul>
                        <form className="d-flex" role="search" onSubmit={handleSearch}>
                            <input className="form-control me-2" value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-light" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar
