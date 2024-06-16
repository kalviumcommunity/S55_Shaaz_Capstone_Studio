import React, { useEffect, useState } from 'react'
import './User.css'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import edit from '../../assets/edit.png'
import axios from 'axios'
import pin from '../../assets/pin.png'

import userTile from '../../assets/userTile.png'
import watchlistTile from '../../assets/watchlistTile.png'
import likedTile from '../../assets/likedTile.png'
import watchedTile from '../../assets/watchedTile.png'
import recommendedTile from '../../assets/recommendedTile.png'
import listTile from '../../assets/listTile.png'
import del from '../../assets/delete.png'
import close from '../../assets/close.png'
import addSimple from '../../assets/addSimple.png'
import minus from '../../assets/minus.png'
import group from '../../assets/group.png'
import user from '../../assets/user.png'


function User() {

    const RENDER_LINK = "https://s55-shaaz-capstone-flickpicks.onrender.com/"

    const IMAGE_PATH = "https://image.tmdb.org/t/p/original"

    const { username } = useParams()
    const navigate = useNavigate()
    const [userData, setUserData] = useState()
    const [genre, setGenre] = useState("profile")
    const [mouseEnter, setMouseEnter] = useState(false)
    const [currUserID, setCurrUserID] = useState(false)

    const [showMovie, setShowMovie] = useState(true)

    const [deletedArea, setDeletedArea] = useState(false)
    const [confirmation, setConfirmation] = useState(true)
    const [password, setPassword] = useState("")

    const ID = localStorage.getItem("userID")

    const getUserData = async () => {
        const res = await axios.get(`https://s55-shaaz-capstone-flickpicks.onrender.com/user/${username}`)
            .then(res => {
                setUserData(res.data)
                if (res.data._id == ID) {
                    setCurrUserID(true)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUserData()
    }, [username])

    const [selectedTile, setSelectedTile] = useState(0);

    const selectTile = (index) => {
        setSelectedTile(index);
    };

    async function checkPassword() {
        if ('CONFIRM' == password) {
            const res = await axios.delete(`https://s55-shaaz-capstone-flickpicks.onrender.com/delete/${userData._id}`)
                .then(res => {
                    if (res.status == 200) {
                        alert("User Deleted Succesfully. Sorry to see you go :(")
                        localStorage.setItem("userID", '')
                        localStorage.setItem("user", false)
                        navigate('/recs')
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            alert('Please Try Again')
        }
    }

    const [showIncoming, setShowIncoming] = useState(false)
    const [showOutgoing, setShowOutgoing] = useState(false)

    const [showFollowers, setShowFollowers] = useState(true)
    const [showFollowButton, setShowFollowButton] = useState(true)

    async function follow(profileData) {
        const res = await axios.put(`http://localhost:3000/addToFollower/${userData._id}`, {
            "name": profileData.name,
            "username": profileData.username,
            "id": profileData._id,
            "profilePic": profileData.profilePic
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    async function following(profileData) {
        const res = await axios.put(`http://localhost:3000/addToFollowing/${profileData._id}`, {
            "name": userData.name,
            "username": userData.username,
            "id": userData._id,
            "profilePic": userData.profilePic
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    async function addToFollower() {
        const ID = localStorage.getItem("userID")
        const res = await axios.get(`https://s55-shaaz-capstone-flickpicks.onrender.com/userByID/${ID}`)
            .then(res => {
                console.log("User who is logged in", res.data)
                follow(res.data)
                following(res.data)
                setShowFollowButton(false)
            })
            .catch(err => console.log(err))
    }

    function doesFollow() {
        const ID = localStorage.getItem("userID")
        if (userData.followers && userData.followers.length > 0) {
            console.log(userData.followers.some(item => item.id == ID))
            return userData.followers.some(item => item.id == ID)
        }
        else {
            return false
        }
    }

    async function removeFollowing(profileData) {
        const res = await axios.put(`http://localhost:3000/removeFollowing/${profileData._id}`, {
            "name": userData.name,
            "username": profileData.username,
            "id": userData._id,
            "profilePic": userData.profilePic
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    async function removeFollower(profileData) {
        const res = await axios.put(`http://localhost:3000/removeFollower/${userData._id}`, {
            "name": profileData.name,
            "username": profileData.username,
            "id": profileData._id,
            "profilePic": profileData.profilePic
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    async function remove() {
        const ID = localStorage.getItem("userID")
        const res = await axios.get(`https://s55-shaaz-capstone-flickpicks.onrender.com/userByID/${ID}`)
            .then(res => {
                console.log("User who is logged in", res.data)
                removeFollower(res.data)
                removeFollowing(res.data)
                setShowFollowButton(true)
            })
            .catch(err => console.log(err))
    }

    const [listGenre, setListGenre] = useState('movies')
    const [showNewList, setShowNewList] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        category: 'movies',
        description : ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
          ...formData,
          [name]: value
        })
      }
    
      async function handleSubmit(){
        if(title == ''){
            alert('Enter a title for your list')
            return 
        }
        const res = await axios.post(`http://localhost:3000/createNewList/${userData._id}`,{
            userDetails : {
                "name" : userData.name,
                "username" : userData.username,
                "profilePic" : userData.profilePic,
                "id" : userData._id
            },
            listDetails : formData
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
      }

    return (
        <>
            {userData && <div className="MainUser">
                <div className="backdrop1">
                    {userData.backdrop && <img src={`https://image.tmdb.org/t/p/original${userData.backdrop.backdrop_path}`} alt="" />}
                    <div className="userGradient1"></div>
                </div>
                <div className="userPage white mons">

                    <div className="userInfo1">
                        <div className="userInfoArea1">
                            <div className="profilePicArea1">
                                <img src={userData.profilePic} />
                            </div>
                            <div className="userName1">
                                {userData.name}
                            </div>
                            <img src={pin} className='pin' />
                        </div>

                        <div className="nameAndBio1">
                            <div className="name1">
                                {userData.username}
                                {localStorage.getItem("userID") == userData._id && <button className="editProfile" onClick={() => navigate(`/editProfile/${username}`)}>
                                    EDIT <img src={edit} />
                                </button>}
                                {localStorage.getItem("userID") == userData._id && <button className="delProfile" onClick={() => setDeletedArea(true)} ><img src={del} /></button>}
                                {localStorage.getItem("userID") && showFollowButton && !doesFollow() && localStorage.getItem("userID") != userData._id && <div className='editProfile' onClick={() => addToFollower()}>FOLLOW</div>}
                                {localStorage.getItem("userID") && (!showFollowButton || doesFollow()) && localStorage.getItem("userID") != userData._id && <div className='delProfile' onClick={() => remove()}>UNFOLLOW</div>}

                            </div>
                            <div className="bio1">
                                {userData.bio}
                            </div>
                        </div>
                    </div>

                    {genre == "profile" && userData.favourites.movies && <div className="favFilmsArea1 white mons">
                        FAVOURITE FILMS

                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />
                        {userData.favourites.movies.length == 0 && <div className='marginCenter'>NO FAVOURITE FILMS</div>}
                        <div className="images1">
                            {userData.favourites.movies.map((el, index) => {
                                return (
                                    <div className="item1" onClick={() => navigate(`/movie/${el.id}`)} key={index}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.poster_path}`} alt="Image 1" />
                                        <div className="overlay1">
                                            {el.title}
                                            <br />
                                            ({el.release_date.split("-")[0]})
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}

                    {genre == "profile" && userData.favourites.tvshow && <div className="favFilmsArea2 white mons">
                        FAVOURITE TV SHOWS

                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        {userData.favourites.tvshow.length == 0 && <div className='marginCenter'>NO FAVOURITE TV SHOWS</div>}
                        <div className="images1">
                            {userData.favourites.tvshow.map((el, index) => {
                                return (
                                    <div className="item1" onClick={() => navigate(`/`)} key={index}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.poster_path}`} alt="Image 1" />
                                        <div className="overlay1">
                                            {el.name}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}

                    {genre == "profile" && userData.favourites.actors && <div className="favFilmsArea2 white mons">
                        FAVOURITE ACTORS

                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        {userData.favourites.actors.length == 0 && <div className='marginCenter'>NO FAVOURITE ACTORS</div>}
                        <div className="images1">
                            {userData.favourites.actors.map((el, index) => {
                                return (
                                    <div className="item1" key={index} onClick={() => navigate(`/person/${el.id}`)}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.profile_path}`} alt="Image 1" />
                                        <div className="overlay1">{el.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}

                    {genre == "profile" && userData.favourites.directors && <div className="favFilmsArea2 white mons">
                        FAVOURITE DIRECTORS

                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        {userData.favourites.directors.length == 0 && <div className='marginCenter'>NO FAVOURITE DIRECTORS</div>}
                        <div className="images1">
                            {userData.favourites.directors.map((el, index) => {
                                return (
                                    <div className="item1" key={index} onClick={() => navigate(`/person/${el.id}`)}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.profile_path}`} alt="Image 1" />
                                        <div className="overlay1">{el.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}



                    {genre == "watchlist" ? <div className='favFilmsArea1'>
                        WATCHLIST
                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        <div className="optionBoxArea">
                            <div className={showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(true)}>MOVIES</div>
                            <div className={!showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(false)}>TV SHOWS</div>
                        </div>

                        {showMovie && <div className="userWatchedTile">
                            {userData.watchlist && userData.watchlist.map((el, index) => {
                                return <div className="container" onClick={() => navigate(`/movie/${el.id}`)}>
                                    <img src={`${IMAGE_PATH}${el.poster_path}`} className='image' />
                                    <div className="overlay">
                                        {el.title}
                                        <br />
                                        ({el.release_date.split("-")[0]})
                                    </div>
                                </div>
                            })}
                        </div>}

                        {!showMovie && <div className="userWatchedTile">
                            {userData.tv.watchlist && userData.tv.watchlist.map((el, index) => {
                                return <div className="container" onClick={() => navigate(`/tvshow/${el.id}`)}>
                                    <img src={`${IMAGE_PATH}${el.poster_path}`} className='image' />
                                    <div className="overlay">
                                        {el.name}
                                    </div>
                                </div>
                            })}
                        </div>}

                        {showMovie && userData.watchlist.length == 0 && <div className='center'>NO FILMS IN WATCHLIST</div>}
                        {!showMovie && userData.tv.watchlist.length == 0 && <div className='center'>NO TV SHOWS IN WATCHLIST</div>}

                    </div> : ""}

                    {genre == "watched" ? <div className='favFilmsArea1'>
                        WATCHED
                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        <div className="optionBoxArea">
                            <div className={showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(true)}>MOVIES</div>
                            <div className={!showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(false)}>TV SHOWS</div>
                        </div>

                        {showMovie && <div className="userWatchedTile">
                            {userData.watched && userData.watched.map((el, index) => {
                                return <div className="container" onClick={() => navigate(`/movie/${el.id}`)}>
                                    <img src={`${IMAGE_PATH}${el.poster_path}`} className='image' />
                                    <div className="overlay">
                                        {el.title}
                                        <br />
                                        ({el.release_date.split("-")[0]})
                                    </div>
                                </div>
                            })}
                        </div>}

                        {!showMovie && <div className="userWatchedTile">
                            {userData.tv.watched && userData.tv.watched.map((el, index) => {
                                return <div className="container" onClick={() => navigate(`/tvshow/${el.id}`)}>
                                    <img src={`${IMAGE_PATH}${el.poster_path}`} className='image' />
                                    <div className="overlay">
                                        {el.name}
                                    </div>
                                </div>
                            })}
                        </div>}

                        {userData.watched.length == 0 && <div className='center'>NO FILMS WATCHED</div>}
                        {!showMovie && userData.tv.watched.length == 0 && <div className='center'>NO TV SHOWS WATCHED</div>}

                    </div> : ""}

                    {genre == "liked" ? <div className='favFilmsArea1'>
                        LIKED
                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        <div className="optionBoxArea">
                            <div className={showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(true)}>MOVIES</div>
                            <div className={!showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(false)}>TV SHOWS</div>
                        </div>

                        {showMovie && <div className="userWatchedTile">
                            {userData.liked && userData.liked.map((el, index) => {
                                return <div className="container" onClick={() => navigate(`/movie/${el.id}`)}>
                                    <img src={`${IMAGE_PATH}${el.poster_path}`} className='image' />
                                    <div className="overlay">
                                        {el.title}
                                        <br />
                                        ({el.release_date.split("-")[0]})
                                    </div>
                                </div>
                            })}
                        </div>}

                        {!showMovie && <div className="userWatchedTile">
                            {userData.tv.liked && userData.tv.liked.map((el, index) => {
                                return <div className="container" onClick={() => navigate(`/tvshow/${el.id}`)}>
                                    <img src={`${IMAGE_PATH}${el.poster_path}`} className='image' />
                                    <div className="overlay">
                                        {el.name}
                                    </div>
                                </div>
                            })}
                        </div>}

                        {userData.liked.length == 0 && <div className='center'>NO LIKED FILMS</div>}
                        {!showMovie && userData.tv.liked.length == 0 && <div className='center'>NO LIKED TV SHOWS</div>}


                    </div> : ""}

                    {genre == "list" ? <div className='favFilmsArea1'>
                        LISTS
                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        <div className="optionBoxArea">
                            <div className={listGenre == 'movies' ? "optionBoxSelected" : "optionBox"} onClick={() => setListGenre('movies')}>MOVIES</div>
                            <div className={listGenre == 'tvshows' ? "optionBoxSelected" : "optionBox"} onClick={() => setListGenre('tvshows')}>TV SHOWS</div>
                            <div className={listGenre == 'cast' ? "optionBoxSelected" : "optionBox"} onClick={() => setListGenre('cast')}>CAST & CREW</div>
                        </div>

                        <div className="displayListArea">
                            <div className="createNewList" onClick={() => setShowNewList(true)}>
                                Create a new List
                            </div>
                        </div>

                    </div> : ""}

                    {genre == "recommended" ? <div className='favFilmsArea1'>
                        RECOMMENDED
                        {console.log(userData)}
                        <div style={{ height: '1px', backgroundColor: 'white', width: '100%', marginTop: "5px" }} />

                        <div className="optionBoxArea">
                            <div className={showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(true)}>MOVIES</div>
                            <div className={!showMovie ? "optionBoxSelected" : "optionBox"} onClick={() => setShowMovie(false)}>TV SHOWS</div>
                        </div>

                        {showMovie && <div className="incomingBlock">
                            {!showIncoming && <div className='flex-end-incoming' onClick={() => setShowIncoming(!showIncoming)}>
                                <span className='incomingBlockTitle'>INCOMING (<span style={{ margin: '4px' }}>{userData.recs.incoming.length}</span>)</span>
                                <img src={addSimple} className='addButton' />
                            </div>}

                            {showIncoming && <div className='flex-end-incoming-2' onClick={() => setShowIncoming(!showIncoming)}>
                                <span className='incomingBlockTitle'>INCOMING (<span style={{ margin: '4px' }}>{userData.recs.incoming.length}</span>)</span>
                                <img src={minus} className='minus' />
                            </div>}

                            {showIncoming && userData.recs && userData.recs.incoming && userData.recs.incoming.length > 0 && <div className="incomingTileArea">
                                {showIncoming && userData.recs.incoming && userData.recs.incoming.reverse().map((el, index) => {
                                    return <div className="incomingTile" key={index}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.data.poster_path}`} className='incomingPoster' onClick={() => navigate(`/movie/${el.data.id}`)} />
                                        <div className="incomingDesc" >
                                            <div className="incomingMovieTitle" onClick={() => navigate(`/movie/${el.data.id}`)}>{el.data.title && el.data.title} ({el.data.release_date && el.data.release_date.split("-")[0]})</div>
                                            <div className="incomingFrom" onClick={() => {
                                                setGenre('profile')
                                                navigate(`/user/${el.from.username}`)
                                            }}>
                                                <span className='incomingGray'>From :</span>
                                                {el.from.profilePic && <img src={el.from.profilePic} />}
                                                {el.from.name && <span className='hoverWhite'>{el.from.name}</span>}
                                            </div>
                                            {el.message && <div className="incomingMessage">
                                                Message : <span className='hoverWhite2'>{el.message}</span>
                                            </div>}
                                        </div>
                                    </div>
                                })}
                            </div>}

                            {showIncoming && userData.recs.incoming.length == 0 && <div className='incomingCenter'>No Incoming Recommendations</div>}



                        </div>}

                        {showMovie && <div className="incomingBlock">
                            {!showOutgoing && <div className='flex-end-incoming' onClick={() => setShowOutgoing(!showOutgoing)}>
                                <span className='incomingBlockTitle'>OUTGOING (<span style={{ margin: '4px' }}>{userData.recs.outgoing.length}</span>)</span>
                                <img src={addSimple} className='addButton' />
                            </div>}

                            {showOutgoing && <div className='flex-end-incoming-2' onClick={() => setShowOutgoing(!showOutgoing)}>
                                <span className='incomingBlockTitle'>OUTGOING (<span style={{ margin: '4px' }}>{userData.recs.outgoing.length}</span>)</span>
                                <img src={minus} className='minus' />
                            </div>}

                            {showOutgoing && <div className="incomingTileArea">
                                {showOutgoing && userData.recs.outgoing && userData.recs.outgoing.reverse().map((el, index) => {
                                    return <div className="incomingTile" key={index}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.data.poster_path}`} className='incomingPoster' onClick={() => navigate(`/movie/${el.data.id}`)} />
                                        <div className="incomingDesc">
                                            <div className="incomingMovieTitle" onClick={() => navigate(`/movie/${el.data.id}`)}>{el.data.title && el.data.title} ({el.data.release_date && el.data.release_date.split("-")[0]})</div>
                                            {el.to.name != "Everyone" ? <div className="incomingFrom" onClick={() => {
                                                setGenre('profile')
                                                navigate(`/user/${el.to.username}`)
                                            }}>
                                                <span className='incomingGray'>To :</span>
                                                {el.to.profilePic && <img src={el.to.profilePic} />}
                                                {el.to.name != "Everyone" && <span className='hoverWhite'>{el.to.name}</span>}
                                            </div> :
                                                <div className="incomingFrom">
                                                    <span className='incomingGray'>To :</span>
                                                    <span style={{ marginLeft: '6px' }}>Everyone</span>
                                                </div>}
                                            {el.message && <div className="incomingMessage">
                                                Message : <span className='hoverWhite2'>{el.message}</span>
                                            </div>}
                                        </div>
                                    </div>
                                })}
                            </div>}

                            {showOutgoing && userData.recs.outgoing.length == 0 && <div className='incomingCenter'>No Outgoing Recommendations</div>}



                        </div>}

                        {!showMovie && <div className="incomingBlock">
                            {!showIncoming && <div className='flex-end-incoming' onClick={() => setShowIncoming(!showIncoming)}>
                                <span className='incomingBlockTitle'>INCOMING (<span style={{ margin: '4px' }}>{userData.tvrecs.incoming.length}</span>)</span>
                                <img src={addSimple} className='addButton' />
                            </div>}

                            {showIncoming && <div className='flex-end-incoming-2' onClick={() => setShowIncoming(!showIncoming)}>
                                <span className='incomingBlockTitle'>INCOMING (<span style={{ margin: '4px' }}>{userData.tvrecs.incoming.length}</span>)</span>
                                <img src={minus} className='minus' />
                            </div>}

                            {showIncoming && userData.tvrecs && userData.tvrecs.incoming && userData.tvrecs.incoming.length > 0 && <div className="incomingTileArea">
                                {showIncoming && userData.tvrecs.incoming && userData.tvrecs.incoming.reverse().map((el, index) => {
                                    return <div className="incomingTile" key={index}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.data.poster_path}`} className='incomingPoster' onClick={() => navigate(`/tvshow/${el.data.id}`)} />
                                        <div className="incomingDesc" >
                                            <div className="incomingMovieTitle" onClick={() => navigate(`/tvshow/${el.data.id}`)}>{el.data.name && el.data.name}</div>
                                            <div className="incomingFrom" onClick={() => {
                                                setGenre('profile')
                                                navigate(`/user/${el.from.username}`)
                                            }}>
                                                <span className='incomingGray'>From :</span>
                                                {el.from.profilePic && <img src={el.from.profilePic} />}
                                                {el.from.name && <span className='hoverWhite'>{el.from.name}</span>}
                                            </div>
                                            {el.message && <div className="incomingMessage">
                                                Message : <span className='hoverWhite2'>{el.message}</span>
                                            </div>}
                                        </div>
                                    </div>
                                })}
                            </div>}

                            {showIncoming && userData.tvrecs.incoming.length == 0 && <div className='incomingCenter'>No Incoming Recommendations</div>}



                        </div>}

                        {!showMovie && <div className="incomingBlock">
                            {!showOutgoing && <div className='flex-end-incoming' onClick={() => setShowOutgoing(!showOutgoing)}>
                                <span className='incomingBlockTitle'>OUTGOING (<span style={{ margin: '4px' }}>{userData.tvrecs.outgoing.length}</span>)</span>
                                <img src={addSimple} className='addButton' />
                            </div>}

                            {showOutgoing && <div className='flex-end-incoming-2' onClick={() => setShowOutgoing(!showOutgoing)}>
                                <span className='incomingBlockTitle'>OUTGOING (<span style={{ margin: '4px' }}>{userData.tvrecs.outgoing.length}</span>)</span>
                                <img src={minus} className='minus' />
                            </div>}

                            {showOutgoing && <div className="incomingTileArea">
                                {showOutgoing && userData.tvrecs.outgoing && userData.tvrecs.outgoing.reverse().map((el, index) => {
                                    return <div className="incomingTile" key={index}>
                                        <img src={`https://image.tmdb.org/t/p/original${el.data.poster_path}`} className='incomingPoster' onClick={() => navigate(`/tvshow/${el.data.id}`)} />
                                        <div className="incomingDesc" >
                                            <div className="incomingMovieTitle" onClick={() => navigate(`/tvshow/${el.data.id}`)}>{el.data.name && el.data.name}</div>
                                            {el.to.name != "Everyone" ? <div className="incomingFrom" onClick={() => {
                                                setGenre('profile')
                                                navigate(`/user/${el.to.username}`)
                                            }}>
                                                <span className='incomingGray'>To :</span>
                                                {el.to.profilePic && <img src={el.to.profilePic} />}
                                                {el.to.name != "Everyone" && <span className='hoverWhite'>{el.to.name}</span>}
                                            </div> :
                                                <div className="incomingFrom">
                                                    <span className='incomingGray'>To :</span>
                                                    <span style={{ marginLeft: '6px' }}>Everyone</span>
                                                </div>}
                                            {el.message && <div className="incomingMessage">
                                                Message : <span className='hoverWhite2'>{el.message}</span>
                                            </div>}
                                        </div>
                                    </div>
                                })}
                            </div>}

                            {showOutgoing && userData.recs.outgoing.length == 0 && <div className='incomingCenter'>No Outgoing Recommendations</div>}



                        </div>}

                    </div> : ""}

                    {genre == "people" ? <div className="peopleArea">
                        <div className="selectPeople">
                            <div className={showFollowers ? 'peopleBlocksSelected' : 'peopleBlocks'} onClick={() => setShowFollowers(!showFollowers)}>
                                FOLLOWERS
                            </div>
                            <div className={!showFollowers ? 'peopleBlocksSelected' : 'peopleBlocks'} onClick={() => setShowFollowers(!showFollowers)}>
                                FOLLOWING
                            </div>
                        </div>

                        {showFollowers && <div className="userFollowing">
                            {userData && userData.followers && userData.followers.map((el, index) => {
                                return <div className="userSearchResults2 white" onClick={() => navigate(`/user/${el.username}`)}>
                                    {el.profilePic ? <div className='centerMid'><img src={el.profilePic} className='followProfileImg' /></div>
                                        : <div className='noUser'><img src={user} className='followImg' />
                                        </div>}
                                    <div className="searchRow">

                                        <div className="searchTitleCast">{el.username}</div>
                                        <div className="userUsername">{el.name}</div>
                                        {/* <div className="castKnownFor"><span>Known for - </span>{el.known_for_department}</div> */}
                                    </div>
                                </div>
                            })}
                        </div>}

                        {showFollowers && userData && userData.followers && userData.followers.length == 0 && <div className='centerFollowers'>SORRY NO ONE FOLLOWS YOU</div>}
                        {!showFollowers && userData && userData.following && userData.following.length == 0 && <div className='centerFollowers'>YOU DO NOT FOLLOW ANYONE</div>}


                        {!showFollowers && <div className="userFollowing">
                            {userData && userData.following && userData.following.map((el, index) => {
                                return <div className="userSearchResults2 white" onClick={() => navigate(`/user/${el.username}`)}>
                                    {el.profilePic ? <div className='centerMid'><img src={el.profilePic} className='followProfileImg' /></div>
                                        : <div className='noUser'><img src={user} className='followImg' />
                                        </div>}
                                    <div className="searchRow">

                                        <div className="searchTitleCast">{el.username}</div>
                                        <div className="userUsername">{el.name}</div>
                                        {/* <div className="castKnownFor"><span>Known for - </span>{el.known_for_department}</div> */}
                                    </div>
                                </div>
                            })}
                        </div>}
                    </div> : <div></div>}

                </div>

                <div className={mouseEnter ? "genreBigArea1 hoverBlackBG1" : "genreBigArea1"} onMouseEnter={() => setMouseEnter(true)} onMouseLeave={() => setMouseEnter(false)}>

                    <div className="genreLogos1 white mons">
                        <div className={genre == "profile" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("profile")} >
                            <img src={userTile} />
                            <span>
                                PROFILE
                            </span>
                        </div>
                        <div className={genre == "watchlist" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("watchlist")} >
                            <img src={watchlistTile} />
                            <span>
                                WATCHLIST
                            </span>
                        </div>
                        <div className={genre == "watched" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("watched")} >
                            <img src={watchedTile} />
                            <span>
                                WATCHED
                            </span>
                        </div>
                        <div className={genre == "liked" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("liked")} >
                            <img src={likedTile} />
                            <span>
                                LIKED
                            </span>
                        </div>
                        <div className={genre == "list" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("list")} >
                            <img src={listTile} />
                            <span>
                                LISTS
                            </span>
                        </div>
                        <div className={genre == "recommended" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("recommended")} >
                            <img src={recommendedTile} />
                            <span>
                                RECOMMENDED
                            </span>
                        </div>
                        <div className={genre == "people" ? "genreBlocks1 activeGenre1" : "genreBlocks1"} onClick={() => setGenre("people")} >
                            <img src={group} />
                            <span>
                                PEOPLE
                            </span>
                        </div>
                    </div>

                </div>


            </div>}

            {deletedArea && <div className="deletedArea">
                {confirmation && <div className="addFilmToFav4 white mons">
                    <h4>DELETE ACCOUNT</h4>

                    You are about to miss a whole  world of experience!
                    <br />
                    {/* <br/> */}
                    Are you sure you want to delete your account?
                    <br />
                    {/* <br/> */}

                    <div className="publicButtons">
                        <div className="publicButton pbNo" onClick={() => setDeletedArea(false)}>NO</div>
                        <div className="publicButton pbYes" onClick={() => setConfirmation(false)}>YES</div>
                    </div>
                    <img src={close} alt="" className="AddFavClose" onClick={() => setDeletedArea(false)} />

                </div>}
                {!confirmation && <div className="addFilmToFav4 white mons">
                    <h4>DELETE ACCOUNT</h4>

                    <div className='deleteInputArea'>
                        <label htmlFor="password">Type CONFIRM</label>
                        <input type="text" name='password' placeholder='Please type CONFIRM' onChange={() => setPassword(event.target.value)} />
                    </div>

                    <div className="publicButtons">
                        <div className="publicButton pbNo" onClick={() => checkPassword()}>DELETE</div>
                    </div>
                    <img src={close} alt="" className="AddFavClose" onClick={() => setDeletedArea(false)} />

                </div>}
            </div>}

            {showNewList && <div className="deletedArea">
                {showNewList && <div className="newListDialogBox white mons">

                    <div>
                        <h4>Create a new List</h4>
                        <div className='centerIt'>

                        <div className='listInput'>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder='Enter a Title'
                            />
                        </div>
                        <div className='listInput'>
                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                >
                                <option value="movies">Movies</option>
                                <option value="tvshows">TV Shows</option>
                                <option value="cast">Cast</option>
                            </select>
                        </div>
                        <div className='listInput topIt'>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder='Enter a Description'
                                >
                            </textarea>
                        </div>
                                </div>
                        <button className='publicButton pbYes' onClick={() => handleSubmit()}>CREATE</button>
                    </div>
                    <img src={close} alt="" className="AddFavClose" onClick={() => setShowNewList(false)} />

                </div>}
            </div>}
        </>
    )
}

export default User