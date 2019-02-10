import React, { useState, useEffect } from 'react';
import './App.css';

// free api key for movie database
const apiKey = '39228113';
const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=`;

const App = () => {
	// set inital state with useState as empty
	const [inputText, handleInputText] = useState('Avengers');
	const [movies, addMovies] = useState([]);

	// simple function to make a get request for movie data
	const fetchMovies = async () => {
		// set initial movie data array
		let totalPages;
		let fetches = [];
		let data = [];

		useEffect(
			() => {
				fetch(baseUrl + inputText)
					// find total pages - each page has 10 results
					.then((res) => {
						return res.json();
					})
					.then((jsonRes) => {
						totalPages = Math.ceil(Number(jsonRes.totalResults) / 10);
						for (let i = 1; i <= totalPages; i++) {
							fetches.push(
								fetch(baseUrl + inputText + '&page=' + i)
									.then((page) => {
										return page.json();
									})
									.then((jsonPage) => {
										data.push(...jsonPage.Search);
									})
							);
						}
					})
					.then(() => {
						Promise.all(fetches).then(() => {
							addMovies(data);
						});
					})
					// update once more to ensure we don't continually keep making requests
					.then(triggerGetData(false))
					.catch((e) => console.log(e));
			},
			// useEffect also takes an array of data, in addition to a function - this
			//    is known as "dependencies" and useEffect will only be called if something
			//    from this list changes
			// only trigger useEffect if getData changes
			[getData]
		);
		return movies;
	};

	// useEffect is componentDidMount, componentWillUnmount AND
	//  componentDidUpdate in 1; traditionally, if we wanted to make a get request
	//  to get initial data, it wouldnt be hard - we can just put it in
	//  a componentDidMount:

	// componentDidMount = () => {
	//   fetchMovies()
	// }

	// However, if we do the same for useEffect, we'll make a network request
	//  EVERYTIME the component updates - meaning we make a get request for every
	//  character we type into the textbox
	// to account for this, we have to alter the traditional pattern of
	//  onClick function on button -> network request -> setState data
	// Instead, the onClick function on the button can trigger a state change
	//  that tells us to make a request, and when the request is compete, we change
	//  state back:

	// the initial state on component mount will be true - allowing us
	//  the first set of get requests:
	const [getData, triggerGetData] = useState(true);
	fetchMovies();
	// rendering movies
	const renderMovieInfo = () => {
		if (movies.length > 1) {
			return movies.map((movie, i) => {
				return (
					<div key={i + movie.Year + movie.Name}>
						<p>Title: {movie.Title}</p>
						<p>Year: {movie.Year}</p>
					</div>
				);
			});
		}
	};

	return (
		<div>
			<input
				value={inputText}
				onChange={(e) => handleInputText(e.target.value)}
			/>
			<button onClick={() => triggerGetData(true)}>Search</button>
			{renderMovieInfo()}
		</div>
	);
};

export default App;
