import React, { useContext, useEffect, useState } from "react";
import styles from "./style.module.css";
import { SocketContext } from "../../src/SocketContext";

const Chatroom = () => {
  const [userId, setUserId] = useState("");
  const {
    myVideo,
    userVideo,
    callData,
    callUser,
    myId,
    answerCall,
    callAccepted,
    endCall,
    callEnded,
  } = useContext(SocketContext);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.subContainer}>
          <div className={styles.clientContainer}>
            <div className={styles.videoContainer}>
              <video
                ref={myVideo}
                className={styles.video}
                autoPlay
                playsInline
                muted
              />
            </div>
            <label className={styles.label}>Joy ID - {myId}</label>
            <div style={{ display: callAccepted ? "none" : "block" }}>
              <input
                type="text"
                name="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={styles.input}
                placeholder="Enter User ID"
              />
              <div className={styles.buttonContainer}>
                <button
                  onClick={() => callUser(userId, "JD")}
                  className={styles.button}
                >
                  Call User
                </button>
                <button
                  onClick={() => answerCall()}
                  className={styles.button}
                  style={{ display: callData.name ? "block" : "none" }}
                >
                  Accept Call
                </button>
              </div>
            </div>
            <div className={styles.endCallContainer}>
              <button
                onClick={() => endCall()}
                className={styles.endButton}
                style={{
                  display: callAccepted ? "block" : "none",
                }}
              >
                End Call
              </button>
            </div>
          </div>
          <div className={styles.remoteContainer}>
            <div className={styles.videoContainer}>
              <video
                ref={userVideo}
                className={styles.video}
                autoPlay
                playsInline
              />
            </div>
            <label className={styles.label}>{callData.name}</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatroom;
