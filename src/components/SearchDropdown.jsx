import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FixedSizeList as List } from 'react-window';

export default function SearchDropdown({ onSelect }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://liutentor.lukasabbe.com/api/courses');
        const data = await response.json();
        const formattedOptions = data.map((item) => ({
          value: item,
          label: String(item),
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get CSS variable value
  const getVar = (name, fallback) =>
    getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: getVar('--bg', '#fff'),
      color: getVar('--text', '#222'),
      borderColor: getVar('--text', '#222'),
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: getVar('--bg', '#fff'),
      color: getVar('--text', '#222'),
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? getVar('--text', '#222') + '22'
        : getVar('--bg', '#fff'),
      color: getVar('--text', '#222'),
    }),
    singleValue: (provided) => ({
      ...provided,
      color: getVar('--text', '#222'),
    }),
    input: (provided) => ({
      ...provided,
      color: getVar('--text', '#222'),
    }),
    placeholder: (provided) => ({
      ...provided,
      color: getVar('--text', '#222'),
    }),
  };

  // Virtualized MenuList for performance (unchanged)
  const height = 35;
  const MenuList = (props) => {
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;
    return (
      <List
        height={Math.min(maxHeight, 300)}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
        width="100%"
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };

  return (
    <div style={{ width: 300 }}>
      {loading ? (
        <p>Loading options...</p>
      ) : (
        <Select
          options={options}
          components={{ MenuList }}
          isSearchable
          placeholder="Select an option"
          onChange={option => onSelect(option ? option.value : null)}
          styles={customStyles}
        />
      )}
    </div>
  );
}