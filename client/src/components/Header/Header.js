import { Link } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import './Header.css';
import logo from './logo.svg';
import goldIngot from '../../Images/gold-ingot.svg';

const Header = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [writerDropdown, setWriterDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3030/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    let [exchangeData, setExchangeData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.bigpara.hurriyet.com.tr/doviz/headerlist/anasayfa');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data && data.data) {
                    const exchangeRates = {};
                    data.data.forEach(currency => {
                        exchangeRates[currency.SEMBOL] = {
                            kapanis: currency.KAPANIS,
                            yuzdeDegisim: currency.YUZDEDEGISIM
                        };
                    });
                    setExchangeData(exchangeRates);
                } else {
                    console.error('Fetched data is invalid:', data);
                }
            } catch (error) {
                console.error('Fetch operation failed:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 7200000);
        return () => clearInterval(intervalId);
    }, []);

    function logout() {
        fetch('http://localhost:3030/logout', {
          credentials: 'include',
          method: 'POST',
        }).then(() => {
          setUserInfo(null);
        });
    }

    const getProfilePhoto = () => {
        fetch('http://localhost:3030/profilephoto', {
          credentials: 'include',
        })
          .then(response => response.json())
          .then(data => {
            setProfilePhoto(data);
          })
          .catch(error => console.error('Error fetching profile photo:', error));
    };

    const username = userInfo?.username;
    const tags = userInfo?.tags;
    
    const isAdmin = tags?.includes('admin');
    const isEditorUp = tags?.includes('editor') || tags?.includes('moderator') || isAdmin;
    const isMasterWriterUp = tags?.includes('master-writer') || isEditorUp;
    const isWriter = tags?.includes('writer') || isMasterWriterUp;
    const onlyWriter = tags?.includes('writer');
    const isUser = tags?.includes('user') || isWriter;

    const darkModeToggle = () => {
        if (userInfo === null) {
            setDarkMode(!darkMode);
            return;
        };
        fetch('http://localhost:3030/darkmode', {
            credentials: 'include',
            method: 'PUT',
            }).then(() => {
            setDarkMode(!darkMode);
            });
        console.log(darkMode);
    };

    const GetDarkMode = () => {
        if (userInfo === null) {
            return;
        };
        fetch('http://localhost:3030/darkmode', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setDarkMode(data);
            })
            .catch(error => console.error('Error fetching dark mode:', error));
    };


    window.onscroll = function() {scrollFunction()};
    let lastScrollTop = 0;
    let scrolledUpOnce = false;
    
    function scrollFunction() {
        let st = window.scrollY || document.documentElement.scrollTop;
        if (document.querySelector("header") === null) return;
        const header = document.querySelector(".header");
        
        header.style.transition = "transform 0.3s ease";
        
        if (st < 200) {
            header.style.position = "relative";
            header.style.transform = "translateY(0%)";
            scrolledUpOnce = false;
        }
        else if (st > lastScrollTop){
            header.style.position = "relative";
            header.style.transform = "translateY(-100%)";
            scrolledUpOnce = false;
        } else {
            header.style.position = "fixed";
            header.style.transform = "translateY(0%)";
            header.style.width = "100%";
            scrolledUpOnce = true;
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }

    userInfo && getProfilePhoto();

    if (userInfo) {
        GetDarkMode();
    }
    if (darkMode) {
        document.body.classList.remove('dark-mode-variables');
    }
    else {
        document.body.classList.add('dark-mode-variables');
    }

  return (
    <div className='header'>
        <header>
            <Link to="/" className="logo" ><img alt='logo' className='logo' src={logo}/></Link>
            <nav>
        {username ? (
        <>
            <div className="dropdowns">
            {onlyWriter ? (
              <div className="UDropdown">
                {/* EGER onylWriter TAGINA SAHIPSE */}
                  <Link className='dropbtn' onClick={() => setWriterDropdown(!writerDropdown)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                      <div className="header-username">
                          Yazmaya Başla
                      </div>
                  </Link>
                  {writerDropdown && (
                      <div className="dropdown-content">
                          <Link to="/createPreviev">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              Yeni Blog
                          </Link>
                          <Link to="/*">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              Yeni Test(İznin yok!)
                          </Link>
                      </div>
                  )}
              </div>
            ) : isMasterWriterUp ? (
              <div className="UDropdown">
                {/* EGER isMasterWriterUp TAGINA SAHIPSE */}
                  <Link className='dropbtn' onClick={() => setWriterDropdown(!writerDropdown)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                      <div className="header-username">
                          Yazmaya Başla
                      </div>
                  </Link>
                  {writerDropdown && (
                      <div className="dropdown-content">
                          <Link to="/create">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              Yeni Blog
                          </Link>
                          <Link to="/createTest">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              Yeni Test
                          </Link>
                      </div>
                  )}
              </div>
            ) : (
              null
            )}
                <div className="UDropdown">
                    <Link className='dropbtn' onClick={() => setWriterDropdown(!writerDropdown)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>
                        <div className="header-username">
                            Keşfet
                        </div>
                    </Link>
                    {writerDropdown && (
                        <div className="dropdown-content">
                            <Link to="/*">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                Bloglar
                            </Link>
                            <Link to="/*">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                Testler
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {/* PROILE EDIT BUTONU */}
            <div className="login-button">
            <div className="dropdown">
                <Link className="dropbtn" onClick={() => setShowDropdown(!showDropdown)}>
                {profilePhoto ? (
                    <img className='ProfilePhoto' src={`http://localhost:3030/${profilePhoto}`} alt="Profile" />
                ) : (
                    <>
                        <div className="header-username">
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </>
                )}
                <span>{username}</span>
                </Link>
                {showDropdown && (
                    <div className="dropdown-content2">
                      {isAdmin && (
                        <Link to="/admin" className='AdminButton'>Admin</Link>
                      )}
                      <Link to={`/profile/${username}`}>Profile</Link>
                      <a onClick={logout}>Logout</a>
                    </div>
                )}
            </div>
                <div className="navs">
                    <div className="dark-mode" onClick={darkModeToggle}>
                        <span className={`material-symbols-outlined ${darkMode ? 'active' : ''}`}>
                            light_mode
                        </span>
                        <span className={`material-symbols-outlined ${darkMode ? '' : 'active'}`}>
                            dark_mode
                        </span>
                    </div>
                </div>
            </div>
        </>
        ) : (
        <> 
        {/* EGER GIRIS YAPILMAMISSA  */}
            <div className="dropdowns">
                <div className="UDropdown">
                    <Link className='dropbtn' onClick={() => setWriterDropdown(!writerDropdown)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>
                        <div className="header-username">
                            Keşfet
                        </div>
                    </Link>
                    {writerDropdown && (
                        <div className="dropdown-content">
                            <Link to="/*">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                Bloglar
                            </Link>
                            <Link to="/*">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                Testler
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="login-button">
                <Link to="/login" className='login-text'>Login / Register</Link>
                <div className="navs">
                    <div className="dark-mode" onClick={darkModeToggle}>
                        <span className={`material-symbols-outlined ${darkMode ? 'active' : ''}`}>
                            light_mode
                        </span>
                        <span className={`material-symbols-outlined ${darkMode ? '' : 'active'}`}>
                            dark_mode
                        </span>
                    </div>
                </div>
            </div>
        </>
        )}
            </nav>
        </header>

        <div>
            <nav className="exchange-rate">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    USD/TRY: {exchangeData['USDTRY']?.kapanis}
                    {exchangeData['USDTRY']?.yuzdeDegisim > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="upChange w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="downChange w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>

                    )}
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    EUR/TRY: {exchangeData['EURTRY']?.kapanis}
                    {exchangeData['EURTRY']?.yuzdeDegisim > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="upChange w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                      
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="downChange w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>

                    )}
                </span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 7.629A3 3 0 0 0 9.017 9.43c-.023.212-.002.425.028.636l.506 3.541a4.5 4.5 0 0 1-.43 2.65L9 16.5l1.539-.513a2.25 2.25 0 0 1 1.422 0l.655.218a2.25 2.25 0 0 0 1.718-.122L15 15.75M8.25 12H12m9 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    GBP/TRY: {exchangeData['GBPTRY']?.kapanis}
                    {exchangeData['GBPTRY']?.yuzdeDegisim > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="upChange w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                      
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="downChange w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>

                    )}
                </span>
                <span>
                    <img src={goldIngot} alt="gold" className='gold'/>
                    ALTIN: {exchangeData['GLDGR']?.kapanis}
                    {exchangeData['GLDGR']?.yuzdeDegisim > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="upChange w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                      
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="downChange w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>

                    )}
                </span>
            </nav>
        </div>
    </div>
  )
}


export default Header