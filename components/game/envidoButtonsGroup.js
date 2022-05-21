import React, {useContext} from 'react';
import { View, Button } from 'react-native';
import ServerContext from '../../utils/serverContext';

const EnvidoButtonsGroup = ({enable}) => {
	const [server] = useContext(ServerContext);
	const socket = server.socket;
	const envido = () => {
		socket.send("envido,0");
	}

	const real_envido = () => {
		socket.send("real_envido,0");
	}

	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			<Button
				title="Envido"
				style={{ padding: 25 }}
				onPress={() => envido()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="Real Envido"
				style={{ padding: 25 }}
				onPress={() => real_envido()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
		</View>
	)
}

export default EnvidoButtonsGroup;