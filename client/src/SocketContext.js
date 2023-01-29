import React, {
  Children,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8000/");

const SocketContext = createContext();

const Context = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callData, setCallData] = useState({});
  const [myId, setMyId] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    getMyStream();

    setMyId(socket.id);
  }, []);

  useEffect(() => {
    socket.on("calluser", ({ signal, callFrom, name }) => {
      setCallData({ signal: signal, from: callFrom, name: name });
    });
  }, [socket]);

  const getMyStream = async () => {
    try {
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      myVideo.current.srcObject = myStream;
      setStream(myStream);
    } catch (error) {
      console.log(error);
    }
  };

  //calling the user from my account
  const callUser = (userid, name) => {
    const myPeer = new Peer({
      initiator: true,
      stream: stream,
      trickle: false,
    });

    myPeer.on("signal", (data) => {
      socket.emit("calluser", {
        signal: data,
        callFrom: myId,
        userToCall: userid,
        name: name,
      });
    });

    myPeer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      myPeer.signal(signal);
    });

    connectionRef.current = myPeer;
  };

  //answer the call by me
  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, stream: stream, trickle: false });
    console.log("calldata", callData);

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, answerTo: callData.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(callData.signal);

    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        callUser,
        answerCall,
        endCall,
        myVideo,
        userVideo,
        callData,
        stream,
        callAccepted,
        callEnded,
        myId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, Context };
