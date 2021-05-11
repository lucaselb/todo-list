import * as React from "react";
import { useState } from "react";
import styles from "./App.module.scss";
import Button from "./components/Button";
import api from "./api";
import Items from "./types/item";
import Input from "./components/Input";
import ModalButtons from "./components/ModalButtons/ModalButtons";
import { List, ListItem } from "./components/List";
import Item from "./types/item";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [isVisible, setModal] = useState<boolean>(false);
  const [isDelete, setDeleteModal] = useState<boolean>(false);
  const [isEdit, setEditModal] = useState<boolean>(false);
  const [selectedItem, setItem] = useState<Item>({
    id: 0,
    text: "",
    created_at: "",
  });
  const [itemText, setItemText] = useState("");

  React.useEffect(() => {
    api
      .getItems()
      .then((items) => {
        console.log(items);
        setItems(items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const submitForm = (event: React.FormEvent<Form>) => {
    event.preventDefault();
    const text = event.currentTarget.text.value.trim();

    if (!text) return;

    if (!isEdit) {
      api.addItems(text).then((item) => {
        setItems((items) => items.concat(item));
      });
    } else {
      api.editItem(selectedItem.id, text).then((item) => {
        let arr = [...items];
        arr.map((data) => {
          if (data.id == selectedItem.id) data.text = text;
        });
        setItems(arr);
        setEditModal(false);
      });
    }

    setModal(false);
  };

  const onEdit = (item: Item) => {
    setEditModal(true);
    setModal(true);
    setItem(item);
    setItemText(item.text);
  };

  const onRemove = (item: Item) => {
    setDeleteModal(true);
    setModal(true);
    setItem(item);
  };

  const onClose = () => {
    setModal(false);
    setDeleteModal(false);
    setEditModal(false);
    setItemText("");
  };

  const confirmRemove = (event: React.FormEvent<Form>) => {
    event.preventDefault();
    api.removeItems(selectedItem.id).then((id) => {
      setItems((items) => items.filter((item) => item.id !== id));
      setModal(false);
    });
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>TODO List</h1>
        <h3>{items.length} Item(s)</h3>
      </header>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            onEdit={() => onEdit(item)}
            onRemove={() => onRemove(item)}
          >
            {item.text}
          </ListItem>
        ))}
      </List>
      <Button
        colorScheme="primary"
        onClick={() => {
          setModal(true);
          setItemText("");
        }}
      >
        Add
      </Button>
      {isVisible && !isDelete && (
        <div className={styles.modal}>
          <form onSubmit={submitForm}>
            <h2>{!isEdit ? "Add Item" : "Edit Item"}</h2>
            <Input
              name="text"
              type="text"
              onChange={(e) => setItemText(e.target.value)}
              value={itemText}
              autoFocus
            ></Input>
            <ModalButtons>
              <Button colorScheme="secondary" onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="primary" name="add" type="submit">
                {!isEdit ? "Add" : "Edit"}
              </Button>
            </ModalButtons>
          </form>
        </div>
      )}
      {isVisible && isDelete && (
        <div className={styles.modal}>
          <form onSubmit={confirmRemove}>
            <h2>Delete Item</h2>
            <span>Are you sure you want to delete this item?</span>
            <ModalButtons>
              <Button colorScheme="secondary" onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="primary" name="add" type="submit">
                Delete
              </Button>
            </ModalButtons>
          </form>
        </div>
      )}
    </main>
  );
};

export default App;
