"use strict";

(function calcultor() {
  const myKeys = document.querySelectorAll(".keys");
  const display = document.getElementById("inputField");
  let expression = "";
  const result = document.getElementById("result");

  function checkValidity() {
    const currentValue = display.innerHTML;
    const stringLength = currentValue.length;
    return !isNaN(currentValue.charAt(stringLength - 1)) && currentValue.length;
  }

  function updateResult() {
    if (
      checkValidity() ||
      display.textContent.charAt(display.textContent.length - 1) === "%" ||
      display.textContent.charAt(display.textContent.length - 1) === "2" ||
      display.textContent.charAt(display.textContent.length - 1) === ")"
    ) {
      console.log(display.textContent, expression, "passed2");
      result.innerHTML = eval(expression);
    }
  }

  function handleOpenBracket() {
    const displayStr = display.textContent;
    if (
      displayStr.length !== 0 &&
      (!isNaN(displayStr.charAt(displayStr.length - 1)) ||
        displayStr.charAt(displayStr.length - 1) === ")")
    ) {
      return "*(";
    }
    return "(";
  }

  function handleCloseBracket(input) {
    const openBracket = expression.match(/\(/g)?.length;
    const closeBracket = expression.match(/\)/g)?.length;
    if (openBracket && (!closeBracket || closeBracket < openBracket)) {
      display.innerHTML += input;
      return ")";
    }
    return "";
  }

  function balanceBracket() {
    const openBracket = expression.match(/\(/g)?.length;
    const closeBracket = expression.match(/\)/g)?.length;
    if (closeBracket !== openBracket) {
      const diff = closeBracket ? openBracket - closeBracket : openBracket;
      const addedBracket = ")".repeat(diff);
      if (checkValidity()) {
        result.innerHTML = eval(expression + addedBracket);
      }
    } else {
      if (checkValidity()) {
        updateResult();
      }
    }
  }

  function handleSymbol(input) {
    const content = display.textContent;
    if (
      checkValidity() ||
      (content.charAt(content.length - 1) === "%" && input !== "%") ||
      (content.length === 0 && input === "(") ||
      (content.charAt(content.length - 1) !== "(" && input === "(") ||
      (input === ")" && !isNaN(content.charAt(content.length - 1))) ||
      (input.charCodeAt(0) === 177 &&
        (content.charCodeAt(content.length - 1) === 215 ||
          content.charCodeAt(content.length - 1) === 247 ||
          !content.length)) ||
      content.charAt(content.length - 1) === ")" ||
      (display.innerHTML.charAt(display.innerHTML.length - 15) === "2" &&
        input.charCodeAt(0) !== 8730) ||
      (input.charCodeAt(0) === 8730 &&
        content.charCodeAt(content.length - 2) !== 8730)
    ) {
      switch (input.charCodeAt(0)) {
        case 215:
          expression += "*";
          break;
        case 247:
          expression += "/";
          break;
        case 0x2212:
          expression += "-";
          break;
        case 37:
          expression += "*0.01";
          break;
        case 43:
          expression += "+";
          break;
        case 177:
          expression += "-";
          input = "&minus;";
          break;
        case 8730:
          if (isNaN(content.charAt(content.length - 1))) {
            expression += "Math.sqrt(";
          } else {
            expression += "*Math.sqrt(";
          }
          input = "&Sqrt;(";
          break;
        case 46:
          expression += ".";
          break;
        case 40:
          const value = handleOpenBracket();
          expression += value;
          break;
        case 41:
          const value1 = handleCloseBracket(input);
          expression += value1;
          return;
        case 55349:
          expression += "**2";
          input = "<small><sup>2</sup></small>";
          break;
        default:
          expression += input;
      }
      display.innerHTML += input;
      updateResult();
    }
  }

  function handleDelete() {
    const currentValue = display.innerHTML;
    let newIndex;
    let newValue = currentValue.slice(0, display.innerHTML.length - 1);
    switch (display.innerHTML.charAt(display.innerHTML.length - 1)) {
      case "%":
        newIndex = 5;
        break;
      case "(":
        newIndex = 2;
        if (isNaN(display.textContent.charAt(display.textContent.length - 2))) {
          if (
            !(
              display.textContent.charAt(display.textContent.length - 2) === ")"
            )
          ) {
            if (
              display.textContent.charCodeAt(display.textContent.length - 2) ===
              8730
            ) {
              newIndex =
                isNaN(
                  display.textContent.charCodeAt(display.textContent.length - 3)
                ) || display.textContent.charCodeAt(0) === 8730
                  ? 10
                  : 11;
              newValue = currentValue.slice(0, display.innerHTML.length - 2);
            } else {
              newIndex = 1;
            }
          }
        }
        break;
      case ">":
        newIndex = 3;
        newValue = currentValue.slice(0, display.innerHTML.length - 27);
        break;
      default:
        newIndex = 1;
    }
    expression = expression.slice(0, expression.length - newIndex);
    console.log(expression);
    display.innerHTML = newValue;
    balanceBracket();
    // if (!isNaN(display.innerHTML.charAt(display.innerHTML.length - 1))) {
    //   balanceBracket();
    // } else {
    //   updateResult();
    // }
  }

  function handleInput(input) {
    const currentValue = display.innerHTML;
    if (input === "del") {
      handleDelete(currentValue);
    } else if (input === "clr") {
      display.textContent = "";
      expression = "";
      result.innerHTML = expression;
      updateResult();
    } else if (input == "ans") {
      expression = result.textContent;
      display.textContent = expression;
      result.textContent = "";
      updateResult();
    } else {
      handleSymbol(input);
      return;
    }

    if (!expression) {
      result.innerHTML = "";
    }
  }

  function handleDigit(e) {
    const len = display.innerHTML.length;
    if (
      display.innerHTML.charAt(len - 1) === "%" ||
      display.innerHTML.charAt(len - 15) === "2"
    ) {
      display.innerHTML += "&times;" + e.target.textContent;
      expression += "*" + e.target.textContent;
    } else {
      display.innerHTML += e.target.textContent;
      expression += e.target.textContent;
      console.log(expression);
    }

    balanceBracket();
  }

  for (const key of myKeys) {
    key.addEventListener("click", function (e) {
      if (e.target === this) {
        if (!isNaN(e.target.textContent)) {
          handleDigit(e);
        } else {
          const strippedString = e.target.textContent.replace(/\s/g, "");
          handleInput(strippedString);
        }
      }
    });
  }

  console.log("linked");
})();
