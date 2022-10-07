import React from 'react';
import { useState } from 'react';
import { getAllFromDatabase, addOneToDatabase, updateOneInDatabase, deleteOneFromDatabase, getOneFromDatabase } from '@/components/helper';
import { Container, Tabs, TextInput, Button, Group, Text, PasswordInput, useMantineTheme } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { uploadFile } from '@/util/firebase';

const Testing = (): React.ReactNode => {
  const theme = useMantineTheme();

  const [getObjectId, setGetObjectId] = useState('');
  const [testingName, setTestingName] = useState('');
  const [testingMotto, setTestingMotto] = useState('');

  const [updatedTestingObjId, setUpdatedTestingObjId] = useState('');
  const [updatedTestingName, setUpdatedTestingName] = useState('');
  const [updatedTestingMotto, setUpdatedTestingMotto] = useState('');

  const [deleteTestingObjId, setDeleteTestingObjId] = useState('');

  const [file, setFile] = useState(null);
  const [fileValid, setFileValid] = useState(false);

  const dropFile = (file) => {
    setFile(file);
    setFileValid(true);
  };

  const submitFile = async () => {
    const fileDownloadURL = await uploadFile(file, 'images/testing-image-upload');
    console.log('fileDownloadURL', fileDownloadURL);
  }

  const getOneTestingObj = async () => {
    const data = await getOneFromDatabase('testing', getObjectId);
    console.log(`getOneTestingObj ${getObjectId}`, data);
  };

  const getAllTestingObjs = async () => {
    const data = await getAllFromDatabase('testing');
    console.log('getAllTestingObjs', data);
  };

  const addTestingObj = async () => {
    const testingObj = {
      name: testingName,
      motto: testingMotto
    };
    const res = await addOneToDatabase('testing', testingObj);
    console.log('addTestingObj', res);
  };

  const updateTestingObj = async () => {
    const updatedKeysAndVals = {
      name: updatedTestingName,
      motto: updatedTestingMotto
    };
    const res = await updateOneInDatabase('testing', updatedTestingObjId, updatedKeysAndVals);
    console.log('updateTestingObj', res);
  };

  const deleteTestingObj = async () => {
    const data = await deleteOneFromDatabase('testing', deleteTestingObjId);
    console.log('deleteTestingObj', data);
  };

  return (
    <div>
      {/* <div style={{ padding: '50px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}> */}
      <Container style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div>
          <h1>Get</h1>
          <TextInput label="(testing) object id" onChange={(e) => setGetObjectId(e.target.value)} />
          <br />
          <Button onClick={getOneTestingObj}>Get</Button>
          <br />
          <br />
          <Button onClick={getAllTestingObjs}>Get All</Button>
        </div>
        <div>
          <h1>Post</h1>
          <TextInput label="(testing) Name" onChange={(e) => setTestingName(e.target.value)} />
          <br />
          <TextInput label="(testing) motto" onChange={(e) => setTestingMotto(e.target.value)} />
          <br />
          <Button onClick={addTestingObj}>Insert</Button>
        </div>
        <div>
          <h1>Put</h1>
          <TextInput label="(testing) object id" onChange={(e) => setUpdatedTestingObjId(e.target.value)} />
          <br />
          <TextInput label="(testing) updated name" onChange={(e) => setUpdatedTestingName(e.target.value)} />
          <br />
          <TextInput label="(testing) updated motto" onChange={(e) => setUpdatedTestingMotto(e.target.value)} />
          <br />
          <Button onClick={updateTestingObj}>Update</Button>
        </div>
        <div>
          <h1>Delete</h1>
          <TextInput label="(testing) object id" onChange={(e) => setDeleteTestingObjId(e.target.value)} />
          <br />
          <Button onClick={deleteTestingObj}>Delete</Button>
        </div>
      </Container>
      <Container style={{ marginBottom: '100px' }}>
        <h1>Image Upload</h1>
        <Dropzone onDrop={(files) => dropFile(files[0])} onReject={() => setFileValid(false)} maxSize={3 * 1024 ** 2} accept={IMAGE_MIME_TYPE}>
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload size={50} stroke={1.5} color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
              {file !== null && (
                <Text size="sm" mt="xs" color="dimmed">
                  <b>
                    Selected file:{' '}
                    <Text span color="red">
                      {file.name}
                    </Text>
                  </b>
                </Text>
              )}
            </div>
          </Group>
        </Dropzone>
        <br />
        <Button disabled={!fileValid && !file} onClick={submitFile}>
          Submit Image
        </Button>
      </Container>
    </div>
  );
};

export default Testing;
