import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { deleteFile, uploadFile } from '@util/firebase';
import { LoggerContext } from '@util/logger';
import Link from 'next/link';
import { SessionContext } from '@hooks/useSessionContext';

const Admin = (): React.ReactNode => {
  const { session } = useContext(SessionContext);
  if (!session || !session.isAdmin) return (<div style={{ padding: 10 }}>unauthorized</div>);

  const logger = useContext(LoggerContext);
  const [collectionSamples, setCollectionSamples] = useState(null);
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

  useEffect(() => {
    const fetchSamples = async () => {
      const res = await fetch(`/api/admin/samples`);
      const data = await res.json();
      setCollectionSamples(data.data);
    };
    fetchSamples();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 10, paddingBottom: 25, borderBottom: '1px solid #ccc' }}>
        <h3>crud objects</h3>
        <ul>
          {collectionSamples && Object.keys(collectionSamples).map((collection) => (
            <li key={collection}><Link href={`/admin/${collection}`} key={collection}>/{collection}</Link></li>
          ))}
        </ul>
      </div>
      <div style={{ padding: 10, paddingBottom: 25, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h3>upload file</h3>
          <input multiple type="file" name="file input" id="file-input" onChange={handleFileSelect} />
          <br />
          <button disabled={!fileValid || !file} onClick={handleFileUpload}>
            upload file
          </button>
        </div>
        <div>
          <h3>delete file</h3>
          <input type="text" placeholder="(testing) file storage path" onChange={(e) => setFileStoragePath(e.target.value)} />
          <br />
          <button onClick={handleFileDelete}>delete file</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
