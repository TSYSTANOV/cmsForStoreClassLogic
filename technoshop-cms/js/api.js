import { GOODS_component } from "./renderGoods.js";

class API {
  BASE_URL;
  constructor(url) {
    this.BASE_URL = url;
  }
  getAllGoods(page = 1) {
    return fetch(`${this.BASE_URL}/api/goods?page=${page}`).then((response) => {
      return response.json();
    });
  }
  getCategory(){
    return fetch(`${this.BASE_URL}/api/category`).then(response => response.json())
  }
  setNewGoods(body){
    fetch(`${this.BASE_URL}/api/goods`,{
      method:'POST',
      body:JSON.stringify(body)
    }).then(response=>console.log(response))
  }
  get BASE_URL(){
    return this.BASE_URL
  }
}

const API_component = new API("http://localhost:3024");
export { API_component };
