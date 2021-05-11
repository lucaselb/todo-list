import Item from "../types/item";

export default {
  getItems: (): Promise<Item[]> => {
    return fetch(`/api/item`)
      .then((response) => response.json())
      .then(function (data) {
        let arr: Array<Item> = [];
        data.map((item: Item) => {
          arr.push({
            id: item.id,
            text: item.text,
            created_at: item.created_at,
          });
        });

        return Promise.resolve(arr);
      });
  },
  addItems: (text: Item["text"]): Promise<Item> => {
    return fetch(`/api/item`, {
      method: "POST",
      body: JSON.stringify({
        text: text,
        created_at: new Date().toUTCString(),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        return Promise.resolve(data);
      });
  },
  editItem: (id: number, text: Item["text"]): Promise<Item> => {
    return fetch(`/api/item`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        text: text,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        return Promise.resolve(data);
      });
  },
  removeItems: (id: Item["id"]): Promise<Item["id"]> => {
    return fetch(`/api/item`, {
      method: "DELETE",
      body: JSON.stringify({
        id: id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log(data);
        return Promise.resolve(data[0].id);
      });
  },
};
