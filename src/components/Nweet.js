import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <NweetDiv>
      {editing ? (
        <>
          <NweetEdit className="container" onSubmit={onSubmit}>
            <input
              className="formInput"
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
              autoFocus
            />
            <input className="formBtn" type="submit" value="Update" />
            <span className="formBtn cancelBtn" onClick={toggleEditing}>
              Cancel
            </span>
          </NweetEdit>
        </>
      ) : (
        <>
          <h4 style={{ fontSize: "14px" }}>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <NweetImg src={nweetObj.attachmentUrl} alt="I'm the pic" />
          )}
          {isOwner && (
            <NweetActions>
              <ActionSpan onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </ActionSpan>
              <ActionSpan onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </ActionSpan>
            </NweetActions>
          )}
        </>
      )}
    </NweetDiv>
  );
};

export default Nweet;

const NweetDiv = styled.div`
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  max-width: 320px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.8);
`;

const NweetImg = styled.img`
  right: -10px;
  top: 20px;
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-top: 10px;
`;

const NweetEdit = styled.form`
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 5px;
`;

const NweetActions = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const ActionSpan = styled.span`
  cursor: pointer;
  &:first-child {
    margin-right: 10px;
  }
`;
