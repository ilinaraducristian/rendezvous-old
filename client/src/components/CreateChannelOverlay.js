import React, {useState} from "react";

function CreateChannelOverlay({onCreateChannel: createChannel}) {
    const [channelName, setChannelName] = useState('');

    function handleChange(event) {
        setChannelName(event.target.value);
    }

    return (
        <form className="holder">
            <label htmlFor="servername">Channel name:</label>
            <input type="text" name="servername" id="servername" value={channelName} onChange={handleChange}/>
            <button type="button" id="createserver" onClick={() => createChannel(channelName)}>Create Channel</button>
        </form>
    );
}

export default CreateChannelOverlay;
