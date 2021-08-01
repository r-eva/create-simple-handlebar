import React from "react"
import Landing from '../Landing'
import { fireEvent, render } from '@testing-library/react'
import "@testing-library/jest-dom/extend-expect"
import dataTest from '../../DATATEST/dataTest.json'

test("Header renders with correct text", () => {
    const component = render(<Landing/>)
    const headerEl = component.getByTestId("header")
    expect(headerEl.textContent).toBe("Welcome to Chop Application")
})

test("Data contains initial value empty string", () => {
    const {getByTestId} = render(<Landing/>)
    const firstData = getByTestId("firstData")
    const secondData = getByTestId("secondData")
    const template = getByTestId("template")
    const messageResult = getByTestId("message")
    expect(firstData.value).toBe(dataTest.bread)
    expect(secondData.value).toBe(dataTest.cheese)
    expect(template.value).toBe("")
    expect(messageResult.textContent).toBe("Please enter dataset and template!")
})

test("Chop function render error if missing one parameter", () => {
    const {getByTestId} = render(<Landing/>)
    const btnEl = getByTestId("submit-button")
    const messageResult = getByTestId("message")

    let firstData = getByTestId("firstData")
    let secondData = getByTestId("secondData")
    let template = getByTestId("template")

    fireEvent.change(firstData, { target: { value: "baguette" } })
    fireEvent.change(secondData, { target: { value: "brie cheese" } })
    fireEvent.click(btnEl);
    expect(messageResult.textContent).toBe(`Template and dataset are mandatory parameters.`)
})

test("Chop function render correct result", () => {
    const {getByTestId} = render(<Landing/>)
    const btnEl = getByTestId("submit-button")
    const messageResult = getByTestId("message")

    let firstData = getByTestId("firstData")
    let secondData = getByTestId("secondData")
    let template = getByTestId("template")

    fireEvent.change(firstData, { target: { value: "baguette" } })
    fireEvent.change(secondData, { target: { value: "brie cheese" } })
    fireEvent.change(template, { target: { value: "I like to eat" } })
    fireEvent.click(btnEl);
    expect(messageResult.textContent).toBe(`I like to eat baguette and brie cheese`)
})

test("Chop function render correct result, if the user input Number and String with symbol", () => {
    const {getByTestId} = render(<Landing/>)
    const btnEl = getByTestId("submit-button")
    const messageResult = getByTestId("message")

    let firstData = getByTestId("firstData")
    let secondData = getByTestId("secondData")
    let template = getByTestId("template")

    fireEvent.change(firstData, { target: { value: "baguete3/(&#" } })
    fireEvent.change(secondData, { target: { value: "brie +?=cheese" } })
    fireEvent.change(template, { target: { value: "I like to eat" } })
    fireEvent.click(btnEl);
    expect(messageResult.textContent).toBe(`I like to eat 3 brie cheese`)
})

test("Chop function render correct result, if the user input datatest both number", () => {
    const {getByTestId} = render(<Landing/>)
    const btnEl = getByTestId("submit-button")
    const messageResult = getByTestId("message")

    let firstData = getByTestId("firstData")
    let secondData = getByTestId("secondData")
    let template = getByTestId("template")

    fireEvent.change(firstData, { target: { value: "bag93/(&#" } })
    fireEvent.change(secondData, { target: { value: "brie +?=c67heese" } })
    fireEvent.change(template, { target: { value: "I like number" } })
    fireEvent.click(btnEl);
    expect(messageResult.textContent).toBe(`I like number 93 and 67`)
})


describe("Test function if received wrong format of parameters, it will send a usefull error", () => {

    const chop = (inputTemplate, inputData) => {
        if (typeof(inputTemplate) != typeof("String") || typeof(inputData) != typeof(dataTest)) {   //// If parameter data is not an Object and or template is not a string, request to corect format.
            return 'Please input data with correct format!'
        }

        let trimFirstString = inputData.bread.replace(/[^a-zA-Z0-9 ]/g, "")                 //// Additional (optional) trim the string, remove symbol on the string
        let trimSecondString = inputData.cheese.replace(/[^a-zA-Z0-9 ]/g, "")
    
        if (/\d/.test(inputData.bread) || /\d/.test(inputData.cheese)) {
    
            let trimNumberOnly = trimFirstString.replace(/[^0-9]/g, "")                     /// If the string has number, get the number only to be shown.
            let trimNumberOnlySecond = trimSecondString.replace(/[^0-9]/g, "")
    
            if (/\d/.test(inputData.bread) && /\d/.test(inputData.cheese)) {               //// Additional (option) trim, if both first string and second string include number, showing "and" inside the template to indicate the both number.
                return `${inputTemplate} ${trimNumberOnly} and ${trimNumberOnlySecond}`
            } else if (/\d/.test(inputData.bread)) {                                            ///  //// Additional (optional) trim, if the only one string include number, just show such string without any letter or symbol.
                return `${inputTemplate} ${trimNumberOnly} ${trimSecondString}`
            } else {
                return `${inputTemplate} ${trimFirstString} ${trimNumberOnlySecond}`
            } 
    
        } else if (inputTemplate === '' || inputData.bread === '' || inputData.cheese === '' ) {
            return 'Template and dataset are mandatory parameters.'
        } else {
            return `${inputTemplate} ${trimFirstString} and ${trimSecondString}`
        }
    };

    let testFunctionData = 1
    let testFunctionTemplate = ['Test template']

    let runFunction = chop(testFunctionTemplate, testFunctionData)
    it('Send usefull error', () => {
        expect(runFunction).toEqual('Please input data with correct format!');
    });
})
