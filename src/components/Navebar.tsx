import { useEffect, useRef, useState, type FC } from "react"
import logo from "../assets/Pauloflix.png"
import profile from "../assets/profile.jpg"
import { Link, useNavigate } from "react-router-dom"
import { Bell, ChevronRight, Menu, Search, X } from "lucide-react"

const Navebar: FC = () => {

    const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [searchQuery, setsearchQuery] = useState<string>("")

    const [isSticky, setIsSticky] = useState<boolean>(false)

    const mainInputRef = useRef<HTMLInputElement>(null)
    const mobileInputRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)

        return() =>{
            window.removeEventListener('scroll',handleScroll)
        }
    },[])

    const toggleSearch = (type: string) => {
        if (type === "mobile") {
            mobileInputRef.current?.focus()
        } else {
            mainInputRef.current?.focus()
        }
        setIsSearchActive(prev => !prev)
    }

    const navigate = useNavigate();

    const handleSearch = (event: React.KeyboardEvent) => {
        if(event.key === 'Enter' && searchQuery.trim()) {
            setsearchQuery("")
            setIsSearchActive(false)
            isMenuOpen && setIsMenuOpen(false)
            navigate(`/search/${encodeURIComponent(searchQuery)}`);
        }
    }

    // X do hambuerguer menu
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev)
    }
    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 flex flex-col px-5 md:px-10
        transition-all duration-300 ease-in-out text-white 
        ${isSticky ? `bg-gradient-to-b from-[rgba(40,0,0,0.9)] bg-[rgba(10,0,0,1)] opacity-95 shadow-lg` : 'bg-gradient-to-b from-[rgba(40,0,0,0.7)] to-transparent'}`}>
            <div className="flex items-center justify-between py-4">
                {/* Logo */}
                <div className="flex gap-x-6 md:gap-x-8 items-center">
                    <Link to="/" className="hover:text-gray-300 transition-transform duration-200 hover:scale-110">
                        <img src={logo} alt="Netflix Logo" className="w-28" />
                    </Link>
                    {/* Navigation */}
                    <nav className="hidden text-sm lg:flex space-x-4">
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                        <Link to="/" className="hover:text-gray-300">TV Shows</Link>
                        <Link to="/" className="hover:text-gray-300">Movies</Link>
                        <Link to="/" className="hover:text-gray-300">New & Popular</Link>
                        <Link to="/myList" className="hover:text-gray-300">My List</Link>
                        <Link to="/" className="hover:text-gray-300">Browse By Language</Link>
                    </nav>
                </div>
                {/* Icons and profile */}
                <div className="flex items-center space-x-4">
                    {/*Search Container*/}
                    <div className={`hidden md:flex relative items-center transition-all  duration-300 ${isSearchActive ? 'w-75 p-2' : 'w-auto'}`}>
                        <button className={`flex items-center justify-center p-2 ${isSearchActive ? 'absolute left-0' : ''}`}
                            aria-label="Toggle Search"
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleSearch('main')
                            }}>
                            <div className="transition-transform duration-200 hover:scale-110">
                                {!isSearchActive && <Search size={20} color="white" />}
                            </div>
                        </button>
                        <input
                            ref={mainInputRef}
                            type="text"
                            placeholder="Search"
                            aria-label="Search"
                            className={`absolute left-10 bg-black bg-opacity-75 text-white rounded-md border 
                        border-transparent focus:outline-none transition-all duration-300"
                        ${isSearchActive ? 'w-60 p-2 border-white opacity-100' : 'w-0 p-0 opacity-0'}`}
                            onChange={(e) => { setsearchQuery(e.target.value) }}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <Bell className="transition-transform duration-200 hover:scale-110" size={20} color="white" />
                    <img src={profile} alt="Profile image" className="transition-transform duration-200 hover:scale-110 
                        1-8 h-8 rounded cursor-pointer" />
                    <ChevronRight className="transition-transform duration-200 hover:scale-110" size={20} color="white" />
                    <div className="h-6 transition-transform duration-200 hover:scale-110">
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden ml-4 focues:outline-none"
                            aria-label="HamBurguer-Menu">
                            <Menu size={24} color="white" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}

            <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 p-8 
                flex flex-col gap-4 transition-transform duration-300 z-40 
                ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'} lg:hidden`}>
                <button onClick={closeMenu} className="self-end text-white transition-transform duration-200 hover:scale-110 hover:text-gray-300">
                    <X color="white" size={24} />
                </button>
                <nav className="flex flex-col space-y-2 mt-4">
                    <div className={`relative flex transition-all duration-300 
                    ${isSearchActive ? '' : 'w-auto'}`}>
                        <button className={`flex items-center justify-center ${isSearchActive ? 'absolute left-0' : ''}`}
                            aria-label="Toggle Search"
                            onClick={(e) => {
                                e.stopPropagation
                                toggleSearch("mobile")
                            }}
                        >
                            {!isSearchActive && <Search size={20} color="white" />}
                        </button>
                        <input
                            ref={mobileInputRef}
                            type="text"
                            placeholder="Search"
                            aria-label="Search"
                            className={`bg-black bg-opacity-75 text-white rounded-md border 
                        border-transparent focus:outline-none transition-all duration-300"
                        ${isSearchActive ? 'w-60 p-2 border-white opacity-100' : 'w-0 p-0 opacity-0'}`}
                            onChange={(e) => { setsearchQuery(e.target.value) }}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/" className="hover:text-gray-300">TV Shows</Link>
                    <Link to="/" className="hover:text-gray-300">Movies</Link>
                    <Link to="/" className="hover:text-gray-300">New & Popular</Link>
                    <button onClick={() =>{
                        navigate('/myList')
                        setIsMenuOpen(false)
                    }} className="hover:text-gray-300 text-left">My List</button>
                </nav>
            </div>
        </header>
    )
}

export default Navebar