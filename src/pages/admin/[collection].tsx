import { addOneToDatabase, deleteOneFromDatabase, queryOneFromDatabase, updateOneInDatabase } from '@components/helper';
import { collectionSamples } from '@components/types';
import { SessionContext } from '@hooks/useSessionContext';
import { LoggerContext } from '@util/logger';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function CollectionForm() {
  const router = useRouter();
  const { session } = useContext(SessionContext);
  const logger = useContext(LoggerContext);
  const collection = router.query.collection as string;
  const [collectionSampleObject, setCollectionSampleObject] = useState({});
  const [stringAndObjectKeys, setStringAndObjectKeys] = useState<string[]>([]);
  const [formData, setFormData] = useState({});
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!session || !session.isAdmin) {
      // Redirect or show unauthorized message
      return;
    }

    if (!collectionSampleObject) {
      // Handle collection not found
      return;
    }

    const keys = Object.keys(collectionSampleObject).filter(
      (key) => determineInputType(collectionSampleObject[key]) === 'text'
    );
    setStringAndObjectKeys(keys);

    // Fetch data or any other side effects
  }, [session, collection, collectionSampleObject]);

  useEffect(() => {
    const fetchSamples = async () => {
      const res = await fetch(`/api/admin/samples`);
      const data = await res.json();
      setCollectionSampleObject(data.data[collection]);
    };
    fetchSamples();
  }, [collection]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value;

    const fieldKeys = name.split('.');
    let updatedFormData = { ...formData };
    let currentLevel = updatedFormData;

    for (let i = 0; i < fieldKeys.length - 1; i++) {
      const key = fieldKeys[i];
      if (!(key in currentLevel)) {
        currentLevel[key] = {};
      }
      currentLevel = currentLevel[key];
    }

    if (newValue === '') {
      // If value is empty, remove the field from formData
      delete currentLevel[fieldKeys[fieldKeys.length - 1]];
    } else {
      currentLevel[fieldKeys[fieldKeys.length - 1]] = newValue;
    }

    setFormData(updatedFormData);
  };

  const getValueFromNestedObject = (obj, path) => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const determineInputType = (value) => {
    if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'checkbox';
    } else if (typeof value === 'object') {
      return 'object';
    } else {
      return 'text';
    }
  };

  const renderFields = (data, prefix = '') => {
    if (!data || typeof data !== 'object') {
      return null;
    }

    return Object.entries(data).map(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      const inputValue = formData[fieldName] || '';
      const inputType = determineInputType(value);

      if (inputType === 'object' && !Array.isArray(value)) {
        return (
          <div style={{ marginLeft: 50, marginTop: 10 }} key={fieldName}>
            {renderFields(value, fieldName)}
          </div>
        );
      } else if (!Array.isArray(value) && fieldName !== 'id') {
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}: </label>
            <input
              type={inputType}
              id={fieldName}
              name={fieldName}
              placeholder={value.toString() as string}
              value={inputType === 'checkbox' ? inputValue : getValueFromNestedObject(formData, fieldName) || ''}
              checked={inputType === 'checkbox' && inputValue}
              onChange={handleInputChange}
            />
          </div>
        );
      }
    });
  };

  const handleFindObject = async (e) => {
    e.preventDefault();
    if (!searchField || !searchValue) {
      logger.log('Please select a field and provide a value for search');
      return;
    }
    const res = await queryOneFromDatabase(collection, searchField, searchValue);
    if (res.success && res.data) {
      logger.log('Object found:', res.data);
      setSearchResult(res.data);
      setErrorMessage('');
    } else {
      logger.log('Object not found');
      setSearchResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchResult || !searchResult.id) {
      if (!formData || Object.keys(formData).length === 0) {
        setErrorMessage('please fill out the form');
        return;
      }
      const res = await addOneToDatabase(collection, formData);
      logger.log('adminAdd.handleSubmit', res);
    }
    else {
      const res = await updateOneInDatabase(collection, searchResult.id, formData);
      logger.log('adminUpdate.handleSubmit', res);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!searchResult || !searchResult.id) {
      logger.log('please find an object before deleting');
      return;
    }
    else {
      const res = await deleteOneFromDatabase(collection, searchResult.id);
      logger.log('adminUpdate.handleDelete', res);
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ textAlign: 'center' }}>{collection}</h2>
      <div style={{ display: 'flex', gap: 50, justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <div>
          <form onSubmit={handleFindObject}>
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)} style={{ padding: 3 }}>
              <option value="">select a field</option>
              {stringAndObjectKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <input type="text" placeholder="Search value" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <button type="submit" style={{ marginLeft: 10 }}>find {collection}</button>
          </form>
          {searchResult && Object.keys(searchResult).length > 0 ? (
            <pre>
              <code>
                {JSON.stringify(searchResult, null, 2)}
              </code>
            </pre>
          ) : (
            <span style={{ color: 'red', display: 'block' }}>no {collection} found</span>
          )}
          {(searchResult && searchResult.id) ? (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setSearchResult(null)}>clear</button>
              <button style={{ borderColor: 'red', color: 'red' }} onClick={handleDelete}>delete {collection}</button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div>
          {searchResult && searchResult.id ? (
            <h3>updating {collection} {searchResult.id}</h3>
          ) : (
            <h3>adding new {collection}</h3>
          )}
          <form onSubmit={handleSubmit}>
            {renderFields(collectionSampleObject)}
            <button type="submit">{(searchResult && searchResult.id) ? `update ${collection}` : `add ${collection}`}</button>
            {errorMessage && <span style={{ color: 'red', display: 'block' }}>{errorMessage}</span>}
          </form>
        </div>
      </div>
      <br />
    </div>
  );
}
