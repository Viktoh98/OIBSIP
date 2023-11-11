"use strict";
(function TodoFunction() {
  const tasks = document.querySelector(".task__list");
  const submitBtn = document.getElementById("submitBtn");
  const myForm = document.getElementById("myForm");
  const addButton = document.getElementById("addButton");
  const errorMessage = document.getElementById("errorMessage");
  const CSRF = document.querySelector(
    "input[name='csrfmiddlewaretoken']"
  ).value;
  const deleteBtn = document.getElementsByClassName("deleteButton");

  async function fillTaskData(id) {
    errorMessage.textContent = "";
    try {
      const response = await fetch(`http://127.0.0.1:8000/detail/${id}/`);
      if (!response.ok) {
        errorMessage.textContent = "Network Error";
      }
      const data = await response.json();
      return data;
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  }

  async function getTaskDetails(e) {
    const task = await e.target.closest(".task");
    if (task) {
      const id = task.getAttribute("data-id");
      const [data] = await fillTaskData(id);

      document.getElementById("title").value = data.title;
      document.getElementById("detail").value = data.detail;
      document.getElementById("due_date").value = data.due_date;
      document.getElementById("isCompleted").checked = data.isCompleted;

      submitBtn.textContent = "Save";
      submitBtn.dataset.type = "update";
      submitBtn.dataset["id"] = data.id;

      addButton.style.display = "flex";
    }
  }

  async function submitPost(event) {
    event.preventDefault();
    errorMessage.textContent = "";
    const formData = new FormData(event.target);
    try {
      let url = "http://127.0.0.1:8000/save/";
      const actionType = submitBtn.dataset.type;
      if (actionType === "update") {
        let id = submitBtn.dataset.id;
        url = `http://127.0.0.1:8000/save/${id}/`;
        formData["id"] = id;
      }
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      } else {
        const data = await response.json();
        location.reload();
      }
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  }

  function resetForm(e) {
    myForm.reset();
    errorMessage.textContent = "";
    submitBtn.textContent = "Add";
    submitBtn.dataset.type = "create";
    delete submitBtn.dataset.id;
    addButton.style.display = "none";
  }

  async function deleteTask(e) {
    console.log(
      e.target.closest(".deleteButton"),
      e.target.closest(".task").dataset.id,
      CSRF
    );
    const id = await e.target.closest(".task").dataset.id;
    const url = "http://127.0.0.1:8000/delete/";
    const formData = { id: id };
    console.log(formData);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-CSRFToken": CSRF,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    location.reload();
  }

  tasks.addEventListener("click", getTaskDetails);
  myForm.addEventListener("submit", submitPost);
  addButton.addEventListener("click", resetForm);

  for (const btn of deleteBtn) {
    btn.addEventListener("click", deleteTask);
  }
})();
