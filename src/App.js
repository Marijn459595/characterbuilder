import './App.css';
import React, {useState, useEffect} from 'react';

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

  const [selectedProficiencies, setSelectedProficiencies] = useState([]);
  const [proficiencyAmount, setProficiencyAmount] = useState(0);

  useEffect(() => {
    getRaces().then(getClasses());
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedClass) {
      getProficiencies(selectedClass);
      getProficiencyAmount(selectedClass);
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
    getSubraces(e.target.value);
  }

  function setClass(e) {
    setSelectedClass(e.target.value);
    getSubclasses(e.target.value);
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
      .then((json) => setSelectedProficiencies(json));
  }

  async function getProficiencyAmount(selectedClass) {
    fetch(API_URL + "GetProficiencyAmount/" + selectedClass)
      .then(response => response.json())
      .then((amount) => setProficiencyAmount(amount));
  }

  function handleProficiencyChange(event) {
    const { value } = event.target;
    setSelectedClass(value);
  }

  function handleCheckboxChange(event) {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedProficiencies((prevProficiencies) => [...prevProficiencies, value]);
    } else {
      setSelectedProficiencies((prevProficiencies) => prevProficiencies.filter((proficiency) => proficiency !== value));
    }
  }

  function renderProficiencyTable() {
    const rows = [];
    const columns = 3;

    for (let i = 0; i < proficiencyOptions.length; i += columns) {
      const row = proficiencyOptions.slice(i, i + columns).map((option) => (
        <td key={option}>
          <label>
            <input 
              type="checkbox"
              value={option}
              checked={selectedProficiencies.includes(option)}
              disabled={selectedProficiencies.length >= proficiencyAmount && !selectedProficiencies.includes(option)}
              onChange={handleCheckboxChange}
            />
            {option}
          </label>
        </td>
      ));
      rows.push(<tr key={i}>{row}</tr>);
    }

    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  return (
    <div class="middlealign">
      <header>
        <h1 class="title">
          Dungeons & Dragons character builder
        </h1>
      </header>
      <div class="dropdown">
        <label class="dropdownlabel">Race: </label>
        <select class="dropdown" onChange={setRace}>
          <option value="" selected disabled hidden></option>
          {
            races.map(race => <option>{race}</option>)
          }
        </select>
      </div>
      {selectedRace && subraces.length > 0 &&
        <div class="dropdown">
          <label class="dropdownlabel">Subrace: </label>
          <select class="dropdown" onChange={setSubrace}>
            <option value="" selected disabled hidden></option>
            {
              subraces.map(subrace => <option>{subrace}</option>)
            }
          </select>
        </div>
      }

      <hr></hr>

      <div class="dropdown">
        <label class="dropdownlabel">Class: </label>
        <select class="dropdown" onChange={setClass}>
          <option value="" selected disabled hidden></option>
          {
            classes.map(_class => <option>{_class}</option>)
          }
        </select>
      </div>
      {selectedClass && subclasses.length > 0 &&
        <div class="dropdown">
          <label class="dropdownlabel">Subclass: </label>
          <select class="dropdown" onChange={setSubclass}>
            <option value="" selected disabled hidden></option>
            {
              subclasses.map(subclass => <option>{subclass}</option>)
            }
          </select>
        </div>
      }

      <hr></hr>

      <details class="detailsbar" open>
        <summary class="detailslabel">Stats</summary>
        <div class="statpointcollection">
          <div class="stat">
            <label class="statlabel">Strength</label>
            <div class="statpoint">
              <div class="oval-text" contentEditable="true" onInput={getModifier}>18</div>
              <div class="square-text">+4</div>
            </div>
          </div>

          <div class="stat">
            <label class="statlabel">Dexterity</label>
            <div class="statpoint">
              <div class="oval-text" contentEditable="true" onInput={getModifier}>18</div>
              <div class="square-text">+4</div>
            </div>
          </div>

          <div class="stat">
            <label class="statlabel">Constitution</label>
            <div class="statpoint">
              <div class="oval-text" contentEditable="true">18</div>
              <div class="square-text">+4</div>
            </div>
          </div>

          <div class="stat">
            <label class="statlabel">Intelligence</label>
            <div class="statpoint">
              <div class="oval-text" contentEditable="true">18</div>
              <div class="square-text">+4</div>
            </div>
          </div>

          <div class="stat">
            <label class="statlabel">Wisdom</label>
            <div class="statpoint">
              <div class="oval-text" contentEditable="true">18</div>
              <div class="square-text">+4</div>
            </div>
          </div>

          <div class="stat">
            <label class="statlabel">Charisma</label>
            <div class="statpoint">
              <div class="oval-text" contentEditable="true">18</div>
              <div class="square-text">+4</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}></div>

        {rolledValues.length == 0 && (
          <div class="middlealign">
            <button onClick={rollStats}>Roll stats</button>
          </div>
        )}
        {rolledValues.length > 0 && (
          <div class="statpointcollection">
            {rolledValues.map((value, index) => (
              <div class="stat" key={index}>
                <div class="rolledstat">{value}</div>
              </div>
            ))}
          </div>
        )}

        <hr></hr>

        <div>
          {renderProficiencyTable()}
        </div>
      </details>
      
    </div>
  );
}

export default App;