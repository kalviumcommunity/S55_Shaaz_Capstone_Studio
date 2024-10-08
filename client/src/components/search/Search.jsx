import React, { useEffect, useState } from 'react'
import './Search.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import search from '../../assets/search.png'
import user from '../../assets/user.png'

import studio from '../../assets/studio.png'
import search2 from '../../assets/image.png'
import logout from '../../assets/logout.png'

function Search() {

  useEffect(() => {
    document.title = `Search - STUDIO`
  }, [])

  async function getUserInfoForNav(){
    const ID = localStorage.getItem('userID')
    const res = axios.get(`https://studio-backend-alpha.vercel.app/userByID/${ID}`)
    .then(res => {
        navigate(`/user/${res.data.username}`)
    })
    .catch(err => console.log(err))
}

  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState("")

  const [onMovie, setOnMovie] = useState("movie")

  const [movieResults, setMovieResults] = useState()
  const [castResults, setCastResults] = useState()
  const [showResults, setShowResults] = useState()

  const [popularCastResults, setPopularCastResults] = useState()
  const [popularMovieResults, setPopularMovieResults] = useState()
  const [popularShowResults, setPopularShowResults] = useState()

  const [TvShow, setTvShow] = useState()

  const [showPopular, setShowPopular] = useState(true)

  const MOVIE_URL = `https://api.themoviedb.org/3/search/movie?query=${searchInput}&include_adult=false&language=en-US&page=1`
  const CAST_URL = `https://api.themoviedb.org/3/search/person?query=${searchInput}&include_adult=false&language=en-US&page=1`
  const SHOW_URL = `https://api.themoviedb.org/3/search/tv?query=${searchInput}&include_adult=false&language=en-US&page=1`

  const POPULARCAST_URL = `https://api.themoviedb.org/3/person/popular?language=en-US&page=1`
  const POPULARMOVIE_URL = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`
  const POPULARSHOW_URL = `https://api.themoviedb.org/3/trending/tv/day?language=en-US`


  const API_METHOD = (passed_url) => {
    return {
      method: 'GET',
      url: passed_url,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjYxNmNlYTAzZmFiNTU0YWM1NGEyZTdlMWE4YzIwMiIsInN1YiI6IjY1ZjI4Y2MxMmZkZWM2MDE4OTIzM2E4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eccxvzxCctqBTZ8lXeSUHgTBcc5r17hhsNLVy845QA4`
      }
    }
  }

  const axios_request = (URL, location) => {
    axios.request(API_METHOD(URL))
      .then(function (response) {
        location(response.data)
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  useEffect(() => {

    axios_request(MOVIE_URL, setMovieResults)
    axios_request(CAST_URL, setCastResults)
    axios_request(SHOW_URL, setShowResults)

    axios_request(POPULARCAST_URL, setPopularCastResults)
    axios_request(POPULARMOVIE_URL, setPopularMovieResults)
    axios_request(POPULARSHOW_URL, setPopularShowResults)

  }, [searchInput])



  useEffect(() => {
    if (searchInput == "") {
      setShowPopular(true)
    }
    else {
      setShowPopular(false)
    }
  }, [searchInput])

  const handlePress = (event) => {
    setSearchInput(event.target.value)
  }

  const handleClick = () => {
    setSearchInput(event.target.value)
  }

  const filterUsers = () => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const [users, setUsers] = useState([])

  async function getData() {
    const res = await axios.get(`https://studio-backend-alpha.vercel.app/users2`)
      .then(res => setUsers(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='search mons'>
      <div className="bgBlack"></div>
      <nav className='white mons'>
                        <div className="nav55">
                            <img src={studio} alt="" className="logoImg" onClick={() => navigate('/')}/>
                            <div className="navList">
                                <div className="navLIS" onClick={() => navigate('/recs')}>MOVIES</div>
                                <div className="navLIS" onClick={() => navigate('/tvrecs')}>TV SHOWS</div>
                                <div className="navLIS" onClick={() => navigate('/users')}>USERS</div>
                                {localStorage.getItem('userID') && <div className="navLIS" onClick={() => getUserInfoForNav()}>PROFILE</div>}
                                <div className="navLI" onClick={() => navigate('/search')}><img src={search2} alt="" /></div>
                                {localStorage.getItem('userID') && <div className="" onClick={() => {
                                    localStorage.setItem('userID', '')
                                    location.reload()
                                }}><img src={logout} className='logoutImg' /></div>}
                                {!localStorage.getItem('userID') && <div className="loginButtonNav" onClick={() => navigate('/login')}>LOGIN / SIGNUP</div>}
                            </div>
                        </div>
                    </nav>
      <div className="searchArea">
        <div className="searchIcon" onClick={handleClick}>
          <img src={search} />
        </div>

        <input type="text" onChange={(event) => handlePress(event)} />
      </div>

      <div className="movieButtonsArea">
        <button className={onMovie == "movie" ? "selectedMovieButton" : "MovieButton"} onClick={() => setOnMovie("movie")}>MOVIE</button>
        <button className={onMovie == "tvshow" ? "selectedMovieButton" : "MovieButton"} onClick={() => setOnMovie("tvshow")}>TV SHOW</button>
        <button className={onMovie == "cast" ? "selectedMovieButton" : "MovieButton"} onClick={() => setOnMovie("cast")}>CAST & CREW</button>
        <button className={onMovie == "users" ? "selectedMovieButton" : "MovieButton"} onClick={() => setOnMovie("users")}>USERS</button>
      </div>

      {!showPopular && onMovie == "movie" && <div className="result">
        {movieResults && onMovie == "movie" && movieResults.results && movieResults.results.map((el, index) => {
          return <div className="searchResults white" onClick={() => navigate(`/movie/${el.id}`)}>
            <img src={`https://image.tmdb.org/t/p/original/${el.poster_path}`} />
            <div className="searchRow">
              <div className='searchYear'>
                <div className="searchTitle">{el.title}</div><span>({el.release_date.split("-")[0]})</span>
              </div>
              <div className="searchDesc scrollbar">{el.overview}</div>
            </div>
          </div>
        })}
      </div>}
      {showPopular && onMovie == "movie" && <div className="result">
        {popularMovieResults && onMovie == "movie" && popularMovieResults.results && popularMovieResults.results.map((el, index) => {
          return <div className="searchResults white" onClick={() => navigate(`/movie/${el.id}`)}>
            <img src={`https://image.tmdb.org/t/p/original/${el.poster_path}`} />
            <div className="searchRow">
              <div className='searchYear'>
                <div className="searchTitle">{el.title}</div><span>({el.release_date.split("-")[0]})</span>
              </div>
              <div className="searchDesc scrollbar">{el.overview}</div>
            </div>
          </div>
        })}
      </div>}


      {!showPopular && onMovie == "tvshow" && <div className="result">
        {showResults && onMovie == "tvshow" && showResults.results && showResults.results.map((el, index) => {
          return <div className="searchResults white" onClick={() => navigate(`/tvshow/${el.id}`)}>
            <img src={`https://image.tmdb.org/t/p/original/${el.poster_path}`} />
            <div className="searchRow">
              <div className='searchYear'>
                <div className="searchTitle">{el.name}</div>
                {/* <span>({el.release_date.split("-")[0]})</span> */}
              </div>
              <div className="searchDesc scrollbar">{el.overview}</div>
            </div>
          </div>
        })}
      </div>}
      {showPopular && onMovie == "tvshow" && <div className="result">
        {popularShowResults && onMovie == "tvshow" && popularShowResults.results && popularShowResults.results.map((el, index) => {
          return <div className="searchResults white" onClick={() => navigate(`/tvshow/${el.id}`)}>
            <img src={`https://image.tmdb.org/t/p/original/${el.poster_path}`} />
            <div className="searchRow">
              <div className='searchYear'>
                <div className="searchTitle">{el.name}</div>
                {/* <span>({el.release_date.split("-")[0]})</span> */}
              </div>
              <div className="searchDesc scrollbar">{el.overview}</div>
            </div>
          </div>
        })}
      </div>}



      {!showPopular && onMovie == "cast" && <div className="castResult">
        {castResults && onMovie == "cast" && castResults.results && castResults.results.map((el, index) => {
          return <div className="castSearchResults white" onClick={() => navigate(`/person/${el.id}`)}>
            {el.profile_path ? <img src={`https://image.tmdb.org/t/p/original/${el.profile_path}`} />
              : <div className='castNotFound'><img src={user} />
              </div>}
            <div className="searchRow">

              <div className="searchTitleCast">{el.name}</div>
              <div className="castKnownFor"><span>Known for - </span>{el.known_for_department}</div>
            </div>
          </div>
        })}
      </div>}
      {showPopular && onMovie == "cast" && <div className="castResult">
        {popularCastResults && onMovie == "cast" && popularCastResults.results && popularCastResults.results.map((el, index) => {
          return <div className="castSearchResults white" onClick={() => navigate(`/person/${el.id}`)}>
            {el.profile_path ? <img src={`https://image.tmdb.org/t/p/original/${el.profile_path}`} />
              : <div className='castNotFound'><img src={user} />
              </div>}
            <div className="searchRow">

              <div className="searchTitleCast">{el.name}</div>
              <div className="castKnownFor"><span>Known for - </span>{el.known_for_department}</div>
            </div>
          </div>
        })}
      </div>}



      {showPopular && onMovie == "users" && <div className="userResult">
        {users && onMovie == "users" && users.map((el, index) => {
          return <div className="userSearchResults white" onClick={() => navigate(`/user/${el.username}`)}>
            {el.profilePic ? <div className='centerMid'><img src={el.profilePic}  className='showProfilePicImg'/></div>
              : <div className='userNotFound'><img src={user} />
              </div>}
            <div className="searchRow">

              <div className="searchTitleCast">{el.username}</div>
              <div className="userUsername">{el.name}</div>
              {/* <div className="castKnownFor"><span>Known for - </span>{el.known_for_department}</div> */}
            </div>
          </div>
        })}
      </div>}
      {!showPopular && onMovie == "users" && <div className="userResult">
        {users && onMovie == "users" && filterUsers().map((el, index) => {
          return <div className="userSearchResults white" onClick={() => navigate(`/user/${el.username}`)}>
            {el.profilePic ? <img src={el.profilePic} className='showProfilePicImg'/>
              : <div className='userNotFound'><img src={user} />
              </div>}
            <div className="searchRow">

              <div className="searchTitleCast">{el.username}</div>
              <div className="userUsername">{el.name}</div>
            </div>
          </div>
        })}
      </div>}
    </div>
  )
}

export default Search