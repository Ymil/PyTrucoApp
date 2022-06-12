import React, {useContext} from 'react';
import { View, Button } from 'react-native';
import ServerContext from '../../utils/serverContext';

const EnvidoButtonsGroup = ({availableActions}) => {
	const [server] = useContext(ServerContext);
	const socket = server.socket;
	const envido = () => {
		socket.send("envido");
	}

	const real_envido = () => {
		socket.send("real_envido");
	}

	if(availableActions.includes("envido") || availableActions.includes("real_envido")){
		return (
			<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
				<Button
					title="Envido"
					style={{ padding: 25 }}
					onPress={() => envido()}
					enable={availableActions.includes("envido")}
					color={ availableActions.includes("envido") ? '' : 'grey' }
				/>
				<Button
					title="Real Envido"
					style={{ padding: 25 }}
					onPress={() => real_envido()}
					enable={availableActions.includes("real_envido")}
					color={ availableActions.includes("real_envido") ? '' : 'grey' }
				/>
			</View>
		)
	}else{
		return <></>;
	}
}

export default EnvidoButtonsGroup;