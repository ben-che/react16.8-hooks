import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
	// set inital state with useState as empty
	const [inputText, handleInputText] = useState('');
	return (
		<div>
			<input
				value={inputText}
				onChange={(e) => handleInputText(e.target.value)}
			/>
			<button>Search</button>
		</div>
	);
};

export default App;
