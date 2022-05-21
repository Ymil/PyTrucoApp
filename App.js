import React from 'react';
import { useState } from 'react';
import GameScreen from './components/game/game';
import HomeScreen from './components/home';
import ServerContext from './utils/serverContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
const App = () => {
	const [server, setServer] = useState({
		adress: "192.168.2.147:9000",
		socket: null
	});

	return (
		<NavigationContainer>
			<ServerContext.Provider value={[server, setServer]}>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Game" component={GameScreen} />
				</Stack.Navigator>
			</ServerContext.Provider>
		</NavigationContainer>
	);
}


export default App;