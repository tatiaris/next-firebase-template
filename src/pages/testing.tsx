import React, { useContext } from 'react';
import { useState } from 'react';
import { getAllFromDatabase, addOneToDatabase, updateOneInDatabase, deleteOneFromDatabase, getOneFromDatabase } from '@components/helper';
import { deleteFile, uploadFile } from '@util/firebase';
import { LoggerContext } from '@util/logger';

const Testing = (): React.ReactNode => {
  const logger = useContext(LoggerContext);
  const [getObjectId, setGetObjectId] = useState('');
  const [testingName, setTestingName] = useState('');
  const [testingMotto, setTestingMotto] = useState('');

  const [updatedTestingObjId, setUpdatedTestingObjId] = useState('');
  const [updatedTestingName, setUpdatedTestingName] = useState('');
  const [updatedTestingMotto, setUpdatedTestingMotto] = useState('');

  const [deleteTestingObjId, setDeleteTestingObjId] = useState('');

  const [file, setFile] = useState(null);
  const [fileValid, setFileValid] = useState(false);

  const [fileStoragePath, setFileStoragePath] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileValid(true);
    logger.log('file', file);
  };

  const handleFileUpload = async () => {
    const fileDownloadURL = await uploadFile(file, 'images/testing-image-upload');
    logger.log('fileDownloadURL', fileDownloadURL);
  };

  const handleFileDelete = async () => {
    const data = await deleteFile(fileStoragePath);
    logger.log('fileDeleted', data);
  };

  const getOneTestingObj = async () => {
    const data = await getOneFromDatabase('testing', getObjectId);
    logger.log(`getOneTestingObj ${getObjectId}`, data);
  };

  const getAllTestingObjs = async () => {
    const data = await getAllFromDatabase('testing');
    logger.log('getAllTestingObjs', data);
  };

  const addTestingObj = async () => {
    const testingObj = {
      name: testingName,
      motto: testingMotto
    };
    const res = await addOneToDatabase('testing', testingObj);
    logger.log('addTestingObj', res);
  };

  const updateTestingObj = async () => {
    const updatedKeysAndVals = {
      name: updatedTestingName,
      motto: updatedTestingMotto
    };
    const res = await updateOneInDatabase('testing', updatedTestingObjId, updatedKeysAndVals);
    logger.log('updateTestingObj', res);
  };

  const deleteTestingObj = async () => {
    const data = await deleteOneFromDatabase('testing', deleteTestingObjId);
    logger.log('deleteTestingObj', data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 10, paddingBottom: 25, display: 'flex', gap: 20, flexWrap: 'wrap', borderBottom: '1px solid #ccc' }}>
        <div>
          <h2>Get</h2>
          <input placeholder="(testing) object id" onChange={(e) => setGetObjectId(e.target.value)} />
          <br />
          <button onClick={getOneTestingObj}>Get</button>
          <br />
          <button onClick={getAllTestingObjs}>Get All</button>
        </div>
        <div>
          <h2>Post</h2>
          <input placeholder="(testing) Name" onChange={(e) => setTestingName(e.target.value)} />
          <br />
          <input placeholder="(testing) motto" onChange={(e) => setTestingMotto(e.target.value)} />
          <br />
          <button onClick={addTestingObj}>Insert</button>
        </div>
        <div>
          <h2>Put</h2>
          <input placeholder="(testing) object id" onChange={(e) => setUpdatedTestingObjId(e.target.value)} />
          <br />
          <input placeholder="(testing) updated name" onChange={(e) => setUpdatedTestingName(e.target.value)} />
          <br />
          <input placeholder="(testing) updated motto" onChange={(e) => setUpdatedTestingMotto(e.target.value)} />
          <br />
          <button onClick={updateTestingObj}>Update</button>
        </div>
        <div>
          <h2>Delete</h2>
          <input placeholder="(testing) object id" onChange={(e) => setDeleteTestingObjId(e.target.value)} />
          <br />
          <button onClick={deleteTestingObj}>Delete</button>
        </div>
      </div>
      <div style={{ padding: 10, paddingBottom: 25, display: 'flex', gap: 20, flexWrap: 'wrap', borderBottom: '1px solid #ccc' }}>
        <div>
          <h2>Upload File</h2>
          <input multiple type="file" name="file input" id="file-input" onChange={handleFileSelect} />
          <br />
          <button disabled={!fileValid || !file} onClick={handleFileUpload}>
            Submit Image
          </button>
        </div>
        <div>
          <h2>Delete File</h2>
          <input placeholder="(testing) file storage path" onChange={(e) => setFileStoragePath(e.target.value)} />
          <br />
          <button onClick={handleFileDelete}>Delete File</button>
        </div>
      </div>
    </div>
  );
};

export default Testing;
