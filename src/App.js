import { useState, useEffect } from "react";
import axios from "axios";
import CustomModal from "./comp/Model";
import "./App.css";

const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tasks/");
      setTaskList(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const displayCompleted = (status) => setViewCompleted(status);

  const renderTabList = () => (
    <div className="my-5 tab-list">
      <span
        onClick={() => displayCompleted(true)}
        className={viewCompleted ? "active" : ""}
      >
        Completed
      </span>
      <span
        onClick={() => displayCompleted(false)}
        className={!viewCompleted ? "active" : ""}
      >
        Incomplete
      </span>
    </div>
  );

  const handleSubmit = async (item) => {
    toggleModal();
    try {
      if (item.id) {
        await axios.put(`http://localhost:8000/api/tasks/${item.id}/`, item);
      } else {
        await axios.post("http://localhost:8000/api/tasks/", item);
      }
      refreshList();
    } catch (err) {
      console.error("Error saving task", err);
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${item.id}/`);
      refreshList();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const createItem = () => {
    setActiveItem({ title: "", description: "", completed: false });
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem(item);
    setModal(true);
  };

  const toggleModal = () => setModal(!modal);

  const renderItems = () => {
    const filteredItems = taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return filteredItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button onClick={() => handleDelete(item)} className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ));
  };

  return (
    <main className="content">
      <h1 className="text-black text-uppercase text-center my-4">
        Task Manager
      </h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">{renderItems()}</ul>
          </div>
        </div>
      </div>
      {modal && (
        <CustomModal
          activeItem={activeItem}
          toggle={toggleModal}
          onSave={handleSubmit}
        />
      )}
    </main>
  );
};

export default App;
