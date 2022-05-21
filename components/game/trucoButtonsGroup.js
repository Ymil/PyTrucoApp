import React, {useContext} from 'react';
import { View,Button } from 'react-native';
import ServerContext from '../../utils/serverContext';
const TrucoButtonsGroup = ({enable}) => {
    const [server] = useContext(ServerContext);
	const socket = server.socket;
	const truco = () => {
		socket.send("truco,0");
	}

	const retruco = () => {
		socket.send("retruco,0");
	}

	const vale_4 = () => {
		socket.send("vale_4,0");
	}
	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			<Button
				title="Truco"
				onPress={() => truco()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="Re Truco"
				onPress={() => retruco()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="Vale 4"
				onPress={() => vale_4()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
		</View>
	)
}

export default TrucoButtonsGroup;