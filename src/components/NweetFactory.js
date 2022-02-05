import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <FactoryForm>
      <FactoryInputContainer>
        <FactoryInputInput
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <FactoryInputArrow type="submit" onClick={onSubmit} value="&rarr;" />
      </FactoryInputContainer>
      <FactoryInputLabel htmlFor="attach-file">
        <span>Add Photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </FactoryInputLabel>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <FactoryFormAttachment>
          <img
            src={attachment}
            alt="attachment"
            style={{ backgroundImage: attachment }}
          />
          <FactoryFormClear onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </FactoryFormClear>
        </FactoryFormAttachment>
      )}
    </FactoryForm>
  );
};

export default NweetFactory;

const FactoryForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FactoryInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const FactoryInputInput = styled.input`
  flex-grow: 1;
  height: 40px;
  padding: 0px 20px;
  color: white;
  border: 1px solid #04aaff;
  border-radius: 20px;
  font-weight: 500;
  font-size: 12px;
`;

const FactoryInputArrow = styled.input`
  position: absolute;
  right: 0;
  background-color: #04aaff;
  height: 40px;
  width: 40px;
  padding: 10px 0px;
  text-align: center;
  border-radius: 20px;
  color: white;
`;

const FactoryInputLabel = styled.label`
  color: #04aaff;
  cursor: pointer;
  &span {
    margin-right: 10px;
    font-size: 12px;
  }
`;

const FactoryFormAttachment = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  &img {
    height: 80px;
    width: 80px;
    border-radius: 40px;
  }
`;

const FactoryFormClear = styled.div`
  color: #04aaff;
  cursor: pointer;
  text-align: center;
  $span {
    margin-right: 10px;
    font-size: 12px;
  }
`;
