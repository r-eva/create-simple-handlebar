import React, {useState} from 'react';
import DataTest from '../DATATEST/dataTest.json'

const Landing = () => {
    const [data, setData] = useState(DataTest)
    const [template, setTemplate] = useState('')
    const [message, setMessage] = useState('Please enter dataset and template!')

    /// Function to process data ///
    const chop = (inputTemplate, inputData) => {
        if (typeof(inputTemplate) != typeof(template) || typeof(inputData) != typeof(data)) {   //// If parameter data is not an Object and or template is not a string, request to corect format.
            return setMessage('Please input data with correct format!')
        }
        
        let trimFirstString = inputData.bread.replace(/[^a-zA-Z0-9 ]/g, "")                 //// Additional (optional) trim the string, remove symbol on the string
        let trimSecondString = inputData.cheese.replace(/[^a-zA-Z0-9 ]/g, "")

        if (/\d/.test(inputData.bread) || /\d/.test(inputData.cheese)) {

            let trimNumberOnly = trimFirstString.replace(/[^0-9]/g, "")                     /// If the string has number, get the number only to be shown.
            let trimNumberOnlySecond = trimSecondString.replace(/[^0-9]/g, "")

            if (/\d/.test(inputData.bread) && /\d/.test(inputData.cheese)) {               //// Additional (option) trim, if both first string and second string include number, showing "and" inside the template to indicate the both number.
                setMessage(`${inputTemplate} ${trimNumberOnly} and ${trimNumberOnlySecond}`)
            } else if (/\d/.test(inputData.bread)) {                                            ///  //// Additional (optional) trim, if the only one string include number, just show such string without any letter or symbol.
                setMessage(`${inputTemplate} ${trimNumberOnly} ${trimSecondString}`)
            } else {
                setMessage(`${inputTemplate} ${trimFirstString} ${trimNumberOnlySecond}`)
            } 

        } else if (inputTemplate === '' || inputData.bread === '' || inputData.cheese === '' ) {
            setMessage('Template and dataset are mandatory parameters.')
        } else {
            setMessage(`${inputTemplate} ${trimFirstString} and ${trimSecondString}`)
        }
    };

    return (
        <div>
            <h1 data-testid="header">Welcome to Chop Application</h1>
            <form>
                <p>Please enter your first word or number:</p>
                <input type="text" name="Bread" placeholder="Set your data here" data-testid="firstData" value={data.bread} onChange={(e) => setData({...data, bread: e.target.value})}/>
                <p>Please enter your second word or number:</p>
                <input type="text" name="Cheese" placeholder="Set your data here" data-testid="secondData" value={data.cheese} onChange={(e) => setData({...data, cheese: e.target.value})}/>
                <p>Please enter your template:</p>
                <input type="text" name="Template" placeholder="Set your template here" data-testid="template" value={template} onChange={(e) => setTemplate(e.target.value)}/>
                <button type="button" style={{marginLeft: "10px"}} data-testid="submit-button" onClick={()=> chop(template, data)}>SUBMIT</button>
            </form>
            <h3 data-testid="message">{message}</h3>
        </div>
    );
};

export default Landing;