import './App.css';
import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const API_URL ="https://localhost:7187/api/Builder/";

const proficiencyOptions = [
  "Acrobatics", "Animal Handling", "Arcana", "Athletics",
  "Deception", "History", "Insight", "Intimidation",
  "Investigation", "Medicine", "Nature", "Perception",
  "Performance", "Persuasion", "Religion", "Sleight of Hand",
  "Stealth", "Survival"
];

function App(props) {

  const [races, SetRaces] = useState([]);
  const [classes, SetClasses] = useState([]);

  const [subraces, SetSubraces] = useState([]);
  const [subclasses, SetSubclasses] = useState([]);

  const [selectedRace, setSelectedRace] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [selectedSubrace, setSelectedSubrace] = useState("");
  const [selectedSubclass, setSelectedSubclass] = useState("");

  const [rolledValues, setRolledValues] = useState([]);

  const [proficiencies, setProficiencies] = useState([]);
  const [selectedProficiencies, setSelectedProficiencies] = useState([]);
  const [proficiencyAmount, setProficiencyAmount] = useState(0);

  useEffect(() => {
    getRaces().then(getClasses());
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedClass) {
      getProficiencies(selectedClass);
      getProficiencyAmount(selectedClass);
      setSelectedProficiencies([]);
    }
  }, [selectedClass])

  async function getRaces() {
    fetch(API_URL + "Races")
      .then(response => response.json())
      .then((json) => SetRaces(json));
    console.log(races);
  }

  async function getClasses() {
    fetch(API_URL + "Classes")
      .then(response => response.json())
      .then((json) => SetClasses(json));
    console.log(classes);
  }

  function setRace(e) {
    setSelectedRace(e.target.value);
    setSelectedSubrace("");
    getSubraces(e.target.value);
  }

  function setClass(e) {
    setSelectedClass(e.target.value);
    setSelectedSubclass("");
    getSubclasses(e.target.value);
    getProficiencies(e.target.value);
    getProficiencyAmount(e.target.value);
  }

  async function getSubraces(race) {
    fetch(API_URL + "Subraces/" + race)
      .then(response => response.json())
      .then((json) => SetSubraces(json));
    console.log(subraces);
  }

  async function getSubclasses(_class) {
    fetch(API_URL + "Subclasses/" + _class)
      .then(response => response.json())
      .then((json) => SetSubclasses(json));
    console.log(subclasses);
  }

  function setSubrace(e) {
    setSelectedSubrace(e.target.value);
  }

  function setSubclass(e) {
    setSelectedSubclass(e.target.value);
  }

  async function getModifier(e) {
    const stat = e.target.textContent;

    if (!stat) {
      return;
    }

    fetch(API_URL + "GetModifier/" + stat)
      .then(response => response.json())
      .then(modifier => {
        const squareTextElement = e.target.nextElementSibling;
        squareTextElement.textContent = modifier >= 0 ? `+${modifier}` : modifier;
    });
  }

  async function rollStats() {
    const newValues = [];
    for (let i = 0; i < 6; i++) {
      const response = await fetch(API_URL + "RollStat");
      const text = await response.text();
      newValues.push(text);
    }
    setRolledValues(newValues);
  }

  async function getProficiencies(selectedClass) {
    fetch(API_URL + "GetProficiencies/" + selectedClass)
      .then(response => response.json())
      .then((json) => setProficiencies(json));
  }

  async function getProficiencyAmount(selectedClass) {
    fetch(API_URL + "GetProficiencyAmount/" + selectedClass)
      .then(response => response.json())
      .then((amount) => setProficiencyAmount(amount));
  }

  function handleCheckboxChange(event) {
    const { value, checked } = event.target;
    if (checked) {
      if (selectedProficiencies.length < proficiencyAmount) {
        setSelectedProficiencies((prevProficiencies) => [...prevProficiencies, value]);
      }
    } else {
      setSelectedProficiencies((prevProficiencies) =>
        prevProficiencies.filter((proficiency) => proficiency !== value)
      );
    }
  }

  function handleStatInputChange(e) {
    let statValue = parseInt(e.target.textContent) || 0;

    if (statValue < 1 || statValue > 20) {
      statValue = 10;
    }

    e.target.textContent = statValue;

    getModifier(e);
   }

  function renderProficiencyTable() {
    const rows = [];
    const columns = 3;

    const columnWidth = `${100 / columns}%`;

    for (let i = 0; i < proficiencyOptions.length; i += columns) {
      const row = proficiencyOptions.slice(i, i + columns).map((option) => (
        <td key={option} style={{ width: columnWidth }}>
          <label>
            <input 
              type="checkbox"
              data-testid="proficiency-checkbox"
              value={option}
              checked={selectedProficiencies.includes(option)}
              disabled={!proficiencies.includes(option) || (selectedProficiencies.length >= proficiencyAmount && !selectedProficiencies.includes(option))}
              onChange={handleCheckboxChange}
              key={option}
            />
            {option}
          </label>
        </td>
      ));
      rows.push(<tr key={i}>{row}</tr>);
    }

    return (
      <table style={{ width: '100%' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  function generateFileContent() {
    const content = 'This is the content of the text file.';

    return content;
  }

  function downloadCharacterFile() {
    const content = generateFileContent();
    const filename = 'custom-filename.txt';

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  function confirmDownload() {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to download the character file?",
      buttons: [
        {
          label: "Yes",
          onClick: () => downloadCharacterFile()
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  return (
    <div className="container">
      <header>
        <h1 className="title">
          Dungeons & Dragons character builder
        </h1>
      </header>
      <div className="dropdown">
        <label htmlFor="raceDropdown" className="dropdownlabel">Race: </label>
        <select id="raceDropdown" className="dropdown" onChange={setRace} value={selectedRace}>
          <option value="" disabled hidden defaultValue></option>
          {
            races.map((race, index) => <option key={index}>{race}</option>)
          }
        </select>
      </div>
      {selectedRace && subraces.length > 0 &&
        <div className="dropdown">
          <label htmlFor="subraceDropdown" className="dropdownlabel">Subrace: </label>
          <select id="subraceDropdown" className="dropdown" onChange={setSubrace} value={selectedSubrace}>
            <option value="" disabled hidden defaultValue></option>
            {
              subraces.map((subrace, index) => <option key={index}>{subrace}</option>)
            }
          </select>
        </div>
      }

      <hr></hr>

      <div className="dropdown">
        <label htmlFor="classDropdown" className="dropdownlabel">Class: </label>
        <select id="classDropdown" className="dropdown" onChange={setClass} value={selectedClass}>
          <option value="" disabled hidden defaultValue></option>
          {
            classes.map((_class, index) => <option key={index}>{_class}</option>)
          }
        </select>
      </div>
      {selectedClass && subclasses.length > 0 &&
        <div className="dropdown">
          <label htmlFor="subclassDropdown" className="dropdownlabel">Subclass: </label>
          <select id="subclassDropdown" className="dropdown" onChange={setSubclass} value={selectedSubclass}>
            <option value="" disabled hidden defaultValue></option>
            {
              subclasses.map((subclass, index) => <option key={index}>{subclass}</option>)
            }
          </select>
        </div>
      }

      <hr></hr>

      <details className="detailsbar" open>
        <summary className="detailslabel">Stats</summary>
        <hr></hr>
        <div className="statpointcollection">
          <div className="stat">
            <label className="statlabel">Strength</label>
            <div className="statpoint">
              <div className="oval-text" contentEditable="true" onBlur={handleStatInputChange}>10</div>
              <div className="square-text">+0</div>
            </div>
          </div>

          <div className="stat">
            <label className="statlabel">Dexterity</label>
            <div className="statpoint">
              <div className="oval-text" contentEditable="true" onBlur={handleStatInputChange}>10</div>
              <div className="square-text">+0</div>
            </div>
          </div>

          <div className="stat">
            <label className="statlabel">Constitution</label>
            <div className="statpoint">
              <div className="oval-text" contentEditable="true" onBlur={handleStatInputChange}>10</div>
              <div className="square-text">+0</div>
            </div>
          </div>

          <div className="stat">
            <label className="statlabel">Intelligence</label>
            <div className="statpoint">
              <div className="oval-text" contentEditable="true" onBlur={handleStatInputChange}>10</div>
              <div className="square-text">+0</div>
            </div>
          </div>

          <div className="stat">
            <label className="statlabel">Wisdom</label>
            <div className="statpoint">
              <div className="oval-text" contentEditable="true" onBlur={handleStatInputChange}>10</div>
              <div className="square-text">+0</div>
            </div>
          </div>

          <div className="stat">
            <label className="statlabel">Charisma</label>
            <div className="statpoint">
              <div className="oval-text" contentEditable="true" onBlur={handleStatInputChange}>10</div>
              <div className="square-text">+0</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}></div>

        {rolledValues.length == 0 && (
          <div className="middlealign">
            <button onClick={rollStats}>Roll stats</button>
          </div>
        )}
        {rolledValues.length > 0 && (
          <div>
            <label className="middlealign">These are the stats you rolled</label>
            <label className="middlealign">Distribute these over your stats as you see fit</label>

            <div style={{ marginTop: '10px' }}></div>

            <div className="statpointcollection">
              {rolledValues.map((value, index) => (
                <div className="stat" key={index}>
                  <div data-testid="rolled-stat" className="rolledstat">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <hr className="line"></hr>
      </details>

      <details className="detailsbar" open>
        <summary className="detailslabel">Proficiencies</summary>
        <hr></hr>
        
        {selectedClass && (
          <div>
            <label className="middlealign">Choose a total of {proficiencyAmount} proficiencies ({selectedProficiencies.length}/{proficiencyAmount})</label>
            <label className="middlealign">Which proficiencies you can choose and the amount are determined by your class</label>
            <div style={{ marginTop: '7px' }}></div>
          </div>
        )}

        <div>
          {renderProficiencyTable()}
        </div>
        <hr className="line"></hr>
      </details>
      
      <hr></hr>
      
      {/*<button onClick={confirmDownload}>Download character file</button>*/}
    </div>
  );
}

export default App;