import React, {useContext} from 'react';
import { View,Button } from 'react-native';
import ServerContext from '../../utils/serverContext';
const TrucoButtonsGroup = ({availableActions}) => {
    const [server] = useContext(ServerContext);
	const socket = server.socket;
	const truco = () => {
		socket.send("truco");
	}

	const retruco = () => {
		socket.send("re_truco");
	}

	const vale_4 = () => {
		socket.send("vale_4");
	}
	if(availableActions.includes("truco") || availableActions.includes("re_truco") || availableActions.includes("vale_4")){
		return (
			<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
				<Button
					title="Truco"
					onPress={() => truco()}
					enable={availableActions.includes("truco")}
					color={ availableActions.includes("truco") ? '' : 'grey' }
				/>
				<Button
					title="Re Truco"
					onPress={() => retruco()}
					enable={availableActions.includes("re_truco")}
					color={ availableActions.includes("re_truco") ? '' : 'grey' }
				/>
				<Button
					title="Vale 4"
					onPress={() => vale_4()}
					enable={availableActions.includes("vale_4")}
					color={ availableActions.includes("vale_4") ? '' : 'grey' }
				/>
			</View>
		)
	}else{
		return <></>;
	}
}

export default TrucoButtonsGroup;